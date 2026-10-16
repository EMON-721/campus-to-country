import React, { useState, useMemo } from 'react';
import { ItalianRegion } from '../../types';
import { ALL_20_ITALIAN_REGIONS } from '../../data/regionsData';
import {
  MapPin,
  Search,
  Filter,
  Building2,
  GraduationCap,
  Coins,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Home,
  Utensils,
  Bus,
  Zap,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface ItalianRegionsViewProps {
  onNavigateToExplorer?: (regionName?: string) => void;
  onNavigateToScholarships?: () => void;
}

export const ItalianRegionsView: React.FC<ItalianRegionsViewProps> = ({
  onNavigateToExplorer,
  onNavigateToScholarships,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCostFilter, setSelectedCostFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'unis' | 'cost_asc' | 'cost_desc'>('name');
  const [selectedRegion, setSelectedRegion] = useState<ItalianRegion | null>(null);

  const zones = ['all', 'North-West', 'North-East', 'Central', 'Southern', 'Islands'] as const;

  const filteredRegions = useMemo(() => {
    return ALL_20_ITALIAN_REGIONS.filter((reg) => {
      // Search matches region name, capital, cities, universities, or DSU authority
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        reg.name.toLowerCase().includes(q) ||
        reg.capital.toLowerCase().includes(q) ||
        reg.universityCities.some((c) => c.toLowerCase().includes(q)) ||
        reg.publicUniversities.some((u) => u.toLowerCase().includes(q)) ||
        reg.regionalScholarshipAuthority.name.toLowerCase().includes(q);

      // Zone filter
      const matchesZone = selectedZone === 'all' || reg.zone === selectedZone;

      // Cost filter
      const matchesCost =
        selectedCostFilter === 'all' ||
        (selectedCostFilter === 'affordable' && reg.estimatedLivingCostsEur.category === 'Affordable') ||
        (selectedCostFilter === 'moderate' && reg.estimatedLivingCostsEur.category === 'Moderate') ||
        (selectedCostFilter === 'high' && reg.estimatedLivingCostsEur.category === 'High Cost');

      return matchesSearch && matchesZone && matchesCost;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'unis') return b.publicUniversitiesCount - a.publicUniversitiesCount;
      if (sortBy === 'cost_asc') return a.estimatedLivingCostsEur.average - b.estimatedLivingCostsEur.average;
      if (sortBy === 'cost_desc') return b.estimatedLivingCostsEur.average - a.estimatedLivingCostsEur.average;
      return 0;
    });
  }, [searchQuery, selectedZone, selectedCostFilter, sortBy]);

  // Zone statistics
  const zoneCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ALL_20_ITALIAN_REGIONS.length };
    ALL_20_ITALIAN_REGIONS.forEach((r) => {
      counts[r.zone] = (counts[r.zone] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-slate-100">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400">
              <Compass className="w-4 h-4" />
              <span>National Territory • 20 Italian Administrative Regions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Italian Regions, Universities & Scholarship Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Italy is divided into 20 distinct regions, each managing its own autonomous Right to Study (DSU) scholarship agency, public universities, living cost dynamics, and student housing infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="emerald" size="sm">
              20 / 20 Regions Verified
            </Badge>
            <Badge variant="teal" size="sm">
              60+ Public Universities
            </Badge>
            <Badge variant="amber" size="sm">
              100% DSU Coverage
            </Badge>
          </div>
        </div>

        {/* Macro-Zone Selector Tabs */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Macro-Zones:
          </span>
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedZone === zone
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{zone === 'all' ? 'All Italy' : zone}</span>
              <span className="ml-1.5 opacity-75 font-mono text-[10px]">
                ({zoneCounts[zone] || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search region, city, university, DSU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Living Cost Filter */}
          <div>
            <select
              value={selectedCostFilter}
              onChange={(e) => setSelectedCostFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Living Cost Levels</option>
              <option value="affordable">Affordable (&lt; €750/month)</option>
              <option value="moderate">Moderate (€750 – €1,000/month)</option>
              <option value="high">High Cost (&gt; €1,000/month)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="unis">Sort by: Most Public Universities</option>
              <option value="cost_asc">Sort by: Living Cost (Low to High)</option>
              <option value="cost_desc">Sort by: Living Cost (High to Low)</option>
            </select>
          </div>

          {/* Counter Badge */}
          <div className="flex items-center justify-between sm:justify-end gap-2 px-1">
            <span className="text-xs text-slate-400">
              Showing <strong className="text-white font-semibold">{filteredRegions.length}</strong> of 20 regions
            </span>
            {(searchQuery || selectedZone !== 'all' || selectedCostFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedZone('all');
                  setSelectedCostFilter('all');
                  setSortBy('name');
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Regions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRegions.map((region) => {
          const costBadgeVariant =
            region.estimatedLivingCostsEur.category === 'Affordable'
              ? 'emerald'
              : region.estimatedLivingCostsEur.category === 'Moderate'
              ? 'amber'
              : 'rose';

          return (
            <div
              key={region.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm group hover:-translate-y-0.5"
            >
              <div className="space-y-3.5">
                {/* Top Row: Region & Zone */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                      {region.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                      <span>Capital:</span>
                      <strong className="text-slate-200">{region.capital}</strong>
                    </div>
                  </div>
                  <Badge variant="slate" size="xs" className="font-medium shrink-0">
                    {region.zone}
                  </Badge>
                </div>

                {/* University Hubs & Cities */}
                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 font-medium">University Cities:</span>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {region.universityCities.map((city, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-medium"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Public Universities List Preview */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-medium flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Public Universities:</span>
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {region.publicUniversitiesCount}
                    </span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {region.publicUniversities.slice(0, 3).map((uni, uIdx) => (
                      <li key={uIdx} className="line-clamp-1 flex items-start space-x-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{uni}</span>
                      </li>
                    ))}
                    {region.publicUniversities.length > 3 && (
                      <li className="text-[10px] text-slate-400 italic">
                        + {region.publicUniversities.length - 3} more public institutions
                      </li>
                    )}
                  </ul>
                </div>

                {/* Regional DSU Agency Highlight */}
                <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-300 font-bold flex items-center space-x-1">
                      <Coins className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{region.regionalScholarshipAuthority.name}</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 font-mono">
                      Up to ~€{region.regionalScholarshipAuthority.maxStipendEur.toLocaleString()}/yr
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    ISEE Threshold: €{region.regionalScholarshipAuthority.iseeParificatoThresholdEur.toLocaleString()} • Tuition Waiver & Meals
                  </div>
                </div>

                {/* Living Cost Metric */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-400">Est. Living Cost:</span>
                    <strong className="text-white font-mono">~€{region.estimatedLivingCostsEur.average}/mo</strong>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                      costBadgeVariant === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : costBadgeVariant === 'amber'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {region.estimatedLivingCostsEur.category}
                  </span>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => setSelectedRegion(region)}
                  className="w-full font-semibold justify-center"
                >
                  <span>Regional Dossier & Guide</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 text-emerald-400" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. In-Depth Region Detail Modal */}
      {selectedRegion && (
        <Modal
          isOpen={!!selectedRegion}
          onClose={() => setSelectedRegion(null)}
          title={`${selectedRegion.name} Regional Dossier`}
          subtitle={`Macro-Zone: ${selectedRegion.zone} • Capital: ${selectedRegion.capital} • ${selectedRegion.publicUniversitiesCount} Public Universities`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6 text-xs text-slate-300 max-h-[75vh] overflow-y-auto pr-1">
            {/* Top Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-800">
              <Badge variant="emerald" size="xs">
                Verified Regional Record
              </Badge>
              <Badge variant="slate" size="xs">
                {selectedRegion.zone}
              </Badge>
              <Badge variant="teal" size="xs">
                Avg Cost: ~€{selectedRegion.estimatedLivingCostsEur.average}/mo ({selectedRegion.estimatedLivingCostsEur.category})
              </Badge>
              <Badge variant="amber" size="xs">
                DSU Ceiling: €{selectedRegion.regionalScholarshipAuthority.iseeParificatoThresholdEur.toLocaleString()}
              </Badge>
            </div>

            {/* Section 1: Public Universities & Degree Availability */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Recognized Public Universities ({selectedRegion.publicUniversitiesCount})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedRegion.publicUniversities.map((uni, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                  >
                    <div className="font-semibold text-white text-xs flex items-center justify-between">
                      <span>{uni}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Located in {selectedRegion.universityCities.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Degrees breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-medium block">Bachelor's Degrees:</span>
                  <div className="text-base font-bold text-white font-mono">
                    ~{selectedRegion.bachelorProgrammesCount}+ Courses
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Example: {selectedRegion.featuredDegrees.bachelor[0] || 'Undergraduate'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-medium block">Master's Degrees:</span>
                  <div className="text-base font-bold text-emerald-400 font-mono">
                    ~{selectedRegion.masterProgrammesCount}+ Courses
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Example: {selectedRegion.featuredDegrees.master[0] || 'MSc'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-medium block">Doctoral / PhD:</span>
                  <div className="text-base font-bold text-amber-400 font-mono">
                    ~{selectedRegion.phdOpportunitiesCount}+ Research Programs
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Example: {selectedRegion.featuredDegrees.phd[0] || 'PhD'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Regional DSU Authority */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>Regional Right to Study Agency (DSU)</span>
                </div>
                <Badge variant="emerald" size="xs">
                  {selectedRegion.regionalScholarshipAuthority.annualCallStatus}
                </Badge>
              </div>

              <div className="text-xs text-slate-200 font-semibold">
                {selectedRegion.regionalScholarshipAuthority.fullName} ({selectedRegion.regionalScholarshipAuthority.name})
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Max Stipend:</span>
                  <strong className="text-emerald-400 font-mono">
                    ~€{selectedRegion.regionalScholarshipAuthority.maxStipendEur.toLocaleString()}/yr
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ISEE Threshold:</span>
                  <strong className="text-white font-mono">
                    €{selectedRegion.regionalScholarshipAuthority.iseeParificatoThresholdEur.toLocaleString()}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Application Call:</span>
                  <strong className="text-white">
                    {selectedRegion.regionalScholarshipAuthority.applicationWindow}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Tuition & Canteen:</span>
                  <strong className="text-teal-300">100% €0 Covered</strong>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <a
                  href={selectedRegion.regionalScholarshipAuthority.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <span>Visit {selectedRegion.regionalScholarshipAuthority.name} Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Section 3: Accommodation & Housing Resources */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Home className="w-4 h-4 text-amber-400" />
                <span>Student Accommodation & Living Dynamics</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-medium block">Average Private Room Rent:</span>
                  <div className="text-base font-bold text-white font-mono">
                    {selectedRegion.accommodationResources.averagePrivateRoomEur}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Monthly cost for a private single room (singola) in shared university student flats.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-medium block">Official Student Dormitories:</span>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    {selectedRegion.accommodationResources.dormProviders.map((prov, pIdx) => (
                      <div key={pIdx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{prov}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-slate-400 font-medium block">
                  Detailed Monthly Budget Breakdown (~€{selectedRegion.estimatedLivingCostsEur.average}/month):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-850 flex items-center space-x-2">
                    <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rent</span>
                      <span className="text-[11px] text-white font-semibold">
                        {selectedRegion.estimatedLivingCostsEur.monthlyBreakdown.rent}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-855 flex items-center space-x-2">
                    <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Food & Dining</span>
                      <span className="text-[11px] text-white font-semibold">
                        {selectedRegion.estimatedLivingCostsEur.monthlyBreakdown.food}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-855 flex items-center space-x-2">
                    <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Transport</span>
                      <span className="text-[11px] text-white font-semibold">
                        {selectedRegion.estimatedLivingCostsEur.monthlyBreakdown.transport}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-855 flex items-center space-x-2">
                    <Zap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Utilities & Net</span>
                      <span className="text-[11px] text-white font-semibold">
                        {selectedRegion.estimatedLivingCostsEur.monthlyBreakdown.utilities}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Student Services & Infrastructure */}
            <div className="space-y-2">
              <span className="text-white font-bold block text-sm">Campus Services & Local Infrastructure:</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedRegion.studentServices.map((serv, sIdx) => (
                  <li key={sIdx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{serv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 5: Official Contacts & Sources */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-slate-400 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scholarship Desk: {selectedRegion.officialContacts.scholarshipEmail}</span>
                </div>
                <div className="text-slate-400 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone: {selectedRegion.officialContacts.scholarshipPhone}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {onNavigateToExplorer && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedRegion(null);
                      onNavigateToExplorer(selectedRegion.name);
                    }}
                  >
                    <span>View Universities in {selectedRegion.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

