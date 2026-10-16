import React, { useState } from 'react';
import {
  AcademicDocument,
  DocumentCategory,
  DocumentStatus,
  DocumentVersion,
  UniversityApplication,
} from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck2,
  Edit2,
  Trash2,
  Paperclip,
  Check,
  Download,
  Upload,
  Eye,
  RefreshCw,
  AlertTriangle,
  Lock,
  Building2,
  History,
  FileSpreadsheet,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DocumentManagerViewProps {
  documents: AcademicDocument[];
  onAddDocument: (doc: AcademicDocument) => void;
  onUpdateDocument: (doc: AcademicDocument) => void;
  onDeleteDocument: (id: string) => void;
  applications?: UniversityApplication[];
}

const CATEGORIES: { key: DocumentCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Documents' },
  { key: 'academic', label: 'Academic & University' },
  { key: 'legalization', label: 'MOFA Attestation & CIMEA' },
  { key: 'sponsor_financial', label: 'Sponsor & Bank Proofs' },
  { key: 'scholarship_dsu', label: 'DSU / ISEE Parificato' },
  { key: 'universitaly', label: 'Universitaly Portal' },
  { key: 'visa', label: 'Embassy & Visa (VFS Dhaka)' },
];

const STATUS_OPTIONS: DocumentStatus[] = [
  'Not Started',
  'Draft',
  'Ready',
  'Attested / Legalized',
  'Submitted',
  'Verified',
];

