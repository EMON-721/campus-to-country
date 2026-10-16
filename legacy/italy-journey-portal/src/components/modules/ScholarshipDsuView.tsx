import React, { useState } from 'react';
import { regionalScholarships } from '../../data/mockData';
import { DsuApplication, DsuApplicationStatus } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Coins,
  Calculator,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  FileText,
  Building,
  Save,
  Check,
  ShieldCheck,
  Clock,
  Landmark,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ScholarshipDsuViewProps {
  onNavigate?: (module: 'documents' | 'applications') => void;
}

export const ScholarshipDsuView: React.FC<ScholarshipDsuViewProps> = ({ onNavigate }) => {
  // Interactive ISEE Parificato Calculator state
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [annualFamilyIncomeBdt, setAnnualFamilyIncomeBdt] = useState<number>(900000); // 9 Lakh BDT
  const [propertyValueBdt, setPropertyValueBdt] = useState<number>(2000000); // 20 Lakh BDT
  const [bankBalanceBdt, setBankBalanceBdt] = useState<number>(500000); // 5 Lakh BDT

  // Personal DSU Application Tracker state loaded from StorageService
  const [dsuApp, setDsuApp] = useState<DsuApplication>(() =>
    StorageService.getDsuApplication()
  );
  const [showSavedToast, setShowSavedToast] = useState(false);

  const EUR_RATE = 132; // 1 EUR = 132 BDT approx

  // Standard Italian Equivalence Scale coefficients:
  // 1 member: 1.00, 2: 1.57, 3: 2.04, 4: 2.46, 5: 2.85, 6+: 3.20
  const getParametroScala = (members: number) => {
    switch (members) {
      case 1:
        return 1.0;
      case 2:
        return 1.57;
      case 3:
        return 2.04;
      case 4:
        return 2.46;
      case 5:
        return 2.85;
      default:
        return 3.2;
    }
  };

  const incomeEur = Math.round(annualFamilyIncomeBdt / EUR_RATE);
  const propertyEur = Math.round(propertyValueBdt / EUR_RATE);
  const movableEur = Math.round(bankBalanceBdt / EUR_RATE);

  // Italian ISEE formula:
  // ISR (Reddito) + 20% of ISP (Patrimonio) divided by scale
  const scale = getParametroScala(familyMembers);
  const totalAssetsEur = propertyEur + movableEur;
  const iseeEstimateEur = Math.round((incomeEur + totalAssetsEur * 0.2) / scale);

  const isFullEligible = iseeEstimateEur < 15000;
  const isPartialEligible = iseeEstimateEur >= 15000 && iseeEstimateEur <= 26000;

  const handleSaveDsuApp = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DsuApplication = {
      ...dsuApp,
      updatedAt: new Date().toISOString(),
    };
    setDsuApp(updated);
    StorageService.saveDsuApplication(updated);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleApplyEstimateToDsu = () => {
    setDsuApp((prev) => ({
      ...prev,
      iseeParificatoEur: iseeEstimateEur,
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl flex items-center space-x-2 border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>DSU Application Saved & Persisted in Storage!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Coins className="w-4 h-4" />
            <span>Right to University Study (Diritto allo Studio Universitario)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Italian Regional Scholarship (DSU) & ISEE Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Italy guarantees financial aid, university fee exemptions (€0 tuition), subsidized meals, and non-repayable annual stipends based on foreign family income (ISEE Parificato).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Badge variant="emerald" size="xs">
            €0 Tuition Exemption
          </Badge>
          <Badge variant="amber" size="xs">
            Free Daily Meals
          </Badge>
          <Badge variant="sky" size="xs">
            Cash Stipend
          </Badge>
        </div>
      </div>

      {/* Personal DSU Application Tracker (Active Working Form with Persistence) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                My Regional DSU Application Tracker
              </h3>
              <p className="text-xs text-slate-400">
                Manage your agency application, CAF office verification, and ranking outcome
              </p>
            </div>
          </div>

          <Badge variant="emerald" size="xs">
            {dsuApp.status}
          </Badge>
        </div>

        <form onSubmit={handleSaveDsuApp} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Target DSU Agency</label>
              <select
                value={dsuApp.agencyName}
                onChange={(e) => setDsuApp({ ...dsuApp, agencyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="EDISU Piemonte">EDISU Piemonte (Politecnico di Torino, UniTo)</option>
                <option value="ER.GO Emilia-Romagna">ER.GO (University of Bologna - UNIBO)</option>
                <option value="DSU Toscana">DSU Toscana (Pisa - UNIPI, Florence)</option>
                <option value="DiSCo Lazio">DiSCo Lazio (Sapienza Rome, Tor Vergata)</option>
                <option value="ALiSEO Liguria">ALiSEO Liguria (University of Genoa - UniGe)</option>
                <option value="ESU Padova">ESU Padova (University of Padua - UNIPD)</option>
                <option value="ESU Venezia">ESU Venezia (Ca' Foscari)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Application Status</label>
              <select
                value={dsuApp.status}
                onChange={(e) =>
                  setDsuApp({ ...dsuApp, status: e.target.value as DsuApplicationStatus })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="Documents Preparation">Documents Preparation</option>
                <option value="ISEE Parificato Issued">ISEE Parificato Issued by CAF</option>
                <option value="Submitted to Agency">Submitted to Agency</option>
                <option value="Provisional Ranking (Idoneo)">Provisional Ranking (Idoneo)</option>
                <option value="Provisional Winner (Assegnatario)">Provisional Winner (Assegnatario)</option>
                <option value="Final Winner (Beneficiario Borsa)">Final Winner (Beneficiario Borsa)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Application Deadline</label>
              <input
                type="date"
                value={dsuApp.applicationDeadline}
                onChange={(e) => setDsuApp({ ...dsuApp, applicationDeadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">CAF Office Utilized</label>
              <input
                type="text"
                placeholder="e.g. CAF CISL / CAF ACLI / Online Convenzionato"
                value={dsuApp.cafOfficeUsed}
                onChange={(e) => setDsuApp({ ...dsuApp, cafOfficeUsed: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">
                Official ISEE Parificato (€ EUR)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={dsuApp.iseeParificatoEur}
                  onChange={(e) =>
                    setDsuApp({ ...dsuApp, iseeParificatoEur: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-bold font-mono focus:outline-none focus:border-emerald-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleApplyEstimateToDsu}
                  title="Copy calculated estimate into field"
                >
                  Use Est.
                </Button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">
                CAF Protocol Reference #
              </label>
              <input
                type="text"
                placeholder="e.g. ISEE-2027-BD-XXXX"
                value={dsuApp.protocolNumber}
                onChange={(e) => setDsuApp({ ...dsuApp, protocolNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dsuApp.freeMealRequested}
                onChange={(e) => setDsuApp({ ...dsuApp, freeMealRequested: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
              />
              <span className="text-slate-300 font-medium">
                Include Daily Canteen Meals Allowance (Mensa Universitaria)
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dsuApp.dormAccommodationRequested}
                onChange={(e) =>
                  setDsuApp({ ...dsuApp, dormAccommodationRequested: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
              />
              <span className="text-slate-300 font-medium">
                Request Free University Dormitory (Alloggio Studentesco)
              </span>
            </label>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Application Notes</label>
            <textarea
              rows={2}
              value={dsuApp.notes}
              onChange={(e) => setDsuApp({ ...dsuApp, notes: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500"
              placeholder="Notes on translation, CAF contact person, regional submission receipt..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Save className="w-4 h-4" />}
            >
              Save DSU Application Details
            </Button>
          </div>
        </form>
      </div>

      {/* Interactive ISEE Parificato Estimator (Non-Guaranteed Reality Check) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Interactive ISEE Parificato Estimator (Bangladesh)
                </h3>
                <Badge variant="amber" size="xs">
                  Estimate Only
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Calculates your Equivalent Economic Situation Indicator score used by Italian CAF tax offices.
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400">Exchange conversion base: </span>
            <span className="font-mono text-emerald-300 font-bold">1 EUR ≈ ৳132 BDT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Family Members Count</label>
            <select
              value={familyMembers}
              onChange={(e) => setFamilyMembers(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value={1}>1 person (Scale 1.00)</option>
              <option value={2}>2 persons (Scale 1.57)</option>
              <option value={3}>3 persons (Scale 2.04)</option>
              <option value={4}>4 persons (Scale 2.46)</option>
              <option value={5}>5 persons (Scale 2.85)</option>
              <option value={6}>6+ persons (Scale 3.20)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Annual Family Income (BDT ৳)
            </label>
            <input
              type="number"
              step="50000"
              value={annualFamilyIncomeBdt}
              onChange={(e) => setAnnualFamilyIncomeBdt(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              ≈ €{incomeEur.toLocaleString()} EUR
            </span>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Family Real Estate / Land (BDT ৳)
            </label>
            <input
              type="number"
              step="100000"
              value={propertyValueBdt}
              onChange={(e) => setPropertyValueBdt(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              ≈ €{propertyEur.toLocaleString()} EUR
            </span>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Bank Balance on 31 Dec (BDT ৳)
            </label>
            <input
              type="number"
              step="50000"
              value={bankBalanceBdt}
              onChange={(e) => setBankBalanceBdt(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              ≈ €{movableEur.toLocaleString()} EUR
            </span>
          </div>
        </div>

        {/* Calculated Result Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Estimated ISEE Parificato Value
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              €{iseeEstimateEur.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">
              Italian national ceiling threshold: <strong className="text-slate-200">€26,000 – €27,000</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 max-w-md">
            <div className="text-xs font-semibold flex items-center space-x-1.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isFullEligible
                  ? 'Maximum Eligibility Tier (Estimated)'
                  : isPartialEligible
                  ? 'Partial Eligibility Tier'
                  : 'Exceeds Typical Threshold'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isFullEligible
                ? 'Your family economic indicator is below €15,000. In Italian regional rankings, you qualify for top priority. Final cash award is subject to regional budget allocation and publishing of official rankings.'
                : 'Eligible for university tuition fee waiver and partial assistance.'}
            </p>
          </div>
        </div>
      </div>

      {/* Regional Agencies Breakdown */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Italian Regional DSU Agencies & Right-to-Study Framework
          </h3>
          <span className="text-xs text-slate-400">
            Source-Backed & Verified Criteria (Non-Guaranteed)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regionalScholarships.map((agency, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 pb-2 border-b border-slate-800/80">
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-[17px] font-semibold text-white tracking-tight leading-snug">{agency.agencyName}</h4>
                    </div>
                    <div className="text-xs text-emerald-400 font-medium mt-0.5">{agency.region}</div>
                    {agency.academicYear && (
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{agency.academicYear}</div>
                    )}
                  </div>
                  <div className="shrink-0 self-start">
                    <Badge
                      variant={agency.verificationStatus === 'Verified' ? 'emerald' : 'amber'}
                      size="sm"
                      className="whitespace-nowrap font-medium text-[11px] shadow-sm"
                    >
                      {agency.verificationStatus || 'Verified'}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed min-h-[44px]">{agency.estimatedBenefits}</p>

                {agency.officialCallBando && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-slate-400 block font-semibold mb-0.5">Official Call (Bando):</span>
                    <span className="italic">{agency.officialCallBando}</span>
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <div className="text-slate-400">
                    Application Window:{' '}
                    <strong className="text-white font-medium">{agency.applicationWindow}</strong>
                  </div>
                  {agency.iseeThresholdEur && (
                    <div className="text-slate-400">
                      ISEE Threshold Ceiling:{' '}
                      <strong className="text-white">€{agency.iseeThresholdEur.toLocaleString()}</strong>
                    </div>
                  )}
                  {agency.lastVerifiedDate && (
                    <div className="text-[11px] text-slate-500">
                      Last Verified: {agency.lastVerifiedDate}
                    </div>
                  )}
                </div>

                {/* Required Documents */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Required Legalized Documents:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {agency.requiredDocuments.map((doc, dIdx) => (
                      <li key={dIdx} className="line-clamp-1">
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                  {agency.notes}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Official Regional Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

