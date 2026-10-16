import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import {
  GraduationCap,
  LogIn,
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  X,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface UserLoginViewProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
  onNavigateToAdminLogin: () => void;
}

export const UserLoginView: React.FC<UserLoginViewProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToAdminLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Google sign in notice state
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password.trim()) {
      setErrorMessage('Please provide both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await StorageService.login(cleanEmail, password.trim(), rememberMe);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoStudent = async () => {
    setEmail('student@example.com');
    setPassword('Student@2027');
    setErrorMessage(null);
    setIsLoading(true);
    const res = await StorageService.login('student@example.com', 'Student@2027', true);
    setIsLoading(false);
    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMessage(res.error || 'Failed to authenticate.');
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleNotice(
      'Google Sign-In is configured for Google Workspace domains. For instant local access, you can sign in with your email/password or use the One-Click Demo Student account.'
    );
    setTimeout(() => setGoogleNotice(null), 8000);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail) {
      setForgotError('Please enter your registered email address.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    setIsResetting(true);
    try {
      const res = await StorageService.resetPassword(cleanEmail, forgotNewPassword);
      if (res.success) {
        setForgotSuccess(res.message || 'Password reset successfully! You can now log in.');
        setEmail(cleanEmail);
        setPassword('');
        setTimeout(() => {
          setIsForgotModalOpen(false);
          setForgotSuccess(null);
          setForgotEmail('');
          setForgotNewPassword('');
          setForgotConfirmPassword('');
        }, 2200);
      } else {
        setForgotError(res.error || 'Could not reset password.');
      }
    } catch {
      setForgotError('Failed to communicate with authentication service.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-lg shadow-emerald-950/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Student Applicant Sign-In
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Access your private Italy MSc admission roadmap, document manager, and scholarship tracker.
          </p>
        </div>

        {/* Card Box */}
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

          {/* Google Sign-In Button */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-slate-900 px-3 text-slate-500 font-semibold">Or with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Session Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember session on this device (30 days)</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center mt-3 bg-emerald-600 hover:bg-emerald-500 border-emerald-500/40"
              isLoading={isLoading}
              icon={<LogIn className="w-4 h-4" />}
            >
              Log In to Personal Dashboard
            </Button>
          </form>

          {/* Quick Demo Student Fill Shortcut */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickDemoStudent}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>One-Click Demo Student Sign-In (student@example.com)</span>
            </button>
          </div>

          {/* Link to Register */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up / Register</span>
            </button>
          </div>
        </div>

        {/* Link to Admin Portal */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onNavigateToAdminLogin}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Administrator Access Portal</span>
            <ArrowRight className="w-3 h-3 ml-0.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => {
          setIsForgotModalOpen(false);
          setForgotError(null);
          setForgotSuccess(null);
        }}
        title="Reset Account Password"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your registered email address and define a new password to restore access to your personal study abroad workspace.
          </p>

          {forgotError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{forgotError}</span>
            </div>
          )}

          {forgotSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{forgotSuccess}</span>
            </div>
          )}

          <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Registered Email
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                placeholder="student@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  New Password (min 6 characters)
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPass(!showForgotPass)}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {showForgotPass ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showForgotPass ? 'text' : 'password'}
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type={showForgotPass ? 'text' : 'password'}
                value={forgotConfirmPassword}
                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsForgotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isResetting}
                icon={<KeyRound className="w-3.5 h-3.5" />}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

