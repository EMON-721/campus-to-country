import React, { useState, useEffect, useCallback } from 'react';
import { StorageService } from './services/storage';
import {
  UserProfile,
  UniversityApplication,
  TaskItem,
  AcademicDocument,
  ExpenseItem,
  UserNote,
  ImportantLink,
} from './types';
import { Sidebar, ModuleKey } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Module Components
import { DashboardView } from './components/modules/DashboardView';
import { AcademicProfileView } from './components/modules/AcademicProfileView';
import { UniversityExplorerView } from './components/modules/UniversityExplorerView';
import { ProgrammeTrackerView } from './components/modules/ProgrammeTrackerView';
import { ApplicationManagementView } from './components/modules/ApplicationManagementView';
import { ScholarshipDsuView } from './components/modules/ScholarshipDsuView';
import { DocumentManagerView } from './components/modules/DocumentManagerView';
import { CimeaDovView } from './components/modules/CimeaDovView';
import { UniversitalyView } from './components/modules/UniversitalyView';
import { EmbassyVisaView } from './components/modules/EmbassyVisaView';
import { VisaChecklistView } from './components/modules/VisaChecklistView';
import { SponsorBankView } from './components/modules/SponsorBankView';
import { AccommodationTravelView } from './components/modules/AccommodationTravelView';
import { ResidencePermitLifeView } from './components/modules/ResidencePermitLifeView';
import { TaskManagerView } from './components/modules/TaskManagerView';
import { CalendarDeadlinesView } from './components/modules/CalendarDeadlinesView';
import { FinancialBudgetView } from './components/modules/FinancialBudgetView';
import { NotesLinksView } from './components/modules/NotesLinksView';
import { ReportsAnalyticsView } from './components/modules/ReportsAnalyticsView';
import { AdminControlCenterView } from './components/modules/AdminControlCenterView';
import { AppearanceSettingsView } from './components/modules/AppearanceSettingsView';
import { CustomModuleBuilderView } from './components/modules/CustomModuleBuilderView';
import { PublicLandingView } from './components/modules/PublicLandingView';
import { ItalianRegionsView } from './components/modules/ItalianRegionsView';

// Role-Based Auth Views
import { AdminLoginView } from './components/auth/AdminLoginView';
import { UserLoginView } from './components/auth/UserLoginView';
import { UserRegisterView } from './components/auth/UserRegisterView';
import { AdminDashboardView } from './components/auth/AdminDashboardView';
import { AuthSession } from './types';

