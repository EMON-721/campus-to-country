import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  Coins,
  FileText,
  FileCheck2,
  Globe2,
  Landmark,
  CheckSquare,
  ShieldCheck,
  Home,
  Plane,
  Luggage,
  Award,
  BookOpenCheck,
  Coffee,
  ListTodo,
  Calendar,
  WalletCards,
  BookmarkCheck,
  TrendingUp,
  X,
  Compass,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Palette,
  Layers,
  BookOpen,
  MapPin,
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export type ModuleKey =
  | 'landing'
  | 'dashboard'
  | 'admin_dashboard'
  | 'profile'
  | 'regions'
  | 'explorer'
  | 'programmes'
  | 'applications'
  | 'scholarships'
  | 'documents'
  | 'cimea_dov'
  | 'universitaly'
  | 'embassy_visa'
  | 'visa_checklist'
  | 'sponsor_bank'
  | 'accommodation'
  | 'flight_planner'
  | 'travel_checklist'
  | 'residence_permit'
  | 'enrollment'
  | 'student_life'
  | 'tasks'
  | 'calendar'
  | 'budget'
  | 'notes_links'
  | 'analytics'
  | 'admin_control'
  | 'appearance'
  | 'custom_modules'
  | string;

interface SidebarProps {
  currentModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingTasksCount: number;
  totalAppsCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  key: ModuleKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
  pendingTasksCount,
  totalAppsCount,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // Appearance & Navigation settings from StorageService
  const [appearance, setAppearance] = useState(() => StorageService.getAppearanceSettings());
  const [navSettings, setNavSettings] = useState(() => StorageService.getNavigationSettings());
  const [customModules, setCustomModules] = useState(() => StorageService.getCustomModules());

  const reloadSettings = () => {
    setAppearance(StorageService.getAppearanceSettings());
    setNavSettings(StorageService.getNavigationSettings());
    setCustomModules(StorageService.getCustomModules());
  };

  useEffect(() => {
    window.addEventListener('italy_msc_storage_changed', reloadSettings);
    return () => {
      window.removeEventListener('italy_msc_storage_changed', reloadSettings);
    };
  }, []);

