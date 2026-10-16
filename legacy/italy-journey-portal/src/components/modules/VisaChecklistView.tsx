import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Check,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Download,
  RotateCcw,
  ExternalLink,
  Info,
  Calendar,
  Building,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { VisaCheckItem } from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const VisaChecklistView: React.FC = () => {
  const [items, setItems] = useState<VisaCheckItem[]>(() => StorageService.getVisaCheckItems());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VisaCheckItem | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [mandatoryOnly, setMandatoryOnly] = useState<boolean>(false);
  const [showSyncSuccessToast, setShowSyncSuccessToast] = useState(false);

  // Form State
  const [formCategory, setFormCategory] = useState('Forms & Identification');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formMandatory, setFormMandatory] = useState(true);
  const [formStatus, setFormStatus] = useState<'Ready' | 'In Progress' | 'Missing'>('In Progress');

  useEffect(() => {
    const handleStorage = () => setItems(StorageService.getVisaCheckItems());
    window.addEventListener('italy_msc_storage_changed', handleStorage);
    return () => window.removeEventListener('italy_msc_storage_changed', handleStorage);
  }, []);

  const toggleStatus = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const next: 'Ready' | 'In Progress' | 'Missing' =
          item.status === 'Ready'
            ? 'In Progress'
            : item.status === 'In Progress'
            ? 'Missing'
            : 'Ready';
        return { ...item, status: next };
      }
      return item;
    });
    setItems(updated);
    StorageService.saveVisaCheckItems(updated);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      const updated: VisaCheckItem = {
        ...editingItem,
        category: formCategory,
        title: formTitle.trim(),
        description: formDesc.trim(),
        notes: formNotes.trim() || undefined,
        isMandatory: formMandatory,
        status: formStatus,
      };
      StorageService.updateVisaCheckItem(updated);
      setItems(StorageService.getVisaCheckItems());
      setEditingItem(null);
    } else {
      const newItem: VisaCheckItem = {
        id: `v-${Date.now()}`,
        category: formCategory,
        title: formTitle.trim(),
        description: formDesc.trim(),
        notes: formNotes.trim() || undefined,
        isMandatory: formMandatory,
        status: formStatus,
      };
      StorageService.addVisaCheckItem(newItem);
      setItems(StorageService.getVisaCheckItems());
    }

    setFormTitle('');
    setFormDesc('');
    setFormNotes('');
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this visa checklist item?')) {
      StorageService.deleteVisaCheckItem(id);
      setItems(StorageService.getVisaCheckItems());
    }
  };

  const openEdit = (item: VisaCheckItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormDesc(item.description);
    setFormNotes(item.notes || '');
    setFormMandatory(item.isMandatory);
    setFormStatus(item.status);
    setIsAddModalOpen(true);
  };

  const handleResetToOfficialEmbassyChecklist = () => {
    if (
      window.confirm(
        'Reload the official 23-point Italian Embassy & VFS Global student visa checklist? This will restore all standard Embassy requirements.'
      )
    ) {
      const restored = StorageService.resetVisaCheckItemsToOfficial();
      setItems(restored);
      setShowSyncSuccessToast(true);
      setTimeout(() => setShowSyncSuccessToast(false), 3000);
    }
  };

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => set.add(item.category));
    return ['all', ...Array.from(set)];
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesMandatory = !mandatoryOnly || item.isMandatory;

      return matchesSearch && matchesCategory && matchesStatus && matchesMandatory;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus, mandatoryOnly]);

  const readyCount = items.filter((i) => i.status === 'Ready').length;
  const inProgressCount = items.filter((i) => i.status === 'In Progress').length;
  const missingCount = items.filter((i) => i.status === 'Missing').length;
  const mandatoryCount = items.filter((i) => i.isMandatory).length;
  const optionalCount = items.filter((i) => !i.isMandatory).length;
  const progressPercent = items.length > 0 ? Math.round((readyCount / items.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-slate-100">
      {/* Toast Alert */}
      {showSyncSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl flex items-center space-x-2 border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Official 23-Point Embassy Visa Checklist Reloaded!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Embassy of Italy & VFS Global Dhaka • National Type D Student Visa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Official 23-Point Visa Document Checklist
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every required and conditional document for your Italian student visa appointment. Includes 12-month bank statements, apostilled civil & academic credentials, CIMEA comparability, and Welcome Association Italy insurance.
          </p>
        </div>

        {/* Readiness Meter & Top Controls */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 w-full sm:w-auto min-w-[240px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Dossier Readiness</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{readyCount} Ready</span>
              <span>{inProgressCount} In Progress</span>
              <span>{missingCount} Missing</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-semibold flex-1 sm:flex-none"
              title="Print checklist for VFS submission"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>Print Checklist</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToOfficialEmbassyChecklist}
              className="text-xs font-semibold flex-1 sm:flex-none text-slate-300 hover:text-white"
              title="Reload standard 23 documents"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>Sync Official 23</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingItem(null);
                setFormTitle('');
                setFormDesc('');
                setFormNotes('');
                setFormCategory('Forms & Identification');
                setFormMandatory(true);
                setFormStatus('In Progress');
                setIsAddModalOpen(true);
              }}
              className="text-xs font-semibold flex-1 sm:flex-none"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Document</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Official Embassy Highlights Alert Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Key Italian Consular Regulations & Notice for Study Visa Applicants</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 text-[11px] leading-relaxed pt-1">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1">
            <strong className="text-white block">1. 12-Month Bank Statement Rule</strong>
            <span>
              Both sponsor and applicant must submit 12 continuous months of bank statements with genuine transaction history and bank solvency certificate.
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1">
            <strong className="text-white block">2. MOFA Apostille Authentication</strong>
            <span>
              All educational certificates, marksheets, Father's NID copy, birth certificates, and family relationship certificates must bear official MOFA Apostille.
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1">
            <strong className="text-white block">3. CIMEA DiploME Verification</strong>
            <span>
              Submit the Statement of Comparability and Verification issued by CIMEA along with the €300 bank/credit card payment receipt slip.
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search document title, notes, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Document Categories ({categories.length - 1})</option>
              {categories.filter((c) => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses ({items.length})</option>
              <option value="Ready">Ready ({readyCount})</option>
              <option value="In Progress">In Progress ({inProgressCount})</option>
              <option value="Missing">Missing ({missingCount})</option>
            </select>
          </div>

          {/* Mandatory Checkbox */}
          <div className="flex items-center justify-between sm:justify-end gap-3 px-1">
            <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={mandatoryOnly}
                onChange={(e) => setMandatoryOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Mandatory Only ({mandatoryCount})</span>
            </label>

            {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || mandatoryOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setMandatoryOnly(false);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <span>
            Showing <strong className="text-white font-semibold">{filteredItems.length}</strong> of {items.length} documents
          </span>
          <span className="text-[11px] text-slate-400">
            {mandatoryCount} Mandatory Required • {optionalCount} Conditional / Optional
          </span>
        </div>
      </div>

      {/* 23-Point Checklist List */}
      <div className="space-y-3.5">
        {filteredItems.map((item, index) => {
          const statusBg =
            item.status === 'Ready'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : item.status === 'In Progress'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/30';

          return (
            <div
              key={item.id}
              onClick={() => toggleStatus(item.id)}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4 group hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-start space-x-4 flex-1">
                {/* Status Toggle Box */}
                <div
                  className={`mt-1 w-6 h-6 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${
                    item.status === 'Ready'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-950'
                      : item.status === 'In Progress'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-700 text-slate-500 group-hover:border-slate-500'
                  }`}
                  title="Click to toggle status"
                >
                  {item.status === 'Ready' && <Check className="w-4 h-4 stroke-[2.5]" />}
                  {item.status === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                  {item.status === 'Missing' && <span className="text-xs font-bold font-mono">!</span>}
                </div>

                {/* Content */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                      {item.title}
                    </h3>

                    {item.isMandatory ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                        Mandatory
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                        Conditional / Optional
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-medium">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Consular Tip / Notes */}
                  {item.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2 mt-2">
                      <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed text-slate-300">{item.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge & Controls */}
              <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${statusBg}`}>
                  {item.status}
                </span>

                <button
                  type="button"
                  onClick={(e) => openEdit(item, e)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Edit document specification"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Checklist Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingItem ? 'Edit Visa Checklist Document' : 'Add Visa Checklist Document'}
        subtitle="Custom document requirement for Italian student visa submission"
      >
        <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Document Category *
            </label>
            <input
              type="text"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Forms & Identification, Financial Solvency (12 Months)"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 12-Month Bank Statement of Sponsor"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Official Description & Specifications *
            </label>
            <textarea
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Detailed embassy instructions, format, required stamps..."
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Consular Tip / Special Notes (Optional)
            </label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Must be stamped and signed on every page by authorized bank officers"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Preparation Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Ready">Ready</option>
                <option value="In Progress">In Progress</option>
                <option value="Missing">Missing</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Requirement Type
              </label>
              <select
                value={formMandatory ? 'mandatory' : 'optional'}
                onChange={(e) => setFormMandatory(e.target.value === 'mandatory')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="mandatory">Mandatory (Required)</option>
                <option value="optional">Conditional / Optional</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingItem ? 'Save Changes' : 'Add Document'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

