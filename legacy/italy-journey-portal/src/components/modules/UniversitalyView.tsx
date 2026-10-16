import React, { useState } from 'react';
import { UniversitalyRecord, UniversitalyStatus, UniversityApplication } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Globe2,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Save,
  Check,
  Building,
  Calendar,
  Download,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface UniversitalyViewProps {
  applications?: UniversityApplication[];
  onNavigate?: (module: 'applications' | 'cimea_dov' | 'embassy_visa') => void;
}

export const UniversitalyView: React.FC<UniversitalyViewProps> = ({
  applications = [],
  onNavigate,
}) => {
  // Load persistent Universitaly record from StorageService
  const [record, setRecord] = useState<UniversitalyRecord>(() =>
    StorageService.getUniversitalyRecord()
  );
  const [showSavedToast, setShowSavedToast] = useState(false);

  const toggleCheck = (id: string) => {
    const updatedChecklist = record.checklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );

    const updatedRecord: UniversitalyRecord = {
      ...record,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
    };

    setRecord(updatedRecord);
    StorageService.saveUniversitalyRecord(updatedRecord);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecord: UniversitalyRecord = {
      ...record,
      updatedAt: new Date().toISOString(),
    };
    setRecord(updatedRecord);
    StorageService.saveUniversitalyRecord(updatedRecord);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const completedCount = record.checklist.filter((c) => c.checked).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl flex items-center space-x-2 border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Universitaly Dossier Details & Checklist Saved!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Globe2 className="w-4 h-4" />
            <span>Ministry of Universities and Research (MUR) Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Universitaly Pre-enrolment Workflow (2027/2028)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Every non-EU international applicant must complete pre-enrolment on Universitaly.it. Once approved by your target Italian university, the official Summary Form (Riepilogo) is generated for VFS Dhaka submission.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://www.universitaly.it"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
          >
            <span>Go to Universitaly.it</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Critical Ministerial Rule Notice */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-start space-x-3.5 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-amber-300">
            Crucial Ministerial Rule: Universitaly Permits Only 1 Active Pre-enrolment Submission
          </div>
          <p className="text-slate-400 leading-relaxed">
            While you can apply to multiple universities directly through their internal application portals (e.g. PoliTO, UNIBO, UniPi, UniPd), Italian law dictates that you can submit <strong>ONE</strong> single pre-enrolment on Universitaly for visa endorsement. If you change your selected admitting university later, the initial university must cancel their validation before you can submit to another.
          </p>
        </div>
      </div>

      {/* Active Pre-enrolment Dossier Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Pre-enrolment Dossier Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Configure your designated admitting public university and consular post
              </p>
            </div>
          </div>

          <Badge variant="emerald" size="xs">
            {record.status}
          </Badge>
        </div>

        <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Universitaly Login Email</label>
              <input
                type="email"
                value={record.accountEmail}
                onChange={(e) => setRecord({ ...record, accountEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">
                Designated Admitting University
              </label>
              <input
                type="text"
                value={record.targetUniversity}
                onChange={(e) => setRecord({ ...record, targetUniversity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">
                MSc Programme Title
              </label>
              <input
                type="text"
                value={record.targetDegree}
                onChange={(e) => setRecord({ ...record, targetDegree: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">
                Consular Post (Embassy / Consulate)
              </label>
              <input
                type="text"
                value={record.consularPost}
                onChange={(e) => setRecord({ ...record, consularPost: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">
                Universitaly Application Code
              </label>
              <input
                type="text"
                value={record.applicationCode}
                onChange={(e) => setRecord({ ...record, applicationCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                placeholder="e.g. UNIV-2027-BD-XXXX"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Dossier Approval Status</label>
              <select
                value={record.status}
                onChange={(e) =>
                  setRecord({ ...record, status: e.target.value as UniversitalyStatus })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="Draft">Draft on Universitaly</option>
                <option value="Submitted to University">Submitted to University</option>
                <option value="Under Evaluation by Faculty">Under Evaluation by Faculty</option>
                <option value="Approved (Riepilogo Issued)">Approved (Riepilogo Issued)</option>
                <option value="Forwarded to Embassy Dhaka">Forwarded to Embassy Dhaka</option>
                <option value="Rejected by University">Rejected by University</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={record.riepilogoPdfDownloaded}
                onChange={(e) =>
                  setRecord({ ...record, riepilogoPdfDownloaded: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
              />
              <span className="font-medium">
                Official Summary Form (Riepilogo pre-iscrizione PDF) downloaded and printed
              </span>
            </label>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Dossier Notes</label>
            <textarea
              rows={2}
              value={record.notes}
              onChange={(e) => setRecord({ ...record, notes: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500"
              placeholder="Notes on communication with university International Office..."
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Save className="w-4 h-4" />}
            >
              Save Universitaly Dossier
            </Button>
          </div>
        </form>
      </div>

      {/* Step by Step Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-emerald-400">Step 1</div>
          <h4 className="text-sm font-bold text-white">Register Universitaly Account</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Register on Universitaly.it using your primary email. Fill personal details matching your valid international passport verbatim.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-emerald-400">Step 2</div>
          <h4 className="text-sm font-bold text-white">Fill Pre-enrolment Form (Step A/B/C)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select 2027/2028 academic year, Laurea Magistrale (MSc 2-year), target public university, and select "Italian Embassy in Dhaka" as your consular destination.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-emerald-400">Step 3</div>
          <h4 className="text-sm font-bold text-white">Download Summary (Riepilogo)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Once your Italian university approves the dossier, the portal enables the download of the official Summary Form. This PDF is submitted to VFS Italy Dhaka.
          </p>
        </div>
      </div>

      {/* Interactive Readiness Checklist with Persistence */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white">
              Universitaly Pre-enrolment Checklist
            </h3>
            <p className="text-xs text-slate-400">
              Ensure all prerequisite documents are uploaded to Universitaly Step C
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-400 font-mono">
            {completedCount} / {record.checklist.length} Completed
          </div>
        </div>

        <div className="space-y-2">
          {record.checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer group transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    item.checked
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-700 bg-slate-900 group-hover:border-emerald-500'
                  }`}
                >
                  {item.checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-xs font-medium ${
                    item.checked ? 'text-slate-400 line-through' : 'text-slate-200'
                  }`}
                >
                  {item.text}
                </span>
              </div>
              <Badge variant={item.checked ? 'emerald' : 'slate'} size="xs">
                {item.checked ? 'Ready' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

