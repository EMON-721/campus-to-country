import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  Coins,
  FileCheck2,
  Globe2,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  CheckCircle2,
  ExternalLink,
  Shield,
  FileText,
  Clock,
  Landmark,
  ChevronRight,
  Mail,
  UserCheck,
} from 'lucide-react';
import { ModuleKey } from '../layout/Sidebar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { publicItalianUniversities, regionalScholarships } from '../../data/mockData';

interface PublicLandingViewProps {
  onNavigate: (module: ModuleKey) => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  contactEmail?: string;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({
  onNavigate,
  onNavigateToLogin,
  onNavigateToRegister,
  contactEmail = 'contact@italyjourney.org',
}) => {
  const [activeDegreeTab, setActiveDegreeTab] = useState<'bachelor' | 'master' | 'phd'>('master');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');

  const degreeInfo = {
    bachelor: {
      title: "Bachelor's Degree (Laurea / First-Cycle)",
      duration: '3 Years (180 ECTS/CFU)',
      overview:
        'Undergraduate university degrees in Italy open to high school graduates with at least 12 years of completed schooling.',
      qualifications: [
        'Higher Secondary Certificate (HSC) / 12 years of formal schooling equivalent',
        'National University Entrance Examinations (where applicable in home country)',
        'TOLC or English TOLC (CISIA) university entrance exam for competitive fields',
        'Certified English proficiency (B2 Level / IELTS 5.5 - 6.0) or Italian B2 for Italian-taught courses',
      ],
      highlights: [
        'Over 150+ English-taught Bachelor programs across Italy',
        'Direct eligibility for regional DSU scholarships and tuition waivers',
        'Pathway to continue onto 2-year Master of Science (Laurea Magistrale)',
      ],
      targetDegrees: ['BSc in Global Governance', 'BSc in Computer Science & AI', 'BSc in Business & Economics', 'BSc in Mechanical Engineering'],
    },
    master: {
      title: "Master's Degree (Laurea Magistrale / Second-Cycle)",
      duration: '2 Years (120 ECTS/CFU)',
      overview:
        'Postgraduate degrees designed for students holding a recognized 3-year or 4-year undergraduate bachelor degree.',
      qualifications: [
        'Recognized 3 or 4-year undergraduate Bachelor degree (BSc / BA / BBA)',
        'Curricular credit requirements (ECTS/CFU) in prerequisite disciplines',
        'English proficiency certificate (IELTS Academic 6.0–6.5+, TOEFL iBT 80+, or English MOI if accepted)',
        'Statement of Comparability (CIMEA) or Declaration of Value (DOV)',
      ],
      highlights: [
        'Over 600+ English-taught Master programs across 60+ public universities',
        'Generous regional DSU grants up to €8,500/year + free daily canteen dining',
        'Post-study 1-year job search permit (Permesso di Soggiorno per Ricerca Lavoro)',
      ],
      targetDegrees: ['MSc in Artificial Intelligence', 'MSc in Data Science & Engineering', 'MSc in Economics & Finance', 'MSc in Biomedical Engineering'],
    },
    phd: {
      title: "Doctoral Degree (Dottorato di Ricerca / Third-Cycle)",
      duration: '3–4 Years (Doctorate)',
      overview:
        'Advanced research degrees awarded upon successful public defense of a doctoral dissertation.',
      qualifications: [
        'Recognized 2-year Master of Science degree or 5-year combined degree',
        'Research Proposal and Statement of Academic Interest aligned with faculty labs',
        'Curriculum Vitae highlighting academic publications, projects, and awards',
        'Confidential academic reference letters from university professors',
      ],
      highlights: [
        'Fully funded doctoral positions with tax-free monthly fellowships (~€1,200–€1,600/month)',
        'Access to state-of-the-art European research laboratories and international conferences',
        'Collaborative industry PhD programs (Dottorato Industriale) with leading European firms',
      ],
      targetDegrees: ['PhD in Computer Science & AI', 'PhD in Bioengineering & Robotics', 'PhD in Physics & Nanotechnology', 'PhD in Economics & Management'],
    },
  };

  const currentDegree = degreeInfo[activeDegreeTab];

  const filteredUniversities = publicItalianUniversities.slice(0, 4);

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16 text-slate-100">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Italy Journey Portal • Your Complete Study in Italy Companion</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Your Journey to Study in Italy <span className="text-emerald-400">Starts Here</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Discover Italian public universities, explore regional DSU scholarships with up to €8,500/year stipends, understand admission prerequisites, prepare verified embassy visa dossiers, and manage your entire study abroad journey from one unified platform.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="px-6 py-3 text-sm font-bold shadow-lg shadow-emerald-950/50"
              onClick={onNavigateToRegister}
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="px-6 py-3 text-sm font-semibold"
              onClick={() => onNavigate('explorer')}
            >
              <Building2 className="w-4 h-4 mr-1.5 text-emerald-400" />
              <span>Explore Public Universities</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-5 py-3 text-sm font-semibold"
              onClick={() => onNavigate('regions')}
            >
              <Compass className="w-4 h-4 mr-1.5 text-teal-400" />
              <span>All 20 Italian Regions</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-5 py-3 text-sm font-semibold"
              onClick={() => onNavigate('scholarships')}
            >
              <Coins className="w-4 h-4 mr-1.5 text-amber-400" />
              <span>Regional DSU Grants</span>
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">60+</div>
              <div className="text-xs text-slate-400 mt-0.5">Public Universities</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">€0 Tuition</div>
              <div className="text-xs text-slate-400 mt-0.5">With DSU Fee Waivers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">~€8.5k/yr</div>
              <div className="text-xs text-slate-400 mt-0.5">Non-Repayable Stipend</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">3 Degrees</div>
              <div className="text-xs text-slate-400 mt-0.5">Bachelor, Master & PhD</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Degree Levels Explorer (Bachelor, Master, PhD) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Degree Pathways
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Study at Any Academic Level
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tailored admission roadmaps, prerequisite criteria, and scholarship guidance for each degree cycle.
            </p>
          </div>

          {/* Degree Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveDegreeTab('bachelor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeDegreeTab === 'bachelor'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bachelor's Degree
            </button>
            <button
              onClick={() => setActiveDegreeTab('master')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeDegreeTab === 'master'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Master's Degree
            </button>
            <button
              onClick={() => setActiveDegreeTab('phd')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeDegreeTab === 'phd'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Doctoral / PhD
            </button>
          </div>
        </div>

        {/* Selected Degree Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">{currentDegree.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">{currentDegree.overview}</p>
            </div>
            <Badge variant="emerald" size="sm" className="self-start md:self-auto font-mono">
              {currentDegree.duration}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Eligibility & Prerequisite Criteria</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentDegree.qualifications.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Key Programme Benefits</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentDegree.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Popular Programmes Samples */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-400 mb-2">Popular Example Disciplines:</div>
            <div className="flex flex-wrap gap-2">
              {currentDegree.targetDegrees.map((deg, dIdx) => (
                <span
                  key={dIdx}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-200"
                >
                  {deg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Public Universities */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              University Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Top Italian Public Universities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              World-renowned institutions offering competitive tuition, world-class faculty, and English curricula.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('explorer')}
            className="self-start sm:self-auto"
          >
            <span>View All Public Universities</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredUniversities.map((uni) => (
            <div
              key={uni.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{uni.universityName}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {uni.city}, {uni.region} {uni.worldRank ? `• QS World Rank #${uni.worldRank}` : ''}
                  </div>
                </div>
                <Badge variant="emerald" size="xs">
                  {uni.degreeType}
                </Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-400 font-medium">Explore Degree Programmes:</div>
                <div className="font-semibold text-white">{uni.programTitle}</div>
                <div className="text-[11px] text-emerald-400 font-mono pt-1">
                  Regional Scholarship: {uni.regionalScholarship}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                <div>
                  <span className="text-slate-400">Application Fee: </span>
                  <span className="font-semibold text-white">€{uni.applicationFeeEur}</span>
                </div>
                <div>
                  <span className="text-slate-400">Tuition: </span>
                  <span className="font-semibold text-emerald-300">{uni.tuitionFeeEurPerYear}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={uni.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => onNavigate('explorer')}
                >
                  <span>Explore Requirements</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Complete Admission Roadmap (6 Clear Steps) */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            End-to-End Pathway
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How to Study in Italy: 6 Core Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            From your first university search to receiving your Italian student visa and residence permit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              step: '01',
              title: 'Programme Search & Application',
              desc: 'Select universities matching your academic criteria and apply in Call 1 (Nov–Jan) or Call 2 (Feb–Apr) through direct portals.',
              badge: 'Step 1',
              icon: Building2,
            },
            {
              step: '02',
              title: 'Academic Legalization & CIMEA',
              desc: 'Legalize degree transcripts via Education Ministry and MOFA. Request CIMEA Statement of Comparability or Declaration of Value (DOV).',
              badge: 'Step 2',
              icon: FileCheck2,
            },
            {
              step: '03',
              title: 'Universitaly Pre-enrolment',
              desc: 'Complete official pre-enrolment on Universitaly.it with your admission letter, selecting the Italian Embassy in your jurisdiction.',
              badge: 'Step 3',
              icon: Globe2,
            },
            {
              step: '04',
              title: 'Regional DSU Scholarship & ISEE',
              desc: 'Calculate foreign family income (ISEE Parificato) to apply for regional grants (EDISU, ER.GO, DSU Toscana) with €0 tuition & dining.',
              badge: 'Step 4',
              icon: Coins,
            },
            {
              step: '05',
              title: 'National Student Visa (Type D)',
              desc: 'Submit visa dossier with 6-month bank statement solvency, sponsor affidavit, and travel insurance at the Italian consular visa desk.',
              badge: 'Step 5',
              icon: Award,
            },
            {
              step: '06',
              title: 'Arrival & Permesso di Soggiorno',
              desc: 'Travel to Italy and submit the Postal Kit for your Residence Permit (Permesso di Soggiorno per Studio) within 8 working days.',
              badge: 'Step 6',
              icon: Landmark,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden shadow-sm hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  {item.step}
                </span>
                <item.icon className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Regional DSU Scholarships Highlight */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 space-y-6 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400">
            <Coins className="w-4 h-4" />
            <span>Right to Higher Education (Diritto allo Studio Universitario)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Aid & Full Tuition Waivers for International Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Italian regional agencies provide need-based support to foreign students whose family income (ISEE Parificato) falls under published regional thresholds. Depending on the regional call (bando) and ranking outcome, benefits may include:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold text-sm">1. University Tuition Exemption</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full or partial waiver of standard university tuition contributions based on economic bracket.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold text-sm">2. Subsidized / Free Meals (Mensa)</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Access to university dining halls with subsidized tariffs or free daily meals for awardees.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-sky-400 font-bold text-sm">3. Cash Maintenance Grants & Dorms</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Annual living stipends or university college accommodation slots awarded according to verified ranking lists.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigate('scholarships')}
            className="font-semibold"
          >
            <span>Explore Regional DSU Agencies & ISEE Calculator</span>
            <ArrowRight className="w-4 h-4 ml-2 text-emerald-400" />
          </Button>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="text-center p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ready to Begin Your Italian Study Journey?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Create an independent student account to track your target universities, customize your document checklist, monitor consular deadlines, and organize your finances.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            className="px-6 py-2.5 text-sm font-bold shadow-lg"
            onClick={onNavigateToRegister}
          >
            <span>Create Free Student Account</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-6 py-2.5 text-sm font-semibold"
            onClick={onNavigateToLogin}
          >
            <span>Sign In to Existing Account</span>
          </Button>
        </div>
      </section>

      {/* 7. Comprehensive Professional Public Footer */}
      <footer className="pt-12 border-t border-slate-800 text-xs text-slate-400 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & About */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                IT
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                Italy Journey Portal
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your Complete Study in Italy Companion. Providing universal university exploration, regional DSU scholarship guidance, and consular visa roadmaps for international candidates.
            </p>
          </div>

          {/* Col 2: Educational Levels */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Education Levels</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveDegreeTab('bachelor');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Bachelor's Degree (Laurea)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveDegreeTab('master');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Master's Degree (Laurea Magistrale)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveDegreeTab('phd');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Doctoral Degree (Dottorato di Ricerca)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scholarships')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Regional DSU Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('regions')}
                  className="hover:text-emerald-400 transition-colors text-emerald-400 font-semibold"
                >
                  All 20 Italian Regions Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Resources */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Official Resources</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://www.universitaly.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                >
                  <span>Universitaly Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cimea.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                >
                  <span>CIMEA Information Centre</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://vistoperitalia.esteri.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                >
                  <span>Il Visto per l'Italia (MAECI)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.studiare-in-italia.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                >
                  <span>Study in Italy (MUR)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Contact & Portal Access */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Contact & Legal</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Inquiries regarding public content or regional guides:
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <Mail className="w-3.5 h-3.5" />
              <a href={`mailto:${contactEmail}`} className="hover:underline">
                {contactEmail}
              </a>
            </div>
            <div className="pt-2 flex flex-col space-y-1 text-slate-400 text-xs">
              <button
                onClick={onNavigateToLogin}
                className="hover:text-white text-left transition-colors"
              >
                Student Sign In
              </button>
              <button
                onClick={() => onNavigate('admin_dashboard')}
                className="hover:text-white text-left transition-colors"
              >
                Staff / Admin Access
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} Italy Journey Portal. All rights reserved. An independent international student admissions resource.
          </p>
          <p className="text-center sm:text-right max-w-xl">
            Official university admission regulations and visa decrees are governed by the Italian Ministry of University and Research (MUR) and Italian diplomatic consular missions.
          </p>
        </div>
      </footer>
    </div>
  );
};

