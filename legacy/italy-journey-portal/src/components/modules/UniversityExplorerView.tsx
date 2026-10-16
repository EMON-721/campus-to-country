import React, { useState, useEffect } from 'react';
import { UniversityProgram, UniversityApplication } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Building2,
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Coins,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

interface UniversityExplorerViewProps {
  currentApplications: UniversityApplication[];
  onAddApplication: (app: UniversityApplication) => void;
  onNavigate?: (module: 'applications') => void;
}

export const UniversityExplorerView: React.FC<UniversityExplorerViewProps> = ({
  currentApplications,
  onAddApplication,
  onNavigate,
}) => {
  const [unis, setUnis] = useState<UniversityProgram[]>(() => StorageService.getUniversities());
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCompetitiveness, setSelectedCompetitiveness] = useState<string>('all');
  const [feeFilter, setFeeFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setUnis(StorageService.getUniversities());
    };
    window.addEventListener('italy_msc_storage_changed', handleStorageChange);
    return () => window.removeEventListener('italy_msc_storage_changed', handleStorageChange);
  }, []);

  const regions = [
    'all',
    'Abruzzo',
    'Basilicata',
    'Calabria',
    'Campania',
    'Emilia-Romagna',
    'Friuli-Venezia Giulia',
    'Lazio',
    'Liguria',
    'Lombardia',
    'Marche',
    'Molise',
    'Piemonte',
    'Puglia',
    'Sardegna',
    'Sicilia',
    'Toscana',
    'Trentino-Alto Adige',
    'Umbria',
    "Valle d'Aosta",
    'Veneto',
  ];

  const filteredUnis = unis.filter((uni) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      uni.universityName.toLowerCase().includes(searchLower) ||
      uni.programTitle.toLowerCase().includes(searchLower) ||
      uni.city.toLowerCase().includes(searchLower) ||
      (uni.curriculumFocus || []).some((f) => f.toLowerCase().includes(searchLower));

    const matchesRegion =
      selectedRegion === 'all' ||
      uni.region.toLowerCase().includes(selectedRegion.toLowerCase()) ||
      (selectedRegion === 'Piemonte' && uni.region.toLowerCase().includes('piedmont')) ||
      (selectedRegion === 'Lombardia' && uni.region.toLowerCase().includes('lombardy')) ||
      (selectedRegion === 'Toscana' && uni.region.toLowerCase().includes('tuscany'));

    const matchesComp =
      selectedCompetitiveness === 'all' || uni.competitiveness === selectedCompetitiveness;
    const matchesFee =
      feeFilter === 'all' ||
      (feeFilter === 'free' && uni.applicationFeeEur === 0) ||
      (feeFilter === 'paid' && uni.applicationFeeEur > 0);

    return matchesSearch && matchesRegion && matchesComp && matchesFee;
  });

  const isUniInTracker = (uni: UniversityProgram) => {
    return currentApplications.some((a) => {
      if (a.universityId && a.universityId === uni.id) return true;
      const aName = a.universityName.toLowerCase().trim();
      const uName = uni.universityName.toLowerCase().trim();
      if (aName === uName) return true;
      if (uni.italianName && aName === uni.italianName.toLowerCase().trim()) return true;
      return false;
    });
  };

  const handleQuickAdd = (uni: UniversityProgram) => {
    if (isUniInTracker(uni)) return;

    const newApp: UniversityApplication = {
      id: `app-${Date.now()}`,
      universityId: uni.id,
      universityName: uni.universityName,
      programName: uni.programTitle,
      city: uni.city,
      region: uni.region,
      portalUrl: uni.applicationPortal.includes('http') ? uni.applicationPortal : uni.officialWebsite,
      portalUsername: '',
      portalPasswordHint: '',
      applicationFeeEur: uni.applicationFeeEur,
      feePaid: uni.applicationFeeEur === 0,
      round: 'Target Call (2027 Intake)',
      deadlineDate: '2027-02-15',
      status: 'Researching',
      isUniversitalyChoice: false,
      notes: `Application for English-taught programme. Regional scholarship: ${uni.regionalScholarship}`,
      requiredDocuments: [
        'Official Degree Transcript',
        'Course Syllabus Breakdown',
        'Language Proficiency Certificate',
        'Europass CV',
        'Statement of Purpose',
      ],
      scholarshipApplied: false,
      updatedAt: new Date().toISOString().split('T')[0],
      isDemo: false,
    };

    onAddApplication(newApp);
    setAddedToast(uni.universityName);
    setTimeout(() => setAddedToast(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl flex items-center space-x-3 border border-emerald-400/40 animate-bounce">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Added <strong>{addedToast}</strong> to Application Manager!</span>
          {onNavigate && (
            <button
              onClick={() => onNavigate('applications')}
              className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-[11px] font-bold underline transition-colors"
            >
              Open Manager →
            </button>
          )}
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Public Italian Universities Directory</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Italian Public Universities Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curated directory of accredited public universities offering English-taught degrees with regional DSU scholarship eligibility.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold border border-slate-700">
            {unis.length} Verified Institutions
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30">
            100% Public & Regional DSU Eligible
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Search box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search university, program, city, or topic (e.g. Deep Learning, Pisa)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Regions</option>
              {regions.filter((r) => r !== 'all').map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Competitiveness */}
          <div>
            <select
              value={selectedCompetitiveness}
              onChange={(e) => setSelectedCompetitiveness(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Target Levels</option>
              <option value="Safe / Realistic">Safe / Realistic (High Acceptance Rate)</option>
              <option value="Target">Target (Balanced)</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High / Reach</option>
            </select>
          </div>
        </div>

        {/* Quick Pills for Application Fee */}
        <div className="flex items-center space-x-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Application Fee:</span>
          <button
            onClick={() => setFeeFilter('all')}
            className={`px-2.5 py-1 rounded-lg ${
              feeFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFeeFilter('free')}
            className={`px-2.5 py-1 rounded-lg ${
              feeFilter === 'free'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            €0 Free Fee (Pisa, Genoa)
          </button>
          <button
            onClick={() => setFeeFilter('paid')}
            className={`px-2.5 py-1 rounded-lg ${
              feeFilter === 'paid'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nominal Fee (€10 - €50)
          </button>
        </div>
      </div>

      {/* University Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUnis.map((uni) => {
          const isAdded = isUniInTracker(uni);

          return (
            <div
              key={uni.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header line: Title & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold text-white hover:text-emerald-300 transition-colors">
                      {uni.universityName}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        {uni.city}, {uni.region} (Italy)
                      </span>
                      {uni.worldRank && (
                        <span className="font-mono text-slate-400">• QS #{uni.worldRank}</span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      uni.competitiveness === 'Safe / Realistic'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : uni.competitiveness === 'Target'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : uni.competitiveness === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {uni.competitiveness}
                  </span>
                </div>

                {/* Program Title Banner */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div className="text-xs font-semibold text-emerald-300 flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>{uni.programTitle}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap gap-2">
                    <span>Degree: {uni.degreeType}</span>
                    <span>• {uni.durationYears} Years (120 CFU)</span>
                    <span>• {uni.language}-taught</span>
                  </div>
                </div>

                {/* Deadlines & Fees */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Application Fee</span>
                    <span className="font-bold text-white">
                      {uni.applicationFeeEur === 0 ? (
                        <span className="text-emerald-400">€0 (Free)</span>
                      ) : (
                        `€${uni.applicationFeeEur}`
                      )}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Application Deadlines</span>
                    <span className="font-semibold text-slate-200 text-[11px] line-clamp-1">
                      {uni.intakeDeadlines}
                    </span>
                  </div>
                </div>

                {/* Regional Scholarship */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="text-[11px] text-amber-300 font-semibold flex items-center space-x-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Regional Scholarship: {uni.regionalScholarship}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tuition fee: {uni.tuitionFeeEurPerYear}
                  </div>
                </div>

                {/* Curriculum Focus Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {uni.curriculumFocus.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Strategic Advice for Applicants */}
                <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                  <div className="text-[11px] font-bold text-amber-300 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admission & Curriculum Matching Strategy</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {uni.cgpaStrategyTip}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <a
                  href={uni.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>Official Uni Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {isAdded ? (
                  <button
                    onClick={() => onNavigate?.('applications')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer group"
                    title="View in Application Manager"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>In My Tracker</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 ml-1">→</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleQuickAdd(uni)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-emerald-950 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Tracker</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredUnis.length === 0 && (
        <div className="text-center py-12 text-slate-400 space-y-2">
          <Building2 className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-medium">No universities match the selected filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedRegion('all');
              setSelectedCompetitiveness('all');
              setFeeFilter('all');
            }}
            className="text-xs text-emerald-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

