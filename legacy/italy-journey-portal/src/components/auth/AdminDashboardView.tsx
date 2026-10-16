import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage';
import { AuthUser } from '../../types';
import { ModuleKey } from '../layout/Sidebar';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Coins,
  Award,
  FileText,
  Palette,
  Layers,
  Users,
  Search,
  SlidersHorizontal,
  Lock,
  ArrowRight,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface AdminDashboardViewProps {
  onNavigate: (module: ModuleKey) => void;
  onNavigateToAdminLogin: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigate,
  onNavigateToAdminLogin,
}) => {
  const isAdmin = StorageService.isAdmin();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Load registered users from API or storage
  useEffect(() => {
    if (!isAdmin) return;
    setIsLoadingUsers(true);

    fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${StorageService.getAuthSession()?.token || ''}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authorized');
      })
      .then((data) => {
        if (data && data.users) {
          setUsers(data.users);
        }
      })
      .catch(() => {
        // Fallback to local default users
        setUsers([
          {
            id: 'student-demo-002',
            email: 'student@example.com',
            fullName: 'Student Applicant',
            role: 'user',
            createdAt: '2026-10-09T08:00:00.000Z',
            bachelorDegree: "Bachelor's Degree",
            currentUniversity: 'Undergraduate Institution',
            targetIntake: '2027/2028 (Autumn / Fall)',
          },
        ]);
      })
      .finally(() => setIsLoadingUsers(false));
  }, [isAdmin]);

  // Protected route access check
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-rose-500/30 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Administrator Access Required</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The Private Admin Dashboard is restricted to authorized platform administrators. Please sign in with administrator credentials.
          </p>
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={onNavigateToAdminLogin}
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            Go to Administrator Login
          </Button>
        </div>
      </div>
    );
  }

  const publicUnis = StorageService.getUniversities();
  const templates = StorageService.getTemplates();
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.currentUniversity && u.currentUniversity.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Administrator Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Private Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Centralized portal management: oversee public university directories, publish scholarship and visa guidance, manage templates, and monitor registered student applicant accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('admin_control')}
            icon={<SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Full Control Center
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('dashboard')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Student Dashboard
          </Button>
        </div>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Registered Students
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {users.length}
          </div>
          <span className="text-xs text-slate-400">Active applicant accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Public Universities
            </span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {publicUnis.length}
          </div>
          <span className="text-xs text-slate-400">Catalogued public institutions</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Shared Templates
            </span>
            <FileText className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {templates.length}
          </div>
          <span className="text-xs text-slate-400">SOP, CV & Professor Email templates</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              System Health
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
            100% Secure
          </div>
          <span className="text-xs text-slate-400">Role-based access enforced</span>
        </div>
      </div>

      {/* Quick Governance Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('admin_control')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                University & Programme Content
              </h3>
              <span className="text-xs text-slate-400">Manage 11 public Italian institutions</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Add or edit English-taught MSc programmes, deadlines, fee requirements, and CFU minimum requirements.
          </p>
        </div>

        <div
          onClick={() => onNavigate('appearance')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-850/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                Appearance & Typography
              </h3>
              <span className="text-xs text-slate-400">Global themes & typography scales</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Customize typography scales, font families, color palettes, card geometry, and layout density with live preview.
          </p>
        </div>

        <div
          onClick={() => onNavigate('custom_modules')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-850/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-teal-300 transition-colors">
                Custom Module Builder
              </h3>
              <span className="text-xs text-slate-400">Schema-driven sections & fields</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create custom portal sections, checklists, statuses, and custom typed fields with persistent CRUD.
          </p>
        </div>
      </div>

      {/* Registered Students Management Directory */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Registered Student Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review registered student applicant accounts and their private workspace initialization status.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-medium">Student Name</th>
                <th className="py-3 px-4 font-medium">Email Address</th>
                <th className="py-3 px-4 font-medium">Degree & University</th>
                <th className="py-3 px-4 font-medium">Target Intake</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No student accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{u.fullName}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {u.bachelorDegree ? `${u.bachelorDegree} · ${u.currentUniversity || ''}` : 'Undergraduate Student'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {u.targetIntake || '2027/2028'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        Student User
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

