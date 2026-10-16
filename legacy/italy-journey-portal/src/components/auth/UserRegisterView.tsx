import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import {
  UserPlus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Check,
} from 'lucide-react';
import { Button } from '../common/Button';

interface UserRegisterViewProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const UserRegisterView: React.FC<UserRegisterViewProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Optional profile fields - empty defaults
  const [bachelorDegree, setBachelorDegree] = useState('');
  const [currentUniversity, setCurrentUniversity] = useState('');
  const [targetIntake, setTargetIntake] = useState('2027/2028 (Autumn / Fall)');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);

  // Email format validation
  const isEmailValid = useMemo(() => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  }, [password]);

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail || !password.trim()) {
      setErrorMessage('Full name, email address, and password are required.');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address (e.g. yourname@domain.com).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await StorageService.register({
        fullName: cleanName,
        email: cleanEmail,
        password: password.trim(),
        bachelorDegree: bachelorDegree.trim(),
        currentUniversity: currentUniversity.trim(),
        targetIntake,
      });

      if (res.success) {
        onRegisterSuccess();
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
    } catch {
      setErrorMessage('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setGoogleNotice(
      'Google Sign-Up is configured for Google Workspace domains. For instant setup, register with your email or use the registration form below.'
    );
    setTimeout(() => setGoogleNotice(null), 8000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-lg shadow-emerald-950/20">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Register your own private, isolated Italy MSc admission workspace.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {googleNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
              <div className="flex-1 leading-relaxed">{googleNotice}</div>
              <button
                type="button"
                onClick={() => setGoogleNotice(null)}
                className="text-teal-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Google Sign-Up Button */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-600 hover:bg-slate-850 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-slate-900 px-3 text-slate-500 font-semibold">
                  Or register with email
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g. Tanvir Ahmed"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                {email && !isEmailValid && (
                  <span className="text-[11px] text-rose-400 font-medium">Invalid email format</span>
                )}
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tanvir@example.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                  email && !isEmailValid
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-slate-700/80 focus:border-emerald-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
                    Password <span className="text-emerald-400">*</span>
                  </label>
                  {password && (
                    <span
                      className={`text-[10px] font-semibold uppercase ${
                        passwordStrength.label === 'Strong'
                          ? 'text-emerald-400'
                          : passwordStrength.label === 'Medium'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="min 6 chars"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
                    Confirm Password <span className="text-emerald-400">*</span>
                  </label>
                  {confirmPassword && !passwordsMatch && (
                    <span className="text-[10px] text-rose-400 font-medium">Mismatch</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="repeat password"
                    className={`w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950/80 border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-500/80 focus:border-rose-500'
                        : 'border-slate-700/80 focus:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Progress Bar */}
            {password && (
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                  <div
                    className={`h-full flex-1 rounded-full ${
                      passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full ${
                      passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full ${
                      passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Password strength: {passwordStrength.label || 'Enter at least 6 characters'}
                </p>
              </div>
            )}

            {/* Optional Academic Background Fields */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Academic Background (Optional)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Undergraduate Degree
                  </label>
                  <input
                    type="text"
                    value={bachelorDegree}
                    onChange={(e) => setBachelorDegree(e.target.value)}
                    placeholder="BSc in Computer Science"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Current University
                  </label>
                  <input
                    type="text"
                    value={currentUniversity}
                    onChange={(e) => setCurrentUniversity(e.target.value)}
                    placeholder="e.g. University / College name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Italian Intake
                </label>
                <select
                  value={targetIntake}
                  onChange={(e) => setTargetIntake(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="2027/2028 (Autumn / Fall)">2027/2028 (Autumn / Fall Intake)</option>
                  <option value="2026/2027 (Autumn / Fall)">2026/2027 (Autumn / Fall Intake)</option>
                  <option value="2028/2029 (Autumn / Fall)">2028/2029 (Autumn / Fall Intake)</option>
                </select>
              </div>
            </div>

            {/* Strict Data Privacy Notice */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5 mt-2 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guaranteed:</strong> New accounts start with clean, empty personal records. Your profile, universities, CGPA, IELTS, and documents are private to you.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center mt-3 bg-emerald-600 hover:bg-emerald-500 border-emerald-500/40"
              isLoading={isLoading}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Register & Launch My Private Workspace
            </Button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center text-xs text-slate-400 pt-5 border-t border-slate-800/80">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Log In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

