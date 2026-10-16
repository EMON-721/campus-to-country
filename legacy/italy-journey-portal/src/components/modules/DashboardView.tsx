import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  UniversityApplication,
  TaskItem,
  AcademicDocument,
  DashboardSettings,
  DashboardWidgetConfig,
  DashboardWidgetId,
} from '../../types';
import { ModuleKey } from '../layout/Sidebar';
import { StorageService } from '../../services/storage';
import {
  GraduationCap,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Coins,
  Building,
  ExternalLink,
  Plus,
  AlertCircle,
  FileText,
  Calendar,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Layers,
  ShieldCheck,
  WalletCards,
  Award,
  Globe2,
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';

interface DashboardViewProps {
  profile: UserProfile;
  applications: UniversityApplication[];
  tasks: TaskItem[];
  documents: AcademicDocument[];
  onNavigate: (module: ModuleKey) => void;
  onToggleTask: (id: string) => void;
  onAddNewApplication: () => void;
  onAddNewTask: () => void;
  onUpdateApplication?: (app: UniversityApplication) => void;
  onUpdateTask?: (task: TaskItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  applications,
  tasks,
  documents,
  onNavigate,
  onToggleTask,
  onAddNewApplication,
  onAddNewTask,
  onUpdateApplication,
  onUpdateTask,
}) => {
  // Stored Dashboard Layout Settings
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>(() =>
    StorageService.getDashboardSettings()
  );

  // Visual Dashboard Editor Modal state
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [draftSettings, setDraftSettings] = useState<DashboardSettings>(dashboardSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [appFilter, setAppFilter] = useState<'all' | 'my' | 'demo'>(
    dashboardSettings.statsFilter || 'all'
  );
  const [taskFilter, setTaskFilter] = useState<'all' | 'my' | 'demo'>('all');

  // Related extra data for widgets
  const dsuApp = StorageService.getDsuApplication();
  const embassyRecord = StorageService.getEmbassyRecord();
  const expenses = StorageService.getExpenses();

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const readyDocs = documents.filter(
    (d) =>
      d.status === 'Ready' ||
      d.status === 'Verified' ||
      d.status === 'Attested / Legalized'
  );
  const urgentTasks = tasks.filter(
    (t) => t.priority === 'urgent' && t.status !== 'completed'
  );

  const myTargetApps = applications.filter((a) => !a.isDemo);
  const demoApps = applications.filter((a) => a.isDemo);

  const displayedApps = applications.filter((a) => {
    if (appFilter === 'my') return !a.isDemo;
    if (appFilter === 'demo') return Boolean(a.isDemo);
    return true;
  });

  const myTasks = tasks.filter((t) => !t.isDemo);
  const demoTasks = tasks.filter((t) => t.isDemo);

  const displayedTasks = tasks.filter((t) => {
    if (taskFilter === 'my') return !t.isDemo;
    if (taskFilter === 'demo') return Boolean(t.isDemo);
    return true;
  });

  // Calculate upcoming deadlines (from applications and tasks within lookahead window)
  const lookaheadDays = dashboardSettings.deadlinesLookaheadDays || 180;
  const now = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(now.getDate() + lookaheadDays);

  const upcomingDeadlines = [
    ...applications.map((a) => ({
      id: `app-${a.id}`,
      type: 'University Deadline',
      title: `${a.universityName} (${a.round})`,
      dateStr: a.deadlineDate,
      date: new Date(a.deadlineDate),
      module: 'applications' as ModuleKey,
      notes: `${a.programName} · Status: ${a.status}`,
    })),
    ...tasks
      .filter((t) => t.status !== 'completed' && t.dueDate)
      .map((t) => ({
        id: `task-${t.id}`,
        type: 'Task Due Date',
        title: t.title,
        dateStr: t.dueDate,
        date: new Date(t.dueDate),
        module: 'tasks' as ModuleKey,
        notes: `Priority: ${t.priority} · Category: ${t.category}`,
      })),
  ]
    .filter((d) => !isNaN(d.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 6);

  // 7-step Master Trajectory
  const milestones = [
    {
      id: 1,
      title: 'Profile & Syllabus CFU Prep',
      period: 'Oct 2026 – Nov 2026',
      status: 'In Progress',
      progress: 75,
      desc: 'Undergraduate course syllabus authenticated, English test verified, academic portfolio organized.',
      targetModule: 'profile' as ModuleKey,
    },
    {
      id: 2,
      title: 'Round 1 & 2 Uni Applications',
      period: 'Dec 2026 – Mar 2027',
      status: 'Upcoming',
      progress: 25,
      desc: 'Submitting Italian public university portals with tailored statements and transcripts.',
      targetModule: 'applications' as ModuleKey,
    },
    {
      id: 3,
      title: 'Graduation & Legalization (MOFA)',
      period: 'Apr 2027 – May 2027',
      status: 'Pending',
      progress: 0,
      desc: 'Undergraduate graduation completion, MOE & Segunbagicha MOFA attestation for CIMEA.',
      targetModule: 'cimea_dov' as ModuleKey,
    },
    {
      id: 4,
      title: 'Universitaly & CIMEA Statement',
      period: 'May 2027 – Jun 2027',
      status: 'Pending',
      progress: 0,
      desc: 'MUR Pre-enrolment summary (Riepilogo) and CIMEA Comparability Certificate.',
      targetModule: 'universitaly' as ModuleKey,
    },
    {
      id: 5,
      title: 'Italian Embassy Visa (VFS Dhaka)',
      period: 'Jun 2027 – Aug 2027',
      status: 'Pending',
      progress: 0,
      desc: 'National Visa Type D, 6-month bank statements, sponsor affidavit, appointment.',
      targetModule: 'embassy_visa' as ModuleKey,
    },
    {
      id: 6,
      title: 'Regional Scholarship (DSU) Filing',
      period: 'Jul 2027 – Aug 2027',
      status: 'Pending',
      progress: 0,
      desc: 'ISEE Parificato submitted to EDISU / ER.GO / DSU Toscana for tuition waiver & stipend.',
      targetModule: 'scholarships' as ModuleKey,
    },
    {
      id: 7,
      title: 'Flight to Italy & Permesso di Soggiorno',
      period: 'Sep 2027 – Oct 2027',
      status: 'Pending',
      progress: 0,
      desc: 'Arrival at MXP/FCO, Poste Italiane yellow kit within 8 days, Questura appointment.',
      targetModule: 'residence_permit' as ModuleKey,
    },
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Admitted':
        return 'emerald';
      case 'Preparing Documents':
        return 'amber';
      case 'Applied':
      case 'Under Evaluation':
        return 'sky';
      case 'Rejected':
        return 'rose';
      default:
        return 'slate';
    }
  };

  // ================= VISUAL DASHBOARD EDITOR HANDLERS =================
  const handleOpenEditor = () => {
    setDraftSettings(JSON.parse(JSON.stringify(dashboardSettings)));
    setIsEditorModalOpen(true);
  };

  const handleToggleWidgetVisible = (widgetId: DashboardWidgetId) => {
    const updated = draftSettings.widgets.map((w) =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    setDraftSettings({ ...draftSettings, widgets: updated });
  };

  const handleMoveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...draftSettings.widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;

    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;

    // re-assign order numbers
    newWidgets.forEach((w, idx) => {
      w.order = idx + 1;
    });

    setDraftSettings({ ...draftSettings, widgets: newWidgets });
  };

  const handleChangeWidgetWidth = (
    widgetId: DashboardWidgetId,
    width: 'full' | 'half' | 'third' | 'two-thirds'
  ) => {
    const updated = draftSettings.widgets.map((w) =>
      w.id === widgetId ? { ...w, width } : w
    );
    setDraftSettings({ ...draftSettings, widgets: updated });
  };

  const handleToggleKpiStat = (statKey: string) => {
    const current = draftSettings.kpiStatsToShow || [];
    let updated: string[];
    if (current.includes(statKey)) {
      updated = current.filter((s) => s !== statKey);
    } else {
      updated = [...current, statKey];
    }
    setDraftSettings({ ...draftSettings, kpiStatsToShow: updated });
  };

  const handleSaveDashboardLayout = () => {
    StorageService.saveDashboardSettings(draftSettings);
    setDashboardSettings(draftSettings);
    setIsEditorModalOpen(false);
    showToast('Dashboard layout saved successfully!');
  };

  const handleResetDashboardLayout = () => {
    StorageService.resetDashboardSettings();
    const defaults = StorageService.getDashboardSettings();
    setDashboardSettings(defaults);
    setDraftSettings(defaults);
    showToast('Dashboard layout reset to default. All admission records preserved!');
  };

  // Helper to get widget container class based on width
  const getWidgetWidthClass = (width: DashboardWidgetConfig['width']) => {
    switch (width) {
      case 'half':
        return 'w-full lg:col-span-1';
      case 'third':
        return 'w-full lg:col-span-1';
      case 'two-thirds':
        return 'w-full lg:col-span-2';
      case 'full':
      default:
        return 'w-full lg:col-span-3';
    }
  };

  // Filter and sort active widgets to render
  const sortedWidgets = [...dashboardSettings.widgets]
    .filter((w) => w.visible)
    .sort((a, b) => a.order - b.order);

  const kpisToShow = dashboardSettings.kpiStatsToShow || [
    'apps',
    'tasks',
    'docs',
    'dsu',
    'budget',
    'visa',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl shadow-emerald-950 flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Hero Strategy Bar with Visual Customizer Button */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 p-6 sm:p-7 shadow-lg">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Target Intake Subtitle */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Target Intake {profile.targetIntake || '2027/2028'} · Italian Public Universities
              </span>
              <span className="text-xs text-slate-400">
                {profile.currentUniversity ? `${profile.currentUniversity} · MSc Strategy` : 'Italy MSc Admission Hub'}
              </span>
            </div>

            {/* Welcome Heading */}
            <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{profile.fullName || 'Applicant'}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Personal study abroad control center for securing English-taught Italian MSc admission offers.
              {profile.bachelorDegree ? ` Focus: ${profile.bachelorDegree}` : ''}
              {profile.targetSpecialization ? ` (${profile.targetSpecialization}).` : '.'}
            </p>

            {/* Profile Strategic Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <div
                onClick={() => onNavigate('profile')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Click to edit profile"
              >
                <span className="text-slate-400">CGPA:</span>
                <span className="font-semibold text-amber-300">
                  {profile.currentCgpa && profile.currentCgpa > 0
                    ? `${profile.currentCgpa.toFixed(2)} / ${profile.cgpaScale.toFixed(2)}`
                    : 'Not Set'}
                </span>
              </div>
              <div
                onClick={() => onNavigate('profile')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Click to edit profile"
              >
                <span className="text-slate-400">IELTS:</span>
                <span className="font-semibold text-emerald-300">
                  {profile.ieltsOverall && profile.ieltsOverall > 0
                    ? `${profile.ieltsOverall.toFixed(1)} Band`
                    : 'Not Set'}
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-200 flex items-center gap-1.5">
                <span className="text-slate-400">Target Intake:</span>
                <span className="font-medium text-white">{profile.targetIntake || '2027/2028'}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-200 flex items-center gap-1.5">
                <span className="text-slate-400">Track:</span>
                <span className="font-medium text-teal-300">
                  {profile.targetSpecialization || 'Computer Science / AI'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions + Customizer Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenEditor}
              className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize Widgets</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              icon={<Building className="w-4 h-4" />}
              onClick={() => onNavigate('explorer')}
            >
              Explore Public Unis
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<GraduationCap className="w-4 h-4 text-emerald-400" />}
              onClick={() => onNavigate('applications')}
            >
              Manage Applications ({applications.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Coins className="w-4 h-4 text-amber-400" />}
              onClick={() => onNavigate('scholarships')}
            >
              DSU Regional Guide
            </Button>
          </div>
        </div>
      </div>

      {/* DYNAMIC DASHBOARD WIDGETS RENDERED ACCORDING TO USER'S CONFIGURATION */}
      <div className="space-y-6">
        {sortedWidgets.map((widget) => {
          // 1. KPI COUNTERS & READINESS
          if (widget.id === 'kpi_stats') {
            return (
              <div key={widget.id} className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpisToShow.includes('apps') && (
                    <StatCard
                      title="Applications Target"
                      value={
                        <div className="flex items-baseline gap-2">
                          <span>{applications.length}</span>
                          <span className="text-xs font-normal text-slate-400">
                            ({myTargetApps.length} my targets)
                          </span>
                        </div>
                      }
                      subtitle={`${myTargetApps.length} Personal · ${demoApps.length} Sample References`}
                      icon={GraduationCap}
                      iconColor="emerald"
                      badge={
                        myTargetApps.length > 0
                          ? { text: 'Active Target', variant: 'verified' }
                          : { text: 'Templates', variant: 'neutral' }
                      }
                      onClick={() => onNavigate('applications')}
                    />
                  )}

                  {kpisToShow.includes('docs') && (
                    <StatCard
                      title="Documents Ready"
                      value={
                        <div className="flex items-baseline gap-2">
                          <span>{readyDocs.length}</span>
                          <span className="text-sm font-normal text-slate-400">
                            / {documents.length}
                          </span>
                        </div>
                      }
                      subtitle={`${
                        documents.length > 0
                          ? Math.round((readyDocs.length / documents.length) * 100)
                          : 0
                      }% ready for evaluation & apostille`}
                      icon={FileCheck}
                      iconColor="teal"
                      badge={{
                        text: `${readyDocs.length}/${documents.length} Ready`,
                        variant: readyDocs.length === documents.length ? 'verified' : 'neutral',
                      }}
                      onClick={() => onNavigate('documents')}
                    />
                  )}

                  {kpisToShow.includes('tasks') && (
                    <StatCard
                      title="Pending Tasks"
                      value={pendingTasks.length}
                      subtitle={
                        urgentTasks.length > 0 ? (
                          <span className="text-rose-400 font-medium">
                            {urgentTasks.length} urgent action item
                            {urgentTasks.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span>{completedTasks.length} tasks completed</span>
                        )
                      }
                      icon={Clock}
                      iconColor="amber"
                      badge={
                        urgentTasks.length > 0
                          ? { text: `${urgentTasks.length} Urgent`, variant: 'estimate' }
                          : undefined
                      }
                      onClick={() => onNavigate('tasks')}
                    />
                  )}

                  {kpisToShow.includes('dsu') && (
                    <StatCard
                      title="Regional DSU Cap"
                      value="Up to ~€7.5k–€8.5k/yr*"
                      subtitle="*Estimated: Tuition waiver + stipend (Requires ISEE < €25,000)"
                      icon={Coins}
                      iconColor="emerald"
                      badge={{ text: 'Estimate Cap', variant: 'estimate' }}
                      onClick={() => onNavigate('scholarships')}
                    />
                  )}
                </div>
              </div>
            );
          }

          // 2. UPCOMING DEADLINES RADAR
          if (widget.id === 'upcoming_deadlines') {
            return (
              <div
                key={widget.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Upcoming Admission & Visa Deadlines (Next {lookaheadDays} Days)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('calendar')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <span>Full Calendar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {upcomingDeadlines.map((item) => {
                    const daysDiff = Math.ceil(
                      (item.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isUrgent = daysDiff >= 0 && daysDiff <= 30;

                    return (
                      <div
                        key={item.id}
                        onClick={() => onNavigate(item.module)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                          isUrgent
                            ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {item.type}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isUrgent
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {daysDiff < 0
                              ? 'Passed'
                              : daysDiff === 0
                              ? 'Today!'
                              : `${daysDiff} days left`}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <div className="text-[11px] text-slate-400 mt-1 truncate">{item.notes}</div>
                        <div className="text-[10px] font-mono text-emerald-400 mt-1.5">
                          Deadline: {item.dateStr}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // 3. TARGET UNIVERSITY APPLICATIONS PIPELINE
          if (widget.id === 'applications_pipeline') {
            return (
              <div key={widget.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      My Target University Applications
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      ({displayedApps.length})
                    </span>
                  </div>

                  {/* Application Filter Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setAppFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        appFilter === 'all'
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({applications.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppFilter('my')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        appFilter === 'my'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-slate-400 hover:text-emerald-300'
                      }`}
                    >
                      My Targets ({myTargetApps.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppFilter('demo')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        appFilter === 'demo'
                          ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                          : 'text-slate-400 hover:text-purple-300'
                      }`}
                    >
                      Sample References ({demoApps.length})
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <Button
                      variant="primary"
                      size="xs"
                      icon={<Plus className="w-3.5 h-3.5" />}
                      onClick={onAddNewApplication}
                    >
                      Add Uni
                    </Button>
                    <button
                      type="button"
                      onClick={() => onNavigate('applications')}
                      className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {displayedApps.slice(0, 6).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-850/80 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => onNavigate('applications')}
                              className="text-sm font-bold text-white hover:text-emerald-300 text-left transition-colors truncate cursor-pointer"
                            >
                              {app.universityName}
                            </button>
                            <span className="text-xs text-slate-400 shrink-0">· {app.city}</span>
                          </div>

                          <div className="text-xs font-medium text-emerald-400 truncate">
                            {app.programName}
                          </div>

                          <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                            <span>Round: {app.round}</span>
                            <span>Deadline: {app.deadlineDate}</span>
                            <span>
                              Fee:{' '}
                              {app.applicationFeeEur === 0
                                ? '€0 (Free)'
                                : `€${app.applicationFeeEur}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusBadgeStyle(app.status)} size="xs" dot>
                              {app.status}
                            </Badge>

                            {!app.isDemo ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                My Target
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onUpdateApplication?.({ ...app, isDemo: false })}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-500/15 hover:bg-emerald-500/20 text-purple-300 hover:text-emerald-300 border border-purple-500/30 hover:border-emerald-500/30 transition-colors cursor-pointer"
                                title="Convert this sample to your personal target application"
                              >
                                Sample → Make Mine
                              </button>
                            )}
                          </div>

                          {app.portalUrl && (
                            <a
                              href={app.portalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-slate-400 hover:text-emerald-300 flex items-center space-x-1 transition-colors"
                            >
                              <span>Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {displayedApps.length === 0 && (
                    <div className="col-span-full">
                      <EmptyState
                        icon={Building}
                        title="No applications in this view"
                        description="You have not added any applications matching this filter."
                        actionText="Add Application"
                        onAction={onAddNewApplication}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // 4. HIGH PRIORITY TASKS & NEXT ACTIONS
          if (widget.id === 'priority_tasks') {
            return (
              <div key={widget.id} className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Action Checklist & Next Tasks
                  </h3>

                  <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setTaskFilter('all')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        taskFilter === 'all'
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskFilter('my')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        taskFilter === 'my'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'text-slate-400 hover:text-emerald-300'
                      }`}
                    >
                      Mine ({myTasks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskFilter('demo')}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        taskFilter === 'demo'
                          ? 'bg-purple-500/20 text-purple-300 font-bold'
                          : 'text-slate-400 hover:text-purple-300'
                      }`}
                    >
                      Samples
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('tasks')}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>All ({tasks.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {displayedTasks.slice(0, 5).map((task) => {
                    const isDone = task.status === 'completed';

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-slate-950/60 border-slate-850 opacity-70'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start space-x-2.5">
                          <button
                            type="button"
                            onClick={() => onToggleTask(task.id)}
                            className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors cursor-pointer ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-600 hover:border-emerald-500 bg-slate-950'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-xs font-semibold leading-tight ${
                                isDone ? 'line-through text-slate-400' : 'text-slate-200'
                              }`}
                            >
                              {task.title}
                            </div>

                            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                              <div className="flex items-center space-x-1.5">
                                <span className="capitalize">{task.category}</span>
                                {!task.isDemo ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                    My Task
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateTask?.({ ...task, isDemo: false })}
                                    className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-slate-700 cursor-pointer"
                                  >
                                    Sample → Mine
                                  </button>
                                )}
                              </div>

                              <span
                                className={`font-medium ${
                                  task.priority === 'urgent'
                                    ? 'text-rose-400'
                                    : task.priority === 'high'
                                    ? 'text-amber-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                Due: {task.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={onAddNewTask}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-750 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-300 text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Task</span>
                  </button>
                </div>
              </div>
            );
          }

          // 5. CRITICAL ACADEMIC DOCUMENTS VAULT
          if (widget.id === 'document_vault') {
            return (
              <div
                key={widget.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Document Readiness & Legalization Vault
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('documents')}
                    className="text-xs font-semibold text-emerald-400 hover:underline"
                  >
                    Vault ({readyDocs.length}/{documents.length})
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {documents.slice(0, 6).map((doc) => {
                    const isReady =
                      doc.status === 'Ready' ||
                      doc.status === 'Verified' ||
                      doc.status === 'Attested / Legalized';

                    return (
                      <div
                        key={doc.id}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-white truncate">{doc.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {doc.issuingAuthority}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center space-x-1 ${
                            isReady
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : doc.status === 'Draft'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isReady && <CheckCircle2 className="w-3 h-3" />}
                          <span>{doc.status}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // 6. FINANCIAL READINESS & DSU GRANTS SNAPSHOT
          if (widget.id === 'financial_snapshot') {
            const totalEstimatedEur = expenses.reduce((sum, e) => sum + e.estimatedEur, 0);
            return (
              <div
                key={widget.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <WalletCards className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Financial Budget & Regional Scholarship Status
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('budget')}
                    className="text-xs font-semibold text-emerald-400 hover:underline"
                  >
                    Budget Tracker
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Total Estimated Budget
                    </div>
                    <div className="text-lg font-bold text-white mt-1">
                      €{totalEstimatedEur.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Admission, Visa & First Flight
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      DSU Target Agency
                    </div>
                    <div className="text-base font-bold text-emerald-400 mt-1">
                      {dsuApp.agencyName}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Status: {dsuApp.status}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      ISEE Parificato Cap
                    </div>
                    <div className="text-base font-bold text-teal-300 mt-1">
                      €{dsuApp.iseeParificatoEur.toLocaleString()} (Eligible)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Threshold &lt; €25,000 for full grant
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // 7. MASTER ADMISSION ROADMAP: 2027/2028 INTAKE
          if (widget.id === 'master_roadmap') {
            return (
              <div key={widget.id} className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Master Admission Roadmap: 2027/2028 Intake
                    </h3>
                    <p className="text-xs text-slate-400">
                      Chronological 7-step pathway from degree completion to university arrival in Italy
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('analytics')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Readiness Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {milestones.map((ms) => (
                    <div
                      key={ms.id}
                      onClick={() => onNavigate(ms.targetModule)}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono text-emerald-400 font-bold text-[11px]">
                          Step {ms.id}
                        </span>
                        <Badge
                          variant={ms.status === 'In Progress' ? 'emerald' : 'slate'}
                          size="xs"
                        >
                          {ms.status}
                        </Badge>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {ms.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{ms.period}</div>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {ms.desc}
                      </p>

                      {dashboardSettings.showRoadmapProgressBar && (
                        <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${ms.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* VISUAL DASHBOARD EDITOR MODAL */}
      <Modal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        title="Visual Dashboard Editor"
        subtitle="Add, remove, reorder, resize widgets and configure metrics thresholds"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5 text-xs">
          {/* Widgets Ordering & Visibility List */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold">
              Dashboard Widgets (Reorder & Visibility)
            </label>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {draftSettings.widgets.map((w, idx) => (
                <div
                  key={w.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    w.visible
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="font-mono text-emerald-400 font-bold text-[11px]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-xs truncate">{w.title}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {/* Width selector */}
                    <select
                      value={w.width}
                      onChange={(e) =>
                        handleChangeWidgetWidth(w.id, e.target.value as any)
                      }
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                    >
                      <option value="full">Full Width</option>
                      <option value="two-thirds">2/3 Width</option>
                      <option value="half">1/2 Width</option>
                      <option value="third">1/3 Width</option>
                    </select>

                    {/* Move Up / Down */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveWidget(idx, 'up')}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === draftSettings.widgets.length - 1}
                      onClick={() => handleMoveWidget(idx, 'down')}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Visible toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleWidgetVisible(w.id)}
                      className={`p-1.5 rounded-lg border ${
                        w.visible
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title={w.visible ? 'Hide widget' : 'Show widget'}
                    >
                      {w.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI Stat Cards to display */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold">
              KPI Metric Counters (Show / Hide in Quick Stats Bar)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'apps', label: 'Applications Target' },
                { key: 'docs', label: 'Documents Ready' },
                { key: 'tasks', label: 'Pending Tasks' },
                { key: 'dsu', label: 'Regional DSU Cap' },
                { key: 'budget', label: 'Financial Budget' },
                { key: 'visa', label: 'Embassy Visa Status' },
              ].map((stat) => {
                const isChecked = (draftSettings.kpiStatsToShow || []).includes(stat.key);
                return (
                  <label
                    key={stat.key}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2 text-slate-300 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleKpiStat(stat.key)}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-900"
                    />
                    <span>{stat.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines Lookahead */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Deadlines Radar Lookahead
              </label>
              <select
                value={draftSettings.deadlinesLookaheadDays || 180}
                onChange={(e) =>
                  setDraftSettings({
                    ...draftSettings,
                    deadlinesLookaheadDays: parseInt(e.target.value) || 180,
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="30">Next 30 Days (Urgent)</option>
                <option value="60">Next 60 Days (2 Months)</option>
                <option value="90">Next 90 Days (Quarter)</option>
                <option value="180">Next 180 Days (6 Months)</option>
                <option value="365">Next 365 Days (Full Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Roadmap Progress Indicators
              </label>
              <div className="pt-2">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftSettings.showRoadmapProgressBar}
                    onChange={(e) =>
                      setDraftSettings({
                        ...draftSettings,
                        showRoadmapProgressBar: e.target.checked,
                      })
                    }
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-900"
                  />
                  <span>Show Progress Bars on Roadmap</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDashboardLayout}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30 text-slate-400 font-semibold text-xs flex items-center space-x-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Layout</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditorModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDashboardLayout}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950"
              >
                Save Layout
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

