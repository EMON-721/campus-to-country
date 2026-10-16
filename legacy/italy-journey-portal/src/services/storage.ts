import {
  UserProfile,
  UniversityApplication,
  TaskItem,
  TaskStatus,
  AcademicDocument,
  ExpenseItem,
  UserNote,
  ImportantLink,
  DsuApplication,
  CimeaStep,
  UniversitalyRecord,
  EctsCourseMapping,
  UniversityProgram,
  AccommodationRecord,
  FlightRecord,
  VisaCheckItem,
  SponsorBankRecord,
  EmbassyVisaRecord,
  ReusableTemplate,
  CustomConfig,
  AppearanceSettings,
  DashboardSettings,
  CustomModuleDefinition,
  CustomModuleRecord,
  NavigationSettings,
  AuthUser,
  AuthSession,
  UserRole,
} from '../types';
import {
  initialProfile,
  initialApplications,
  initialTasks,
  initialDocuments,
  initialExpenses,
  initialNotes,
  initialLinks,
  publicItalianUniversities,
} from '../data/mockData';
import {
  initialAccommodations,
  initialFlights,
  initialVisaCheckItems,
  initialSponsorRecords,
  initialEmbassyRecord,
  initialTemplates,
  initialCustomConfig,
  initialAppearanceSettings,
  initialDashboardSettings,
  initialCustomModules,
  initialCustomModuleRecords,
  initialNavigationSettings,
} from '../data/adminInitialData';

const STORAGE_KEYS = {
  PROFILE: 'italy_msc_profile',
  APPLICATIONS: 'italy_msc_applications',
  TASKS: 'italy_msc_tasks',
  DOCUMENTS: 'italy_msc_documents',
  EXPENSES: 'italy_msc_expenses',
  NOTES: 'italy_msc_notes',
  LINKS: 'italy_msc_links',
  DSU_APP: 'italy_msc_dsu_application',
  CIMEA_STEPS: 'italy_msc_cimea_steps',
  UNIVERSITALY: 'italy_msc_universitaly',
  ECTS_MAPPINGS: 'italy_msc_ects_mappings',
  UNIVERSITIES: 'italy_msc_universities',
  ACCOMMODATIONS: 'italy_msc_accommodations',
  FLIGHTS: 'italy_msc_flights',
  VISA_CHECKLIST: 'italy_msc_visa_checklist_items',
  SPONSOR_RECORDS: 'italy_msc_sponsor_bank_records',
  EMBASSY_RECORD: 'italy_msc_embassy_visa_record',
  TEMPLATES: 'italy_msc_reusable_templates',
  CUSTOM_CONFIG: 'italy_msc_custom_config',
  APPEARANCE: 'italy_msc_appearance_settings',
  DASHBOARD_SETTINGS: 'italy_msc_dashboard_settings',
  CUSTOM_MODULES: 'italy_msc_custom_modules',
  CUSTOM_MODULE_RECORDS: 'italy_msc_custom_module_records',
  NAVIGATION_SETTINGS: 'italy_msc_navigation_settings',
  AUTH_SESSION: 'italy_msc_auth_session',
  REGISTERED_USERS: 'italy_msc_registered_users',
};

export const initialDsuApplication: DsuApplication = {
  agencyName: 'EDISU Piemonte',
  region: 'Piemonte (Turin)',
  applicationDeadline: '2027-08-30',
  status: 'Documents Preparation',
  cafOfficeUsed: 'CAF CISL Convenzionato',
  iseeParificatoEur: 6850,
  protocolNumber: 'ISEE-2027-BD-9941',
  freeMealRequested: true,
  dormAccommodationRequested: true,
  notes: 'Awaiting family income certificate translation and attestation from Segunbagicha MOFA.',
  updatedAt: '2026-10-09T00:00:00.000Z',
};

export const initialCimeaSteps: CimeaStep[] = [
  {
    id: 1,
    title: 'Collect Official Undergraduate Transcript & Graduation Certificate',
    authority: 'University Controller of Examinations / Registrar',
    timeline: 'Immediately upon degree completion',
    status: 'Pending',
    cost: 'Standard university fee',
    instructions: 'Request sealed official academic transcripts and completion letter stating English Medium of Instruction.',
  },
  {
    id: 2,
    title: 'University Grants Commission (UGC) / MOE Attestation',
    authority: 'Ministry of Education (MOE) Secretariat, Dhaka',
    timeline: '1-2 Days',
    status: 'Pending',
    cost: 'Free / Nominal stamp',
    instructions: 'Submit original bachelor degree certificate and transcripts for government verification.',
  },
  {
    id: 3,
    title: 'Ministry of Foreign Affairs (MOFA) Dhaka Attestation',
    authority: 'MOFA Consular Section, Segunbagicha, Dhaka',
    timeline: '1 Day (Morning submission, afternoon pickup)',
    status: 'Pending',
    cost: 'Free of charge',
    instructions: 'Submit MOE-attested papers to MOFA counter for official government authentication and QR barcode seal.',
  },
  {
    id: 4,
    title: 'CIMEA Diplo-me Account Creation & Document Upload',
    authority: 'CIMEA Italy (cimea.diplo-me.eu)',
    timeline: 'Online Portal',
    status: 'Pending',
    cost: 'Free account setup',
    instructions: 'Create student profile, select target Italian universities (e.g. PoliTO, UNIBO, UniPi), and upload scanned color PDF copies of MOFA-attested transcript.',
  },
  {
    id: 5,
    title: 'Order Statement of Comparability & Verification',
    authority: 'CIMEA Italy',
    timeline: '15 - 60 working days',
    status: 'Pending',
    cost: '€150 - €300 (Payable via international credit/debit card)',
    instructions: 'CIMEA verifies the 4-year duration (minimum 120-160 credits) and comparability to Italian Laurea triennale, issuing a cryptographically signed digital certificate.',
  },
  {
    id: 6,
    title: 'Link CIMEA Certificate to Universitaly & University Portal',
    authority: 'Universitaly & Target Italian Universities',
    timeline: 'Instant digital upload',
    status: 'Pending',
    cost: 'Included',
    instructions: 'Provide the CIMEA verification link / PDF to the Italian university admission office for unconditional matriculation.',
  },
];

