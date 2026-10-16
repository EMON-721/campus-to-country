import React, { useState, useEffect } from 'react';
import { UniversityProgram, UniversityApplication, EctsCourseMapping } from '../../types';
import { StorageService } from '../../services/storage';
import {
  GraduationCap,
  Layers,
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
  MapPin,
  Check,
  Award,
  Plus,
  CheckCircle2,
  Trash2,
  Building,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ProgrammeTrackerViewProps {
  onAddApplication?: (app: UniversityApplication) => void;
  onNavigate?: (module: 'applications') => void;
}

export const ProgrammeTrackerView: React.FC<ProgrammeTrackerViewProps> = ({
  onAddApplication,
  onNavigate,
}) => {
  const [programs, setPrograms] = useState<UniversityProgram[]>(() =>
    StorageService.getUniversities()
  );
  const [activeTab, setActiveTab] = useState<'catalog' | 'ects_matching'>('catalog');
  const [search, setSearch] = useState('');
  const [curriculumFilter, setCurriculumFilter] = useState<string>('all');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setPrograms(StorageService.getUniversities());
    };
    window.addEventListener('italy_msc_storage_changed', handleStorageChange);
    return () => window.removeEventListener('italy_msc_storage_changed', handleStorageChange);
  }, []);

  // ECTS course mappings state loaded from storage
  const [ectsMappings, setEctsMappings] = useState<EctsCourseMapping[]>(() =>
    StorageService.getEctsMappings()
  );

  // New course mapping form state
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCreditHours, setNewCreditHours] = useState<number>(3);
  const [newDiscipline, setNewDiscipline] = useState<
    'INF/01' | 'ING-INF/05' | 'MAT/01-08' | 'FIS/01-03' | 'General'
  >('INF/01');

  const topics = [
    'all',
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Big Data',
    'Robotics',
  ];

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.programTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.universityName.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      curriculumFilter === 'all' ||
      p.curriculumFocus.some((f) => f.toLowerCase().includes(curriculumFilter.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  const handleTrackProgramme = (prog: UniversityProgram) => {
    if (!onAddApplication) return;

    const newApp: UniversityApplication = {
      id: `app-${Date.now()}`,
      universityId: prog.id,
      universityName: prog.universityName,
      programName: prog.programTitle,
      city: prog.city,
      region: prog.region,
      portalUrl: prog.officialWebsite,
      applicationFeeEur: prog.applicationFeeEur,
      feePaid: false,
      round: 'Round 1 (2027 Intake)',
      deadlineDate: '2027-01-30',
      status: 'Preparing Documents',
      isUniversitalyChoice: false,
      notes: `Target: ${prog.degreeType}. Curricular tip: ${prog.cgpaStrategyTip}`,
      requiredDocuments: [
        'Official Degree Transcripts',
        'Language Proficiency Certificate',
        'Course Syllabus Stamped',
        'Europass CV',
        'Motivation Letter',
      ],
      scholarshipApplied: false,
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    onAddApplication(newApp);
    setAddedToast(`${prog.universityName} added to your Application Tracker!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newMapping: EctsCourseMapping = {
      id: `cm-${Date.now()}`,
      courseCode: newCourseCode.trim() || 'CS 101',
      courseTitle: newCourseTitle.trim(),
      creditHours: newCreditHours,
      convertedCfu: Math.round(newCreditHours * 1.5),
      italianDiscipline: newDiscipline,
      status: 'Matched',
    };

    const updated = [...ectsMappings, newMapping];
    setEctsMappings(updated);
    StorageService.saveEctsMappings(updated);

    // Reset inputs
    setNewCourseCode('');
    setNewCourseTitle('');
    setNewCreditHours(3);
  };

  const handleDeleteMapping = (id: string) => {
    const updated = ectsMappings.filter((m) => m.id !== id);
    setEctsMappings(updated);
    StorageService.saveEctsMappings(updated);
  };

  // Calculate totals by discipline
  const totalInf = ectsMappings
    .filter((m) => m.italianDiscipline === 'INF/01' || m.italianDiscipline === 'ING-INF/05')
    .reduce((acc, curr) => acc + curr.convertedCfu, 0);

  const totalMat = ectsMappings
    .filter((m) => m.italianDiscipline === 'MAT/01-08')
    .reduce((acc, curr) => acc + curr.convertedCfu, 0);

  const totalFis = ectsMappings
    .filter((m) => m.italianDiscipline === 'FIS/01-03')
    .reduce((acc, curr) => acc + curr.convertedCfu, 0);

  const totalOverallCfu = ectsMappings.reduce((acc, curr) => acc + curr.convertedCfu, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl flex items-center space-x-2 border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Master of Science (Laurea Magistrale) Directory</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            MSc Programme Requirements & ECTS Matching
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official 2-year 120 CFU Master degrees in AI, ML, NLP & Data Science with curriculum credit mapping
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Italian MSc Directory ({programs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ects_matching')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'ects_matching'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            ECTS Matching Matrix ({totalOverallCfu} CFU)
          </button>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <>
          {/* Filter and Search */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search degree title or university..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCurriculumFilter(t)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                    curriculumFilter === t
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {t === 'all' ? 'All Specializations' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Programme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-white">{prog.programTitle}</h3>
                      <div className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {prog.universityName} · {prog.city} ({prog.region})
                        </span>
                      </div>
                    </div>
                    <Badge variant="emerald" size="xs">
                      120 CFU (2 Yrs)
                    </Badge>
                  </div>

                  {/* Curriculum focus pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {prog.curriculumFocus.map((f, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-teal-500/10 text-teal-300 text-[11px] font-medium border border-teal-500/20"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Requirement highlights */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">Min. Language Requirement:</span>
                      <span className="font-bold text-emerald-400">
                        IELTS {prog.admissionRequirements.minIelts} / CEFR B2+
                      </span>
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400 block mb-0.5">Evaluation Rubric & CGPA Strategy:</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {prog.admissionRequirements.cgpaRecommendation}
                      </p>
                    </div>
                    <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                      <span>Curriculum Match: </span>
                      <span className="text-slate-200">{prog.admissionRequirements.curriculumMatching}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom actions: Portal and Add to My Tracker */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={prog.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                  >
                    <span>Official Course Syllabus</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Button
                    variant="primary"
                    size="xs"
                    icon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => handleTrackProgramme(prog)}
                  >
                    + Add to My Tracker
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'ects_matching' && (
        <div className="space-y-6">
          {/* ECTS Summary Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Informatics (INF/01, ING-INF/05)
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {totalInf} CFU
              </div>
              <p className="text-[11px] text-slate-400">
                Minimum required: 30 CFU · <span className="text-emerald-400 font-bold">Requirement Exceeded</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Mathematics (MAT/01 - MAT/08)
              </span>
              <div className="text-2xl font-black text-teal-400 font-mono">
                {totalMat} CFU
              </div>
              <p className="text-[11px] text-slate-400">
                Minimum required: 18 CFU · <span className="text-teal-400 font-bold">Requirement Exceeded</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Physics & Engineering (FIS/01)
              </span>
              <div className="text-2xl font-black text-sky-400 font-mono">
                {totalFis} CFU
              </div>
              <p className="text-[11px] text-slate-400">
                Minimum required: 6 CFU · <span className="text-sky-400 font-bold">Requirement Exceeded</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Total Italian ECTS Equivalent
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {totalOverallCfu} CFU
              </div>
              <p className="text-[11px] text-emerald-400">
                Degree qualifies for Italian Laurea Magistrale admission (min 180 CFU).
              </p>
            </div>
          </div>

          {/* Add Course Mapping Form */}
          <form
            onSubmit={handleAddMapping}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Map Undergraduate Course to Italian SSD Discipline</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CSE 4407"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">Undergraduate Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Natural Language Processing"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Credit Hours</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={newCreditHours}
                  onChange={(e) => setNewCreditHours(parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Italian SSD Category</label>
                <select
                  value={newDiscipline}
                  onChange={(e) => setNewDiscipline(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                >
                  <option value="INF/01">INF/01 (Informatics)</option>
                  <option value="ING-INF/05">ING-INF/05 (Systems)</option>
                  <option value="MAT/01-08">MAT/01-08 (Mathematics)</option>
                  <option value="FIS/01-03">FIS/01-03 (Physics)</option>
                  <option value="General">General / Engineering</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button variant="primary" size="xs">
                + Add Course to Matrix
              </Button>
            </div>
          </form>

          {/* Table of Course Mappings */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Undergraduate Course to Italian CFU Concordance Table
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {ectsMappings.length} courses mapped
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="p-3 pl-5">Course Code</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Credit Hours</th>
                    <th className="p-3">Italian CFU (Est.)</th>
                    <th className="p-3">Italian SSD Discipline</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right pr-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ectsMappings.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3 pl-5 font-mono text-emerald-400 font-bold">
                        {m.courseCode || m.ulabCourseCode}
                      </td>
                      <td className="p-3 font-medium text-white">{m.courseTitle || m.ulabCourseTitle}</td>
                      <td className="p-3 font-mono text-slate-300">{m.creditHours} hrs</td>
                      <td className="p-3 font-mono text-emerald-300 font-bold">
                        {m.convertedCfu} CFU
                      </td>
                      <td className="p-3">
                        <Badge variant="teal" size="xs">
                          {m.italianDiscipline}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="emerald" size="xs">
                          {m.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right pr-5">
                        <button
                          type="button"
                          onClick={() => handleDeleteMapping(m.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove course mapping"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

