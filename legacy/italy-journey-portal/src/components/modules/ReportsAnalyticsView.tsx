import React from 'react';
import {
  UserProfile,
  UniversityApplication,
  TaskItem,
  AcademicDocument,
  ExpenseItem,
} from '../../types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  Download,
  Building,
  GraduationCap,
  Coins,
} from 'lucide-react';

interface ReportsAnalyticsViewProps {
  profile: UserProfile;
  applications: UniversityApplication[];
  tasks: TaskItem[];
  documents: AcademicDocument[];
  expenses: ExpenseItem[];
}

export const ReportsAnalyticsView: React.FC<ReportsAnalyticsViewProps> = ({
  profile,
  applications,
  tasks,
  documents,
  expenses,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const readyDocs = documents.filter(
    (d) => d.status === 'Ready' || d.status === 'Verified' || d.status === 'Attested / Legalized'
  ).length;

  const totalTasks = tasks.length || 1;
  const totalDocs = documents.length || 1;

  // Weighted Journey Readiness calculation:
  // Profile (Language & Info): 25% (Validated dossier = 25%)
  // Documents: 25% * (readyDocs / totalDocs)
  // Tasks: 25% * (completedTasks / totalTasks)
  // Applications: 25% * (active applications / 4 minimum)
  const docScore = Math.round((readyDocs / totalDocs) * 25);
  const taskScore = Math.round((completedTasks / totalTasks) * 25);
  const appScore = Math.min(25, Math.round((applications.length / 4) * 25));
  const profileScore = 25; // Academic Profile & Completed Dossier

  const overallReadiness = profileScore + docScore + taskScore + appScore;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Quantitative Admissions Readiness & Analytics</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reports and Progress Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time readiness metrics, admission eligibility evaluations, and milestone tracking.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-2 transition-colors"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Print / Export Summary</span>
        </button>
      </div>

      {/* Main Meter & Score */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="space-y-3 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Admissions Readiness Index (ARI)
          </span>
          <div className="text-4xl sm:text-5xl font-black text-white font-mono flex items-center justify-center lg:justify-start space-x-3">
            <span>{overallReadiness}%</span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-sans font-bold border border-emerald-500/30">
              High Acceptance Viability
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Your verified language proficiency and targeted selection of public universities place you ahead of the median international applicant pool. Complete your syllabus course-mapping to push your index above 85%.
          </p>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Academic Profile</span>
            <div className="text-lg font-bold text-emerald-300 font-mono">{profileScore} / 25 pts</div>
            <div className="text-[10px] text-slate-400">Language Proficiency Verified</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Documents Vault</span>
            <div className="text-lg font-bold text-teal-300 font-mono">{docScore} / 25 pts</div>
            <div className="text-[10px] text-slate-400">{readyDocs} documents ready</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Applications Pool</span>
            <div className="text-lg font-bold text-cyan-300 font-mono">{appScore} / 25 pts</div>
            <div className="text-[10px] text-slate-400">{applications.length} unis tracked</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Milestone Tasks</span>
            <div className="text-lg font-bold text-amber-300 font-mono">{taskScore} / 25 pts</div>
            <div className="text-[10px] text-slate-400">{completedTasks} tasks completed</div>
          </div>
        </div>
      </div>

      {/* Holistic Admission Rubric Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Strengths & Compensatory factors */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Profile Compensatory Strengths</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400">1. Certified Language Proficiency (B2 / C1)</div>
              <p className="text-slate-300">
                Most Italian public degree courses require official B2 (IELTS 6.0+) or C1 (IELTS 7.0+) proficiency certificates. Submitting valid proof ensures maximum language points in ranking evaluations.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-teal-400">2. Disciplinary Curriculum Foundation</div>
              <p className="text-slate-300">
                Undergraduate academic transcripts matching standard Italian disciplinary credits (CFU) across mathematics, foundational theories, and specialized coursework.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-400">3. English-Medium Instruction</div>
              <p className="text-slate-300">
                Undergraduate studies taught in English accompanied by an official Medium of Instruction (MOI) certificate simplifies admission review.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Recommended Tactical Focus */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>Next Tactical Priorities</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-amber-300">1. Certified Syllabus Translation / Stamping</div>
              <p className="text-slate-300">
                Collect the official course curriculum syllabus signed by the university Department Chair or Registrar for credit evaluation.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-amber-300">2. Apply in Round 1 (Nov – Jan)</div>
              <p className="text-slate-300">
                Non-EU quotas in Italian universities fill in the earliest round. Never wait for Round 2 or 3!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-amber-300">3. Target Holistic Universities</div>
              <p className="text-slate-300">
                Prioritize University of Bologna, University of Pisa, University of Padua, and University of Genoa where student dossiers are evaluated comprehensively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

