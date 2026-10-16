import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Shield, KeyRound, ArrowRight, Lock, AlertCircle, CheckCircle2, User, Globe2 } from 'lucide-react';
import { Button } from '../common/Button';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onNavigateToUserLogin: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onNavigateToUserLogin,
}) => {
  const [email, setEmail] = useState('admin@italy-msc.edu');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password.trim()) {
      setErrorMessage('Please enter the administrator access key.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await StorageService.adminLogin(password.trim(), email.trim());
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(res.error || 'Invalid administrator authorization key.');
      }
    } catch (err: any) {
      setErrorMessage('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@italy-msc.edu');
    setPassword('Admin@Italy2027');
    setErrorMessage(null);
    setIsLoading(true);
    const res = await StorageService.adminLogin('Admin@Italy2027', 'admin@italy-msc.edu');
    setIsLoading(false);
    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMessage(res.error || 'Failed to authenticate.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Security Badge Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-lg shadow-emerald-950/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Administrator Gateway
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Authorized administrative access for Italy MSc Journey portal governance and content publishing.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">
                Administrator Email / ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@italy-msc.edu"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">
                Master Authorization Key / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5 leading-normal">
                Default authorization key: <code className="text-emerald-400 font-mono">Admin@Italy2027</code>
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center mt-2"
              isLoading={isLoading}
              icon={<KeyRound className="w-4 h-4" />}
            >
              Authenticate as Administrator
            </Button>
          </form>

          {/* Quick Demo Fill Shortcut */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>One-Click Demo Admin Authorization</span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-2 font-medium text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Administrative Privileges:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
              <li>Manage shared public universities & MSc programmes</li>
              <li>Edit regional DSU scholarship and visa guidance</li>
              <li>Configure system typography and portal design</li>
              <li>Manage student directory and access control</li>
            </ul>
          </div>
        </div>

        {/* Back to User Portal */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onNavigateToUserLogin}
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Are you a student applicant? Return to Student Login</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

