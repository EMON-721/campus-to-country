import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  TrendingUp,
  Download,
  Copy,
  Check,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const SponsorBankView: React.FC = () => {
  // Configurable suggested planning range requested by website administration
  // Illustrative estimate, not a statutory minimum or guaranteed visa threshold
  const [planningRangeMinBdt, setPlanningRangeMinBdt] = useState<number>(2000000); // 20 Lakh BDT
  const [planningRangeMaxBdt, setPlanningRangeMaxBdt] = useState<number>(2500000); // 25 Lakh BDT

  // User's own financial planning fields - empty by default
  const [currentBalanceBdt, setCurrentBalanceBdt] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('');
  const [sponsorName, setSponsorName] = useState<string>('');
  const [sponsorRelationship, setSponsorRelationship] = useState<string>('');
  const [statementPeriod, setStatementPeriod] = useState<string>('12 Months (Continuous)');
  const [fundingSource, setFundingSource] = useState<string>('');
  const [taxDocumentAttached, setTaxDocumentAttached] = useState<boolean>(false);
  const [solvencyCertReady, setSolvencyCertReady] = useState<boolean>(false);

  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const EUR_RATE = 132;
  const parsedBalanceBdt = parseFloat(currentBalanceBdt) || 0;
  const currentEur = parsedBalanceBdt > 0 ? Math.round(parsedBalanceBdt / EUR_RATE) : 0;
  const planningMinEur = Math.round(planningRangeMinBdt / EUR_RATE);
  const planningMaxEur = Math.round(planningRangeMaxBdt / EUR_RATE);

  const affidavitSample = `BEFORE THE NOTARY PUBLIC / FIRST CLASS MAGISTRATE
[City, Country of Execution]

AFFIDAVIT OF FINANCIAL SUPPORT & SPONSORSHIP (ILLUSTRATIVE DRAFT TEMPLATE)
[Notice: This is an illustrative template draft. Not an embassy-approved or statutory form. Adapt with legal counsel to match current consular guidelines.]

I, [Sponsor Full Name], Son/Daughter of [Grandparent / Father Name], National Identity / Passport No: [NID/Passport No], residing at [Permanent Address, City, Country], do hereby solemnly affirm and declare on oath as follows:

1. That I am a bona fide citizen of [Country] and maintain lawful and verifiable income through my business / profession / employment as [Profession / Designation / Business Name].

2. That my [Son / Daughter / Ward], [Applicant Full Name], holder of Passport No: [Passport Number], has applied for / been admitted to pursue higher studies in Italy for the upcoming academic session.

3. That I undertake full financial sponsorship and responsibility to bear all necessary educational and living expenses, including university tuition fees, accommodation, food, medical insurance, and return airfare during their entire period of study in Italy.

4. That I possess sufficient funds in my bank accounts maintained with [Designated Bank Name, Branch Name], as evidenced by the attached official 12-Month Bank Account Statements and Bank Solvency Certificate.

5. That all funds deposited in the aforesaid bank account represent genuine, legitimate personal savings / earnings accumulated over time and not temporary or borrowed deposits.

6. That the sponsored student will not become a financial burden or recourse to the public funds of the Government of Italy.

DEPONENT: _______________________________
[Signature of Financial Sponsor]

Identified and sworn before me:
[Notary Public / Magistrate Seal & Signature]`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(affidavitSample);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Landmark className="w-4 h-4" />
            <span>Proof of Means of Subsistence · Financial Planning</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sponsor and Financial Documents</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Financial planning guidelines, 12-month bank statements for sponsor & applicant, solvency certificates, and tax records for Italian study visa preparation.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs">
          <div>
            <div className="text-[11px] text-slate-400">Current Balance</div>
            <div className="font-extrabold text-emerald-400 text-sm">
              {parsedBalanceBdt > 0 ? (
                <>৳{parsedBalanceBdt.toLocaleString()} BDT (≈ €{currentEur.toLocaleString()})</>
              ) : (
                <span className="text-slate-400 italic">Not set</span>
              )}
            </div>
          </div>
          <Badge
            variant={parsedBalanceBdt > 0 && solvencyCertReady ? 'emerald' : 'amber'}
            size="xs"
          >
            {parsedBalanceBdt > 0 && solvencyCertReady ? 'Profile In Progress' : 'Pending Verification'}
          </Badge>
        </div>
      </div>

      {/* Official Guidelines & Planning Estimate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 block">
              Illustrative Financial Planning Range
            </span>
            <Badge variant="emerald" size="xs">Planning Guide</Badge>
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            ৳20 – ৳25 Lakh BDT
          </div>
          <div className="text-xs text-slate-300">
            ≈ €{planningMinEur.toLocaleString()} – €{planningMaxEur.toLocaleString()} EUR
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 leading-relaxed">
            *Customizable planning estimate requested by portal administration. <strong>Not an official embassy minimum</strong>, statutory threshold, or visa guarantee. Set your personal budget according to current consular guidelines.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-400 block">
              Bank Statement Period (Bangladesh Checklist)
            </span>
            <Badge variant="sky" size="xs">12 Months</Badge>
          </div>
          <div className="text-2xl font-black text-white font-mono">12 Continuous Months</div>
          <div className="text-xs text-slate-400">
            Official requirement: 12-Month bank statement for applicant & sponsor
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 leading-relaxed">
            Per the official VFS Global / Italian Embassy Dhaka University Pre-enrolment Study Visa checklist, statements must cover 12 continuous months with genuine transaction history and justified source of funds.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 block">
              Official Source Verification
            </span>
            <Badge variant="amber" size="xs">Verified</Badge>
          </div>
          <div className="text-sm font-bold text-white leading-snug">
            VFS Global Bangladesh Study Visa Checklist
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Document checklist for University Pre-enrolment Study Visa applicants. Last verified: October 2026.
          </p>
          <div className="pt-1 border-t border-slate-800/80">
            <a
              href="https://visa.vfsglobal.com/one-pager/italy/bangladesh/bangali/pdf/STUDY-VISA-University-pre-enrolment_updated.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center space-x-1"
            >
              <span>View Official VFS Checklist PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Account & Solvency Profile (User-Driven, Empty Defaults) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Sponsor and Bank Solvency Profile</h3>
            <p className="text-xs text-slate-400">
              Enter your own verifiable bank details. Fields remain private to your student account.
            </p>
          </div>
          <span className="text-xs text-slate-400">User-Controlled Entry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Designated Bank Name</label>
            <input
              type="text"
              placeholder="e.g. Scheduled Commercial Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Account Holder & Sponsor Name</label>
            <input
              type="text"
              placeholder="e.g. Sponsor Full Name"
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Sponsor Relationship</label>
            <input
              type="text"
              placeholder="e.g. Father / Mother / Self"
              value={sponsorRelationship}
              onChange={(e) => setSponsorRelationship(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Account Type</label>
            <input
              type="text"
              placeholder="e.g. Savings / Current Account / FDR"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Bank Statement Period</label>
            <select
              value={statementPeriod}
              onChange={(e) => setStatementPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="12 Months (Continuous)">12 Months (Continuous - Official Bangladesh Checklist)</option>
              <option value="6 Months">6 Months (Alternative Consular Jurisdiction)</option>
              <option value="Other">Other Verified Period</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Current Account Balance (BDT ৳)</label>
            <input
              type="number"
              placeholder="Enter balance (e.g. 2000000)"
              value={currentBalanceBdt}
              onChange={(e) => setCurrentBalanceBdt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold font-mono focus:outline-none focus:border-emerald-500"
            />
            {parsedBalanceBdt > 0 && (
              <span className="text-[10px] text-slate-400 mt-1 block">
                ≈ €{currentEur.toLocaleString()} EUR (at €1 ≈ ৳{EUR_RATE})
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={solvencyCertReady}
              onChange={(e) => setSolvencyCertReady(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
            />
            <span className="text-slate-300 font-medium">
              Bank Solvency Certificate obtained from branch with EUR equivalent
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={taxDocumentAttached}
              onChange={(e) => setTaxDocumentAttached(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
            />
            <span className="text-slate-300 font-medium">
              Source of funds documents ready (Income tax return acknowledgment, TIN, trade license)
            </span>
          </label>
        </div>
      </div>

      {/* Sponsor Affidavit Sample Template (Clear Draft Disclaimer) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Sponsor Financial Support Affidavit (Customizable Template Draft)
              </h3>
              <Badge variant="amber" size="xs">Illustrative Template</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Draft template for initial document preparation. Must be customized with your authentic details and notarized per local legal practice and consular instructions.
            </p>
          </div>

          <button
            onClick={copyTemplate}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors self-start sm:self-auto"
          >
            {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTemplate ? 'Copied to Clipboard!' : 'Copy Affidavit Draft'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {affidavitSample}
        </pre>
      </div>
    </div>
  );
};

