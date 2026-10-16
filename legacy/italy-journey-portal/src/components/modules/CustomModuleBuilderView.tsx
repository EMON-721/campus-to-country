import React, { useState } from 'react';
import {
  CustomModuleDefinition,
  CustomModuleRecord,
  CustomFieldDefinition,
  CustomFieldType,
  NavigationSettings,
} from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Archive,
  RotateCcw,
  Sliders,
  Type,
  Hash,
  Calendar,
  DollarSign,
  List,
  CheckSquare,
  Link,
  AlignLeft,
  Paperclip,
  FolderPlus,
  BookOpen,
  MailCheck,
  Award,
  Globe,
  Heart,
  Briefcase,
  Compass,
  FileCode,
  Sparkles,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';

interface CustomModuleBuilderViewProps {
  onNavigate?: (module: any) => void;
  onRefreshNavigation?: () => void;
}

export const CustomModuleBuilderView: React.FC<CustomModuleBuilderViewProps> = ({
  onNavigate,
  onRefreshNavigation,
}) => {
  // Modules list from storage
  const [modules, setModules] = useState<CustomModuleDefinition[]>(() =>
    StorageService.getCustomModules()
  );
  const [selectedModuleId, setSelectedModuleId] = useState<string>(() =>
    modules.length > 0 ? modules[0].id : ''
  );

  // Active view tab inside builder
  const [activeBuilderTab, setActiveBuilderTab] = useState<'records' | 'schema' | 'nav_settings'>(
    'records'
  );

  // Search & filter for records
  const [recordSearch, setRecordSearch] = useState('');
  const [showArchivedRecords, setShowArchivedRecords] = useState(false);

  // Module creation/edit modal
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CustomModuleDefinition | null>(null);
  const [moduleFormData, setModuleFormData] = useState<Partial<CustomModuleDefinition>>({
    name: '',
    description: '',
    categoryGroup: 'CUSTOM MODULES',
    iconName: 'BookOpen',
    fields: [],
  });

  // Field creation/edit modal
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomFieldDefinition | null>(null);
  const [fieldFormData, setFieldFormData] = useState<Partial<CustomFieldDefinition>>({
    label: '',
    name: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: [],
  });
  const [fieldOptionsInput, setFieldOptionsInput] = useState('');

  // Record creation/edit modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CustomModuleRecord | null>(null);
  const [recordFormData, setRecordFormData] = useState<Record<string, any>>({});

  // Navigation settings state
  const [navSettings, setNavSettings] = useState<NavigationSettings>(() =>
    StorageService.getNavigationSettings()
  );

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeModule = modules.find((m) => m.id === selectedModuleId);

  // Records for active module
  const [records, setRecords] = useState<CustomModuleRecord[]>(() =>
    StorageService.getCustomModuleRecords(selectedModuleId, true)
  );

  const reloadRecords = (modId: string) => {
    setRecords(StorageService.getCustomModuleRecords(modId, true));
  };

  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    reloadRecords(id);
  };

  // ================= MODULE CRUD =================
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleFormData({
      name: '',
      description: '',
      categoryGroup: 'CUSTOM MODULES',
      iconName: 'BookOpen',
      fields: [
        {
          id: `f_${Date.now()}_1`,
          name: 'title',
          label: 'Title / Subject',
          type: 'text',
          required: true,
          placeholder: 'Title of entry',
        },
        {
          id: `f_${Date.now()}_2`,
          name: 'status',
          label: 'Status',
          type: 'dropdown',
          options: ['Not Started', 'In Progress', 'Completed'],
          defaultValue: 'In Progress',
        },
      ],
    });
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: CustomModuleDefinition) => {
    setEditingModule(mod);
    setModuleFormData(mod);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleFormData.name) return;

    const slug = moduleFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    if (editingModule) {
      const updated: CustomModuleDefinition = {
        ...editingModule,
        name: moduleFormData.name,
        slug,
        description: moduleFormData.description || '',
        categoryGroup: moduleFormData.categoryGroup || 'CUSTOM MODULES',
        iconName: moduleFormData.iconName || 'BookOpen',
        updatedAt: new Date().toISOString(),
      };
      StorageService.updateCustomModule(updated);
      setModules(StorageService.getCustomModules());
      showToast(`Module "${updated.name}" updated.`);
    } else {
      const created: CustomModuleDefinition = {
        id: `mod-${Date.now()}`,
        name: moduleFormData.name,
        slug,
        description: moduleFormData.description || '',
        categoryGroup: moduleFormData.categoryGroup || 'CUSTOM MODULES',
        iconName: moduleFormData.iconName || 'BookOpen',
        fields: moduleFormData.fields || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      StorageService.addCustomModule(created);
      const updatedList = StorageService.getCustomModules();
      setModules(updatedList);
      setSelectedModuleId(created.id);
      reloadRecords(created.id);
      showToast(`Custom module "${created.name}" created successfully.`);
    }

    setIsModuleModalOpen(false);
    if (onRefreshNavigation) onRefreshNavigation();
  };

  const handleDeleteModule = (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this custom section and all of its records? This action cannot be undone.'
      )
    )
      return;
    StorageService.deleteCustomModule(id);
    const updated = StorageService.getCustomModules();
    setModules(updated);
    if (updated.length > 0) {
      setSelectedModuleId(updated[0].id);
      reloadRecords(updated[0].id);
    } else {
      setSelectedModuleId('');
      setRecords([]);
    }
    showToast('Custom module deleted.');
    if (onRefreshNavigation) onRefreshNavigation();
  };

  // ================= FIELD SCHEMA CRUD =================
  const handleOpenAddField = () => {
    setEditingField(null);
    setFieldFormData({
      label: '',
      name: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: [],
    });
    setFieldOptionsInput('');
    setIsFieldModalOpen(true);
  };

  const handleOpenEditField = (field: CustomFieldDefinition) => {
    setEditingField(field);
    setFieldFormData(field);
    setFieldOptionsInput((field.options || []).join(', '));
    setIsFieldModalOpen(true);
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModule || !fieldFormData.label) return;

    const fieldName =
      fieldFormData.name || fieldFormData.label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const parsedOptions = fieldOptionsInput
      ? fieldOptionsInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    let updatedFields = [...activeModule.fields];
    if (editingField) {
      updatedFields = updatedFields.map((f) =>
        f.id === editingField.id
          ? {
              ...f,
              label: fieldFormData.label!,
              name: fieldName,
              type: fieldFormData.type || 'text',
              required: Boolean(fieldFormData.required),
              placeholder: fieldFormData.placeholder,
              options: parsedOptions,
            }
          : f
      );
    } else {
      const newField: CustomFieldDefinition = {
        id: `f_${Date.now()}`,
        label: fieldFormData.label!,
        name: fieldName,
        type: fieldFormData.type || 'text',
        required: Boolean(fieldFormData.required),
        placeholder: fieldFormData.placeholder,
        options: parsedOptions,
      };
      updatedFields.push(newField);
    }

    const updatedModule = { ...activeModule, fields: updatedFields };
    StorageService.updateCustomModule(updatedModule);
    setModules(StorageService.getCustomModules());
    setIsFieldModalOpen(false);
    showToast(`Field schema updated.`);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!activeModule) return;
    const updatedFields = activeModule.fields.filter((f) => f.id !== fieldId);
    const updatedModule = { ...activeModule, fields: updatedFields };
    StorageService.updateCustomModule(updatedModule);
    setModules(StorageService.getCustomModules());
    showToast(`Field removed from schema.`);
  };

  // ================= RECORD CRUD =================
  const handleOpenAddRecord = () => {
    if (!activeModule) return;
    setEditingRecord(null);
    const initialData: Record<string, any> = {};
    activeModule.fields.forEach((f) => {
      initialData[f.id] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setRecordFormData(initialData);
    setIsRecordModalOpen(true);
  };

  const handleOpenEditRecord = (record: CustomModuleRecord) => {
    setEditingRecord(record);
    setRecordFormData({ ...record.data });
    setIsRecordModalOpen(true);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModule) return;

    if (editingRecord) {
      const updated: CustomModuleRecord = {
        ...editingRecord,
        data: recordFormData,
        updatedAt: new Date().toISOString(),
      };
      StorageService.updateCustomModuleRecord(updated);
      showToast('Record updated successfully.');
    } else {
      const created: CustomModuleRecord = {
        id: `rec-${Date.now()}`,
        moduleId: activeModule.id,
        data: recordFormData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      StorageService.addCustomModuleRecord(created);
      showToast('New record added to module.');
    }

    setIsRecordModalOpen(false);
    reloadRecords(activeModule.id);
  };

  const handleDeleteRecord = (id: string) => {
    StorageService.deleteCustomModuleRecord(id);
    if (activeModule) reloadRecords(activeModule.id);
    showToast('Record deleted.');
  };

  const handleToggleArchiveRecord = (id: string, currentlyArchived?: boolean) => {
    if (currentlyArchived) {
      StorageService.restoreCustomModuleRecord(id);
      showToast('Record restored.');
    } else {
      StorageService.archiveCustomModuleRecord(id);
      showToast('Record archived.');
    }
    if (activeModule) reloadRecords(activeModule.id);
  };

  // Export records of current module to JSON
  const handleExportModuleRecords = () => {
    if (!activeModule) return;
    const payload = {
      moduleName: activeModule.name,
      schema: activeModule.fields,
      records: records,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-module-${activeModule.slug}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Module records exported successfully.');
  };

  // ================= NAVIGATION SETTINGS =================
  const PORTAL_STANDARD_MODULES = [
    { key: 'explorer', label: 'Public Uni Explorer' },
    { key: 'programmes', label: 'MSc Programme Tracker' },
    { key: 'applications', label: 'Application Manager' },
    { key: 'scholarships', label: 'Scholarship & DSU' },
    { key: 'documents', label: 'Document Manager' },
    { key: 'cimea_dov', label: 'CIMEA, DOV & Apostille' },
    { key: 'universitaly', label: 'Universitaly Pre-enrolment' },
    { key: 'embassy_visa', label: 'Embassy & Visa Tracker' },
    { key: 'visa_checklist', label: 'Visa Checklist' },
    { key: 'sponsor_bank', label: 'Sponsor & Bank Funds' },
    { key: 'budget', label: 'Financial Budget' },
    { key: 'accommodation', label: 'Accommodation' },
    { key: 'flight_planner', label: 'Flight Planner' },
    { key: 'travel_checklist', label: 'Airport & Departure Prep' },
    { key: 'residence_permit', label: 'Permesso di Soggiorno' },
    { key: 'student_life', label: 'Italy Student Life' },
  ];

  const toggleModuleHidden = (modKey: string) => {
    const currentHidden = navSettings.hiddenModules || [];
    let nextHidden: string[];
    if (currentHidden.includes(modKey)) {
      nextHidden = currentHidden.filter((k) => k !== modKey);
    } else {
      nextHidden = [...currentHidden, modKey];
    }
    const updated = { ...navSettings, hiddenModules: nextHidden };
    setNavSettings(updated);
    StorageService.saveNavigationSettings(updated);
    showToast('Navigation visibility preference updated.');
    if (onRefreshNavigation) onRefreshNavigation();
  };

  const handleCustomLabelChange = (modKey: string, newLabel: string) => {
    const updated = {
      ...navSettings,
      customLabels: { ...navSettings.customLabels, [modKey]: newLabel },
    };
    setNavSettings(updated);
    StorageService.saveNavigationSettings(updated);
  };

  // Filter records
  const displayedRecords = records.filter((r) => {
    if (!showArchivedRecords && r.isArchived) return false;
    if (showArchivedRecords && !r.isArchived) return false;

    if (!recordSearch) return true;
    const values = Object.values(r.data).join(' ').toLowerCase();
    return values.includes(recordSearch.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl shadow-emerald-950 flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Schema-Driven Module Engine & Navigation Customizer</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Custom Module Builder</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Create custom admissions or student life sections, define typed schemas (text, currency, date, dropdowns, attachments), manage custom records, and organize navigation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAddModule}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create New Section</span>
          </button>
        </div>
      </div>

      {/* Module Selector Pills */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Your Custom Sections:</span>
          <span className="text-[11px] text-slate-400">{modules.length} active custom modules</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {modules.map((m) => {
            const isSelected = m.id === selectedModuleId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectModule(m.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{m.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 font-mono">
                  {m.fields.length} fields
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Workbench */}
      {activeModule ? (
        <div className="space-y-4">
          {/* Active Module Header & Sub-Tabs */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">{activeModule.name}</h3>
                <Badge variant="emerald" size="xs">
                  {activeModule.categoryGroup}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeModule.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveBuilderTab('records')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeBuilderTab === 'records'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Records Data ({records.filter((r) => !r.isArchived).length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBuilderTab('schema')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeBuilderTab === 'schema'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fields Schema ({activeModule.fields.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBuilderTab('nav_settings')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeBuilderTab === 'nav_settings'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Navigation & Menus
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEditModule(activeModule)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                title="Edit module name or description"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteModule(activeModule.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 transition-colors border border-slate-700"
                title="Delete this section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAB 1: RECORDS DATA VIEW */}
          {activeBuilderTab === 'records' && (
            <div className="space-y-4">
              {/* Record Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3 w-full md:w-auto flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search saved records..."
                      value={recordSearch}
                      onChange={(e) => setRecordSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowArchivedRecords(!showArchivedRecords)}
                    className={`px-3 py-2 rounded-xl border font-semibold flex items-center space-x-1.5 transition-colors ${
                      showArchivedRecords
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>{showArchivedRecords ? 'Viewing Archived' : 'Show Archived'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportModuleRecords}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center space-x-1.5 border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddRecord}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-950"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Record</span>
                  </button>
                </div>
              </div>

              {/* Records Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-2.5">
                      {/* Record data items generated dynamically */}
                      {activeModule.fields.map((field) => {
                        const val = rec.data[field.id];
                        if (val === undefined || val === '') return null;

                        if (field.type === 'checkbox') {
                          return (
                            <div
                              key={field.id}
                              className="flex items-center space-x-2 text-xs text-slate-300"
                            >
                              <span
                                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                  val ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                {val ? '✓' : ''}
                              </span>
                              <span className="font-medium">{field.label}</span>
                            </div>
                          );
                        }

                        if (field.type === 'url') {
                          return (
                            <div key={field.id} className="space-y-0.5 text-xs">
                              <span className="text-[10px] text-slate-400 font-medium">
                                {field.label}:
                              </span>
                              <div>
                                <a
                                  href={val}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-400 hover:underline flex items-center space-x-1 truncate font-mono text-[11px]"
                                >
                                  <span>{val}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={field.id} className="space-y-0.5">
                            <div className="text-[10px] text-slate-400 font-medium">
                              {field.label}
                            </div>
                            <div className="text-xs text-white font-medium break-words">
                              {String(val)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(rec.updatedAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleArchiveRecord(rec.id, rec.isArchived)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title={rec.isArchived ? 'Restore record' : 'Archive record'}
                        >
                          {rec.isArchived ? (
                            <RotateCcw className="w-3.5 h-3.5" />
                          ) : (
                            <Archive className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditRecord(rec)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord(rec.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {displayedRecords.length === 0 && (
                <div className="p-10 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                  <div className="text-sm font-bold text-white">No records in this module yet</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Add Record" to fill out this section based on its schema fields.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddRecord}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Add First Record
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCHEMA DESIGNER */}
          {activeBuilderTab === 'schema' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Field Schema Definition</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define typed attributes: Text, Number, Date, Currency, Dropdowns, Checkboxes, URLs, and Notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddField}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Field</span>
                </button>
              </div>

              {/* Fields Table */}
              <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Label</th>
                      <th className="px-5 py-3">Variable Name</th>
                      <th className="px-5 py-3">Data Type</th>
                      <th className="px-5 py-3">Required</th>
                      <th className="px-5 py-3">Options / Constraints</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {activeModule.fields.map((field) => (
                      <tr key={field.id} className="hover:bg-slate-800/40">
                        <td className="px-5 py-3.5 font-bold text-white">{field.label}</td>
                        <td className="px-5 py-3.5 font-mono text-emerald-400">{field.name}</td>
                        <td className="px-5 py-3.5 capitalize">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px]">
                            {field.type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {field.required ? (
                            <span className="text-emerald-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-slate-500">Optional</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                          {field.options && field.options.length > 0
                            ? field.options.join(', ')
                            : field.placeholder || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditField(field)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5 inline" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteField(field.id)}
                            className="text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: NAVIGATION & OPTIONAL MODULE VISIBILITY */}
          {activeBuilderTab === 'nav_settings' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
                <h4 className="text-sm font-bold text-white">
                  Portal Navigation & Optional Modules
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hide modules that are not relevant to your current stage or customize their display names.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PORTAL_STANDARD_MODULES.map((mod) => {
                    const isHidden = (navSettings.hiddenModules || []).includes(mod.key);
                    const currentLabel =
                      navSettings.customLabels?.[mod.key] || mod.label;

                    return (
                      <div
                        key={mod.key}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                          isHidden
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <input
                            type="text"
                            value={currentLabel}
                            onChange={(e) => handleCustomLabelChange(mod.key, e.target.value)}
                            className="bg-transparent font-bold text-white text-xs border-b border-transparent focus:border-emerald-500 focus:outline-none truncate w-full"
                          />
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Key: {mod.key}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleModuleHidden(mod.key)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border ${
                            isHidden
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {isHidden ? 'Hidden' : 'Visible'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* CREATE / EDIT MODULE MODAL */}
      <Modal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        title={editingModule ? `Edit Section: ${editingModule.name}` : 'Create New Custom Section'}
        subtitle="Define a custom tracking section for your Italian study abroad journey"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveModule} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Section Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Italian Language Prep (A1/A2)"
              value={moduleFormData.name || ''}
              onChange={(e) => setModuleFormData({ ...moduleFormData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Category Group</label>
            <select
              value={moduleFormData.categoryGroup || 'CUSTOM MODULES'}
              onChange={(e) =>
                setModuleFormData({ ...moduleFormData, categoryGroup: e.target.value as any })
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="COMMAND CENTER">COMMAND CENTER</option>
              <option value="ADMISSION & UNIVERSITIES">ADMISSION & UNIVERSITIES</option>
              <option value="SCHOLARSHIP & FINANCE">SCHOLARSHIP & FINANCE</option>
              <option value="DOCUMENTS & LEGALIZATION">DOCUMENTS & LEGALIZATION</option>
              <option value="VISA & EMBASSY">VISA & EMBASSY</option>
              <option value="RELOCATION & LIFE">RELOCATION & LIFE</option>
              <option value="DAILY PRODUCTIVITY">DAILY PRODUCTIVITY</option>
              <option value="CUSTOM MODULES">CUSTOM MODULES</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of what this section tracks..."
              value={moduleFormData.description || ''}
              onChange={(e) =>
                setModuleFormData({ ...moduleFormData, description: e.target.value })
              }
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModuleModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950"
            >
              {editingModule ? 'Update Section' : 'Create Section'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE / EDIT FIELD SCHEMA MODAL */}
      <Modal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        title={editingField ? `Edit Field: ${editingField.label}` : 'Add Field to Schema'}
        subtitle="Define data type and validation rules for this field"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveField} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Field Label *</label>
            <input
              type="text"
              required
              placeholder="e.g. Target Level, Study Hours"
              value={fieldFormData.label || ''}
              onChange={(e) => setFieldFormData({ ...fieldFormData, label: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Data Type</label>
            <select
              value={fieldFormData.type || 'text'}
              onChange={(e) =>
                setFieldFormData({ ...fieldFormData, type: e.target.value as CustomFieldType })
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            >
              <option value="text">Text (Single Line)</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="currency">Currency (€ EUR / ৳ BDT)</option>
              <option value="dropdown">Dropdown (Select Option)</option>
              <option value="checkbox">Checkbox (Yes / No)</option>
              <option value="url">URL Link</option>
              <option value="notes">Notes / Long Text</option>
              <option value="file">File Attachment / Reference</option>
            </select>
          </div>

          {fieldFormData.type === 'dropdown' && (
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Dropdown Options (Comma-separated) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. A1 Beginner, A2 Elementary, B1 Intermediate"
                value={fieldOptionsInput}
                onChange={(e) => setFieldOptionsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Placeholder Text</label>
            <input
              type="text"
              placeholder="e.g. Enter target university name..."
              value={fieldFormData.placeholder || ''}
              onChange={(e) =>
                setFieldFormData({ ...fieldFormData, placeholder: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={Boolean(fieldFormData.required)}
                onChange={(e) =>
                  setFieldFormData({ ...fieldFormData, required: e.target.checked })
                }
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
              />
              <span>Mark this field as Required</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsFieldModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950"
            >
              Save Field
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE / EDIT RECORD MODAL (DYNAMIC SCHEMA FORM) */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title={editingRecord ? 'Edit Entry' : `Add Entry to ${activeModule?.name || 'Section'}`}
        subtitle="Fill in fields based on this section's schema"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
          {activeModule?.fields.map((field) => {
            const val = recordFormData[field.id];

            if (field.type === 'dropdown') {
              return (
                <div key={field.id}>
                  <label className="block text-slate-400 mb-1 font-medium">
                    {field.label} {field.required && '*'}
                  </label>
                  <select
                    required={field.required}
                    value={val || ''}
                    onChange={(e) =>
                      setRecordFormData({ ...recordFormData, [field.id]: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="">Select option...</option>
                    {(field.options || []).map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.type === 'checkbox') {
              return (
                <div key={field.id} className="pt-1">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(val)}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, [field.id]: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                    />
                    <span className="font-medium">{field.label}</span>
                  </label>
                </div>
              );
            }

            if (field.type === 'notes') {
              return (
                <div key={field.id}>
                  <label className="block text-slate-400 mb-1 font-medium">
                    {field.label} {field.required && '*'}
                  </label>
                  <textarea
                    rows={3}
                    required={field.required}
                    placeholder={field.placeholder || ''}
                    value={val || ''}
                    onChange={(e) =>
                      setRecordFormData({ ...recordFormData, [field.id]: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              );
            }

            return (
              <div key={field.id}>
                <label className="block text-slate-400 mb-1 font-medium">
                  {field.label} {field.required && '*'}
                </label>
                <input
                  type={
                    field.type === 'number'
                      ? 'number'
                      : field.type === 'date'
                      ? 'date'
                      : field.type === 'url'
                      ? 'url'
                      : 'text'
                  }
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  value={val || ''}
                  onChange={(e) =>
                    setRecordFormData({ ...recordFormData, [field.id]: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            );
          })}

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950"
            >
              {editingRecord ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