export const DocumentManagerView: React.FC<DocumentManagerViewProps> = ({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  applications = [],
}) => {
  // Loaded applications for linking if not passed via props
  const universityApps =
    applications.length > 0 ? applications : StorageService.getApplications();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState<string>('all');
  const [selectedExpiryFilter, setSelectedExpiryFilter] = useState<'all' | 'expiring_soon' | 'expired' | 'valid'>('all');
  const [onlyPrivate, setOnlyPrivate] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AcademicDocument | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Preview Modal state
  const [previewDoc, setPreviewDoc] = useState<AcademicDocument | null>(null);

  // Replacement / Versioning Modal state
  const [replacingDoc, setReplacingDoc] = useState<AcademicDocument | null>(null);
  const [replacementFile, setReplacementFile] = useState<{
    name: string;
    size: string;
    dataUrl?: string;
    type?: string;
  } | null>(null);
  const [replacementVersionNote, setReplacementVersionNote] = useState('');

  // Version History Modal state
  const [historyDoc, setHistoryDoc] = useState<AcademicDocument | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form state
  const initialFormState: Partial<AcademicDocument> = {
    title: '',
    category: 'academic',
    status: 'Ready',
    requiredFor: ['University App'],
    issuingAuthority: 'University Registrar / Controller of Examinations',
    copiesCount: 2,
    notes: '',
    hasPhysicalCopy: true,
    hasDigitalCopy: true,
    expiryDate: '',
    fileReferenceName: '',
    fileSize: '',
    linkedUniversities: [],
    isPrivate: false,
  };

  const [formData, setFormData] = useState<Partial<AcademicDocument>>(initialFormState);
  const [reqInput, setReqInput] = useState('');

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: AcademicDocument) => {
    setEditingDoc(doc);
    setFormData({
      ...doc,
      linkedUniversities: doc.linkedUniversities || [],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
  };

  // Handle native file selection in form
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        fileReferenceName: file.name,
        fileSize: formattedSize,
        fileType: file.type || 'application/pdf',
        fileDataUrl: result,
        hasDigitalCopy: true,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingDoc) {
      const updated: AcademicDocument = {
        ...editingDoc,
        ...(formData as AcademicDocument),
      };
      onUpdateDocument(updated);
      showToast(`Updated "${updated.title}" successfully.`);
    } else {
      const newDocId = `doc-${Date.now()}`;
      const initialVersion: DocumentVersion = {
        versionNumber: 'v1.0',
        fileName: formData.fileReferenceName || `${formData.title.replace(/\s+/g, '_')}.pdf`,
        fileSize: formData.fileSize || '1.2 MB',
        uploadedAt: new Date().toISOString(),
        note: 'Initial verified document registration.',
        fileDataUrl: formData.fileDataUrl,
      };

      const created: AcademicDocument = {
        id: newDocId,
        title: formData.title!,
        category: formData.category || 'academic',
        status: formData.status || 'Not Started',
        requiredFor: formData.requiredFor || ['University App'],
        issuingAuthority: formData.issuingAuthority || 'Issuing Authority / University',
        copiesCount: Number(formData.copiesCount) || 1,
        notes: formData.notes || '',
        hasPhysicalCopy: Boolean(formData.hasPhysicalCopy),
        hasDigitalCopy: Boolean(formData.hasDigitalCopy),
        expiryDate: formData.expiryDate || undefined,
        fileReferenceName: formData.fileReferenceName || initialVersion.fileName,
        fileSize: formData.fileSize || initialVersion.fileSize,
        fileDataUrl: formData.fileDataUrl,
        fileType: formData.fileType || 'application/pdf',
        linkedUniversities: formData.linkedUniversities || [],
        isPrivate: Boolean(formData.isPrivate),
        versions: [initialVersion],
      };
      onAddDocument(created);
      showToast(`Added "${created.title}" to document vault.`);
    }
    handleCloseModal();
  };

  // Document Replacement & Versioning Handler
  const handleOpenReplacement = (doc: AcademicDocument) => {
    setReplacingDoc(doc);
    setReplacementFile(null);
    setReplacementVersionNote('');
  };

  const handleReplacementFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setReplacementFile({
        name: file.name,
        size: formattedSize,
        type: file.type,
        dataUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmReplacement = () => {
    if (!replacingDoc || !replacementFile) return;

    const existingVersions = replacingDoc.versions || [];
    const nextVerIndex = existingVersions.length + 1;
    const nextVersionNum = `v1.${nextVerIndex}`;

    const newVersion: DocumentVersion = {
      versionNumber: nextVersionNum,
      fileName: replacementFile.name,
      fileSize: replacementFile.size,
      uploadedAt: new Date().toISOString(),
      note: replacementVersionNote || 'Updated document version replaced.',
      fileDataUrl: replacementFile.dataUrl,
    };

    const updatedDoc: AcademicDocument = {
      ...replacingDoc,
      fileReferenceName: replacementFile.name,
      fileSize: replacementFile.size,
      fileDataUrl: replacementFile.dataUrl,
      fileType: replacementFile.type,
      hasDigitalCopy: true,
      lastReplacedAt: new Date().toISOString(),
      versions: [newVersion, ...existingVersions],
    };

    onUpdateDocument(updatedDoc);
    setReplacingDoc(null);
    setReplacementFile(null);
    showToast(`Replaced document with version ${nextVersionNum}!`);
  };

  // Quick Status change
  const handleQuickStatusChange = (doc: AcademicDocument, newStatus: DocumentStatus) => {
    const updated = { ...doc, status: newStatus };
    onUpdateDocument(updated);
    showToast(`Status updated to "${newStatus}" for ${doc.title}.`);
  };

  const handleAddReq = () => {
    if (!reqInput.trim()) return;
    const current = formData.requiredFor || [];
    setFormData({
      ...formData,
      requiredFor: [...current, reqInput.trim()],
    });
    setReqInput('');
  };

  const handleRemoveReq = (index: number) => {
    const current = formData.requiredFor || [];
    setFormData({
      ...formData,
      requiredFor: current.filter((_, i) => i !== index),
    });
  };

  const toggleLinkedUniversity = (uniName: string) => {
    const current = formData.linkedUniversities || [];
    if (current.includes(uniName)) {
      setFormData({
        ...formData,
        linkedUniversities: current.filter((u) => u !== uniName),
      });
    } else {
      setFormData({
        ...formData,
        linkedUniversities: [...current, uniName],
      });
    }
  };

  // Expiry calculation helper
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return { label: 'No Expiry / Permanent', color: 'slate', daysLeft: null };
    const today = new Date();
    const exp = new Date(expiryDate);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Expired (${Math.abs(diffDays)}d ago)`, color: 'rose', daysLeft: diffDays };
    }
    if (diffDays <= 90) {
      return { label: `Expiring Soon (${diffDays}d left)`, color: 'amber', daysLeft: diffDays };
    }
    return { label: `Valid (${diffDays}d left)`, color: 'emerald', daysLeft: diffDays };
  };

  // Safe Export of Document Checklist
  const handleExportChecklist = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      totalDocuments: documents.length,
      readyDocuments: documents.filter(
        (d) =>
          d.status === 'Ready' ||
          d.status === 'Verified' ||
          d.status === 'Attested / Legalized'
      ).length,
      documents: documents.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        status: d.status,
        issuingAuthority: d.issuingAuthority,
        copiesCount: d.copiesCount,
        hasPhysicalCopy: d.hasPhysicalCopy,
        hasDigitalCopy: d.hasDigitalCopy,
        expiryDate: d.expiryDate || 'N/A',
        linkedUniversities: d.linkedUniversities || [],
        versionsCount: d.versions?.length || 1,
        isPrivate: Boolean(d.isPrivate),
        notes: d.notes,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `italy-msc-document-dossier-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Document dossier JSON exported successfully.');
  };

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(search.toLowerCase()) ||
      doc.notes.toLowerCase().includes(search.toLowerCase()) ||
      (doc.fileReferenceName && doc.fileReferenceName.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || doc.status === selectedStatus;

    const matchUniversity =
      selectedUniversityFilter === 'all' ||
      (doc.linkedUniversities && doc.linkedUniversities.includes(selectedUniversityFilter));

    const expiryInfo = getExpiryStatus(doc.expiryDate);
    let matchExpiry = true;
    if (selectedExpiryFilter === 'expiring_soon') {
      matchExpiry = expiryInfo.color === 'amber';
    } else if (selectedExpiryFilter === 'expired') {
      matchExpiry = expiryInfo.color === 'rose';
    } else if (selectedExpiryFilter === 'valid') {
      matchExpiry = expiryInfo.color === 'emerald';
    }

    const matchPrivate = onlyPrivate ? Boolean(doc.isPrivate) : true;

    return matchSearch && matchCategory && matchStatus && matchUniversity && matchExpiry && matchPrivate;
  });

  const readyCount = documents.filter(
    (d) => d.status === 'Ready' || d.status === 'Verified' || d.status === 'Attested / Legalized'
  ).length;

  const expiringSoonCount = documents.filter((d) => {
    const s = getExpiryStatus(d.expiryDate);
    return s.color === 'amber';
  }).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
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
            <ShieldCheck className="w-4 h-4" />
            <span>Document Vault, Legalization & Version Control</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Advanced Document Manager</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Transcripts, syllabus breakdown, IELTS TRF, MOFA attestation, CIMEA comparability, and visa affidavits with live preview, version tracking, expiry alerts, and university linking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs">
            <div>
              <div className="text-[11px] text-slate-400">Readiness Score</div>
              <div className="font-bold text-emerald-400 text-sm">
                {readyCount} / {documents.length} Docs
              </div>
            </div>
            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width: `${documents.length ? Math.round((readyCount / documents.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportChecklist}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center space-x-1.5 transition-colors border border-slate-700/60"
            title="Export Document Dossier JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Dossier</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </button>
        </div>
      </div>

      {/* Expiry Alerts Notification Banner if any documents are expiring soon */}
      {expiringSoonCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">{expiringSoonCount} document(s) expiring within 90 days!</span>{' '}
              <span className="text-amber-300/80">
                Check IELTS validity (must cover initial semester) or Police Clearance certificate renewal.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedExpiryFilter('expiring_soon')}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-[11px] border border-amber-500/40 shrink-0"
          >
            View Expiring
          </button>
        </div>
      )}

      {/* Filters & Organization Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          {/* Search bar */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, authority, file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses ({documents.length})</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* University Linkage filter */}
          <div>
            <select
              value={selectedUniversityFilter}
              onChange={(e) => setSelectedUniversityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Linked Universities</option>
              {universityApps.map((app) => (
                <option key={app.id} value={app.universityName}>
                  {app.universityName}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry filter */}
          <div>
            <select
              value={selectedExpiryFilter}
              onChange={(e) => setSelectedExpiryFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Validity Periods</option>
              <option value="valid">Valid Documents Only</option>
              <option value="expiring_soon">Expiring within 90 days ({expiringSoonCount})</option>
              <option value="expired">Expired Documents</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Private Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  selectedCategory === c.key
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <label className="flex items-center space-x-2 text-slate-400 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={onlyPrivate}
              onChange={(e) => setOnlyPrivate(e.target.checked)}
              className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
            />
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Only Private / Confidential</span>
            </span>
          </label>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const expiryInfo = getExpiryStatus(doc.expiryDate);
          const versionsCount = doc.versions?.length || 1;

          return (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                {/* Header line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      {doc.isPrivate && (
                        <span title="Confidential: stored client-side">
                          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-white hover:text-emerald-300 transition-colors truncate">
                        {doc.title}
                      </h3>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{doc.issuingAuthority}</div>
                  </div>

                  {/* Interactive Status Dropdown */}
                  <select
                    value={doc.status}
                    onChange={(e) =>
                      handleQuickStatusChange(doc, e.target.value as DocumentStatus)
                    }
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border cursor-pointer bg-slate-950 focus:outline-none ${
                      doc.status === 'Verified'
                        ? 'border-emerald-500/40 text-emerald-300'
                        : doc.status === 'Ready'
                        ? 'border-teal-500/40 text-teal-300'
                        : doc.status === 'Attested / Legalized'
                        ? 'border-purple-500/40 text-purple-300'
                        : doc.status === 'Draft'
                        ? 'border-amber-500/40 text-amber-300'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Copies & Physical/Digital indicators */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800">
                    {doc.copiesCount} hard cop{doc.copiesCount > 1 ? 'ies' : 'y'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg border ${
                      doc.hasPhysicalCopy
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {doc.hasPhysicalCopy ? '✓ Hard Copy' : 'No Hard Copy'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg border ${
                      doc.hasDigitalCopy
                        ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {doc.hasDigitalCopy ? '✓ Scanned PDF' : 'No Soft PDF'}
                  </span>
                </div>

                {/* Expiry Pill */}
                {doc.expiryDate && (
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-slate-400">Expires:</span>
                    <span
                      className={`font-semibold px-2 py-0.2 rounded-md text-[10px] ${
                        expiryInfo.color === 'rose'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : expiryInfo.color === 'amber'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {doc.expiryDate} ({expiryInfo.label})
                    </span>
                  </div>
                )}

                {/* Linked Universities Chips */}
                {doc.linkedUniversities && doc.linkedUniversities.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-emerald-400" />
                      <span>Linked Universities:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doc.linkedUniversities.map((uni, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]"
                        >
                          {uni}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required for tag pills */}
                <div className="flex flex-wrap gap-1">
                  {doc.requiredFor.map((r, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/60"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                {/* Notes */}
                {doc.notes && (
                  <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                    {doc.notes}
                  </p>
                )}

                {/* Attached File Reference with Quick Actions */}
                {doc.fileReferenceName && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
                    <div className="flex items-center space-x-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-emerald-300 truncate">
                        {doc.fileReferenceName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 ml-2">
                      {doc.fileSize && (
                        <span className="text-slate-400 text-[10px]">{doc.fileSize}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 transition-colors"
                        title="Preview Document"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Versioning & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {/* Version trigger */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setHistoryDoc(doc)}
                    className="text-[10px] font-mono text-slate-400 hover:text-emerald-300 flex items-center space-x-1 transition-colors"
                    title="View version history"
                  >
                    <History className="w-3 h-3" />
                    <span>v1.{versionsCount > 1 ? versionsCount : 0} ({versionsCount} ver)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenReplacement(doc)}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5 hover:underline"
                    title="Replace with new file"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Replace</span>
                  </button>
                </div>

                {/* Edit & Delete actions */}
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(doc)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit document details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No documents match criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, status filters, or selected university stage.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSelectedUniversityFilter('all');
              setSelectedExpiryFilter('all');
              setOnlyPrivate(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add / Edit Document Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDoc ? `Edit: ${editingDoc.title}` : 'Add Academic Document'}
        subtitle="Manage legalization, file uploads, expiry reminders & university links"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Document Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Official Course Syllabus Breakdown (100% English MOI)"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Category</label>
              <select
                value={formData.category || 'academic'}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as DocumentCategory })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Status</label>
              <select
                value={formData.status || 'Not Started'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as DocumentStatus })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Issuing Authority</label>
              <input
                type="text"
                placeholder="e.g. University Controller of Examinations / MOFA Dhaka"
                value={formData.issuingAuthority || ''}
                onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Number of Physical Copies</label>
              <input
                type="number"
                min="1"
                value={formData.copiesCount ?? 1}
                onChange={(e) =>
                  setFormData({ ...formData, copiesCount: parseInt(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                E.g. IELTS test validity (+2 yrs) or Police Clearance (+6 mos).
              </span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Confidentiality / Privacy
              </label>
              <div className="pt-2">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isPrivate)}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                  />
                  <span>Mark as Confidential (Private Vault)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Real File Upload & Name */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <label className="block text-slate-300 font-bold text-xs flex items-center justify-between">
              <span>Upload / Attach Scanned Document File</span>
              <span className="text-[10px] text-emerald-400 font-normal">
                Supports PDF, JPG, PNG, DOCX
              </span>
            </label>

            <div className="flex items-center space-x-3">
              <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer border border-slate-700 flex items-center space-x-2 transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Choose Local File</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {formData.fileReferenceName ? (
                <div className="flex-1 min-w-0">
                  <div className="text-emerald-300 font-mono text-[11px] truncate">
                    {formData.fileReferenceName}
                  </div>
                  <div className="text-slate-400 text-[10px]">{formData.fileSize || 'Attached'}</div>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">No file chosen yet</span>
              )}
            </div>
          </div>

          {/* Hard / Soft copy flags */}
          <div className="flex items-center space-x-6 pt-1">
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.hasPhysicalCopy)}
                onChange={(e) => setFormData({ ...formData, hasPhysicalCopy: e.target.checked })}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
              />
              <span>I have Physical Printed Copies</span>
            </label>
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.hasDigitalCopy)}
                onChange={(e) => setFormData({ ...formData, hasDigitalCopy: e.target.checked })}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
              />
              <span>I have Digital Scanned PDF</span>
            </label>
          </div>

          {/* Link to University Applications */}
          {universityApps.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-slate-400 font-medium">
                Link to Targeted Italian Universities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                {universityApps.map((app) => {
                  const isChecked = (formData.linkedUniversities || []).includes(app.universityName);
                  return (
                    <label
                      key={app.id}
                      className="flex items-center space-x-2 text-slate-300 cursor-pointer text-[11px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLinkedUniversity(app.universityName)}
                        className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-900"
                      />
                      <span className="truncate" title={app.universityName}>
                        {app.universityName}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Required for stage tag list */}
          <div className="space-y-2">
            <label className="block text-slate-400 font-medium">Required For Stages</label>
            <div className="flex flex-wrap gap-1.5">
              {(formData.requiredFor || []).map((req, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs flex items-center space-x-1"
                >
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReq(idx)}
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
                placeholder="Add stage requirement (e.g. Universitaly, CIMEA, VFS Dhaka)..."
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
              <button
                type="button"
                onClick={handleAddReq}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Notes & Instructions</label>
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
              {editingDoc ? 'Update Document' : 'Save Document'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title={`Preview: ${previewDoc.title}`}
          subtitle={`File: ${previewDoc.fileReferenceName || 'Document Scanned Copy'} • ${previewDoc.fileSize || 'N/A'}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4 text-xs">
            {/* If data URL exists and is an image */}
            {previewDoc.fileDataUrl && previewDoc.fileDataUrl.startsWith('data:image') ? (
              <div className="max-h-96 overflow-auto rounded-2xl bg-slate-950 border border-slate-800 p-2 flex justify-center">
                <img
                  src={previewDoc.fileDataUrl}
                  alt={previewDoc.title}
                  className="max-h-96 object-contain rounded-lg"
                />
              </div>
            ) : (
              /* Simulated High-Fidelity Document Viewer */
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{previewDoc.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        Authority: {previewDoc.issuingAuthority}
                      </p>
                    </div>
                  </div>
                  <Badge variant="emerald" size="sm">
                    {previewDoc.status}
                  </Badge>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800/80 space-y-2 font-mono text-[11px]">
                  <div className="text-slate-400"># OFFICIAL DOCUMENT VERIFICATION SHEET</div>
                  <div className="text-white">Document ID: {previewDoc.id}</div>
                  <div className="text-white">Reference File: {previewDoc.fileReferenceName}</div>
                  <div className="text-white">Hard Copies In Custody: {previewDoc.copiesCount}</div>
                  <div className="text-white">
                    Attestation Status: {previewDoc.status === 'Attested / Legalized' ? '✓ MOFA & CIMEA Validated' : 'Pending Formal Attestation'}
                  </div>
                  {previewDoc.notes && (
                    <div className="text-emerald-400 pt-1">Notes: {previewDoc.notes}</div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Confidentiality: Client-side local storage only</span>
                  <span>Document Hash: {previewDoc.id}-2027-IT</span>
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-slate-400 text-[11px]">
                Versions logged: {previewDoc.versions?.length || 1}
              </span>
              <div className="flex items-center space-x-2">
                {previewDoc.fileDataUrl ? (
                  <a
                    href={previewDoc.fileDataUrl}
                    download={previewDoc.fileReferenceName || `${previewDoc.title}.pdf`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Mock file download for ${previewDoc.title} initiated.`);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Copy</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Document Replacement & Version Bump Modal */}
      {replacingDoc && (
        <Modal
          isOpen={Boolean(replacingDoc)}
          onClose={() => setReplacingDoc(null)}
          title={`Replace Document File: ${replacingDoc.title}`}
          subtitle="Upload a new attested or stamped copy. Previous versions will be archived in version history."
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-400">Current Active File:</div>
              <div className="font-mono text-emerald-300 text-sm">
                {replacingDoc.fileReferenceName || 'No file attached'} ({replacingDoc.fileSize || 'N/A'})
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-bold">Select New Replacement File</label>
              <label className="block w-full p-4 rounded-xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 cursor-pointer text-center transition-colors">
                <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-slate-200 font-medium block">
                  Click to choose new document file
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  PDF, PNG, JPG (e.g. MOFA-attested transcript or newly issued certificate)
                </span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleReplacementFileSelect}
                  className="hidden"
                />
              </label>

              {replacementFile && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-200">
                  <div className="font-mono truncate">{replacementFile.name}</div>
                  <div className="text-[10px] font-bold shrink-0 ml-2">{replacementFile.size}</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Version Note / What Changed?
              </label>
              <input
                type="text"
                placeholder="e.g. Added official stamp from Controller of Examinations and MOFA attestation"
                value={replacementVersionNote}
                onChange={(e) => setReplacementVersionNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setReplacingDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!replacementFile}
                onClick={handleConfirmReplacement}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950"
              >
                Save & Bump Version
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Version History Modal */}
      {historyDoc && (
        <Modal
          isOpen={Boolean(historyDoc)}
          onClose={() => setHistoryDoc(null)}
          title={`Version History: ${historyDoc.title}`}
          subtitle="Audit log of all uploaded file revisions"
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-3">
              {(historyDoc.versions && historyDoc.versions.length > 0 ? historyDoc.versions : [
                {
                  versionNumber: 'v1.0',
                  fileName: historyDoc.fileReferenceName || 'Initial upload',
                  fileSize: historyDoc.fileSize || '1.0 MB',
                  uploadedAt: new Date().toISOString(),
                  note: 'Initial verified document',
                },
              ]).map((ver, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {ver.versionNumber}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(ver.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-white font-mono text-[11px] truncate">
                    {ver.fileName} {ver.fileSize ? `(${ver.fileSize})` : ''}
                  </div>

                  {ver.note && <div className="text-slate-400 text-[11px]">{ver.note}</div>}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setHistoryDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Document?"
        subtitle="This action cannot be undone."
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Are you sure you want to remove this document record and all its version history from your manager?
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
                if (deleteConfirmId) {
                  onDeleteDocument(deleteConfirmId);
                  showToast('Document deleted.');
                }
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