  // State for collapsible navigation groups (default all open)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('italy_msc_sidebar_groups');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const updated = { ...prev, [sectionId]: !prev[sectionId] };
      try {
        localStorage.setItem('italy_msc_sidebar_groups', JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const baseSections: NavSection[] = [
    {
      id: 'command_center',
      title: 'COMMAND CENTER',
      items: [
        { key: 'landing', label: 'Public Portal Home', icon: Compass },
        { key: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
        { key: 'profile', label: 'Academic Profile', icon: UserCheck },
        { key: 'analytics', label: 'Reports & Analytics', icon: TrendingUp },
        { key: 'calendar', label: 'Calendar & Deadlines', icon: Calendar },
      ],
    },
    {
      id: 'admission',
      title: 'ADMISSION & UNIVERSITIES',
      items: [
        { key: 'regions', label: 'All 20 Italian Regions', icon: MapPin },
        { key: 'explorer', label: 'Public Uni Explorer', icon: Building2 },
        { key: 'programmes', label: 'Degree Programmes', icon: GraduationCap },
        {
          key: 'applications',
          label: 'Application Manager',
          icon: BriefcaseBusiness,
          badge: totalAppsCount > 0 ? totalAppsCount : undefined,
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
        },
        { key: 'universitaly', label: 'Universitaly Pre-enrolment', icon: Globe2 },
        { key: 'enrollment', label: 'University Enrollment', icon: BookOpenCheck },
      ],
    },
    {
      id: 'scholarships',
      title: 'SCHOLARSHIP & FINANCE',
      items: [
        { key: 'scholarships', label: 'Scholarship & DSU', icon: Coins },
        { key: 'sponsor_bank', label: 'Sponsor & Bank Funds', icon: Landmark },
        { key: 'budget', label: 'Financial Budget', icon: WalletCards },
      ],
    },
    {
      id: 'documents',
      title: 'DOCUMENTS & LEGALIZATION',
      items: [
        { key: 'documents', label: 'Document Manager', icon: FileText },
        { key: 'cimea_dov', label: 'CIMEA, DOV & Apostille', icon: FileCheck2 },
        { key: 'visa_checklist', label: 'Visa Checklist', icon: ShieldCheck },
      ],
    },
    {
      id: 'visa',
      title: 'VISA & EMBASSY',
      items: [
        { key: 'embassy_visa', label: 'Embassy & Visa Tracker', icon: Award },
      ],
    },
    {
      id: 'relocation',
      title: 'RELOCATION & LIFE',
      items: [
        { key: 'accommodation', label: 'Accommodation', icon: Home },
        { key: 'flight_planner', label: 'Flight Planner', icon: Plane },
        { key: 'travel_checklist', label: 'Airport & Departure Prep', icon: Luggage },
        { key: 'residence_permit', label: 'Permesso di Soggiorno', icon: CheckSquare },
        { key: 'student_life', label: 'Italy Student Life', icon: Coffee },
      ],
    },
    {
      id: 'productivity',
      title: 'DAILY PRODUCTIVITY',
      items: [
        {
          key: 'tasks',
          label: 'Tasks & Milestones',
          icon: ListTodo,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          badgeColor: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        },
        { key: 'notes_links', label: 'Notes & Official Links', icon: BookmarkCheck },
      ],
    },
  ];

  // If custom modules exist, add dynamic custom sections
  if (customModules.length > 0) {
    baseSections.push({
      id: 'custom_sections',
      title: 'CUSTOM SECTIONS',
      items: customModules.map((m) => ({
        key: `custom_${m.id}`,
        label: m.name,
        icon: BookOpen,
      })),
    });
  }

  // Add ADMINISTRATION & SYSTEM only for administrator account
  if (StorageService.isAdmin()) {
    baseSections.push({
      id: 'owner_admin',
      title: 'ADMINISTRATION & SYSTEM',
      items: [
        {
          key: 'admin_dashboard',
          label: 'Admin Dashboard',
          icon: ShieldCheck,
          badge: 'Admin',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
        },
        {
          key: 'admin_control',
          label: 'Admin Control Center',
          icon: SlidersHorizontal,
        },
        {
          key: 'appearance',
          label: 'Appearance & Design',
          icon: Palette,
        },
        {
          key: 'custom_modules',
          label: 'Custom Module Builder',
          icon: Layers,
        },
      ],
    });
  }

  // Filter hidden modules and apply label overrides
  const hiddenKeys = navSettings.hiddenModules || [];
  const customLabels = navSettings.customLabels || {};

  const sections: NavSection[] = baseSections
    .map((sec) => ({
      ...sec,
      items: sec.items
        .filter((item) => !hiddenKeys.includes(item.key))
        .map((item) => ({
          ...item,
          label: customLabels[item.key] || item.label,
        })),
    }))
    .filter((sec) => sec.items.length > 0);

  const handleSelect = (key: ModuleKey) => {
    onSelectModule(key);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-950/95 border-r border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} w-72`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            {/* Italian Flag Emblem */}
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex flex-col justify-between shadow-inner shrink-0">
              <div className="flex h-full w-full rounded overflow-hidden">
                <div className="w-1/3 bg-emerald-500" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-rose-600" />
              </div>
            </div>

            {/* Brand Title (hidden in desktop collapsed mode) */}
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="text-sm font-extrabold tracking-tight text-white truncate">
                    {appearance.brandTitle || 'Italy Study Portal'}
                  </span>
                  {appearance.showBadges && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {appearance.brandBadge || '2026/27'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  {appearance.brandSubtitle || 'University & Visa Hub'}
                </p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse / expand button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors ml-auto"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Target Intake Subheader (only in expanded mode) */}
        {!isCollapsed && (
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] shrink-0">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Intake: Fall 2027</span>
            </div>
            <span className="text-slate-400 font-medium">Public Unis</span>
          </div>
        )}

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {sections.map((sec) => {
            const isGroupCollapsed = Boolean(collapsedSections[sec.id]);

            return (
              <div key={sec.id} className="space-y-1">
                {/* Section Header with Collapse Chevron */}
                {!isCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors text-left group"
                  >
                    <span>{sec.title}</span>
                    <span className="text-slate-400 group-hover:text-slate-300 transition-transform">
                      {isGroupCollapsed ? (
                        <ChevronRight className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </span>
                  </button>
                ) : (
                  <div className="my-1.5 border-t border-slate-800/70" />
                )}

                {/* Section Items (hidden if group collapsed and not in icon-only mode) */}
                {(!isGroupCollapsed || isCollapsed) && (
                  <div className="space-y-0.5">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentModule === item.key;

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleSelect(item.key)}
                          title={isCollapsed ? item.label : undefined}
                          className={`w-full flex items-center ${
                            isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-2.5 py-2'
                          } rounded-xl text-xs font-medium transition-all group relative ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                          }`}
                        >
                          <div className={`flex items-center space-x-2.5 ${isCollapsed ? 'justify-center' : 'truncate'}`}>
                            {/* Active indicator dot */}
                            {isActive && !isCollapsed && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            )}
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive
                                  ? 'text-emerald-400'
                                  : 'text-slate-400 group-hover:text-slate-200'
                              }`}
                            />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </div>

                          {!isCollapsed && item.badge && (
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${
                                item.badgeColor ||
                                (isActive
                                  ? 'bg-emerald-500/25 text-emerald-200'
                                  : 'bg-slate-800 text-slate-400')
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {/* Hover Tooltip in Desktop Collapsed Mode */}
                          {isCollapsed && (
                            <div className="hidden lg:group-hover:flex absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-white whitespace-nowrap shadow-xl z-50 pointer-events-none items-center gap-2">
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 shrink-0">
          {(() => {
            const session = StorageService.getAuthSession();
            const user = session?.user;
            const initials = user?.fullName
              ? user.fullName
                  .split(' ')
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'G';
            const displayName = user?.fullName || 'Guest Visitor';
            const profile = StorageService.getProfile();
            const displaySub = user
              ? user.role === 'admin'
                ? 'Portal Administrator'
                : profile?.bachelorDegree && profile.bachelorDegree.trim()
                ? `${profile.studyLevel ? `${profile.studyLevel} · ` : ''}${profile.bachelorDegree}${profile.subject ? ` (${profile.subject})` : ''}`
                : user.bachelorDegree && user.bachelorDegree.trim()
                ? user.bachelorDegree
                : 'Complete Your Profile'
              : 'Sign in to sync roadmap';

            return (
              <div
                className={`rounded-xl bg-slate-900/80 border border-slate-800 flex items-center ${
                  isCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
                }`}
              >
                <div
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : 'space-x-2.5'
                  } min-w-0 cursor-pointer`}
                  onClick={() => handleSelect('profile')}
                  title="View Academic Profile"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      user?.role === 'admin'
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                        : user
                        ? 'bg-teal-500/20 border border-teal-500/30 text-teal-300'
                        : 'bg-slate-800 border border-slate-750 text-slate-400'
                    }`}
                  >
                    {initials}
                  </div>
                  {!isCollapsed && (
                    <div className="text-left min-w-0">
                      <div className="text-xs font-semibold text-slate-200 leading-tight truncate">
                        {displayName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {displaySub}
                      </div>
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <button
                    onClick={() => handleSelect('profile')}
                    title="View Profile Settings"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    aria-label="Profile Settings"
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </aside>
    </>
  );
};

