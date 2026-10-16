import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Building,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  ArrowRight,
  HelpCircle,
  Check,
  Info,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface EmbassyVisaViewProps {
  onNavigate?: (module: any) => void;
}

export const EmbassyVisaView: React.FC<EmbassyVisaViewProps> = ({ onNavigate }) => {
  const [appointmentStatus, setAppointmentStatus] = useState<string>('Slot Monitoring');
  const [targetSubmissionMonth, setTargetSubmissionMonth] = useState<string>('June – July 2027');

  const visaSteps = [
    {
      step: 1,
      title: 'Universitaly Pre-enrolment Summary (Riepilogo)',
      desc: 'Obtain university validation on Universitaly.it. MUR automatically forwards confirmation to Embassy Dhaka.',
      status: 'In Progress',
      actionModule: 'universitaly',
      actionLabel: 'Universitaly Portal',
    },
    {
      step: 2,
      title: 'Educational Attestations & CIMEA / DOV',
      desc: 'BSc Transcripts attested by Ministry of Education, Segunbagicha MOFA, plus Diplo-me CIMEA Statement.',
      status: 'In Progress',
      actionModule: 'cimea_dov',
      actionLabel: 'CIMEA / DOV Status',
    },
    {
      step: 3,
      title: 'Financial Solvency & Sponsor Documents',
      desc: '12-month bank statements of sponsor and applicant, bank solvency certificates, ৳300 notarized affidavit & NBR tax returns.',
      status: 'In Progress',
      actionModule: 'sponsor_bank',
      actionLabel: 'Sponsor & Solvency',
    },
    {
      step: 4,
      title: 'VFS Global Appointment Slot Booking',
      desc: 'Secure student visa submission appointment at VFS Italy Dhaka Centre (Delta Life Tower).',
      status: 'Pending Slot',
      actionModule: null,
      actionLabel: 'VFS Online Portal',
      externalUrl: 'https://visa.vfsglobal.com/bgd/en/ita',
    },
    {
      step: 5,
      title: 'Dossier Submission & Biometrics',
      desc: 'In-person document file submission, photograph verification, and digital fingerprinting at VFS Dhaka.',
      status: 'Upcoming',
      actionModule: 'visa_checklist',
      actionLabel: 'View Checklist',
    },
    {
      step: 6,
      title: 'Consular Assessment & Interview (If Called)',
      desc: 'Embassy consular section review. Interview calls occur selectively to verify study motivation.',
      status: 'Pending Submission',
      actionModule: null,
    },
    {
      step: 7,
      title: 'Visa Stamping & Passport Collection',
      desc: 'Collection of National Type D Study Visa (365 days multi-entry) from VFS delivery counter.',
      status: 'Target: Aug 2027',
      actionModule: null,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Embassy of Italy in Bangladesh & VFS Global</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Italian Embassy & Student Visa Guidance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            National Type D Long Stay Visa (Studio / Immatricolazione Università) tracking for 2027/2028 intake.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://visa.vfsglobal.com/bgd/en/ita"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-950 transition-all"
          >
            <span>VFS Italy Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {onNavigate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('visa_checklist')}
              icon={<FileText className="w-3.5 h-3.5" />}
            >
              13-Point Checklist
            </Button>
          )}
        </div>
      </div>

      {/* Diplomatic & Processing Authority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>Consular Authority</span>
          </div>
          <h4 className="text-base font-semibold text-white">Embassy of Italy in Dhaka</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Plot 2/3, Road 74/79, Gulshan-2, Dhaka 1212. All visa decisions and background checks are conducted exclusively by Italian diplomatic officers.
          </p>
          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-emerald-400" />
              <span>visti.dhaka@esteri.it</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+880 2 5881 2781 - 3</span>
            </div>
            <div className="text-slate-500">Working Days: Sunday – Thursday (09:00 - 16:30)</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Application Submission Center</span>
          </div>
          <h4 className="text-base font-semibold text-white">VFS Global Italy Visa Centre</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Delta Life Tower (4th & 5th Floor), Plot 37, Road 90, Gulshan North, Gulshan-2, Dhaka 1212. Mandatory site for file intake and biometrics.
          </p>
          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-teal-400" />
              <span>info.itbd@vfshelpline.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-teal-400" />
              <span>+880 9606 777666</span>
            </div>
            <div className="text-slate-500">Submission Hours: 08:30 - 14:00 (Prior appointment required)</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing Timelines</span>
          </div>
          <h4 className="text-base font-semibold text-white">Estimated 4 to 8 Weeks</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Peak student visa intake window runs from June to September. Applying early in June/July prevents pre-departure delays and flight rescheduling.
          </p>
          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
            <div className="text-slate-300 flex justify-between">
              <span>Embassy Visa Fee:</span>
              <span className="font-semibold text-white">€50 (~৳6,600 BDT)</span>
            </div>
            <div className="text-slate-300 flex justify-between">
              <span>VFS Service Fee:</span>
              <span className="font-semibold text-white">~৳4,400 BDT</span>
            </div>
            <div className="text-emerald-400 font-medium">Payment Mode: Exact cash or pay order at VFS counter</div>
          </div>
        </div>
      </div>

      {/* Appointment & File Tracker Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Student Visa Application Milestone</h3>
            <p className="text-xs text-slate-400">
              National Visa Type D (Long stay study visa for 365 days / Laurea Magistrale)
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Filing Window:</span>
            <span className="px-3 py-1 rounded-lg bg-slate-950 text-emerald-400 font-semibold border border-slate-800">
              {targetSubmissionMonth}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Visa Category</span>
            <span className="font-semibold text-white">National Visa (Type D)</span>
            <span className="text-[10px] text-emerald-400 block">Sub-category: Studio</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Visa Application Fee</span>
            <span className="font-semibold text-white">€50 / ~৳6,600 BDT</span>
            <span className="text-[10px] text-slate-400 block">+ VFS fee (~৳4,400 BDT)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Current Status</span>
            <select
              value={appointmentStatus}
              onChange={(e) => setAppointmentStatus(e.target.value)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none w-full cursor-pointer text-xs"
            >
              <option value="Slot Monitoring" className="bg-slate-900 text-white">
                Slot Monitoring
              </option>
              <option value="Appointment Booked" className="bg-slate-900 text-white">
                Appointment Booked
              </option>
              <option value="Dossier Submitted to VFS" className="bg-slate-900 text-white">
                Dossier Submitted to VFS
              </option>
              <option value="Under Review by Embassy" className="bg-slate-900 text-white">
                Under Review by Embassy
              </option>
              <option value="Visa Granted & Collected" className="bg-slate-900 text-white">
                Visa Granted & Collected
              </option>
            </select>
            <span className="text-[10px] text-slate-400 block">Click to update status</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Target Travel Window</span>
            <span className="font-semibold text-white">September 2027</span>
            <span className="text-[10px] text-slate-400 block">Milan (MXP) / Rome (FCO) / Turin (TRN)</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Visa Progression Pipeline */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">7-Stage Visa Dossier Workflow</h3>
            <p className="text-xs text-slate-400">
              Essential sequence from university pre-enrolment validation through passport receipt.
            </p>
          </div>
          <span className="text-xs text-slate-400">Step progression roadmap</span>
        </div>

        <div className="space-y-3">
          {visaSteps.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-semibold flex items-center justify-center shrink-0 text-xs">
                  {s.step}
                </span>
                <div>
                  <h4 className="font-semibold text-white text-sm">{s.title}</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Badge variant="teal" size="xs">
                  {s.status}
                </Badge>
                {s.actionModule && onNavigate && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onNavigate(s.actionModule)}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <span>{s.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
                {s.externalUrl && (
                  <a
                    href={s.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{s.actionLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Guidelines & Embassy Scrutiny Points */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <h4 className="font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Embassy of Italy Dhaka Visa Scrutiny & Interview Key Insights</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <strong className="text-white block text-sm">1. Bank Statement Consistency</strong>
            <p className="text-slate-400 text-xs">
              The Embassy Dhaka pays strict attention to sponsor account statements. Ensure funds are accumulated steadily over 6 months with clear income traces rather than bulk last-minute unverified deposits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <strong className="text-white block text-sm">2. Language Proficiency Authenticity</strong>
            <p className="text-slate-400 text-xs">
              Italian student visa processing for English-taught programmes prioritizes genuine language competency. Submitting an official IELTS Academic certificate (6.0+ or CEFR B2/C1) eliminates English proficiency doubts during consular scrutiny.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <strong className="text-white block text-sm">3. Family Sponsor Legal Ties</strong>
            <p className="text-slate-400 text-xs">
              Provide government-registered Birth Certificate and Family Composition Certificate attesting the relation between student and financial guarantor, accompanied by notarized ৳300 stamp affidavit and NBR tax returns.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <strong className="text-white block text-sm">4. Accommodation & Travel Coverage</strong>
            <p className="text-slate-400 text-xs">
              Supply university dormitory confirmation, a registered Italian residential contract, or a 30-day verified booking with host commitment, alongside Schengen travel medical insurance (€30,000+ coverage).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

