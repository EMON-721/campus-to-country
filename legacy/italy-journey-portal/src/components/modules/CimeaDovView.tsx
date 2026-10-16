import React, { useState } from 'react';
import { CimeaStep } from '../../types';
import { StorageService } from '../../services/storage';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  ArrowRight,
  Building,
  Save,
  Check,
  Search,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const CimeaDovView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cimea' | 'dov' | 'apostille'>('cimea');

  // Load steps from persistent StorageService
  const [steps, setSteps] = useState<CimeaStep[]>(() => StorageService.getCimeaSteps());
  const [showSavedToast, setShowSavedToast] = useState(false);

  // CIMEA Dossier Tracking State
  const [dossierNumber, setDossierNumber] = useState('CIMEA-2027-BD-4410');
  const [comparabilityOrdered, setComparabilityOrdered] = useState(false);
  const [verificationOrdered, setVerificationOrdered] = useState(false);

  const toggleStep = (id: number) => {
    const updated = steps.map((s) => {
      if (s.id === id) {
        const next: 'Completed' | 'In Progress' | 'Pending' =
          s.status === 'Completed'
            ? 'Pending'
            : s.status === 'Pending'
            ? 'In Progress'
            : 'Completed';
        return { ...s, status: next };
      }
      return s;
    });

    setSteps(updated);
    StorageService.saveCimeaSteps(updated);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const completedStepsCount = steps.filter((s) => s.status === 'Completed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl flex items-center space-x-2 border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Credential Legalization Progress Saved!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>Academic Credential Evaluation for Italy</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            CIMEA, DOV & Legalization Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Italian law mandates that foreign undergraduate qualifications must be certified through either CIMEA digital certificates (recommended) or the Italian Embassy Declaration of Value (DOV).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="https://cimea.diplo-me.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-2 transition-colors shadow-md shadow-emerald-950"
          >
            <span>Open CIMEA DiploME</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Pathway Comparison Tabs */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('cimea')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'cimea'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          CIMEA Digital DiploME (Fastest & 100% Online)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dov')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'dov'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Declaration of Value (DOV - Embassy Dhaka)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('apostille')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'apostille'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Bangladesh MOFA & Apostille Updates
        </button>
      </div>

      {activeTab === 'cimea' && (
        <div className="space-y-6">
          {/* CIMEA Active Dossier Tracker Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  CIMEA DiploME Active Dossier Tracking
                </h3>
              </div>
              <Badge variant="emerald" size="xs">
                {completedStepsCount} / {steps.length} Steps Completed
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">CIMEA Account Email</label>
                <input
                  type="email"
                  placeholder="applicant@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">DiploME Dossier Reference #</label>
                <input
                  type="text"
                  value={dossierNumber}
                  onChange={(e) => setDossierNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target University Recipient</label>
                <input
                  type="text"
                  defaultValue="Politecnico di Torino (PoliTO)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={comparabilityOrdered}
                  onChange={(e) => setComparabilityOrdered(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
                />
                <span>Statement of Comparability (Attestato di Comparabilità) Ordered</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={verificationOrdered}
                  onChange={(e) => setVerificationOrdered(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
                />
                <span>Statement of Verification (Attestato di Verifica) Ordered</span>
              </label>
            </div>
          </div>

          {/* Interactive Steps Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Step-by-Step Legalization & CIMEA Execution Plan
            </h3>

            <div className="space-y-3">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    s.status === 'Completed'
                      ? 'bg-slate-950/60 border-slate-800/80'
                      : s.status === 'In Progress'
                      ? 'bg-slate-900 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <button
                        type="button"
                        onClick={() => toggleStep(s.id)}
                        className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                          s.status === 'Completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : s.status === 'In Progress'
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'border-slate-700 bg-slate-950 hover:border-emerald-500'
                        }`}
                        title="Toggle status: Pending -> In Progress -> Completed"
                      >
                        {s.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                        {s.status === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            Step {s.id}
                          </span>
                          <h4
                            className={`text-sm font-bold ${
                              s.status === 'Completed'
                                ? 'text-slate-400 line-through'
                                : 'text-white'
                            }`}
                          >
                            {s.title}
                          </h4>
                        </div>

                        <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                          <span>Authority: {s.authority}</span>
                          <span>Timeline: {s.timeline}</span>
                          <span>Cost: {s.cost}</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed pt-1">
                          {s.instructions}
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-auto shrink-0">
                      <Badge
                        variant={
                          s.status === 'Completed'
                            ? 'emerald'
                            : s.status === 'In Progress'
                            ? 'amber'
                            : 'slate'
                        }
                        size="xs"
                      >
                        {s.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dov' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Declaration of Value (Dichiarazione di Valore - DOV) via Embassy of Italy in Dhaka
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The DOV is an official document issued directly by the Consular Section of the Italian Embassy in Dhaka, stating that your Bangladeshi degree corresponds to Italian standards.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white">DOV Submission Requirements at VFS Italy Dhaka:</h4>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>Original BSc Certificate & Transcript, attested by Bangladesh MOE & MOFA Segunbagicha.</li>
              <li>Official Italian translation by an Embassy-recognized translator in Dhaka.</li>
              <li>Two photocopies of all original documents and translations.</li>
              <li>Copy of Bangladeshi passport and Universitaly summary application form.</li>
              <li>Issuance time: Can take anywhere from 3 weeks to 2 months during peak summer intake.</li>
            </ul>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <strong className="block mb-0.5">Expert Tip for 2027/2028:</strong>
              Most Italian public universities (PoliTO, UNIBO, UniPi, UNIPD) now explicitly prefer and accept <strong>CIMEA DiploME</strong> over Embassy DOV because CIMEA is processed 100% digitally with verifiable cryptographic QR codes.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'apostille' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-teal-400">
            <Info className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bangladesh Apostille Convention Legalization Updates
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Bangladesh deposited its accession to the 1961 Hague Apostille Convention. The Ministry of Foreign Affairs (MOFA) Dhaka is rolling out electronic Apostille (e-Apostille) verification for educational and commercial certificates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white">Standard Procedure (Segunbagicha MOFA):</h4>
              <p className="text-slate-300 leading-relaxed">
                Until universal e-Apostille integration is fully recognized by all Italian universities, standard consular legalization with MOFA barcode sticker remains 100% accepted by both CIMEA and the Italian Embassy in Dhaka.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white">Verification Protocol:</h4>
              <p className="text-slate-300 leading-relaxed">
                Always ensure your university official transcripts have the Controller of Examination or Registrar signature before heading to the Ministry of Education (MOE) and MOFA.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