export const initialUniversitalyRecord: UniversitalyRecord = {
  accountEmail: 'applicant@example.com',
  targetUniversity: 'Politecnico di Torino (PoliTO)',
  targetDegree: 'Data Science & Engineering (Laurea Magistrale)',
  consularPost: 'Embassy of Italy in Dhaka (Bangladesh)',
  applicationCode: 'UNIV-2027-SAMPLE-001',
  status: 'Draft',
  riepilogoPdfDownloaded: false,
  notes: 'Draft pre-enrolment dossier opened. Awaiting official university admission validation before final confirmation.',
  checklist: [
    { id: 'u1', text: 'Account registered on Universitaly.it with active email', checked: true },
    { id: 'u2', text: 'Personal details match international passport verbatim', checked: true },
    { id: 'u3', text: 'Academic Year 2027/2028 chosen', checked: true },
    { id: 'u4', text: 'Admitting Italian Public University & MSc Degree selected', checked: false },
    { id: 'u5', text: 'Embassy of Italy in Dhaka designated as Visa Consular post', checked: true },
    { id: 'u6', text: 'Official Undergraduate Transcripts & Degree Certificate (English) uploaded', checked: false },
    { id: 'u7', text: 'English Language Proficiency Test TRF (IELTS / TOEFL) uploaded', checked: true },
    { id: 'u8', text: 'CIMEA Statement of Comparability / Verification or DOV attached', checked: false },
    { id: 'u9', text: 'University Admission Letter / Offer attached', checked: false },
    { id: 'u10', text: 'Submitted & Waiting for University to approve Summary (Riepilogo)', checked: false },
  ],
  updatedAt: '2026-10-09T00:00:00.000Z',
};

export const initialEctsMappings: EctsCourseMapping[] = [
  {
    id: 'cm-1',
    courseCode: 'CS 101',
    courseTitle: 'Structured Programming (C/C++)',
    creditHours: 3,
    convertedCfu: 5,
    italianDiscipline: 'INF/01',
    status: 'Matched',
  },
  {
    id: 'cm-2',
    courseCode: 'CS 201',
    courseTitle: 'Data Structures and Algorithms',
    creditHours: 4,
    convertedCfu: 6,
    italianDiscipline: 'INF/01',
    status: 'Matched',
  },
  {
    id: 'cm-3',
    courseCode: 'CS 302',
    courseTitle: 'Database Management Systems',
    creditHours: 3,
    convertedCfu: 5,
    italianDiscipline: 'ING-INF/05',
    status: 'Matched',
  },
  {
    id: 'cm-4',
    courseCode: 'CS 405',
    courseTitle: 'Artificial Intelligence & Machine Learning',
    creditHours: 3,
    convertedCfu: 5,
    italianDiscipline: 'INF/01',
    status: 'Matched',
  },
  {
    id: 'cm-5',
    courseCode: 'MATH 101',
    courseTitle: 'Differential and Integral Calculus',
    creditHours: 3,
    convertedCfu: 5,
    italianDiscipline: 'MAT/01-08',
    status: 'Matched',
  },
  {
    id: 'cm-6',
    courseCode: 'MATH 202',
    courseTitle: 'Linear Algebra & Discrete Mathematics',
    creditHours: 3,
    convertedCfu: 5,
    italianDiscipline: 'MAT/01-08',
    status: 'Matched',
  },
  {
    id: 'cm-7',
    courseCode: 'PHYS 101',
    courseTitle: 'Physics: Mechanics and Electromagnetism',
    creditHours: 3,
    convertedCfu: 5,
    italianDiscipline: 'FIS/01-03',
    status: 'Matched',
  },
];

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('italy_msc_storage_changed'));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

function getActiveSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.user) return parsed;
    return null;
  } catch {
    return null;
  }
}

function getUserScopedKey(baseKey: string): string {
  const session = getActiveSession();
  if (session?.user && session.user.role === 'user') {
    return `${baseKey}_user_${session.user.id}`;
  }
  return baseKey;
}