export default function App() {
  const getInitialRoute = (): string => {
    try {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin/login') return '/admin/login';
      if (path === '/login') return '/login';
      if (path === '/register') return '/register';
      if (path === '/admin/dashboard') return '/admin/dashboard';
      if (path === '/dashboard') return '/dashboard';
    } catch {
      // fallback
    }
    return '/dashboard';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [session, setSession] = useState<AuthSession | null>(() => StorageService.getAuthSession());
  const currentUser = session?.user || null;

  const [currentModule, setCurrentModule] = useState<ModuleKey>(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin/dashboard') return 'admin_dashboard';
      if (path === '/landing') return 'landing';
    } catch {}
    const active = StorageService.getAuthSession();
    return active?.user ? 'dashboard' : 'landing';
  });

  const [appearance, setAppearance] = useState(() => StorageService.getAppearanceSettings());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('italy_msc_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const navigate = (route: string) => {
    if (route.startsWith('/')) {
      setCurrentRoute(route);
      try {
        window.history.pushState({}, '', route);
      } catch {}
      if (route === '/admin/dashboard') {
        setCurrentModule('admin_dashboard');
      } else if (route === '/dashboard') {
        setCurrentModule('dashboard');
      }
    } else {
      // module key
      setCurrentModule(route as ModuleKey);
      if (route === 'admin_dashboard') {
        setCurrentRoute('/admin/dashboard');
        try {
          window.history.pushState({}, '', '/admin/dashboard');
        } catch {}
      } else if (route === 'dashboard') {
        setCurrentRoute('/dashboard');
        try {
          window.history.pushState({}, '', '/dashboard');
        } catch {}
      } else {
        setCurrentRoute('/dashboard');
      }
    }
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname.toLowerCase();
        if (['/admin/login', '/login', '/register', '/admin/dashboard', '/dashboard'].includes(path)) {
          setCurrentRoute(path);
          if (path === '/admin/dashboard') setCurrentModule('admin_dashboard');
          else if (path === '/dashboard') setCurrentModule('dashboard');
        }
      } catch {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('italy_msc_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // App State loaded from StorageService
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile);
  const [applications, setApplications] = useState<UniversityApplication[]>(
    StorageService.getApplications
  );
  const [tasks, setTasks] = useState<TaskItem[]>(StorageService.getTasks);
  const [documents, setDocuments] = useState<AcademicDocument[]>(StorageService.getDocuments);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(StorageService.getExpenses);
  const [notes, setNotes] = useState<UserNote[]>(StorageService.getNotes);
  const [links, setLinks] = useState<ImportantLink[]>(StorageService.getLinks);

  // Quick action modal trigger states
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Sync state if storage changes
  const reloadStateFromStorage = useCallback(() => {
    setSession(StorageService.getAuthSession());
    setProfile(StorageService.getProfile());
    setApplications(StorageService.getApplications());
    setTasks(StorageService.getTasks());
    setDocuments(StorageService.getDocuments());
    setExpenses(StorageService.getExpenses());
    setNotes(StorageService.getNotes());
    setLinks(StorageService.getLinks());
    setAppearance(StorageService.getAppearanceSettings());
  }, []);

  useEffect(() => {
    window.addEventListener('italy_msc_storage_changed', reloadStateFromStorage);
    return () => {
      window.removeEventListener('italy_msc_storage_changed', reloadStateFromStorage);
    };
  }, [reloadStateFromStorage]);

  const handleSignOut = () => {
    StorageService.logout();
    setSession(null);
    reloadStateFromStorage();
    navigate('/login');
  };

  const handleSwitchRole = async (targetRole: 'admin' | 'user') => {
    if (targetRole === 'admin') {
      const res = await StorageService.adminLogin('Admin@Italy2027', 'admin@italy-msc.edu');
      if (res.success) {
        setSession(res.session || null);
        reloadStateFromStorage();
        navigate('/admin/dashboard');
      }
    } else {
      const res = await StorageService.login('student@example.com', 'Student@2027');
      if (res.success) {
        setSession(res.session || null);
        reloadStateFromStorage();
        navigate('/dashboard');
      }
    }
  };

  // Profile actions
  const handleUpdateProfile = (updated: UserProfile) => {
    StorageService.updateProfile(updated);
    setProfile(updated);
  };

  // Application actions
  const handleAddApplication = (app: UniversityApplication) => {
    StorageService.addApplication(app);
    setApplications(StorageService.getApplications());
  };

  const handleUpdateApplication = (app: UniversityApplication) => {
    StorageService.updateApplication(app);
    setApplications(StorageService.getApplications());
  };

  const handleDeleteApplication = (id: string) => {
    StorageService.deleteApplication(id);
    setApplications(StorageService.getApplications());
  };

  // Task actions
  const handleAddTask = (task: TaskItem) => {
    StorageService.addTask(task);
    setTasks(StorageService.getTasks());
  };

  const handleUpdateTask = (task: TaskItem) => {
    StorageService.updateTask(task);
    setTasks(StorageService.getTasks());
  };

  const handleDeleteTask = (id: string) => {
    StorageService.deleteTask(id);
    setTasks(StorageService.getTasks());
  };

  const handleToggleTask = (id: string) => {
    StorageService.toggleTask(id);
    setTasks(StorageService.getTasks());
  };

  // Document actions
  const handleAddDocument = (doc: AcademicDocument) => {
    StorageService.addDocument(doc);
    setDocuments(StorageService.getDocuments());
  };

  const handleUpdateDocument = (doc: AcademicDocument) => {
    StorageService.updateDocument(doc);
    setDocuments(StorageService.getDocuments());
  };

  const handleDeleteDocument = (id: string) => {
    StorageService.deleteDocument(id);
    setDocuments(StorageService.getDocuments());
  };

  // Expense actions
  const handleAddExpense = (exp: ExpenseItem) => {
    StorageService.addExpense(exp);
    setExpenses(StorageService.getExpenses());
  };

  const handleUpdateExpense = (exp: ExpenseItem) => {
    StorageService.updateExpense(exp);
    setExpenses(StorageService.getExpenses());
  };

  const handleDeleteExpense = (id: string) => {
    StorageService.deleteExpense(id);
    setExpenses(StorageService.getExpenses());
  };

  // Note actions
  const handleAddNote = (note: UserNote) => {
    StorageService.addNote(note);
    setNotes(StorageService.getNotes());
  };

  const handleUpdateNote = (note: UserNote) => {
    StorageService.updateNote(note);
    setNotes(StorageService.getNotes());
  };

  const handleDeleteNote = (id: string) => {
    StorageService.deleteNote(id);
    setNotes(StorageService.getNotes());
  };

  // Link actions
  const handleAddLink = (link: ImportantLink) => {
    StorageService.addLink(link);
    setLinks(StorageService.getLinks());
  };

  const handleDeleteLink = (id: string) => {
    StorageService.deleteLink(id);
    setLinks(StorageService.getLinks());
  };

  // Global Header Quick Add shortcuts
  const handleTriggerQuickAddApp = () => {
    setCurrentModule('applications');
    setIsAddAppModalOpen(true);
  };

  const handleTriggerQuickAddTask = () => {
    setCurrentModule('tasks');
    setIsAddTaskModalOpen(true);
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const json = StorageService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-italy-msc-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (json: string): boolean => {
    const success = StorageService.importBackup(json);
    if (success) {
      reloadStateFromStorage();
    }
    return success;
  };

  const handleResetData = () => {
    StorageService.resetAllData();
    reloadStateFromStorage();
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  // Dedicated Route: Administrator Login (/admin/login)
  if (currentRoute === '/admin/login') {
    return (
      <div
        className={`min-h-screen ${
          appearance.themeMode === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
        } flex flex-col font-sans transition-colors`}
        style={{
          fontFamily:
            appearance.fontFamily === 'jakarta'
              ? '"Plus Jakarta Sans", sans-serif'
              : appearance.fontFamily === 'system'
              ? 'system-ui, sans-serif'
              : 'Inter, sans-serif',
        }}
      >
        <AdminLoginView
          onLoginSuccess={() => {
            reloadStateFromStorage();
            navigate('/admin/dashboard');
          }}
          onNavigateToUserLogin={() => navigate('/login')}
        />
      </div>
    );
  }

  // Dedicated Route: Normal User Login (/login)
  if (currentRoute === '/login') {
    return (
      <div
        className={`min-h-screen ${
          appearance.themeMode === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
        } flex flex-col font-sans transition-colors`}
        style={{
          fontFamily:
            appearance.fontFamily === 'jakarta'
              ? '"Plus Jakarta Sans", sans-serif'
              : appearance.fontFamily === 'system'
              ? 'system-ui, sans-serif'
              : 'Inter, sans-serif',
        }}
      >
        <UserLoginView
          onLoginSuccess={() => {
            reloadStateFromStorage();
            navigate('/dashboard');
          }}
          onNavigateToRegister={() => navigate('/register')}
          onNavigateToAdminLogin={() => navigate('/admin/login')}
        />
      </div>
    );
  }

  // Dedicated Route: User Registration (/register)
  if (currentRoute === '/register') {
    return (
      <div
        className={`min-h-screen ${
          appearance.themeMode === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
        } flex flex-col font-sans transition-colors`}
        style={{
          fontFamily:
            appearance.fontFamily === 'jakarta'
              ? '"Plus Jakarta Sans", sans-serif'
              : appearance.fontFamily === 'system'
              ? 'system-ui, sans-serif'
              : 'Inter, sans-serif',
        }}
      >
        <UserRegisterView
          onRegisterSuccess={() => {
            reloadStateFromStorage();
            navigate('/dashboard');
          }}
          onNavigateToLogin={() => navigate('/login')}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        appearance.themeMode === 'light'
          ? 'bg-slate-100 text-slate-900'
          : 'bg-slate-950 text-slate-100'
      } flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors ${
        appearance.fontSizeScale === 'compact'
          ? 'text-[13px]'
          : appearance.fontSizeScale === 'spacious'
          ? 'text-[15px]'
          : 'text-sm'
      }`}
      style={{
        fontFamily:
          appearance.fontFamily === 'jakarta'
            ? '"Plus Jakarta Sans", sans-serif'
            : appearance.fontFamily === 'system'
            ? 'system-ui, sans-serif'
            : 'Inter, sans-serif',
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(mod) => navigate(mod)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingTasksCount={pendingTasksCount}
        totalAppsCount={applications.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
      />

      {/* Main App Layout */}
      <div
        className={`${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        } flex flex-col flex-1 min-w-0 transition-all duration-300`}
      >
        {/* Sticky Top Header */}
        <Header
          currentModule={currentModule}
          currentUser={currentUser}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onSelectModule={(mod) => navigate(mod)}
          onAddNewApplication={handleTriggerQuickAddApp}
          onAddNewTask={handleTriggerQuickAddTask}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onResetData={handleResetData}
          onSignOut={handleSignOut}
          onSwitchRole={handleSwitchRole}
          onNavigateToLogin={() => navigate('/login')}
          onNavigateToRegister={() => navigate('/register')}
        />

        {/* Dynamic Main Module Viewport */}
        <main
          className={`flex-1 overflow-y-auto ${
            appearance.layoutDensity === 'compact' ? 'p-3 sm:p-5' : 'p-4 sm:p-6 lg:p-8'
          }`}
        >
          {/* Public Landing Page */}
          {currentModule === 'landing' && (
            <PublicLandingView
              onNavigate={(mod) => navigate(mod)}
              onNavigateToLogin={() => navigate('/login')}
              onNavigateToRegister={() => navigate('/register')}
            />
          )}

          {/* Admin Dashboard */}
          {(currentModule === 'admin_dashboard' || currentRoute === '/admin/dashboard') && (
            <AdminDashboardView
              onNavigate={(mod) => navigate(mod)}
              onNavigateToAdminLogin={() => navigate('/admin/login')}
            />
          )}

          {currentRoute !== '/admin/dashboard' && currentModule === 'dashboard' && (
            <DashboardView
              profile={profile}
              applications={applications}
              tasks={tasks}
              documents={documents}
              onNavigate={(mod) => setCurrentModule(mod)}
              onToggleTask={handleToggleTask}
              onAddNewApplication={handleTriggerQuickAddApp}
              onAddNewTask={handleTriggerQuickAddTask}
              onUpdateApplication={handleUpdateApplication}
              onUpdateTask={handleUpdateTask}
            />
          )}

          {currentModule === 'profile' && (
            <AcademicProfileView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onNavigate={(mod) => setCurrentModule(mod)}
            />
          )}

          {currentModule === 'regions' && (
            <ItalianRegionsView
              onNavigateToExplorer={() => setCurrentModule('explorer')}
              onNavigateToScholarships={() => setCurrentModule('scholarships')}
            />
          )}

          {currentModule === 'explorer' && (
            <UniversityExplorerView
              currentApplications={applications}
              onAddApplication={handleAddApplication}
              onNavigate={(mod) => setCurrentModule(mod)}
            />
          )}

          {currentModule === 'programmes' && (
            <ProgrammeTrackerView
              onAddApplication={handleAddApplication}
              onNavigate={(mod) => setCurrentModule(mod)}
            />
          )}

          {currentModule === 'applications' && (
            <ApplicationManagementView
              applications={applications}
              onAddApplication={handleAddApplication}
              onUpdateApplication={handleUpdateApplication}
              onDeleteApplication={handleDeleteApplication}
              isAddModalOpenInitially={isAddAppModalOpen}
              onCloseAddModalInitially={() => setIsAddAppModalOpen(false)}
            />
          )}

          {currentModule === 'scholarships' && (
            <ScholarshipDsuView onNavigate={(mod) => setCurrentModule(mod)} />
          )}

          {currentModule === 'documents' && (
            <DocumentManagerView
              documents={documents}
              onAddDocument={handleAddDocument}
              onUpdateDocument={handleUpdateDocument}
              onDeleteDocument={handleDeleteDocument}
              applications={applications}
            />
          )}

          {currentModule === 'cimea_dov' && <CimeaDovView />}

          {currentModule === 'universitaly' && (
            <UniversitalyView
              applications={applications}
              onNavigate={(mod) => setCurrentModule(mod)}
            />
          )}

          {currentModule === 'embassy_visa' && (
            <EmbassyVisaView onNavigate={(mod) => setCurrentModule(mod)} />
          )}

          {currentModule === 'visa_checklist' && <VisaChecklistView />}

          {currentModule === 'sponsor_bank' && <SponsorBankView />}

          {(currentModule === 'accommodation' ||
            currentModule === 'flight_planner' ||
            currentModule === 'travel_checklist') && <AccommodationTravelView />}

          {(currentModule === 'residence_permit' ||
            currentModule === 'enrollment' ||
            currentModule === 'student_life') && <ResidencePermitLifeView />}

          {currentModule === 'tasks' && (
            <TaskManagerView
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
              isAddModalOpenInitially={isAddTaskModalOpen}
              onCloseAddModalInitially={() => setIsAddTaskModalOpen(false)}
            />
          )}

          {currentModule === 'calendar' && <CalendarDeadlinesView />}

          {currentModule === 'budget' && (
            <FinancialBudgetView
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {currentModule === 'notes_links' && (
            <NotesLinksView
              notes={notes}
              links={links}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onAddLink={handleAddLink}
              onDeleteLink={handleDeleteLink}
            />
          )}

          {currentModule === 'analytics' && (
            <ReportsAnalyticsView
              profile={profile}
              applications={applications}
              tasks={tasks}
              documents={documents}
              expenses={expenses}
            />
          )}

          {currentModule === 'admin_control' && (
            <AdminControlCenterView
              onNavigate={(mod) => setCurrentModule(mod)}
              onRefreshData={reloadStateFromStorage}
            />
          )}

          {currentModule === 'appearance' && (
            <AppearanceSettingsView
              onAppearanceChanged={() => reloadStateFromStorage()}
              onNavigate={(mod) => setCurrentModule(mod)}
            />
          )}

          {(currentModule === 'custom_modules' || currentModule.startsWith('custom_')) && (
            <CustomModuleBuilderView
              onNavigate={(mod) => setCurrentModule(mod)}
              onRefreshNavigation={reloadStateFromStorage}
            />
          )}
        </main>
      </div>
    </div>
  );
}

