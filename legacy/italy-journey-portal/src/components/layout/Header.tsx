import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Download,
  Upload,
  RotateCcw,
  Plus,
  ExternalLink,
  SlidersHorizontal,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Lock,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { ModuleKey } from './Sidebar';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AuthUser } from '../../types';

interface HeaderProps {
  currentModule: ModuleKey;
  currentUser?: AuthUser | null;
  onOpenMobileSidebar: () => void;
  onSelectModule: (mod: ModuleKey) => void;
  onAddNewApplication: () => void;
  onAddNewTask: () => void;
  onExportBackup: () => void;
  onImportBackup: (json: string) => boolean;
  onResetData: () => void;
  onSignOut?: () => void;
  onSwitchRole?: (role: 'admin' | 'user') => void;
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
}

const MODULE_TITLES: Record<ModuleKey, { title: string; subtitle: string; category: string }> = {
  landing: {
    title: 'Italy Journey Portal',
    subtitle: 'Your Complete Study in Italy Companion — Bachelor, Master & PhD Pathways',
    category: 'Home',
  },
  dashboard: {
    title: 'Student Dashboard',
    subtitle: 'Personal study abroad control center, status metrics, and admission countdown',
    category: 'Overview',
  },
  profile: {
    title: 'Academic Profile & Strategy',
    subtitle: 'Degree records, GPA/CGPA, language proficiency test scores, and credit matching strategy',
    category: 'Profile',
  },
  regions: {
    title: 'All 20 Italian Regions Explorer',
    subtitle: 'Comprehensive regional higher education, public university directory, living costs, and regional DSU agencies',
    category: 'Regions',
  },
  explorer: {
    title: 'Italian Public University Explorer',
    subtitle: 'Public universities offering Bachelor, Master, and PhD degree programmes across Italy',
    category: 'Admission',
  },
  programmes: {
    title: 'Degree Programme Directory & Matching',
    subtitle: 'Curriculum requirements, ECTS credit evaluation, and target academic disciplines',
    category: 'Admission',
  },
  applications: {
    title: 'University Application Manager',
    subtitle: 'Track round deadlines, portal logins, fees, status, and admission offers',
    category: 'Admission',
  },
  scholarships: {
    title: 'Scholarship & DSU Regional Tracker',
    subtitle: 'Regional DSU agencies (EDISU, ER.GO, DSU Toscana), ISEE Parificato & benefits',
    category: 'Finance',
  },
  documents: {
    title: 'Academic Document Manager',
    subtitle: 'Transcripts, syllabus, SOP, LORs, and attestation readiness checklist',
    category: 'Documents',
  },
  cimea_dov: {
    title: 'CIMEA, DOV & Legalization Tracker',
    subtitle: 'Statement of Comparability (CIMEA DiploME), DOV, and Bangladesh MOFA attestation',
    category: 'Documents',
  },
  universitaly: {
    title: 'Universitaly Pre-enrolment Portal',
    subtitle: 'Official MUR pre-enrolment workflow, document attachments, and verification',
    category: 'Admission',
  },
  embassy_visa: {
    title: 'Italian Embassy & Student Visa Tracker',
    subtitle: 'VFS Global Dhaka appointment tracking, Type D National Visa processing',
    category: 'Visa',
  },
  visa_checklist: {
    title: 'Visa Document Checklist (VFS Dhaka)',
    subtitle: 'Official checklist for Italian Embassy in Bangladesh student visa submission',
    category: 'Visa',
  },
  sponsor_bank: {
    title: 'Sponsor & Bank Solvency Documents',
    subtitle: 'Proof of funds tracker, 6-month bank statements, affidavit & NBR tax returns',
    category: 'Finance',
  },
  accommodation: {
    title: 'Accommodation Management',
    subtitle: 'Student dorms, private rent contracts, Agenzia delle Entrate registration',
    category: 'Relocation',
  },
  flight_planner: {
    title: 'Flight Booking Planner',
    subtitle: 'Dhaka (DAC) to Italy (MXP/FCO), airline baggage allowance for student visas',
    category: 'Relocation',
  },
  travel_checklist: {
    title: 'Airport & Departure Checklist',
    subtitle: 'Essential packing list, adapters, documents in hand luggage, pre-flight checks',
    category: 'Relocation',
  },
  residence_permit: {
    title: 'Permesso di Soggiorno (Residence Permit)',
    subtitle: 'Poste Italiane yellow kit, Questura appointment, €118 tax bollettino tracker',
    category: 'Relocation',
  },
  enrollment: {
    title: 'University Final Enrollment',
    subtitle: 'Tax code (Codice Fiscale), matriculation, original document presentation',
    category: 'Admission',
  },
  student_life: {
    title: 'Italy Student Life & Settling In',
    subtitle: 'Tessera Sanitaria (health card), Italian SIM, bank account, public transit card',
    category: 'Relocation',
  },
  tasks: {
    title: 'Tasks & Milestone To-Do Lists',
    subtitle: 'Action items categorized by stage, priority, and upcoming deadlines',
    category: 'Productivity',
  },
  calendar: {
    title: 'Admissions Calendar & Deadlines',
    subtitle: 'Chronological roadmap for applications, scholarships, and visa intake 27/28',
    category: 'Productivity',
  },
  budget: {
    title: 'Financial Budget & Expense Tracker',
    subtitle: 'Detailed estimated vs actual expenses in EUR (€) and BDT (৳)',
    category: 'Finance',
  },
  notes_links: {
    title: 'Notes & Official Italian Portals',
    subtitle: 'Crucial bookmarks, Telegram groups, verified portals, and personal notes',
    category: 'Productivity',
  },
  analytics: {
    title: 'Progress & Readiness Analytics',
    subtitle: 'Overall journey completion score, profile viability, and next milestones',
    category: 'Overview',
  },
  admin_control: {
    title: 'Owner & Admin Control Center',
    subtitle: 'Manage all 18 modules, custom categories, reusable templates & archived vault',
    category: 'System',
  },
  appearance: {
    title: 'Appearance & Design Settings',
    subtitle: 'Customize branding, theme palettes, typography scale, and card layout',
    category: 'Settings',
  },
  custom_modules: {
    title: 'Custom Module Builder',
    subtitle: 'Build schema-driven sections, custom checklists, fields, and navigation',
    category: 'Builder',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onOpenMobileSidebar,
  onSelectModule,
  onAddNewApplication,
  onAddNewTask,
  onExportBackup,
  onImportBackup,
  onResetData,
  currentUser,
  onSignOut,
  onSwitchRole,
  onNavigateToLogin,
  onNavigateToRegister,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const currentInfo = MODULE_TITLES[currentModule] || {
    title: 'Italy Study Abroad Platform',
    subtitle: 'Admissions Portal',
    category: 'Portal',
  };

  // Keyboard shortcut for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchableItems = [
    { name: 'Dashboard Overview', module: 'dashboard' as ModuleKey, desc: 'Admission metrics & countdown' },
    { name: 'Academic Profile & Strategy', module: 'profile' as ModuleKey, desc: 'Academic records, CGPA, IELTS, and CFU credits' },
    { name: 'Politecnico di Torino (PoliTO)', module: 'explorer' as ModuleKey, desc: 'Turin, Data Science & Engineering' },
    { name: 'University of Bologna (UNIBO)', module: 'explorer' as ModuleKey, desc: 'Bologna, MSc Artificial Intelligence' },
    { name: 'University of Padua (UNIPD)', module: 'explorer' as ModuleKey, desc: 'Padua, MSc Computer Science / AI' },
    { name: 'Sapienza University of Rome', module: 'explorer' as ModuleKey, desc: 'Rome, MSc AI & Robotics' },
    { name: 'University of Pisa (UNIPI)', module: 'explorer' as ModuleKey, desc: 'Pisa, AI & Data Engineering, 0€ App fee' },
    { name: 'University of Genoa (UniGe)', module: 'explorer' as ModuleKey, desc: 'Genoa, Computer Engineering AI track' },
    { name: 'University Application Manager', module: 'applications' as ModuleKey, desc: 'Manage your active university submissions' },
    { name: 'Scholarship & DSU Regional Tracker', module: 'scholarships' as ModuleKey, desc: 'EDISU, ER.GO, DSU Toscana grants' },
    { name: 'Academic Document Manager', module: 'documents' as ModuleKey, desc: 'Transcripts, Syllabus, SOP, LOR, Passport' },
    { name: 'CIMEA DiploME Platform', module: 'cimea_dov' as ModuleKey, desc: 'Statement of Comparability & Verification' },
    { name: 'Universitaly Pre-enrolment', module: 'universitaly' as ModuleKey, desc: 'Pre-enrolment summary (Riepilogo) form' },
    { name: 'Italian Embassy & Student Visa', module: 'embassy_visa' as ModuleKey, desc: 'VFS Global Dhaka appointment tracking' },
    { name: 'Visa Document Checklist', module: 'visa_checklist' as ModuleKey, desc: 'Full Embassy Dhaka document bundle' },
    { name: 'Sponsor & Bank Solvency Funds', module: 'sponsor_bank' as ModuleKey, desc: 'Bank statement, sponsor affidavit, NBR tax' },
    { name: 'Accommodation in Italy', module: 'accommodation' as ModuleKey, desc: 'Dormitories, apartment rental contracts' },
    { name: 'Flight Planner', module: 'flight_planner' as ModuleKey, desc: 'DAC to MXP/FCO tickets, student luggage' },
    { name: 'Permesso di Soggiorno Tracker', module: 'residence_permit' as ModuleKey, desc: '8-day rule, Poste Italiane yellow kit' },
    { name: 'Italy Student Life & Services', module: 'student_life' as ModuleKey, desc: 'Codice Fiscale, ASL Health card, SIM' },
    { name: 'Financial Budget & Cost Planner', module: 'budget' as ModuleKey, desc: 'EUR (€) and BDT (৳) calculations' },
    { name: 'Tasks & Milestone To-Do List', module: 'tasks' as ModuleKey, desc: 'Pending tasks, priority, deadlines' },
    { name: 'Calendar & Important Deadlines', module: 'calendar' as ModuleKey, desc: 'Application calls and visa schedule' },
    { name: 'Progress Analytics', module: 'analytics' as ModuleKey, desc: 'Journey readiness meter and score' },
    { name: 'Owner & Admin Control Center', module: 'admin_control' as ModuleKey, desc: 'Manage all modules, custom categories, reusable templates & archived vault' },
  ];

  const filteredItems = searchQuery.trim()
    ? searchableItems.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchableItems.slice(0, 8);

  const handleImportSubmit = () => {
    setImportError('');
    if (!importJsonText.trim()) {
      setImportError('Please paste valid JSON text.');
      return;
    }
    const success = onImportBackup(importJsonText);
    if (success) {
      setIsBackupOpen(false);
      setImportJsonText('');
    } else {
      setImportError('Invalid backup data format. Please check your JSON.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
        {/* Left side: Hamburger & Title with Category Breadcrumb */}
        <div className="flex items-center space-x-3.5 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
              <span>{currentInfo.category}</span>
              <span>/</span>
              <span className="text-emerald-400 font-semibold">{currentInfo.title}</span>
            </div>
            <p className="text-xs text-slate-400 truncate hidden sm:block max-w-xl">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right side: User Account Menu, Quick Search & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Visitor not logged in: Clearly visible Log In & Sign Up / Register buttons (accessible on mobile & desktop) */}
          {!currentUser ? (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-750 hover:border-slate-650 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                title="Log In to your personal student workspace"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-500/50 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm shadow-emerald-950/40 cursor-pointer"
                title="Sign Up / Register for a new account"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign Up / </span>
                <span>Register</span>
              </button>
            </div>
          ) : (
            /* User is logged in: Replace with Profile, My Dashboard, Settings, Log Out menu */
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-xs cursor-pointer"
                title="User Account & Navigation"
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                    currentUser.role === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-teal-500/20 text-teal-400'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-white font-medium text-[11px] leading-tight truncate max-w-[110px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    {currentUser.role === 'admin' ? 'Administrator' : 'Student User'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-2.5 space-y-2">
                  <div className="px-2 py-1.5 border-b border-slate-800/80">
                    <p className="text-xs font-semibold text-white truncate">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          currentUser.role === 'admin'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        {currentUser.role === 'admin' ? 'Authorized Administrator' : 'Standard Student Account'}
                      </span>
                    </div>
                  </div>

                  {/* Account Navigation: Profile, My Dashboard, Settings */}
                  <div className="space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSelectModule('profile');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      <span>Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSelectModule('dashboard');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>My Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSelectModule('appearance');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Settings</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onSelectModule('admin_dashboard');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-emerald-300 hover:bg-emerald-500/10 transition-colors flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Admin Dashboard</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onSelectModule('admin_control');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-emerald-300 hover:bg-emerald-500/10 transition-colors flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Admin Control Center</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Sign Out */}
                  <div className="pt-1.5 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onSignOut) onSignOut();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 text-xs font-medium transition-all cursor-pointer"
            title="Search modules & universities (Ctrl+K or ⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Quick Jump</span>
            <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Quick Add Action Shortcuts (only for signed-in users) */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-1.5">
              <Button
                variant="secondary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5 text-emerald-400" />}
                onClick={onAddNewTask}
              >
                Task
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={onAddNewApplication}
              >
                Add Uni
              </Button>
            </div>
          )}

          {/* Admin Control Center Shortcut: STRICTLY available ONLY to authenticated administrators */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onSelectModule('admin_control')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-semibold ${
                currentModule === 'admin_control' || currentModule === 'admin_dashboard'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-slate-800'
              }`}
              title="Owner & Admin Control Center"
              aria-label="Owner and Admin Control Center"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline text-[11px]">Admin</span>
            </button>
          )}

          {/* Backup / Export Menu */}
          <button
            onClick={() => setIsBackupOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            title="Data Backup & JSON Export"
            aria-label="Backup and Data Management"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        title="Quick Navigation & Search"
        subtitle="Search across all 23 modules, Italian universities, and admission workflows"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search university, DSU scholarship, visa checklist, task, CIMEA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-750 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
            {filteredItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectModule(item.module);
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/80 flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-colors" />
              </button>
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No matching modules or universities found for "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Backup & Restore Modal */}
      <Modal
        isOpen={isBackupOpen}
        onClose={() => {
          setIsBackupOpen(false);
          setImportError('');
        }}
        title="Data Backup & Storage Management"
        subtitle="Your journey data is securely stored in your browser's persistent local storage."
        maxWidth="max-w-lg"
      >
        <div className="space-y-5 text-sm">
          {/* Export Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center space-x-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download JSON Backup</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export all your applications, task statuses, documents checklist, expenses, and notes into an offline JSON file for safe archiving.
            </p>
            <div className="pt-1">
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={onExportBackup}
                className="w-full"
              >
                Export & Save Backup
              </Button>
            </div>
          </div>

          {/* Import Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <h4 className="font-semibold text-white flex items-center space-x-2">
              <Upload className="w-4 h-4 text-sky-400" />
              <span>Restore from JSON</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste a previously exported backup JSON string to restore your entire state.
            </p>
            <textarea
              rows={4}
              placeholder="Paste JSON content here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-750 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />
            {importError && (
              <div className="text-xs text-rose-400 font-medium">{importError}</div>
            )}
            <Button
              variant="secondary"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={handleImportSubmit}
              className="w-full"
            >
              Import & Restore
            </Button>
          </div>

          {/* Reset zone */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="font-medium text-xs text-slate-300">Reset to Defaults</div>
              <div className="text-[11px] text-slate-400">Reload official public dataset & templates</div>
            </div>
            <button
              onClick={() => {
                setIsBackupOpen(false);
                setIsResetConfirmOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset Data to Default Seeds?"
        subtitle="This will replace any changes made with the standard public dataset."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to restore the defaults? Any custom universities or personal notes added will be replaced by the original template.
          </p>
          <div className="flex items-center justify-end space-x-3 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onResetData();
                setIsResetConfirmOpen(false);
              }}
            >
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