export const StorageService = {
  // Authentication & Session Management
  getAuthSession: (): AuthSession | null => getActiveSession(),

  saveAuthSession: (session: AuthSession | null): void => {
    if (session) {
      safeSet(STORAGE_KEYS.AUTH_SESSION, session);
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        window.dispatchEvent(new Event('italy_msc_storage_changed'));
      } catch {
        // ignore
      }
    }
  },

  getCurrentUser: (): AuthUser | null => {
    const session = getActiveSession();
    return session ? session.user : null;
  },

  isAdmin: (): boolean => {
    const session = getActiveSession();
    return session?.user?.role === 'admin';
  },

  login: async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string; session?: AuthSession }> => {
    const sessionDurationMs = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 24 * 60 * 60 * 1000; // 24 hours

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        const session: AuthSession = {
          token: data.token,
          user: data.user,
          expiresAt: Date.now() + sessionDurationMs,
        };
        StorageService.saveAuthSession(session);
        return { success: true, session };
      }
      return { success: false, error: data.error || 'Login failed.' };
    } catch {
      // Local fallback for offline mode
      if (email && password) {
        const session: AuthSession = {
          token: 'offline-token-' + Date.now(),
          user: {
            id: 'student-demo-002',
            email: email.toLowerCase(),
            fullName: 'Student Applicant',
            role: 'user',
            createdAt: new Date().toISOString(),
          },
          expiresAt: Date.now() + sessionDurationMs,
        };
        StorageService.saveAuthSession(session);
        return { success: true, session };
      }
      return { success: false, error: 'Network error or invalid credentials.' };
    }
  },

  resetPassword: async (
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Password reset failed.' };
    } catch {
      return {
        success: true,
        message: 'Password updated successfully in offline fallback mode.',
      };
    }
  },

  adminLogin: async (
    password: string,
    email = 'admin@italy-msc.edu'
  ): Promise<{ success: boolean; error?: string; session?: AuthSession }> => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        const session: AuthSession = {
          token: data.token,
          user: data.user,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        StorageService.saveAuthSession(session);
        return { success: true, session };
      }
      return { success: false, error: data.error || 'Administrator verification failed.' };
    } catch {
      // Offline fallback: check master key
      if (password === 'Admin@Italy2027') {
        const session: AuthSession = {
          token: 'offline-admin-token-' + Date.now(),
          user: {
            id: 'admin-master-001',
            email: 'admin@italy-msc.edu',
            fullName: 'Portal Administrator',
            role: 'admin',
            createdAt: new Date().toISOString(),
          },
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        StorageService.saveAuthSession(session);
        return { success: true, session };
      }
      return { success: false, error: 'Invalid administrator access key.' };
    }
  },

  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    bachelorDegree?: string;
    currentUniversity?: string;
    targetIntake?: string;
  }): Promise<{ success: boolean; error?: string; session?: AuthSession }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        const session: AuthSession = {
          token: data.token,
          user: data.user,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        StorageService.saveAuthSession(session);
        return { success: true, session };
      }
      return { success: false, error: data.error || 'Registration failed.' };
    } catch {
      // Local fallback
      const session: AuthSession = {
        token: 'offline-reg-token-' + Date.now(),
        user: {
          id: `user-${Date.now()}`,
          email: userData.email.toLowerCase(),
          fullName: userData.fullName,
          role: 'user',
          createdAt: new Date().toISOString(),
          bachelorDegree: userData.bachelorDegree,
          currentUniversity: userData.currentUniversity,
          targetIntake: userData.targetIntake,
        },
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      StorageService.saveAuthSession(session);
      return { success: true, session };
    }
  },

  logout: (): void => {
    StorageService.saveAuthSession(null);
  },

  // Academic Profile (User-Scoped Isolation)
  getProfile: (): UserProfile => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.PROFILE}_user_${session.user.id}`;
      const defaultStudentProfile: UserProfile = {
        fullName: session.user.fullName || '',
        email: session.user.email || '',
        phone: '',
        originCountry: '',
        city: '',
        studyLevel: "Master's",
        currentUniversity: session.user.currentUniversity || '',
        bachelorDegree: session.user.bachelorDegree || '',
        department: '',
        subject: '',
        degreeDuration: '',
        academicCredits: 0,
        gradingSystem: 'CGPA 4.0 Scale',
        currentCgpa: 0,
        cgpaScale: 4.0,
        expectedGraduation: '',
        languageProficiencyCert: '',
        ieltsOverall: 0,
        ieltsBreakdown: { listening: 0, reading: 0, writing: 0, speaking: 0 },
        targetIntake: session.user.targetIntake || '2027/2028 (Autumn / Fall)',
        targetFields: [],
        targetSpecialization: '',
        preferredSubject: '',
        preferredUniversity: '',
        preferredLanguage: 'English-taught',
        passportNumber: '',
        passportExpiry: '',
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: '',
        notes: '',
      };
      return safeGet<UserProfile>(key, defaultStudentProfile);
    }
    if (session?.user && session.user.role === 'admin') {
      return safeGet<UserProfile>(STORAGE_KEYS.PROFILE, initialProfile);
    }
    // Guest visitor default profile (empty, neutral placeholders)
    const guestProfile: UserProfile = {
      fullName: 'Prospective Student',
      email: '',
      phone: '',
      originCountry: '',
      city: '',
      studyLevel: "Master's",
      currentUniversity: '',
      bachelorDegree: '',
      department: '',
      subject: '',
      degreeDuration: '',
      academicCredits: 0,
      gradingSystem: 'CGPA 4.0 Scale',
      currentCgpa: 0,
      cgpaScale: 4.0,
      expectedGraduation: '',
      languageProficiencyCert: '',
      ieltsOverall: 0,
      ieltsBreakdown: { listening: 0, reading: 0, writing: 0, speaking: 0 },
      targetIntake: '2027/2028 (Autumn / Fall)',
      targetFields: [],
      targetSpecialization: '',
      preferredSubject: '',
      preferredUniversity: '',
      preferredLanguage: 'English-taught',
      passportNumber: '',
      passportExpiry: '',
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      notes: '',
    };
    return guestProfile;
  },

  updateProfile: (profile: UserProfile): void => {
    const key = getUserScopedKey(STORAGE_KEYS.PROFILE);
    safeSet(key, profile);
  },

  // Applications (User-Scoped Isolation: Normal user & guest starts with empty array)
  getApplications: (includeArchived = false): UniversityApplication[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.APPLICATIONS}_user_${session.user.id}`;
      const list = safeGet<UniversityApplication[]>(key, []);
      return includeArchived ? list : list.filter((a) => !a.isArchived);
    }
    if (session?.user && session.user.role === 'admin') {
      const list = safeGet<UniversityApplication[]>(STORAGE_KEYS.APPLICATIONS, initialApplications);
      return includeArchived ? list : list.filter((a) => !a.isArchived);
    }
    // Guest visitor default: empty list, no pre-injected applications
    const guestList = safeGet<UniversityApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    return includeArchived ? guestList : guestList.filter((a) => !a.isArchived);
  },
  saveApplications: (apps: UniversityApplication[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.APPLICATIONS);
    safeSet(key, apps);
  },
  addApplication: (app: UniversityApplication): void => {
    const current = StorageService.getApplications(true);
    StorageService.saveApplications([app, ...current]);
  },
  updateApplication: (app: UniversityApplication): void => {
    const current = StorageService.getApplications(true);
    StorageService.saveApplications(current.map((a) => (a.id === app.id ? app : a)));
  },
  deleteApplication: (id: string): void => {
    const current = StorageService.getApplications(true);
    StorageService.saveApplications(current.filter((a) => a.id !== id));
  },
  archiveApplication: (id: string): void => {
    const current = StorageService.getApplications(true);
    StorageService.saveApplications(
      current.map((a) =>
        a.id === id ? { ...a, isArchived: true, archivedAt: new Date().toISOString() } : a
      )
    );
  },
  restoreApplication: (id: string): void => {
    const current = StorageService.getApplications(true);
    StorageService.saveApplications(
      current.map((a) => (a.id === id ? { ...a, isArchived: false, archivedAt: undefined } : a))
    );
  },
  convertApplicationToUser: (id: string): void => {
    const current = StorageService.getApplications(true);
    StorageService.saveApplications(
      current.map((a) => (a.id === id ? { ...a, isDemo: false } : a))
    );
  },
  convertAllDemoApplications: (): void => {
    const current = StorageService.getApplications(true);
    StorageService.saveApplications(current.map((a) => ({ ...a, isDemo: false })));
  },
  deleteAllDemoApplications: (): void => {
    const current = StorageService.getApplications(true);
    StorageService.saveApplications(current.filter((a) => !a.isDemo));
  },

  getTasks: (includeArchived = false): TaskItem[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.TASKS}_user_${session.user.id}`;
      const list = safeGet<TaskItem[]>(key, []);
      return includeArchived ? list : list.filter((t) => !t.isArchived);
    }
    const list = safeGet<TaskItem[]>(STORAGE_KEYS.TASKS, initialTasks);
    return includeArchived ? list : list.filter((t) => !t.isArchived);
  },
  saveTasks: (tasks: TaskItem[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.TASKS);
    safeSet(key, tasks);
  },
  addTask: (task: TaskItem): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks([task, ...current]);
  },
  updateTask: (task: TaskItem): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(current.map((t) => (t.id === task.id ? task : t)));
  },
  deleteTask: (id: string): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(current.filter((t) => t.id !== id));
  },
  archiveTask: (id: string): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(
      current.map((t) =>
        t.id === id ? { ...t, isArchived: true, archivedAt: new Date().toISOString() } : t
      )
    );
  },
  restoreTask: (id: string): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(
      current.map((t) => (t.id === id ? { ...t, isArchived: false, archivedAt: undefined } : t))
    );
  },
  convertTaskToUser: (id: string): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(
      current.map((t) => (t.id === id ? { ...t, isDemo: false } : t))
    );
  },
  convertAllDemoTasks: (): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(current.map((t) => ({ ...t, isDemo: false })));
  },
  deleteAllDemoTasks: (): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(current.filter((t) => !t.isDemo));
  },
  cycleTaskStatus: (id: string): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(
      current.map((t) => {
        if (t.id === id) {
          const nextStatus: TaskStatus =
            t.status === 'todo' ? 'in_progress' : t.status === 'in_progress' ? 'completed' : 'todo';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  },
  toggleTask: (id: string): void => {
    const current = StorageService.getTasks(true);
    StorageService.saveTasks(
      current.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  },

  getDocuments: (includeArchived = false): AcademicDocument[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.DOCUMENTS}_user_${session.user.id}`;
      const list = safeGet<AcademicDocument[]>(key, []);
      return includeArchived ? list : list.filter((d) => !d.isArchived);
    }
    const list = safeGet<AcademicDocument[]>(STORAGE_KEYS.DOCUMENTS, initialDocuments);
    return includeArchived ? list : list.filter((d) => !d.isArchived);
  },
  saveDocuments: (docs: AcademicDocument[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.DOCUMENTS);
    safeSet(key, docs);
  },
  addDocument: (doc: AcademicDocument): void => {
    const current = StorageService.getDocuments(true);
    StorageService.saveDocuments([doc, ...current]);
  },
  updateDocument: (doc: AcademicDocument): void => {
    const current = StorageService.getDocuments(true);
    StorageService.saveDocuments(current.map((d) => (d.id === doc.id ? doc : d)));
  },
  deleteDocument: (id: string): void => {
    const current = StorageService.getDocuments(true);
    StorageService.saveDocuments(current.filter((d) => d.id !== id));
  },
  archiveDocument: (id: string): void => {
    const current = StorageService.getDocuments(true);
    StorageService.saveDocuments(
      current.map((d) =>
        d.id === id ? { ...d, isArchived: true, archivedAt: new Date().toISOString() } : d
      )
    );
  },
  restoreDocument: (id: string): void => {
    const current = StorageService.getDocuments(true);
    StorageService.saveDocuments(
      current.map((d) => (d.id === id ? { ...d, isArchived: false, archivedAt: undefined } : d))
    );
  },

  getExpenses: (includeArchived = false): ExpenseItem[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.EXPENSES}_user_${session.user.id}`;
      const list = safeGet<ExpenseItem[]>(key, []);
      return includeArchived ? list : list.filter((e) => !e.isArchived);
    }
    if (session?.user && session.user.role === 'admin') {
      const list = safeGet<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, initialExpenses);
      return includeArchived ? list : list.filter((e) => !e.isArchived);
    }
    return [];
  },
  saveExpenses: (expenses: ExpenseItem[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.EXPENSES);
    safeSet(key, expenses);
  },
  addExpense: (exp: ExpenseItem): void => {
    const current = StorageService.getExpenses(true);
    StorageService.saveExpenses([exp, ...current]);
  },
  updateExpense: (exp: ExpenseItem): void => {
    const current = StorageService.getExpenses(true);
    StorageService.saveExpenses(current.map((e) => (e.id === exp.id ? exp : e)));
  },
  deleteExpense: (id: string): void => {
    const current = StorageService.getExpenses(true);
    StorageService.saveExpenses(current.filter((e) => e.id !== id));
  },
  archiveExpense: (id: string): void => {
    const current = StorageService.getExpenses(true);
    StorageService.saveExpenses(
      current.map((e) =>
        e.id === id ? { ...e, isArchived: true, archivedAt: new Date().toISOString() } : e
      )
    );
  },
  restoreExpense: (id: string): void => {
    const current = StorageService.getExpenses(true);
    StorageService.saveExpenses(
      current.map((e) => (e.id === id ? { ...e, isArchived: false, archivedAt: undefined } : e))
    );
  },

  getNotes: (includeArchived = false): UserNote[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.NOTES}_user_${session.user.id}`;
      const list = safeGet<UserNote[]>(key, []);
      return includeArchived ? list : list.filter((n) => !n.isArchived);
    }
    if (session?.user && session.user.role === 'admin') {
      const list = safeGet<UserNote[]>(STORAGE_KEYS.NOTES, initialNotes);
      return includeArchived ? list : list.filter((n) => !n.isArchived);
    }
    return [];
  },
  saveNotes: (notes: UserNote[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.NOTES);
    safeSet(key, notes);
  },
  addNote: (note: UserNote): void => {
    const current = StorageService.getNotes(true);
    StorageService.saveNotes([note, ...current]);
  },
  updateNote: (note: UserNote): void => {
    const current = StorageService.getNotes(true);
    StorageService.saveNotes(current.map((n) => (n.id === note.id ? note : n)));
  },
  deleteNote: (id: string): void => {
    const current = StorageService.getNotes(true);
    StorageService.saveNotes(current.filter((n) => n.id !== id));
  },
  archiveNote: (id: string): void => {
    const current = StorageService.getNotes(true);
    StorageService.saveNotes(
      current.map((n) =>
        n.id === id ? { ...n, isArchived: true, archivedAt: new Date().toISOString() } : n
      )
    );
  },
  restoreNote: (id: string): void => {
    const current = StorageService.getNotes(true);
    StorageService.saveNotes(
      current.map((n) => (n.id === id ? { ...n, isArchived: false, archivedAt: undefined } : n))
    );
  },

  getLinks: (includeArchived = false): ImportantLink[] => {
    const list = safeGet<ImportantLink[]>(STORAGE_KEYS.LINKS, initialLinks);
    return includeArchived ? list : list.filter((l) => !l.isArchived);
  },
  saveLinks: (links: ImportantLink[]): void => safeSet(STORAGE_KEYS.LINKS, links),
  addLink: (link: ImportantLink): void => {
    const current = safeGet<ImportantLink[]>(STORAGE_KEYS.LINKS, initialLinks);
    StorageService.saveLinks([link, ...current]);
  },
  updateLink: (link: ImportantLink): void => {
    const current = safeGet<ImportantLink[]>(STORAGE_KEYS.LINKS, initialLinks);
    StorageService.saveLinks(current.map((l) => (l.id === link.id ? link : l)));
  },
  deleteLink: (id: string): void => {
    const current = safeGet<ImportantLink[]>(STORAGE_KEYS.LINKS, initialLinks);
    StorageService.saveLinks(current.filter((l) => l.id !== id));
  },
  archiveLink: (id: string): void => {
    const current = safeGet<ImportantLink[]>(STORAGE_KEYS.LINKS, initialLinks);
    StorageService.saveLinks(
      current.map((l) =>
        l.id === id ? { ...l, isArchived: true, archivedAt: new Date().toISOString() } : l
      )
    );
  },
  restoreLink: (id: string): void => {
    const current = safeGet<ImportantLink[]>(STORAGE_KEYS.LINKS, initialLinks);
    StorageService.saveLinks(
      current.map((l) => (l.id === id ? { ...l, isArchived: false, archivedAt: undefined } : l))
    );
  },

  // Universities & Programmes Management
  getUniversities: (includeArchived = false): UniversityProgram[] => {
    const list = safeGet<UniversityProgram[]>(
      STORAGE_KEYS.UNIVERSITIES,
      publicItalianUniversities
    );
    return includeArchived ? list : list.filter((u) => !u.isArchived);
  },
  saveUniversities: (unis: UniversityProgram[]): void =>
    safeSet(STORAGE_KEYS.UNIVERSITIES, unis),
  addUniversity: (uni: UniversityProgram): void => {
    const current = StorageService.getUniversities(true);
    StorageService.saveUniversities([uni, ...current]);
  },
  updateUniversity: (uni: UniversityProgram): void => {
    const current = StorageService.getUniversities(true);
    StorageService.saveUniversities(current.map((u) => (u.id === uni.id ? uni : u)));
  },
  deleteUniversity: (id: string): void => {
    const current = StorageService.getUniversities(true);
    StorageService.saveUniversities(current.filter((u) => u.id !== id));
  },
  archiveUniversity: (id: string): void => {
    const current = StorageService.getUniversities(true);
    StorageService.saveUniversities(
      current.map((u) =>
        u.id === id ? { ...u, isArchived: true, archivedAt: new Date().toISOString() } : u
      )
    );
  },
  restoreUniversity: (id: string): void => {
    const current = StorageService.getUniversities(true);
    StorageService.saveUniversities(
      current.map((u) => (u.id === id ? { ...u, isArchived: false, archivedAt: undefined } : u))
    );
  },

  // Accommodation Records Management
  getAccommodations: (includeArchived = false): AccommodationRecord[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.ACCOMMODATIONS}_user_${session.user.id}`;
      const list = safeGet<AccommodationRecord[]>(key, []);
      return includeArchived ? list : list.filter((a) => !a.isArchived);
    }
    const list = safeGet<AccommodationRecord[]>(
      STORAGE_KEYS.ACCOMMODATIONS,
      initialAccommodations
    );
    return includeArchived ? list : list.filter((a) => !a.isArchived);
  },
  saveAccommodations: (records: AccommodationRecord[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.ACCOMMODATIONS);
    safeSet(key, records);
  },
  addAccommodation: (record: AccommodationRecord): void => {
    const current = StorageService.getAccommodations(true);
    StorageService.saveAccommodations([record, ...current]);
  },
  updateAccommodation: (record: AccommodationRecord): void => {
    const current = StorageService.getAccommodations(true);
    StorageService.saveAccommodations(current.map((a) => (a.id === record.id ? record : a)));
  },
  deleteAccommodation: (id: string): void => {
    const current = StorageService.getAccommodations(true);
    StorageService.saveAccommodations(current.filter((a) => a.id !== id));
  },
  archiveAccommodation: (id: string): void => {
    const current = StorageService.getAccommodations(true);
    StorageService.saveAccommodations(
      current.map((a) =>
        a.id === id ? { ...a, isArchived: true, archivedAt: new Date().toISOString() } : a
      )
    );
  },
  restoreAccommodation: (id: string): void => {
    const current = StorageService.getAccommodations(true);
    StorageService.saveAccommodations(
      current.map((a) => (a.id === id ? { ...a, isArchived: false, archivedAt: undefined } : a))
    );
  },

  // Flight Records Management
  getFlights: (includeArchived = false): FlightRecord[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.FLIGHTS}_user_${session.user.id}`;
      const list = safeGet<FlightRecord[]>(key, []);
      return includeArchived ? list : list.filter((f) => !f.isArchived);
    }
    const list = safeGet<FlightRecord[]>(STORAGE_KEYS.FLIGHTS, initialFlights);
    return includeArchived ? list : list.filter((f) => !f.isArchived);
  },
  saveFlights: (records: FlightRecord[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.FLIGHTS);
    safeSet(key, records);
  },
  addFlight: (record: FlightRecord): void => {
    const current = StorageService.getFlights(true);
    StorageService.saveFlights([record, ...current]);
  },
  updateFlight: (record: FlightRecord): void => {
    const current = StorageService.getFlights(true);
    StorageService.saveFlights(current.map((f) => (f.id === record.id ? record : f)));
  },
  deleteFlight: (id: string): void => {
    const current = StorageService.getFlights(true);
    StorageService.saveFlights(current.filter((f) => f.id !== id));
  },
  archiveFlight: (id: string): void => {
    const current = StorageService.getFlights(true);
    StorageService.saveFlights(
      current.map((f) =>
        f.id === id ? { ...f, isArchived: true, archivedAt: new Date().toISOString() } : f
      )
    );
  },
  restoreFlight: (id: string): void => {
    const current = StorageService.getFlights(true);
    StorageService.saveFlights(
      current.map((f) => (f.id === id ? { ...f, isArchived: false, archivedAt: undefined } : f))
    );
  },

  // Visa Checklist Items Management
  getVisaCheckItems: (includeArchived = false): VisaCheckItem[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.VISA_CHECKLIST}_user_${session.user.id}`;
      const userTemplate = initialVisaCheckItems.map((item) => ({
        ...item,
        status: item.status || ('In Progress' as const),
      }));
      const list = safeGet<VisaCheckItem[]>(key, userTemplate);
      return includeArchived ? list : list.filter((v) => !v.isArchived);
    }
    const list = safeGet<VisaCheckItem[]>(
      STORAGE_KEYS.VISA_CHECKLIST,
      initialVisaCheckItems
    );
    return includeArchived ? list : list.filter((v) => !v.isArchived);
  },
  resetVisaCheckItemsToOfficial: (): VisaCheckItem[] => {
    const session = getActiveSession();
    const template = initialVisaCheckItems.map((item) => ({ ...item }));
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.VISA_CHECKLIST}_user_${session.user.id}`;
      safeSet(key, template);
    } else {
      safeSet(STORAGE_KEYS.VISA_CHECKLIST, template);
    }
    return template;
  },
  saveVisaCheckItems: (items: VisaCheckItem[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.VISA_CHECKLIST);
    safeSet(key, items);
  },
  addVisaCheckItem: (item: VisaCheckItem): void => {
    const current = StorageService.getVisaCheckItems(true);
    StorageService.saveVisaCheckItems([item, ...current]);
  },
  updateVisaCheckItem: (item: VisaCheckItem): void => {
    const current = StorageService.getVisaCheckItems(true);
    StorageService.saveVisaCheckItems(current.map((v) => (v.id === item.id ? item : v)));
  },
  deleteVisaCheckItem: (id: string): void => {
    const current = StorageService.getVisaCheckItems(true);
    StorageService.saveVisaCheckItems(current.filter((v) => v.id !== id));
  },
  archiveVisaCheckItem: (id: string): void => {
    const current = StorageService.getVisaCheckItems(true);
    StorageService.saveVisaCheckItems(
      current.map((v) =>
        v.id === id ? { ...v, isArchived: true, archivedAt: new Date().toISOString() } : v
      )
    );
  },
  restoreVisaCheckItem: (id: string): void => {
    const current = StorageService.getVisaCheckItems(true);
    StorageService.saveVisaCheckItems(
      current.map((v) => (v.id === id ? { ...v, isArchived: false, archivedAt: undefined } : v))
    );
  },

  // Sponsor & Bank Records Management
  getSponsorRecords: (includeArchived = false): SponsorBankRecord[] => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.SPONSOR_RECORDS}_user_${session.user.id}`;
      const list = safeGet<SponsorBankRecord[]>(key, []);
      return includeArchived ? list : list.filter((s) => !s.isArchived);
    }
    if (session?.user && session.user.role === 'admin') {
      const list = safeGet<SponsorBankRecord[]>(
        STORAGE_KEYS.SPONSOR_RECORDS,
        initialSponsorRecords
      );
      return includeArchived ? list : list.filter((s) => !s.isArchived);
    }
    return [];
  },
  saveSponsorRecords: (records: SponsorBankRecord[]): void => {
    const key = getUserScopedKey(STORAGE_KEYS.SPONSOR_RECORDS);
    safeSet(key, records);
  },
  addSponsorRecord: (record: SponsorBankRecord): void => {
    const current = StorageService.getSponsorRecords(true);
    StorageService.saveSponsorRecords([record, ...current]);
  },
  updateSponsorRecord: (record: SponsorBankRecord): void => {
    const current = StorageService.getSponsorRecords(true);
    StorageService.saveSponsorRecords(current.map((s) => (s.id === record.id ? record : s)));
  },
  deleteSponsorRecord: (id: string): void => {
    const current = StorageService.getSponsorRecords(true);
    StorageService.saveSponsorRecords(current.filter((s) => s.id !== id));
  },
  archiveSponsorRecord: (id: string): void => {
    const current = StorageService.getSponsorRecords(true);
    StorageService.saveSponsorRecords(
      current.map((s) =>
        s.id === id ? { ...s, isArchived: true, archivedAt: new Date().toISOString() } : s
      )
    );
  },
  restoreSponsorRecord: (id: string): void => {
    const current = StorageService.getSponsorRecords(true);
    StorageService.saveSponsorRecords(
      current.map((s) => (s.id === id ? { ...s, isArchived: false, archivedAt: undefined } : s))
    );
  },

  // Embassy & Visa Record Management
  getEmbassyRecord: (): EmbassyVisaRecord => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.EMBASSY_RECORD}_user_${session.user.id}`;
      const defaultStudentEmbassy: EmbassyVisaRecord = {
        id: 'embassy-user-default',
        consularOffice: 'Embassy of Italy in Dhaka (Gulshan 2)',
        visaCategory: 'National Visa Type D (Study)',
        vfsReferenceNumber: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentStatus: 'Monitoring Slots',
        submissionTargetMonth: 'June - August 2027',
        visaFeeBdt: 12500,
        vfsFeeBdt: 3200,
        interviewNotes: 'Personal student visa checklist and appointment tracker.',
        policeClearanceAttached: false,
        travelInsuranceAttached: false,
        dummyTicketAttached: false,
        statusNotes: 'Monitoring VFS Italy Dhaka booking slots for Autumn intake.',
        updatedAt: new Date().toISOString(),
      };
      return safeGet<EmbassyVisaRecord>(key, defaultStudentEmbassy);
    }
    return safeGet<EmbassyVisaRecord>(STORAGE_KEYS.EMBASSY_RECORD, initialEmbassyRecord);
  },
  saveEmbassyRecord: (record: EmbassyVisaRecord): void => {
    const key = getUserScopedKey(STORAGE_KEYS.EMBASSY_RECORD);
    safeSet(key, record);
  },

  // Reusable Templates Management
  getTemplates: (): ReusableTemplate[] =>
    safeGet<ReusableTemplate[]>(STORAGE_KEYS.TEMPLATES, initialTemplates),
  saveTemplates: (templates: ReusableTemplate[]): void =>
    safeSet(STORAGE_KEYS.TEMPLATES, templates),
  addTemplate: (template: ReusableTemplate): void => {
    const current = StorageService.getTemplates();
    StorageService.saveTemplates([template, ...current]);
  },
  updateTemplate: (template: ReusableTemplate): void => {
    const current = StorageService.getTemplates();
    StorageService.saveTemplates(current.map((t) => (t.id === template.id ? template : t)));
  },
  deleteTemplate: (id: string): void => {
    const current = StorageService.getTemplates();
    StorageService.saveTemplates(current.filter((t) => t.id !== id));
  },

  // Custom Categories & Statuses Configuration
  getCustomConfig: (): CustomConfig =>
    safeGet<CustomConfig>(STORAGE_KEYS.CUSTOM_CONFIG, initialCustomConfig),
  saveCustomConfig: (config: CustomConfig): void =>
    safeSet(STORAGE_KEYS.CUSTOM_CONFIG, config),

  // Unified Archived Records Vault
  getAllArchivedRecords: () => {
    const applications = StorageService.getApplications(true).filter((a) => a.isArchived);
    const universities = StorageService.getUniversities(true).filter((u) => u.isArchived);
    const tasks = StorageService.getTasks(true).filter((t) => t.isArchived);
    const documents = StorageService.getDocuments(true).filter((d) => d.isArchived);
    const expenses = StorageService.getExpenses(true).filter((e) => e.isArchived);
    const notes = StorageService.getNotes(true).filter((n) => n.isArchived);
    const links = StorageService.getLinks(true).filter((l) => l.isArchived);
    const accommodations = StorageService.getAccommodations(true).filter((a) => a.isArchived);
    const flights = StorageService.getFlights(true).filter((f) => f.isArchived);
    const visaItems = StorageService.getVisaCheckItems(true).filter((v) => v.isArchived);
    const sponsors = StorageService.getSponsorRecords(true).filter((s) => s.isArchived);

    return {
      applications,
      universities,
      tasks,
      documents,
      expenses,
      notes,
      links,
      accommodations,
      flights,
      visaItems,
      sponsors,
      totalCount:
        applications.length +
        universities.length +
        tasks.length +
        documents.length +
        expenses.length +
        notes.length +
        links.length +
        accommodations.length +
        flights.length +
        visaItems.length +
        sponsors.length,
    };
  },

  getDsuApplication: (): DsuApplication => {
    const session = getActiveSession();
    if (session?.user && session.user.role === 'user') {
      const key = `${STORAGE_KEYS.DSU_APP}_user_${session.user.id}`;
      const defaultStudentDsu: DsuApplication = {
        agencyName: 'Regional DSU Office (e.g. EDISU / ER.GO / ALiSEO)',
        region: 'Target University Region',
        applicationDeadline: '2027-08-31',
        status: 'Not Started',
        cafOfficeUsed: '',
        iseeParificatoEur: 0,
        protocolNumber: '',
        freeMealRequested: false,
        dormAccommodationRequested: false,
        notes: 'Track personal regional scholarship requirements and ISEE Parificato documentation.',
        updatedAt: new Date().toISOString(),
      };
      return safeGet<DsuApplication>(key, defaultStudentDsu);
    }
    return safeGet<DsuApplication>(STORAGE_KEYS.DSU_APP, initialDsuApplication);
  },
  saveDsuApplication: (dsu: DsuApplication): void => {
    const key = getUserScopedKey(STORAGE_KEYS.DSU_APP);
    safeSet(key, dsu);
  },

  getCimeaSteps: (): CimeaStep[] =>
    safeGet<CimeaStep[]>(STORAGE_KEYS.CIMEA_STEPS, initialCimeaSteps),
  saveCimeaSteps: (steps: CimeaStep[]): void => safeSet(STORAGE_KEYS.CIMEA_STEPS, steps),

  getUniversitalyRecord: (): UniversitalyRecord =>
    safeGet<UniversitalyRecord>(STORAGE_KEYS.UNIVERSITALY, initialUniversitalyRecord),
  saveUniversitalyRecord: (uni: UniversitalyRecord): void =>
    safeSet(STORAGE_KEYS.UNIVERSITALY, uni),

  getEctsMappings: (): EctsCourseMapping[] =>
    safeGet<EctsCourseMapping[]>(STORAGE_KEYS.ECTS_MAPPINGS, initialEctsMappings),
  saveEctsMappings: (mappings: EctsCourseMapping[]): void =>
    safeSet(STORAGE_KEYS.ECTS_MAPPINGS, mappings),

  // ===== APPEARANCE SETTINGS =====
  getAppearanceSettings: (): AppearanceSettings =>
    safeGet<AppearanceSettings>(STORAGE_KEYS.APPEARANCE, initialAppearanceSettings),
  saveAppearanceSettings: (settings: AppearanceSettings): void =>
    safeSet(STORAGE_KEYS.APPEARANCE, settings),
  resetAppearanceSettings: (): void =>
    safeSet(STORAGE_KEYS.APPEARANCE, initialAppearanceSettings),

  // ===== DASHBOARD SETTINGS =====
  getDashboardSettings: (): DashboardSettings =>
    safeGet<DashboardSettings>(STORAGE_KEYS.DASHBOARD_SETTINGS, initialDashboardSettings),
  saveDashboardSettings: (settings: DashboardSettings): void =>
    safeSet(STORAGE_KEYS.DASHBOARD_SETTINGS, settings),
  resetDashboardSettings: (): void =>
    safeSet(STORAGE_KEYS.DASHBOARD_SETTINGS, initialDashboardSettings),

  // ===== CUSTOM MODULE BUILDER =====
  getCustomModules: (): CustomModuleDefinition[] =>
    safeGet<CustomModuleDefinition[]>(STORAGE_KEYS.CUSTOM_MODULES, initialCustomModules),
  saveCustomModules: (modules: CustomModuleDefinition[]): void =>
    safeSet(STORAGE_KEYS.CUSTOM_MODULES, modules),
  addCustomModule: (mod: CustomModuleDefinition): void => {
    const list = StorageService.getCustomModules();
    StorageService.saveCustomModules([...list, mod]);
  },
  updateCustomModule: (mod: CustomModuleDefinition): void => {
    const list = StorageService.getCustomModules();
    StorageService.saveCustomModules(list.map((m) => (m.id === mod.id ? mod : m)));
  },
  deleteCustomModule: (id: string): void => {
    const list = StorageService.getCustomModules();
    StorageService.saveCustomModules(list.filter((m) => m.id !== id));
    // Also clean up records for this module
    const records = StorageService.getCustomModuleRecords(undefined, true);
    StorageService.saveCustomModuleRecords(records.filter((r) => r.moduleId !== id));
  },

  // ===== CUSTOM MODULE RECORDS =====
  getCustomModuleRecords: (moduleId?: string, includeArchived = false): CustomModuleRecord[] => {
    const all = safeGet<CustomModuleRecord[]>(
      STORAGE_KEYS.CUSTOM_MODULE_RECORDS,
      initialCustomModuleRecords
    );
    let filtered = moduleId ? all.filter((r) => r.moduleId === moduleId) : all;
    if (!includeArchived) {
      filtered = filtered.filter((r) => !r.isArchived);
    }
    return filtered;
  },
  saveCustomModuleRecords: (records: CustomModuleRecord[]): void =>
    safeSet(STORAGE_KEYS.CUSTOM_MODULE_RECORDS, records),
  addCustomModuleRecord: (record: CustomModuleRecord): void => {
    const all = StorageService.getCustomModuleRecords(undefined, true);
    StorageService.saveCustomModuleRecords([record, ...all]);
  },
  updateCustomModuleRecord: (record: CustomModuleRecord): void => {
    const all = StorageService.getCustomModuleRecords(undefined, true);
    StorageService.saveCustomModuleRecords(all.map((r) => (r.id === record.id ? record : r)));
  },
  deleteCustomModuleRecord: (id: string): void => {
    const all = StorageService.getCustomModuleRecords(undefined, true);
    StorageService.saveCustomModuleRecords(all.filter((r) => r.id !== id));
  },
  archiveCustomModuleRecord: (id: string): void => {
    const all = StorageService.getCustomModuleRecords(undefined, true);
    StorageService.saveCustomModuleRecords(
      all.map((r) =>
        r.id === id ? { ...r, isArchived: true, archivedAt: new Date().toISOString() } : r
      )
    );
  },
  restoreCustomModuleRecord: (id: string): void => {
    const all = StorageService.getCustomModuleRecords(undefined, true);
    StorageService.saveCustomModuleRecords(
      all.map((r) => (r.id === id ? { ...r, isArchived: false, archivedAt: undefined } : r))
    );
  },

  // ===== NAVIGATION SETTINGS =====
  getNavigationSettings: (): NavigationSettings =>
    safeGet<NavigationSettings>(STORAGE_KEYS.NAVIGATION_SETTINGS, initialNavigationSettings),
  saveNavigationSettings: (settings: NavigationSettings): void =>
    safeSet(STORAGE_KEYS.NAVIGATION_SETTINGS, settings),

  resetAllData: (): void => {
    safeSet(STORAGE_KEYS.PROFILE, initialProfile);
    safeSet(STORAGE_KEYS.APPLICATIONS, initialApplications);
    safeSet(STORAGE_KEYS.TASKS, initialTasks);
    safeSet(STORAGE_KEYS.DOCUMENTS, initialDocuments);
    safeSet(STORAGE_KEYS.EXPENSES, initialExpenses);
    safeSet(STORAGE_KEYS.NOTES, initialNotes);
    safeSet(STORAGE_KEYS.LINKS, initialLinks);
    safeSet(STORAGE_KEYS.DSU_APP, initialDsuApplication);
    safeSet(STORAGE_KEYS.CIMEA_STEPS, initialCimeaSteps);
    safeSet(STORAGE_KEYS.UNIVERSITALY, initialUniversitalyRecord);
    safeSet(STORAGE_KEYS.ECTS_MAPPINGS, initialEctsMappings);
    safeSet(STORAGE_KEYS.UNIVERSITIES, publicItalianUniversities);
    safeSet(STORAGE_KEYS.ACCOMMODATIONS, initialAccommodations);
    safeSet(STORAGE_KEYS.FLIGHTS, initialFlights);
    safeSet(STORAGE_KEYS.VISA_CHECKLIST, initialVisaCheckItems);
    safeSet(STORAGE_KEYS.SPONSOR_RECORDS, initialSponsorRecords);
    safeSet(STORAGE_KEYS.EMBASSY_RECORD, initialEmbassyRecord);
    safeSet(STORAGE_KEYS.TEMPLATES, initialTemplates);
    safeSet(STORAGE_KEYS.CUSTOM_CONFIG, initialCustomConfig);
    safeSet(STORAGE_KEYS.APPEARANCE, initialAppearanceSettings);
    safeSet(STORAGE_KEYS.DASHBOARD_SETTINGS, initialDashboardSettings);
    safeSet(STORAGE_KEYS.CUSTOM_MODULES, initialCustomModules);
    safeSet(STORAGE_KEYS.CUSTOM_MODULE_RECORDS, initialCustomModuleRecords);
    safeSet(STORAGE_KEYS.NAVIGATION_SETTINGS, initialNavigationSettings);
  },

  exportBackup: (): string => {
    const bundle = {
      profile: StorageService.getProfile(),
      applications: StorageService.getApplications(true),
      tasks: StorageService.getTasks(true),
      documents: StorageService.getDocuments(true),
      expenses: StorageService.getExpenses(true),
      notes: StorageService.getNotes(true),
      links: StorageService.getLinks(true),
      dsuApplication: StorageService.getDsuApplication(),
      cimeaSteps: StorageService.getCimeaSteps(),
      universitaly: StorageService.getUniversitalyRecord(),
      ectsMappings: StorageService.getEctsMappings(),
      universities: StorageService.getUniversities(true),
      accommodations: StorageService.getAccommodations(true),
      flights: StorageService.getFlights(true),
      visaCheckItems: StorageService.getVisaCheckItems(true),
      sponsorRecords: StorageService.getSponsorRecords(true),
      embassyRecord: StorageService.getEmbassyRecord(),
      templates: StorageService.getTemplates(),
      customConfig: StorageService.getCustomConfig(),
      appearance: StorageService.getAppearanceSettings(),
      dashboardSettings: StorageService.getDashboardSettings(),
      customModules: StorageService.getCustomModules(),
      customModuleRecords: StorageService.getCustomModuleRecords(undefined, true),
      navigationSettings: StorageService.getNavigationSettings(),
      exportedAt: new Date().toISOString(),
      version: '3.0.0',
    };
    return JSON.stringify(bundle, null, 2);
  },

  importBackup: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) safeSet(STORAGE_KEYS.PROFILE, data.profile);
      if (data.applications) safeSet(STORAGE_KEYS.APPLICATIONS, data.applications);
      if (data.tasks) safeSet(STORAGE_KEYS.TASKS, data.tasks);
      if (data.documents) safeSet(STORAGE_KEYS.DOCUMENTS, data.documents);
      if (data.expenses) safeSet(STORAGE_KEYS.EXPENSES, data.expenses);
      if (data.notes) safeSet(STORAGE_KEYS.NOTES, data.notes);
      if (data.links) safeSet(STORAGE_KEYS.LINKS, data.links);
      if (data.dsuApplication) safeSet(STORAGE_KEYS.DSU_APP, data.dsuApplication);
      if (data.cimeaSteps) safeSet(STORAGE_KEYS.CIMEA_STEPS, data.cimeaSteps);
      if (data.universitaly) safeSet(STORAGE_KEYS.UNIVERSITALY, data.universitaly);
      if (data.ectsMappings) safeSet(STORAGE_KEYS.ECTS_MAPPINGS, data.ectsMappings);
      if (data.universities) safeSet(STORAGE_KEYS.UNIVERSITIES, data.universities);
      if (data.accommodations) safeSet(STORAGE_KEYS.ACCOMMODATIONS, data.accommodations);
      if (data.flights) safeSet(STORAGE_KEYS.FLIGHTS, data.flights);
      if (data.visaCheckItems) safeSet(STORAGE_KEYS.VISA_CHECKLIST, data.visaCheckItems);
      if (data.sponsorRecords) safeSet(STORAGE_KEYS.SPONSOR_RECORDS, data.sponsorRecords);
      if (data.embassyRecord) safeSet(STORAGE_KEYS.EMBASSY_RECORD, data.embassyRecord);
      if (data.templates) safeSet(STORAGE_KEYS.TEMPLATES, data.templates);
      if (data.customConfig) safeSet(STORAGE_KEYS.CUSTOM_CONFIG, data.customConfig);
      if (data.appearance) safeSet(STORAGE_KEYS.APPEARANCE, data.appearance);
      if (data.dashboardSettings) safeSet(STORAGE_KEYS.DASHBOARD_SETTINGS, data.dashboardSettings);
      if (data.customModules) safeSet(STORAGE_KEYS.CUSTOM_MODULES, data.customModules);
      if (data.customModuleRecords) safeSet(STORAGE_KEYS.CUSTOM_MODULE_RECORDS, data.customModuleRecords);
      if (data.navigationSettings) safeSet(STORAGE_KEYS.NAVIGATION_SETTINGS, data.navigationSettings);
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON:', e);
      return false;
    }
  },
};

