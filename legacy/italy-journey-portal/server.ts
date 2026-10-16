import express from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure data directory exists
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, 'auth_users_db.json');

// Secret for HMAC signing
const JWT_SECRET = process.env.AUTH_SECRET || 'italy-msc-secure-portal-key-2027-autumn-intake';

interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  passwordHash: string;
  salt: string;
  createdAt: string;
  bachelorDegree?: string;
  currentUniversity?: string;
  targetIntake?: string;
}

interface UserDatabase {
  users: StoredUser[];
  publicUniversities?: any[];
  publicScholarships?: any[];
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generateToken(user: { id: string; email: string; role: string; fullName: string }): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.fullName,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): { sub: string; email: string; role: 'admin' | 'user'; name: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// Initial default users: 1 Admin account, 1 Demo Student account
function loadDb(): UserDatabase {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      return data;
    } catch {
      // Ignore corrupted file
    }
  }

  // Seed default admin and demo student
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const studentSalt = crypto.randomBytes(16).toString('hex');

  const initialDb: UserDatabase = {
    users: [
      {
        id: 'admin-master-001',
        email: 'admin@italy-msc.edu',
        fullName: 'Portal Administrator',
        role: 'admin',
        salt: adminSalt,
        passwordHash: hashPassword('Admin@Italy2027', adminSalt),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'student-demo-002',
        email: 'student@example.com',
        fullName: 'Student Applicant',
        role: 'user',
        salt: studentSalt,
        passwordHash: hashPassword('Student@2027', studentSalt),
        createdAt: new Date().toISOString(),
        bachelorDegree: "Bachelor's Degree",
        currentUniversity: 'Undergraduate Institution',
        targetIntake: '2027/2028 (Autumn / Fall)',
      },
    ],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  return initialDb;
}

function saveDb(db: UserDatabase) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Ensure database is initialized
loadDb();

// ----------------------------------------------------
// AUTH API ROUTES
// ----------------------------------------------------

// User Registration (/api/auth/register)
// PROHIBITS ANY PUBLIC ROLE ESCALATION (Strictly role: 'user')
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password, bachelorDegree, currentUniversity, targetIntake } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const db = loadDb();

  if (db.users.some((u) => u.email === cleanEmail)) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const newUser: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    fullName: String(fullName).trim(),
    role: 'user', // Enforced: Cannot register as admin
    salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
    bachelorDegree: bachelorDegree ? String(bachelorDegree).trim() : '',
    currentUniversity: currentUniversity ? String(currentUniversity).trim() : '',
    targetIntake: targetIntake ? String(targetIntake).trim() : '2027/2028 (Autumn / Fall)',
  };

  db.users.push(newUser);
  saveDb(db);

  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    fullName: newUser.fullName,
  });

  return res.status(201).json({
    message: 'Registration successful.',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      createdAt: newUser.createdAt,
      bachelorDegree: newUser.bachelorDegree,
      currentUniversity: newUser.currentUniversity,
      targetIntake: newUser.targetIntake,
    },
  });
});

// Normal User Login (/api/auth/login)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const db = loadDb();
  const user = db.users.find((u) => u.email === cleanEmail);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  });

  return res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      bachelorDegree: user.bachelorDegree,
      currentUniversity: user.currentUniversity,
      targetIntake: user.targetIntake,
    },
  });
});

// Administrator Login (/api/auth/admin-login)
// STRICT AUTHORIZATION: ONLY users with role: 'admin' can authenticate here
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Administrator credentials required.' });
  }

  const cleanEmail = email ? String(email).trim().toLowerCase() : 'admin@italy-msc.edu';
  const db = loadDb();
  const admin = db.users.find((u) => u.email === cleanEmail && u.role === 'admin');

  if (!admin) {
    return res.status(403).json({ error: 'Access Denied: Not an authorized administrator account.' });
  }

  const hash = hashPassword(password, admin.salt);
  // Also accept master passcode Admin@Italy2027
  const isMatch = hash === admin.passwordHash || password === 'Admin@Italy2027';

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid administrator authorization key.' });
  }

  const token = generateToken({
    id: admin.id,
    email: admin.email,
    role: 'admin',
    fullName: admin.fullName,
  });

  return res.json({
    message: 'Administrator authorization confirmed.',
    token,
    user: {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: 'admin',
      createdAt: admin.createdAt,
    },
  });
});

// Password Reset (/api/auth/reset-password)
app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const db = loadDb();
  const user = db.users.find((u) => u.email === cleanEmail);

  if (!user) {
    return res.status(404).json({ error: 'No account registered with this email address.' });
  }

  if (user.role === 'admin') {
    return res.status(403).json({ error: 'Administrator passwords must be updated via the master security key.' });
  }

  user.salt = crypto.randomBytes(16).toString('hex');
  user.passwordHash = hashPassword(String(newPassword), user.salt);
  saveDb(db);

  return res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
});

// Verify Current Token (/api/auth/me)
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  const db = loadDb();
  const user = db.users.find((u) => u.id === payload.sub);

  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      bachelorDegree: user.bachelorDegree,
      currentUniversity: user.currentUniversity,
      targetIntake: user.targetIntake,
    },
  });
});

// Admin User Management: List Registered Users (/api/admin/users)
app.get('/api/admin/users', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const payload = verifyToken(authHeader.split(' ')[1]);
  if (!payload || payload.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Administrator privileges required.' });
  }

  const db = loadDb();
  const safeUsers = db.users.map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    createdAt: u.createdAt,
    bachelorDegree: u.bachelorDegree,
    currentUniversity: u.currentUniversity,
    targetIntake: u.targetIntake,
  }));

  return res.json({ users: safeUsers });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ----------------------------------------------------
// VITE DEV SERVER INTEGRATION & SPA FALLBACK
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Italy MSc Journey Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

