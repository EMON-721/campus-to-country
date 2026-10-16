import React, { useState } from 'react';
import { UniversityApplication, ApplicationStatus } from '../../types';
import { Modal } from '../common/Modal';
import {
  BriefcaseBusiness,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Key,
  Calendar,
  Building,
  Check,
  Award,
} from 'lucide-react';

interface ApplicationManagementViewProps {
  applications: UniversityApplication[];
  onAddApplication: (app: UniversityApplication) => void;
  onUpdateApplication: (app: UniversityApplication) => void;
  onDeleteApplication: (id: string) => void;
  isAddModalOpenInitially?: boolean;
  onCloseAddModalInitially?: () => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'Researching',
  'Preparing Documents',
  'Applied',
  'Under Evaluation',
  'Interview Scheduled',
  'Admitted',
  'Pre-Enrolled',
  'Rejected',
];

export const ApplicationManagementView: React.FC<ApplicationManagementViewProps> = ({
  applications,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
  isAddModalOpenInitially = false,
  onCloseAddModalInitially,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'user' | 'demo'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingApp, setEditingApp] = useState<UniversityApplication | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const initialFormState: Partial<UniversityApplication> = {
    universityName: '',
    programName: 'MSc in Computer Science & Artificial Intelligence',
    city: '',
    region: '',
    portalUrl: '',
    portalUsername: '',
    portalPasswordHint: '',
    applicationFeeEur: 30,
    feePaid: false,
    round: 'Round 1 (2027 Intake)',
    deadlineDate: '2027-01-30',
    status: 'Preparing Documents',
    isUniversitalyChoice: false,
    notes: '',
    requiredDocuments: [
      'Official Degree Transcripts',
      'Language Proficiency Certificate',
      'Course Syllabus Breakdown',
      'Europass CV',
      'Motivation Letter',
    ],
    scholarshipApplied: false,
  };

  const [formData, setFormData] = useState<Partial<UniversityApplication>>(initialFormState);
  const [docInput, setDocInput] = useState('');

  // Sync modal when triggered from external quick-add
  React.useEffect(() => {
    if (isAddModalOpenInitially) {
      setEditingApp(null);
      setFormData(initialFormState);
      setIsModalOpen(true);
    }
  }, [isAddModalOpenInitially]);

  const handleOpenAdd = () => {
    setEditingApp(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: UniversityApplication) => {
    setEditingApp(app);
    setFormData(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApp(null);
    if (onCloseAddModalInitially) onCloseAddModalInitially();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.universityName || !formData.programName) return;

    if (editingApp) {
      const updated: UniversityApplication = {
        ...editingApp,
        ...(formData as UniversityApplication),
        isDemo: formData.isDemo !== undefined ? formData.isDemo : editingApp.isDemo,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateApplication(updated);
    } else {
      const created: UniversityApplication = {
        id: `app-${Date.now()}`,
        universityName: formData.universityName!,
        programName: formData.programName!,
        city: formData.city || 'Italy',
        region: formData.region || '',
        portalUrl: formData.portalUrl || 'https://www.universitaly.it',
        portalUsername: formData.portalUsername || '',
        portalPasswordHint: formData.portalPasswordHint || '',
        applicationFeeEur: Number(formData.applicationFeeEur) || 0,
        feePaid: Boolean(formData.feePaid),
        round: formData.round || 'Fall 2027 Intake',
        deadlineDate: formData.deadlineDate || '2027-02-01',
        status: (formData.status as ApplicationStatus) || 'Researching',
        isUniversitalyChoice: Boolean(formData.isUniversitalyChoice),
        notes: formData.notes || '',
        requiredDocuments: formData.requiredDocuments || [],
        scholarshipApplied: Boolean(formData.scholarshipApplied),
        updatedAt: new Date().toISOString().split('T')[0],
        isDemo: formData.isDemo !== undefined ? Boolean(formData.isDemo) : false,
      };
      onAddApplication(created);
    }
    handleCloseModal();
  };

  const handleConvertToReal = (app: UniversityApplication) => {
    onUpdateApplication({ ...app, isDemo: false, updatedAt: new Date().toISOString().split('T')[0] });
  };

  const handleQuickStatusChange = (app: UniversityApplication, newStatus: ApplicationStatus) => {
    onUpdateApplication({ ...app, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] });
  };

  const handleConvertAllDemos = () => {
    applications.forEach((app) => {
      if (app.isDemo) {
        onUpdateApplication({ ...app, isDemo: false });
      }
    });
  };

  const handleDeleteAllDemos = () => {
    if (window.confirm('Remove all sample demonstration applications? Your own custom targets will be kept.')) {
      applications.forEach((app) => {
        if (app.isDemo) {
          onDeleteApplication(app.id);
        }
      });
    }
  };

  const handleAddDoc = () => {
    if (!docInput.trim()) return;
    const current = formData.requiredDocuments || [];
    setFormData({
      ...formData,
      requiredDocuments: [...current, docInput.trim()],
    });
    setDocInput('');
  };

  const handleRemoveDoc = (index: number) => {
    const current = formData.requiredDocuments || [];
    setFormData({
      ...formData,
      requiredDocuments: current.filter((_, i) => i !== index),
    });
  };

  const userAppsCount = applications.filter((a) => !a.isDemo).length;
  const demoAppsCount = applications.filter((a) => a.isDemo).length;

  const filteredApps = applications.filter((app) => {
    const matchSearch =
      app.universityName.toLowerCase().includes(search.toLowerCase()) ||
      app.programName.toLowerCase().includes(search.toLowerCase()) ||
      app.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchSource =
      sourceFilter === 'all' ||
      (sourceFilter === 'user' && !app.isDemo) ||
      (sourceFilter === 'demo' && Boolean(app.isDemo));
    return matchSearch && matchStatus && matchSource;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Admitted':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Preparing Documents':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Applied':
      case 'Under Evaluation':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Pre-Enrolled':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <BriefcaseBusiness className="w-4 h-4" />
            <span>Admission Funnel Management</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">University Application Manager</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track rounds, university portal logins, application fees, required documents, and offer letters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New University Application</span>
        </button>
      </div>

      {/* Filter and View Toggle Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status select */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses ({applications.length})</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st} ({applications.filter((a) => a.status === st).length})
                </option>
              ))}
            </select>
          </div>

          {/* Record Source Filter */}
          <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                sourceFilter === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setSourceFilter('user')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                sourceFilter === 'user'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              My Targets ({userAppsCount})
            </button>
            <button
              onClick={() => setSourceFilter('demo')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                sourceFilter === 'demo'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              Samples ({demoAppsCount})
            </button>
          </div>

          {/* Quick Demo Management */}
          {demoAppsCount > 0 && (
            <div className="hidden xl:flex items-center space-x-1.5 pl-1 border-l border-slate-800 text-[11px]">
              <button
                onClick={handleConvertAllDemos}
                className="px-2 py-1 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Convert all sample applications into your real targets"
              >
                Make All Real
              </button>
              <button
                onClick={handleDeleteAllDemos}
                className="px-2 py-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Clear all demonstration entries"
              >
                Clear Samples
              </button>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Content: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Line */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                      <span>{app.universityName}</span>
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {app.city} {app.region && `• ${app.region}`}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Quick status dropdown */}
                    <select
                      value={app.status}
                      onChange={(e) => handleQuickStatusChange(app, e.target.value as ApplicationStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer outline-none bg-slate-900 ${getStatusBadge(
                        app.status
                      )}`}
                      title="Click to quickly update status"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-slate-900 text-slate-200">
                          {st}
                        </option>
                      ))}
                    </select>

                    {!app.isDemo ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        My Target
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConvertToReal(app)}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 hover:bg-emerald-500/20 text-purple-300 hover:text-emerald-300 border border-purple-500/30 hover:border-emerald-500/30 transition-colors flex items-center space-x-1"
                        title="Click to convert sample into your own real target"
                      >
                        <span>Sample</span>
                        <span className="text-[9px] underline">→ Make Mine</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Program title */}
                <div className="text-xs font-semibold text-emerald-300 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {app.programName}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Intake / Round</span>
                    <span className="font-semibold text-slate-200">{app.round}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Portal Deadline</span>
                    <span className="font-semibold text-slate-200">{app.deadlineDate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Application Fee</span>
                    <span className="font-semibold text-slate-200">
                      {app.applicationFeeEur === 0 ? '€0 (Free)' : `€${app.applicationFeeEur}`} •{' '}
                      {app.feePaid ? (
                        <span className="text-emerald-400">Paid</span>
                      ) : (
                        <span className="text-amber-400">Unpaid</span>
                      )}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Universitaly Pre-enrolment</span>
                    <span className="font-semibold text-slate-200">
                      {app.isUniversitalyChoice ? (
                        <span className="text-purple-400 font-bold">Primary Choice</span>
                      ) : (
                        <span className="text-slate-400">Secondary</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Credentials / Portal info */}
                {app.portalUsername && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      <span>Login: <strong className="text-white font-mono">{app.portalUsername}</strong></span>
                    </div>
                    {app.portalPasswordHint && (
                      <span className="text-[11px] text-slate-400 italic">
                        {app.portalPasswordHint}
                      </span>
                    )}
                  </div>
                )}

                {/* Documents checklist */}
                {app.requiredDocuments && app.requiredDocuments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Required Documents ({app.requiredDocuments.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {app.requiredDocuments.map((doc, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 text-[10px] border border-slate-700/60"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {app.notes && (
                  <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-950/40 p-2 rounded-xl">
                    "{app.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={app.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 font-medium"
                >
                  <span>Open Uni Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleOpenEdit(app)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Application"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(app.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">University & City</th>
                <th className="p-4">Program</th>
                <th className="p-4">Round & Deadline</th>
                <th className="p-4">Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center space-x-2">
                      <span>{app.universityName}</span>
                      {!app.isDemo ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          My Target
                        </span>
                      ) : (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          Sample
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal">{app.city}</div>
                  </td>
                  <td className="p-4 text-emerald-300 font-medium">{app.programName}</td>
                  <td className="p-4">
                    <div>{app.round}</div>
                    <div className="text-[11px] text-slate-400">{app.deadlineDate}</div>
                  </td>
                  <td className="p-4">
                    {app.applicationFeeEur === 0 ? '€0' : `€${app.applicationFeeEur}`} •{' '}
                    {app.feePaid ? (
                      <span className="text-emerald-400">Paid</span>
                    ) : (
                      <span className="text-amber-400">Unpaid</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleQuickStatusChange(app, e.target.value as ApplicationStatus)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold border cursor-pointer outline-none bg-slate-900 ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st} className="bg-slate-900 text-slate-200">
                            {st}
                          </option>
                        ))}
                      </select>
                      {app.isDemo && (
                        <button
                          onClick={() => handleConvertToReal(app)}
                          className="text-[10px] text-purple-300 hover:text-emerald-300 underline"
                          title="Convert to My Target"
                        >
                          Make Mine
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <a
                        href={app.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-emerald-400"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(app)}
                        className="p-1.5 text-slate-400 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(app.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingApp ? `Edit: ${editingApp.universityName}` : 'Add New University Application'}
        subtitle="Manage admission round, fee, portal details, and status"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">University Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Politecnico di Torino"
                value={formData.universityName || ''}
                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">City</label>
              <input
                type="text"
                placeholder="e.g. Turin"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Degree / Program Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. MSc in Data Science and Engineering"
              value={formData.programName || ''}
              onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Round / Call</label>
              <input
                type="text"
                value={formData.round || ''}
                onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Deadline Date</label>
              <input
                type="date"
                value={formData.deadlineDate || ''}
                onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Status</label>
              <select
                value={formData.status || 'Researching'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ApplicationStatus })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Application Fee (€)</label>
              <input
                type="number"
                min="0"
                value={formData.applicationFeeEur ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, applicationFeeEur: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.feePaid)}
                  onChange={(e) => setFormData({ ...formData, feePaid: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                />
                <span>Fee Already Paid</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.isUniversitalyChoice)}
                  onChange={(e) =>
                    setFormData({ ...formData, isUniversitalyChoice: e.target.checked })
                  }
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-950"
                />
                <span>Primary Universitaly Choice</span>
              </label>
            </div>
          </div>

          {/* Portal details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Portal URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.portalUrl || ''}
                onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Portal Username</label>
              <input
                type="text"
                placeholder="Login username"
                value={formData.portalUsername || ''}
                onChange={(e) => setFormData({ ...formData, portalUsername: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Password Hint / Vault</label>
              <input
                type="text"
                placeholder="Hint or stored location"
                value={formData.portalPasswordHint || ''}
                onChange={(e) => setFormData({ ...formData, portalPasswordHint: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          {/* Required Documents Tag list */}
          <div className="space-y-2">
            <label className="block text-slate-400 font-medium">Required Documents</label>
            <div className="flex flex-wrap gap-1.5">
              {(formData.requiredDocuments || []).map((doc, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs flex items-center space-x-1"
                >
                  <span>{doc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(idx)}
                    className="text-slate-400 hover:text-rose-400 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="Add document requirement..."
                value={docInput}
                onChange={(e) => setDocInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDoc();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
              <button
                type="button"
                onClick={handleAddDoc}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Record Classification Selector */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <label className="block text-slate-400 font-medium text-[11px]">Record Classification</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isDemo: false })}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors ${
                  !formData.isDemo
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                My Target Application (Real)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isDemo: true })}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-colors ${
                  Boolean(formData.isDemo)
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Sample Reference Entry
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Real targets count towards your personal application roadmap. Samples are provided as reference guides.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Notes & Evaluation Tips</label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950"
            >
              {editingApp ? 'Update Application' : 'Create Application'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete University Application?"
        subtitle="This action cannot be undone."
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Are you sure you want to remove this university application from your tracker?
          </p>
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteConfirmId) onDeleteApplication(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

