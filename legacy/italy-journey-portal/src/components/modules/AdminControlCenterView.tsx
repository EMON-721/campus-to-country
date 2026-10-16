import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  Database,
  Archive,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Check,
  Copy,
  ExternalLink,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  Landmark,
  Home,
  Plane,
  Coins,
  ListTodo,
  BookmarkCheck,
  Undo2,
  Tag,
  Download,
  Upload,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';
import {
  UserProfile,
  UniversityApplication,
  UniversityProgram,
  TaskItem,
  AcademicDocument,
  ExpenseItem,
  UserNote,
  ImportantLink,
  AccommodationRecord,
  FlightRecord,
  VisaCheckItem,
  SponsorBankRecord,
  ReusableTemplate,
  CustomConfig,
  DsuApplication,
} from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface AdminControlCenterViewProps {
  onNavigate?: (module: any) => void;
  onRefreshData?: () => void;
}

type AdminTab =
  | 'overview'
  | 'universities'
  | 'applications'
  | 'tasks_docs'
  | 'relocation_finance'
  | 'custom_content'
  | 'templates'
  | 'vault';

export const AdminControlCenterView: React.FC<AdminControlCenterViewProps> = ({
  onNavigate,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Loaded collections
  const [universities, setUniversities] = useState<UniversityProgram[]>(() =>
    StorageService.getUniversities(true)
  );
  const [applications, setApplications] = useState<UniversityApplication[]>(() =>
    StorageService.getApplications(true)
  );
  const [tasks, setTasks] = useState<TaskItem[]>(() => StorageService.getTasks(true));
  const [documents, setDocuments] = useState<AcademicDocument[]>(() =>
    StorageService.getDocuments(true)
  );
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() =>
    StorageService.getExpenses(true)
  );
  const [notes, setNotes] = useState<UserNote[]>(() => StorageService.getNotes(true));
  const [links, setLinks] = useState<ImportantLink[]>(() => StorageService.getLinks(true));
  const [accommodations, setAccommodations] = useState<AccommodationRecord[]>(() =>
    StorageService.getAccommodations(true)
  );
  const [flights, setFlights] = useState<FlightRecord[]>(() =>
    StorageService.getFlights(true)
  );
  const [visaItems, setVisaItems] = useState<VisaCheckItem[]>(() =>
    StorageService.getVisaCheckItems(true)
  );
  const [sponsors, setSponsors] = useState<SponsorBankRecord[]>(() =>
    StorageService.getSponsorRecords(true)
  );
  const [templates, setTemplates] = useState<ReusableTemplate[]>(() =>
    StorageService.getTemplates()
  );
  const [customConfig, setCustomConfig] = useState<CustomConfig>(() =>
    StorageService.getCustomConfig()
  );
  const [dsuApp, setDsuApp] = useState<DsuApplication>(() =>
    StorageService.getDsuApplication()
  );

  // Vault data
  const [archivedVault, setArchivedVault] = useState(() =>
    StorageService.getAllArchivedRecords()
  );

  // Modals state
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<UniversityProgram | null>(null);

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<UniversityApplication | null>(null);

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReusableTemplate | null>(null);

  const [isAccomModalOpen, setIsAccomModalOpen] = useState(false);
  const [editingAccom, setEditingAccom] = useState<AccommodationRecord | null>(null);

  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightRecord | null>(null);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    type: string;
    id: string;
    name: string;
  } | null>(null);

  // New category inputs
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('');
  const [newAppStatus, setNewAppStatus] = useState('');
  const [newTag, setNewTag] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshAllState = () => {
    setUniversities(StorageService.getUniversities(true));
    setApplications(StorageService.getApplications(true));
    setTasks(StorageService.getTasks(true));
    setDocuments(StorageService.getDocuments(true));
    setExpenses(StorageService.getExpenses(true));
    setNotes(StorageService.getNotes(true));
    setLinks(StorageService.getLinks(true));
    setAccommodations(StorageService.getAccommodations(true));
    setFlights(StorageService.getFlights(true));
    setVisaItems(StorageService.getVisaCheckItems(true));
    setSponsors(StorageService.getSponsorRecords(true));
    setTemplates(StorageService.getTemplates());
    setCustomConfig(StorageService.getCustomConfig());
    setDsuApp(StorageService.getDsuApplication());
    setArchivedVault(StorageService.getAllArchivedRecords());
    if (onRefreshData) onRefreshData();
  };

  useEffect(() => {
    const handleStorageEvent = () => refreshAllState();
    window.addEventListener('italy_msc_storage_changed', handleStorageEvent);
    return () => window.removeEventListener('italy_msc_storage_changed', handleStorageEvent);
  }, []);

  // --- CRUD: Universities ---
  const handleSaveUni = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const uniData: UniversityProgram = {
      id: editingUni ? editingUni.id : `uni-${Date.now()}`,
      universityName: (formData.get('universityName') as string).trim(),
      italianName: (formData.get('italianName') as string).trim(),
      city: (formData.get('city') as string).trim(),
      region: (formData.get('region') as string).trim(),
      worldRank: formData.get('worldRank') ? Number(formData.get('worldRank')) : undefined,
      programTitle: (formData.get('programTitle') as string).trim(),
      degreeType: 'MSc / Laurea Magistrale',
      durationYears: 2,
      creditsCFU: Number(formData.get('creditsCFU')) || 120,
      language: 'English',
      applicationPortal: (formData.get('applicationPortal') as string).trim(),
      applicationFeeEur: Number(formData.get('applicationFeeEur')) || 0,
      tuitionFeeEurPerYear: (formData.get('tuitionFeeEurPerYear') as string).trim(),
      regionalScholarship: (formData.get('regionalScholarship') as string).trim(),
      intakeDeadlines: (formData.get('intakeDeadlines') as string).trim(),
      admissionRequirements: {
        minIelts: Number(formData.get('minIelts')) || 6.0,
        cgpaRecommendation: (formData.get('cgpaRecommendation') as string).trim(),
        curriculumMatching: (formData.get('curriculumMatching') as string).trim(),
        greRequired: formData.get('greRequired') === 'on',
      },
      curriculumFocus: (formData.get('curriculumFocus') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      competitiveness: (formData.get('competitiveness') as any) || 'Moderate',
      cgpaStrategyTip: (formData.get('cgpaStrategyTip') as string).trim(),
      officialWebsite: (formData.get('officialWebsite') as string).trim(),
      isCustom: true,
    };

    if (editingUni) {
      StorageService.updateUniversity(uniData);
      showToast(`Updated "${uniData.universityName}"`);
    } else {
      StorageService.addUniversity(uniData);
      showToast(`Created "${uniData.universityName}"`);
    }

    setIsUniModalOpen(false);
    setEditingUni(null);
    refreshAllState();
  };

  const handleArchiveUni = (id: string, archive: boolean) => {
    if (archive) {
      StorageService.archiveUniversity(id);
      showToast('University moved to Archived Vault');
    } else {
      StorageService.restoreUniversity(id);
      showToast('University restored to active list');
    }
    refreshAllState();
  };

  // --- CRUD: Applications ---
  const handleSaveApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const appData: UniversityApplication = {
      id: editingApp ? editingApp.id : `app-${Date.now()}`,
      universityName: (formData.get('universityName') as string).trim(),
      programName: (formData.get('programName') as string).trim(),
      city: (formData.get('city') as string).trim(),
      region: (formData.get('region') as string).trim(),
      portalUrl: (formData.get('portalUrl') as string).trim(),
      portalUsername: (formData.get('portalUsername') as string).trim() || undefined,
      portalPasswordHint: (formData.get('portalPasswordHint') as string).trim() || undefined,
      applicationFeeEur: Number(formData.get('applicationFeeEur')) || 0,
      feePaid: formData.get('feePaid') === 'on',
      round: (formData.get('round') as string).trim() || 'Round 1',
      deadlineDate: (formData.get('deadlineDate') as string).trim(),
      status: (formData.get('status') as any) || 'Researching',
      isUniversitalyChoice: formData.get('isUniversitalyChoice') === 'on',
      notes: (formData.get('notes') as string).trim(),
      requiredDocuments: (formData.get('requiredDocuments') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      scholarshipApplied: formData.get('scholarshipApplied') === 'on',
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    if (editingApp) {
      StorageService.updateApplication(appData);
      showToast(`Updated application "${appData.universityName}"`);
    } else {
      StorageService.addApplication(appData);
      showToast(`Added application "${appData.universityName}"`);
    }

    setIsAppModalOpen(false);
    setEditingApp(null);
    refreshAllState();
  };

  const handleArchiveApp = (id: string, archive: boolean) => {
    if (archive) {
      StorageService.archiveApplication(id);
      showToast('Application moved to Archived Vault');
    } else {
      StorageService.restoreApplication(id);
      showToast('Application restored to active list');
    }
    refreshAllState();
  };

  // --- CRUD: Templates ---
  const handleSaveTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const tmpl: ReusableTemplate = {
      id: editingTemplate ? editingTemplate.id : `tmpl-${Date.now()}`,
      title: (formData.get('title') as string).trim(),
      category: (formData.get('category') as any) || 'Custom',
      description: (formData.get('description') as string).trim(),
      content: (formData.get('content') as string).trim(),
      tags: (formData.get('tags') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (editingTemplate) {
      StorageService.updateTemplate(tmpl);
      showToast(`Template "${tmpl.title}" updated`);
    } else {
      StorageService.addTemplate(tmpl);
      showToast(`Template "${tmpl.title}" created`);
    }

    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
    refreshAllState();
  };

  // --- Confirmation & Permanent Delete ---
  const triggerPermanentDelete = (type: string, id: string, name: string) => {
    setPendingDelete({ type, id, name });
    setIsConfirmDeleteOpen(true);
  };

  const executePermanentDelete = () => {
    if (!pendingDelete) return;
    const { type, id, name } = pendingDelete;

    switch (type) {
      case 'university':
        StorageService.deleteUniversity(id);
        break;
      case 'application':
        StorageService.deleteApplication(id);
        break;
      case 'task':
        StorageService.deleteTask(id);
        break;
      case 'document':
        StorageService.deleteDocument(id);
        break;
      case 'expense':
        StorageService.deleteExpense(id);
        break;
      case 'note':
        StorageService.deleteNote(id);
        break;
      case 'link':
        StorageService.deleteLink(id);
        break;
      case 'accommodation':
        StorageService.deleteAccommodation(id);
        break;
      case 'flight':
        StorageService.deleteFlight(id);
        break;
      case 'visa_item':
        StorageService.deleteVisaCheckItem(id);
        break;
      case 'sponsor':
        StorageService.deleteSponsorRecord(id);
        break;
      case 'template':
        StorageService.deleteTemplate(id);
        break;
      default:
        break;
    }

    showToast(`Permanently deleted "${name}"`);
    setIsConfirmDeleteOpen(false);
    setPendingDelete(null);
    refreshAllState();
  };

  // --- Custom Config Handlers ---
  const handleAddTaskCategory = () => {
    if (!newTaskCategory.trim()) return;
    const cat = newTaskCategory.trim().toLowerCase().replace(/\s+/g, '_');
    if (!customConfig.taskCategories.includes(cat)) {
      const updated = {
        ...customConfig,
        taskCategories: [...customConfig.taskCategories, cat],
      };
      StorageService.saveCustomConfig(updated);
      setCustomConfig(updated);
      setNewTaskCategory('');
      showToast(`Added task category: "${cat}"`);
    }
  };

  const handleRemoveTaskCategory = (cat: string) => {
    const updated = {
      ...customConfig,
      taskCategories: customConfig.taskCategories.filter((c) => c !== cat),
    };
    StorageService.saveCustomConfig(updated);
    setCustomConfig(updated);
    showToast(`Removed category "${cat}"`);
  };

  const handleAddDocCategory = () => {
    if (!newDocCategory.trim()) return;
    const cat = newDocCategory.trim().toLowerCase().replace(/\s+/g, '_');
    if (!customConfig.documentCategories.includes(cat)) {
      const updated = {
        ...customConfig,
        documentCategories: [...customConfig.documentCategories, cat],
      };
      StorageService.saveCustomConfig(updated);
      setCustomConfig(updated);
      setNewDocCategory('');
      showToast(`Added document category: "${cat}"`);
    }
  };

  const handleRemoveDocCategory = (cat: string) => {
    const updated = {
      ...customConfig,
      documentCategories: customConfig.documentCategories.filter((c) => c !== cat),
    };
    StorageService.saveCustomConfig(updated);
    setCustomConfig(updated);
    showToast(`Removed category "${cat}"`);
  };

  const handleAddStatus = () => {
    if (!newAppStatus.trim()) return;
    const st = newAppStatus.trim();
    if (!customConfig.applicationStatuses.includes(st)) {
      const updated = {
        ...customConfig,
        applicationStatuses: [...customConfig.applicationStatuses, st],
      };
      StorageService.saveCustomConfig(updated);
      setCustomConfig(updated);
      setNewAppStatus('');
      showToast(`Added status: "${st}"`);
    }
  };

  const handleRemoveStatus = (st: string) => {
    const updated = {
      ...customConfig,
      applicationStatuses: customConfig.applicationStatuses.filter((s) => s !== st),
    };
    StorageService.saveCustomConfig(updated);
    setCustomConfig(updated);
    showToast(`Removed status "${st}"`);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const t = newTag.trim();
    if (!customConfig.tags.includes(t)) {
      const updated = {
        ...customConfig,
        tags: [...customConfig.tags, t],
      };
      StorageService.saveCustomConfig(updated);
      setCustomConfig(updated);
      setNewTag('');
      showToast(`Added tag: "${t}"`);
    }
  };

  const handleRemoveTag = (t: string) => {
    const updated = {
      ...customConfig,
      tags: customConfig.tags.filter((item) => item !== t),
    };
    StorageService.saveCustomConfig(updated);
    setCustomConfig(updated);
    showToast(`Removed tag "${t}"`);
  };

  // Convert Sample / Demo Data
  const handleConvertAllDemo = () => {
    StorageService.convertAllDemoApplications();
    StorageService.convertAllDemoTasks();
    showToast('All sample items converted to verified user records');
    refreshAllState();
  };

  const handleCleanAllDemo = () => {
    if (
      window.confirm(
        'Remove all sample items? (Your personal user-created records will remain completely intact)'
      )
    ) {
      StorageService.deleteAllDemoApplications();
      StorageService.deleteAllDemoTasks();
      showToast('Sample demo items cleaned');
      refreshAllState();
    }
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const json = StorageService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `italy-msc-admin-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Full system backup downloaded');
  };

  const isAdmin = StorageService.isAdmin();
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-rose-500/30 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Administrator Access Required</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The Owner/Admin Control Center is restricted to authorized platform administrators. Please sign in with administrator credentials.
          </p>
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={() => onNavigate && onNavigate('admin_dashboard')}
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            Go to Administrator Portal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Cockpit */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>OWNER & APPLICATION CONTROL COCKPIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Owner & Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Full administrative control over all 18 modules: modify public universities, manage
            applications, configure custom statuses & categories, author reusable templates, and
            manage the Archived Records Vault with instant restore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportJson}
          >
            Export Backup
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => {
              refreshAllState();
              showToast('Refreshed data across all 18 modules');
            }}
          >
            Sync State
          </Button>
        </div>
      </div>

      {/* High-Level Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Universities</div>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {universities.filter((u) => !u.isArchived).length}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Active Catalog</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Applications</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
            {applications.filter((a) => !a.isArchived).length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tracked Targets</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Active Tasks</div>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {tasks.filter((t) => !t.isArchived && t.status !== 'completed').length}
          </div>
          <div className="text-[10px] text-amber-400 mt-0.5">Pending Action</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Templates</div>
          <div className="text-xl font-extrabold text-teal-400 mt-0.5">{templates.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Reusable Docs</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Categories</div>
          <div className="text-xl font-extrabold text-white mt-0.5">
            {customConfig.taskCategories.length + customConfig.documentCategories.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Configured</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Archived Vault</div>
          <div className="text-xl font-extrabold text-rose-400 mt-0.5">
            {archivedVault.totalCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Restorable</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'overview'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>1. Module Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'universities'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>2. University Catalog ({universities.filter((u) => !u.isArchived).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'applications'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BriefcaseBusiness className="w-3.5 h-3.5" />
          <span>3. Applications ({applications.filter((a) => !a.isArchived).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks_docs')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'tasks_docs'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>4. Tasks & Documents</span>
        </button>

        <button
          onClick={() => setActiveTab('relocation_finance')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'relocation_finance'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>5. Relocation & Finance</span>
        </button>

        <button
          onClick={() => setActiveTab('custom_content')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'custom_content'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>6. Custom Content & Categories</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'templates'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>7. Reusable Templates ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'vault'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>8. Archived Vault ({archivedVault.totalCount})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM CONTROL */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Actions & Data Protection Bar */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Data Protection & Separation</h3>
                <p className="text-xs text-slate-400">
                  Safely separate sample template records from your verified personal admission data.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleConvertAllDemo}
                  icon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                >
                  Mark All As Verified User Records
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleCleanAllDemo}
                  className="text-rose-400 hover:bg-rose-500/10"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Clear Demo Data
                </Button>
              </div>
            </div>
          </div>

          {/* 18 Module Management Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Direct Module Management Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'profile',
                  name: '1. Academic Profile',
                  desc: 'Degree records, language proficiency test scores, ECTS mappings, and academic history',
                  count: '1 Profile Record',
                  action: () => (onNavigate ? onNavigate('profile') : null),
                },
                {
                  id: 'explorer',
                  name: '2. Public University Explorer',
                  desc: 'Italian public universities database, rankings, tuition, entry requirements',
                  count: `${universities.length} Universities`,
                  action: () => setActiveTab('universities'),
                },
                {
                  id: 'programmes',
                  name: '3. MSc Programme Tracker',
                  desc: 'Curriculum requirements, CFU credit evaluations, English-taught Laurea Magistrale',
                  count: `${universities.length} Programmes`,
                  action: () => (onNavigate ? onNavigate('programmes') : null),
                },
                {
                  id: 'applications',
                  name: '4. Application Manager',
                  desc: 'Target university admissions, rounds, fee payment status, portal credentials',
                  count: `${applications.length} Applications`,
                  action: () => setActiveTab('applications'),
                },
                {
                  id: 'scholarships',
                  name: '5. Scholarship & DSU Management',
                  desc: 'EDISU, ER.GO, DSU Toscana, ISEE Parificato calculator, regional grant status',
                  count: `Dossier: ${dsuApp.status}`,
                  action: () => (onNavigate ? onNavigate('scholarships') : null),
                },
                {
                  id: 'documents',
                  name: '6. Document Manager',
                  desc: 'Transcripts, SOP, MOFA attestation, police verification, passport copies',
                  count: `${documents.length} Documents`,
                  action: () => setActiveTab('tasks_docs'),
                },
                {
                  id: 'cimea_dov',
                  name: '7. CIMEA, DOV & Apostille',
                  desc: 'Diplo-me credential evaluation steps, MOE/MOFA attestation, statement of comparability',
                  count: '6 Legalization Steps',
                  action: () => (onNavigate ? onNavigate('cimea_dov') : null),
                },
                {
                  id: 'universitaly',
                  name: '8. Universitaly Pre-enrolment',
                  desc: 'Official MUR pre-enrolment portal, consular designation, Riepilogo status',
                  count: 'Pre-enrolment Dossier',
                  action: () => (onNavigate ? onNavigate('universitaly') : null),
                },
                {
                  id: 'embassy_visa',
                  name: '9. Embassy & Student Visa Tracker',
                  desc: 'Italian Embassy in Dhaka, VFS Global appointment booking, Type D visa audit',
                  count: 'Consular Tracking',
                  action: () => (onNavigate ? onNavigate('embassy_visa') : null),
                },
                {
                  id: 'sponsor_bank',
                  name: '10. Sponsor & Bank Funds',
                  desc: 'Financial solvency, 6-month statements, 300 Tk stamp affidavit, NBR tax returns',
                  count: `${sponsors.length} Sponsor Accounts`,
                  action: () => setActiveTab('relocation_finance'),
                },
                {
                  id: 'budget',
                  name: '11. Financial Budget & Costs',
                  desc: 'Pre-departure & initial settlement expenses, EUR/BDT currency estimates',
                  count: `${expenses.length} Expense Items`,
                  action: () => (onNavigate ? onNavigate('budget') : null),
                },
                {
                  id: 'accommodation',
                  name: '12. Accommodation Planner',
                  desc: 'University dormitories (EDISU/ER.GO), private flatshares, registered lease contracts',
                  count: `${accommodations.length} Housing Records`,
                  action: () => setActiveTab('relocation_finance'),
                },
                {
                  id: 'flight_planner',
                  name: '13. Flight Planner',
                  desc: 'DAC to MXP/FCO airlines, student baggage allowance (40-45kg), route bookings',
                  count: `${flights.length} Flight Routes`,
                  action: () => setActiveTab('relocation_finance'),
                },
                {
                  id: 'residence_permit',
                  name: '14. Permesso di Soggiorno',
                  desc: '8-day postal kit submission, Marca da Bollo, Questura fingerprinting appointment',
                  count: 'Post-Arrival Residency',
                  action: () => (onNavigate ? onNavigate('residence_permit') : null),
                },
                {
                  id: 'enrollment',
                  name: '15. University Matriculation',
                  desc: 'Final document submission, student tax payment, matricola number issuance',
                  count: 'Matriculation Hub',
                  action: () => (onNavigate ? onNavigate('enrollment') : null),
                },
                {
                  id: 'student_life',
                  name: '16. Italy Student Life',
                  desc: 'Codice Fiscale, SSN health insurance, Italian SIM, bank accounts, living costs',
                  count: 'Settlement Guides',
                  action: () => (onNavigate ? onNavigate('student_life') : null),
                },
                {
                  id: 'tasks',
                  name: '17. Tasks & Calendar Deadlines',
                  desc: 'Admission milestones, document submissions, scholarship deadlines, reminders',
                  count: `${tasks.length} Total Tasks`,
                  action: () => setActiveTab('tasks_docs'),
                },
                {
                  id: 'notes_links',
                  name: '18. Notes & Official Links',
                  desc: 'Admission strategy notes, Italian agency websites, Bangladeshi student groups',
                  count: `${notes.length} Notes • ${links.length} Links`,
                  action: () => (onNavigate ? onNavigate('notes_links') : null),
                },
                {
                  id: 'appearance',
                  name: '19. Appearance & Design Settings',
                  desc: 'Branding, color palettes, dark/light modes, typography scales, card geometry',
                  count: 'Theme Customizer',
                  action: () => (onNavigate ? onNavigate('appearance') : null),
                },
                {
                  id: 'custom_modules',
                  name: '20. Custom Module Builder',
                  desc: 'Create schema-driven sections, custom fields, and rearrange portal navigation',
                  count: 'Schema Builder',
                  action: () => (onNavigate ? onNavigate('custom_modules') : null),
                },
              ].map((mod) => (
                <div
                  key={mod.id}
                  onClick={mod.action}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {mod.name}
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-emerald-400">{mod.count}</span>
                    <span className="group-hover:text-slate-300">Manage Module &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNIVERSITIES CATALOG CRUD */}
      {activeTab === 'universities' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Italian Universities & MSc Programs</h3>
              <p className="text-xs text-slate-400">
                Add, edit, or archive public university records, intake deadlines, and tuition specs.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingUni(null);
                setIsUniModalOpen(true);
              }}
            >
              Add New University
            </Button>
          </div>

          <div className="space-y-3">
            {universities.map((uni) => (
              <div
                key={uni.id}
                className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                  uni.isArchived
                    ? 'border-rose-900/50 bg-rose-950/10 opacity-70'
                    : 'border-slate-800 hover:border-slate-700'
                } flex flex-col lg:flex-row lg:items-center justify-between gap-4`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-bold text-white">{uni.universityName}</h4>
                    <span className="text-xs text-slate-400 font-medium">({uni.city}, {uni.region})</span>
                    {uni.isArchived && (
                      <Badge variant="rose" size="xs">
                        Archived
                      </Badge>
                    )}
                    {uni.isCustom && (
                      <Badge variant="emerald" size="xs">
                        Custom User Entry
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-300">{uni.programTitle}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Deadlines: {uni.intakeDeadlines} • Fee: {uni.applicationFeeEur === 0 ? 'Free (0€)' : `€${uni.applicationFeeEur}`} • Scholarship: {uni.regionalScholarship}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingUni(uni);
                      setIsUniModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {uni.isArchived ? (
                    <button
                      onClick={() => handleArchiveUni(uni.id, false)}
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-1 transition-all"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleArchiveUni(uni.id, true)}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium flex items-center space-x-1 transition-all"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}

                  <button
                    onClick={() => triggerPermanentDelete('university', uni.id, uni.universityName)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium flex items-center space-x-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATIONS MANAGEMENT CRUD */}
      {activeTab === 'applications' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">University Application Manager</h3>
              <p className="text-xs text-slate-400">
                Manage target applications, change admission statuses, deadlines, and portal hints.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingApp(null);
                setIsAppModalOpen(true);
              }}
            >
              Add New Application
            </Button>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                  app.isArchived
                    ? 'border-rose-900/50 bg-rose-950/10 opacity-70'
                    : 'border-slate-800 hover:border-slate-700'
                } flex flex-col lg:flex-row lg:items-center justify-between gap-4`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-bold text-white">{app.universityName}</h4>
                    <Badge
                      variant={
                        app.status === 'Admitted'
                          ? 'emerald'
                          : app.status === 'Applied'
                          ? 'sky'
                          : app.status === 'Rejected'
                          ? 'rose'
                          : 'amber'
                      }
                      size="xs"
                    >
                      {app.status}
                    </Badge>
                    {app.isUniversitalyChoice && (
                      <Badge variant="teal" size="xs">
                        Official Universitaly Choice
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-300">{app.programName}</p>
                  <p className="text-xs text-slate-400">
                    Deadline: <span className="text-emerald-400 font-bold">{app.deadlineDate}</span> • Round: {app.round} • Fee: €{app.applicationFeeEur} ({app.feePaid ? 'Paid' : 'Unpaid'})
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingApp(app);
                      setIsAppModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {app.isArchived ? (
                    <button
                      onClick={() => handleArchiveApp(app.id, false)}
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-1"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleArchiveApp(app.id, true)}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium flex items-center space-x-1"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}

                  <button
                    onClick={() => triggerPermanentDelete('application', app.id, app.universityName)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TASKS & DOCUMENTS */}
      {activeTab === 'tasks_docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Column */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Tasks & Milestones</h3>
                <p className="text-xs text-slate-400">{tasks.length} total tasks registered</p>
              </div>
              <Button
                variant="outline"
                size="xs"
                icon={<ExternalLink className="w-3 h-3" />}
                onClick={() => (onNavigate ? onNavigate('tasks') : null)}
              >
                Open Tasks Module
              </Button>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-white truncate">{task.title}</div>
                    <div className="text-[10px] text-slate-400">
                      Due: {task.dueDate} • Priority: {task.priority} • Category: {task.category}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => {
                        StorageService.cycleTaskStatus(task.id);
                        refreshAllState();
                      }}
                      className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-emerald-400"
                    >
                      {task.status}
                    </button>
                    <button
                      onClick={() => {
                        StorageService.archiveTask(task.id);
                        showToast('Task archived');
                        refreshAllState();
                      }}
                      className="p-1 text-slate-500 hover:text-amber-400"
                      title="Archive Task"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerPermanentDelete('task', task.id, task.title)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Documents Column */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Academic Documents Checklist</h3>
                <p className="text-xs text-slate-400">{documents.length} official documents</p>
              </div>
              <Button
                variant="outline"
                size="xs"
                icon={<ExternalLink className="w-3 h-3" />}
                onClick={() => (onNavigate ? onNavigate('documents') : null)}
              >
                Open Documents Module
              </Button>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-white truncate">{doc.title}</div>
                    <div className="text-[10px] text-slate-400">
                      Authority: {doc.issuingAuthority} • Category: {doc.category}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <Badge variant="emerald" size="xs">
                      {doc.status}
                    </Badge>
                    <button
                      onClick={() => {
                        StorageService.archiveDocument(doc.id);
                        showToast('Document archived');
                        refreshAllState();
                      }}
                      className="p-1 text-slate-500 hover:text-amber-400"
                      title="Archive Document"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerPermanentDelete('document', doc.id, doc.title)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RELOCATION & FINANCE */}
      {activeTab === 'relocation_finance' && (
        <div className="space-y-6">
          {/* Accommodation & Housing Records */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Student Housing & Dormitories</h3>
                <p className="text-xs text-slate-400">
                  Track regional university dorm applications (EDISU/ER.GO) and registered private leases.
                </p>
              </div>
              <Button
                variant="primary"
                size="xs"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setEditingAccom(null);
                  setIsAccomModalOpen(true);
                }}
              >
                Add Housing Record
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accommodations.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{acc.propertyName}</span>
                    <Badge variant="teal" size="xs">
                      {acc.status}
                    </Badge>
                  </div>
                  <div className="text-slate-400">
                    City: <span className="text-white font-medium">{acc.city}</span> • Rent: <span className="text-emerald-400 font-bold">€{acc.monthlyRentEur}/mo</span> (Deposit: €{acc.depositEur})
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{acc.notes}</p>
                  <div className="pt-2 border-t border-slate-900 flex justify-end space-x-2">
                    <button
                      onClick={() => triggerPermanentDelete('accommodation', acc.id, acc.propertyName)}
                      className="text-rose-400 hover:text-rose-300 text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsor & Bank Solvency Records */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Sponsor & Bank Accounts</h3>
                <p className="text-xs text-slate-400">
                  Proof of means of subsistence records for Embassy of Italy in Dhaka.
                </p>
              </div>
              <Button
                variant="outline"
                size="xs"
                icon={<ExternalLink className="w-3 h-3" />}
                onClick={() => (onNavigate ? onNavigate('sponsor_bank') : null)}
              >
                Open Sponsor Module
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsors.map((sp) => (
                <div
                  key={sp.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{sp.sponsorName}</span>
                    <Badge variant="emerald" size="xs">
                      {sp.status}
                    </Badge>
                  </div>
                  <div className="text-slate-400">
                    Bank: {sp.bankName} • Account: {sp.accountNumberMasked}
                  </div>
                  <div className="text-emerald-400 font-bold text-sm">
                    ৳{sp.balanceBdt.toLocaleString()} BDT (~€{sp.balanceEur.toLocaleString()})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Solvency Certificate: {sp.solvencyCertificateIssued ? 'Yes' : 'Pending'} • 300 Tk Affidavit: {sp.affidavitNotarized ? 'Notarized' : 'Draft'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOM CONTENT & CATEGORIES */}
      {activeTab === 'custom_content' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Custom Category & Status Manager</h3>
              <p className="text-xs text-slate-400">
                Tailor system taxonomy: add new task categories, document classifications, custom application statuses, and search tags.
              </p>
            </div>

            {/* Task Categories */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Task Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {customConfig.taskCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  >
                    <span>{cat}</span>
                    <button
                      onClick={() => handleRemoveTaskCategory(cat)}
                      className="text-slate-500 hover:text-rose-400 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 max-w-md">
                <input
                  type="text"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  placeholder="New task category name..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Button variant="primary" size="xs" onClick={handleAddTaskCategory}>
                  Add Category
                </Button>
              </div>
            </div>

            {/* Document Categories */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                Document Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {customConfig.documentCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  >
                    <span>{cat}</span>
                    <button
                      onClick={() => handleRemoveDocCategory(cat)}
                      className="text-slate-500 hover:text-rose-400 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 max-w-md">
                <input
                  type="text"
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  placeholder="New document category..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Button variant="primary" size="xs" onClick={handleAddDocCategory}>
                  Add Category
                </Button>
              </div>
            </div>

            {/* Application Statuses */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                Application Custom Statuses
              </label>
              <div className="flex flex-wrap gap-2">
                {customConfig.applicationStatuses.map((st) => (
                  <span
                    key={st}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  >
                    <span>{st}</span>
                    <button
                      onClick={() => handleRemoveStatus(st)}
                      className="text-slate-500 hover:text-rose-400 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 max-w-md">
                <input
                  type="text"
                  value={newAppStatus}
                  onChange={(e) => setNewAppStatus(e.target.value)}
                  placeholder="e.g. In Faculty Interview..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Button variant="primary" size="xs" onClick={handleAddStatus}>
                  Add Status
                </Button>
              </div>
            </div>

            {/* Global Tags */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Tags & Taxonomy
              </label>
              <div className="flex flex-wrap gap-2">
                {customConfig.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300"
                  >
                    <span>#{t}</span>
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-500 hover:text-rose-400 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 max-w-md">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag without #..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Button variant="primary" size="xs" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REUSABLE TEMPLATES STUDIO */}
      {activeTab === 'templates' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Reusable Templates Studio</h3>
              <p className="text-xs text-slate-400">
                Author and copy ready-made drafts: Sponsor Affidavits, Professor Inquiries, SOP frameworks, and Italian CAF requests.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingTemplate(null);
                setIsTemplateModalOpen(true);
              }}
            >
              Create New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="teal" size="xs">
                      {tmpl.category}
                    </Badge>
                    <span className="text-[10px] text-slate-500">Updated: {tmpl.updatedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{tmpl.title}</h4>
                  <p className="text-xs text-slate-400">{tmpl.description}</p>
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {tmpl.content}
                  </pre>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {tmpl.tags.map((t) => (
                      <span key={t} className="text-[10px] text-slate-500">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(tmpl.content);
                        showToast(`Copied "${tmpl.title}" to clipboard!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingTemplate(tmpl);
                        setIsTemplateModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Edit template"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => triggerPermanentDelete('template', tmpl.id, tmpl.title)}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Delete template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: ARCHIVED RECORDS VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-rose-400">
              <Archive className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Archived Records Vault</h3>
            </div>
            <p className="text-xs text-slate-400">
              Safely store past, rejected, or inactive records without deleting them. Any archived
              record can be restored with a single click or permanently deleted.
            </p>
          </div>

          {archivedVault.totalCount === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
              <Archive className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">Vault is Empty</h4>
              <p className="text-xs text-slate-400">
                You have no archived items. Archiving allows you to hide records from modules without
                losing historical data.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Archived Applications */}
              {archivedVault.applications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Archived Applications ({archivedVault.applications.length})
                  </h4>
                  {archivedVault.applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{app.universityName}</div>
                        <div className="text-xs text-slate-400">{app.programName}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="xs"
                          icon={<Undo2 className="w-3.5 h-3.5" />}
                          onClick={() => handleArchiveApp(app.id, false)}
                        >
                          Restore
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() =>
                            triggerPermanentDelete('application', app.id, app.universityName)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Archived Universities */}
              {archivedVault.universities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    Archived Universities ({archivedVault.universities.length})
                  </h4>
                  {archivedVault.universities.map((uni) => (
                    <div
                      key={uni.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{uni.universityName}</div>
                        <div className="text-xs text-slate-400">{uni.programTitle}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="xs"
                          icon={<Undo2 className="w-3.5 h-3.5" />}
                          onClick={() => handleArchiveUni(uni.id, false)}
                        >
                          Restore
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() =>
                            triggerPermanentDelete('university', uni.id, uni.universityName)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Archived Tasks */}
              {archivedVault.tasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Archived Tasks ({archivedVault.tasks.length})
                  </h4>
                  {archivedVault.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{task.title}</div>
                        <div className="text-xs text-slate-400">Due: {task.dueDate}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="xs"
                          icon={<Undo2 className="w-3.5 h-3.5" />}
                          onClick={() => {
                            StorageService.restoreTask(task.id);
                            refreshAllState();
                            showToast('Task restored');
                          }}
                        >
                          Restore
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() => triggerPermanentDelete('task', task.id, task.title)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL: University Form */}
      <Modal
        isOpen={isUniModalOpen}
        onClose={() => setIsUniModalOpen(false)}
        title={editingUni ? 'Edit Italian University Program' : 'Add Public Italian University'}
      >
        <form onSubmit={handleSaveUni} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                University Name (English)
              </label>
              <input
                type="text"
                name="universityName"
                defaultValue={editingUni?.universityName}
                required
                placeholder="e.g. University of Padova"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Italian Name / Acronym
              </label>
              <input
                type="text"
                name="italianName"
                defaultValue={editingUni?.italianName}
                placeholder="e.g. Università degli Studi di Padova (UNIPD)"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                name="city"
                defaultValue={editingUni?.city}
                required
                placeholder="e.g. Padua"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Region</label>
              <input
                type="text"
                name="region"
                defaultValue={editingUni?.region}
                required
                placeholder="e.g. Veneto"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">World Rank</label>
              <input
                type="number"
                name="worldRank"
                defaultValue={editingUni?.worldRank}
                placeholder="e.g. 219"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Program Title
            </label>
            <input
              type="text"
              name="programTitle"
              defaultValue={editingUni?.programTitle}
              required
              placeholder="e.g. MSc in Computer Science / Data Science"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Application Fee (€)</label>
              <input
                type="number"
                name="applicationFeeEur"
                defaultValue={editingUni?.applicationFeeEur ?? 30}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min IELTS</label>
              <input
                type="number"
                step="0.5"
                name="minIelts"
                defaultValue={editingUni?.admissionRequirements.minIelts ?? 6.0}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Competitiveness</label>
              <select
                name="competitiveness"
                defaultValue={editingUni?.competitiveness ?? 'Moderate'}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
                <option value="Target">Target</option>
                <option value="Safe / Realistic">Safe / Realistic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deadlines Description
            </label>
            <input
              type="text"
              name="intakeDeadlines"
              defaultValue={editingUni?.intakeDeadlines ?? 'Round 1: Nov-Jan | Round 2: Feb-Apr'}
              placeholder="e.g. Call 1: Nov - Feb | Call 2: Mar - May"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Curriculum Matching Strategy (For International Degree Holders)
            </label>
            <textarea
              name="cgpaStrategyTip"
              rows={2}
              defaultValue={editingUni?.cgpaStrategyTip}
              placeholder="Advice on fulfilling curricular requirements and emphasizing algorithms/math..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Official Website</label>
              <input
                type="url"
                name="officialWebsite"
                defaultValue={editingUni?.officialWebsite}
                placeholder="https://www.unipd.it"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Regional DSU Agency</label>
              <input
                type="text"
                name="regionalScholarship"
                defaultValue={editingUni?.regionalScholarship ?? 'ESU Padova (~€7,500/yr)'}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsUniModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingUni ? 'Save Changes' : 'Create University'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Application Form */}
      <Modal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        title={editingApp ? 'Edit University Application' : 'Add University Target'}
      >
        <form onSubmit={handleSaveApp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">University</label>
              <input
                type="text"
                name="universityName"
                defaultValue={editingApp?.universityName}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Program</label>
              <input
                type="text"
                name="programName"
                defaultValue={editingApp?.programName}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                name="city"
                defaultValue={editingApp?.city ?? 'Turin'}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Region</label>
              <input
                type="text"
                name="region"
                defaultValue={editingApp?.region ?? 'Piedmont'}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                name="status"
                defaultValue={editingApp?.status ?? 'Researching'}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                {customConfig.applicationStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline Date</label>
              <input
                type="date"
                name="deadlineDate"
                defaultValue={editingApp?.deadlineDate ?? '2027-01-31'}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Round</label>
              <input
                type="text"
                name="round"
                defaultValue={editingApp?.round ?? 'Round 1'}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Portal URL</label>
              <input
                type="url"
                name="portalUrl"
                defaultValue={editingApp?.portalUrl}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Application Fee (€)</label>
              <input
                type="number"
                name="applicationFeeEur"
                defaultValue={editingApp?.applicationFeeEur ?? 0}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-1">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                name="feePaid"
                defaultChecked={editingApp?.feePaid}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
              />
              <span>Application Fee Paid</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                name="isUniversitalyChoice"
                defaultChecked={editingApp?.isUniversitalyChoice}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
              />
              <span className="font-semibold text-teal-300">Designate as Universitaly Choice</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Strategy Notes</label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={editingApp?.notes}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAppModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingApp ? 'Save Application' : 'Create Application'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Reusable Template Form */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title={editingTemplate ? 'Edit Reusable Template' : 'Create Reusable Template'}
      >
        <form onSubmit={handleSaveTemplate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Template Title</label>
            <input
              type="text"
              name="title"
              defaultValue={editingTemplate?.title}
              required
              placeholder="e.g. Italian Professor Inquiry for ECTS Verification"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                name="category"
                defaultValue={editingTemplate?.category ?? 'Custom'}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Statement of Purpose (SOP)">Statement of Purpose (SOP)</option>
                <option value="Curriculum Vitae (CV)">Curriculum Vitae (CV)</option>
                <option value="Email to Professor">Email to Professor</option>
                <option value="Recommendation Letter">Recommendation Letter</option>
                <option value="Sponsor Affidavit">Sponsor Affidavit</option>
                <option value="Motivation Letter">Motivation Letter</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                defaultValue={editingTemplate?.tags.join(', ')}
                placeholder="PoliTO, SOP, AI, IELTS"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <input
              type="text"
              name="description"
              defaultValue={editingTemplate?.description}
              placeholder="Brief explanation of when to use this template..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Template Content</label>
            <textarea
              name="content"
              rows={8}
              defaultValue={editingTemplate?.content}
              required
              placeholder="Paste full text template with placeholders like [Candidate Name], [Programme]..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsTemplateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingTemplate ? 'Save Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM PERMANENT DELETE DIALOG */}
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="Confirm Permanent Deletion"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-rose-200">
              <div className="font-bold">Permanent Destructive Action</div>
              <p>
                Are you sure you want to permanently delete{' '}
                <span className="font-bold text-white">"{pendingDelete?.name}"</span>? This record
                will be permanently purged from local storage and cannot be restored from the vault.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={executePermanentDelete}>
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

