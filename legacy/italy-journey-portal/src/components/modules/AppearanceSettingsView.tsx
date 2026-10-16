import React, { useState, useEffect } from 'react';
import {
  AppearanceSettings,
  DashboardSettings,
  NavigationSettings,
  ThemePalette,
} from '../../types';
import { StorageService } from '../../services/storage';
import { Badge } from '../common/Badge';
import {
  Palette,
  Layout,
  Type,
  Sun,
  Moon,
  Sparkles,
  Check,
  Undo2,
  RotateCcw,
  Sliders,
  Eye,
  SlidersHorizontal,
  Layers,
  Save,
  Compass,
  Monitor,
  Sidebar as SidebarIcon,
  Table as TableIcon,
  ShieldCheck,
  Building2,
  Calendar,
  GraduationCap,
} from 'lucide-react';

interface AppearanceSettingsViewProps {
  onAppearanceChanged?: (settings: AppearanceSettings) => void;
  onNavigate?: (module: any) => void;
}

export const AppearanceSettingsView: React.FC<AppearanceSettingsViewProps> = ({
  onAppearanceChanged,
  onNavigate,
}) => {
  // Loaded stored settings
  const [savedSettings, setSavedSettings] = useState<AppearanceSettings>(() =>
    StorageService.getAppearanceSettings()
  );
  // Current draft settings for live editing & preview
  const [settings, setSettings] = useState<AppearanceSettings>(() =>
    StorageService.getAppearanceSettings()
  );

  // Navigation settings for menu labels & visibility
  const [navSettings, setNavSettings] = useState<NavigationSettings>(() =>
    StorageService.getNavigationSettings()
  );

  // Notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // Palette definitions
  const PALETTES: {
    id: ThemePalette;
    name: string;
    description: string;
    primaryHex: string;
    secondaryHex: string;
    bgHex: string;
  }[] = [
    {
      id: 'emerald_navy',
      name: 'Emerald & Italian Navy (Default)',
      description: 'Official Italian Republic flag accents with deep midnight slate.',
      primaryHex: '#10b981',
      secondaryHex: '#047857',
      bgHex: '#020617',
    },
    {
      id: 'sapphire_blue',
      name: 'Sapphire & Venetian Blue',
      description: 'Regal Mediterranean blue inspired by Venice and University of Bologna.',
      primaryHex: '#3b82f6',
      secondaryHex: '#1d4ed8',
      bgHex: '#0f172a',
    },
    {
      id: 'forest_mint',
      name: 'Alpine Mint & Pine',
      description: 'Crisp alpine green inspired by Piedmont & Trentino-Alto Adige mountains.',
      primaryHex: '#14b8a6',
      secondaryHex: '#0f766e',
      bgHex: '#022c22',
    },
    {
      id: 'cyber_slate',
      name: 'Monochrome Cyber Slate',
      description: 'High-contrast neutral slate for minimal engineering workflows.',
      primaryHex: '#94a3b8',
      secondaryHex: '#64748b',
      bgHex: '#0a0f1d',
    },
    {
      id: 'velvet_purple',
      name: 'Florentine Velvet Amethyst',
      description: 'Renaissance Tuscan purple inspired by Florence and Siena.',
      primaryHex: '#a855f7',
      secondaryHex: '#7e22ce',
      bgHex: '#180d2b',
    },
  ];

  const FONT_OPTIONS: { id: AppearanceSettings['fontFamily']; label: string; desc: string }[] = [
    { id: 'inter', label: 'Inter', desc: 'Ultra-clean modern sans-serif (Recommended)' },
    { id: 'jakarta', label: 'Plus Jakarta Sans', desc: 'Refined geometric SaaS typography' },
    { id: 'system', label: 'System Native Sans', desc: 'Default OS system UI font' },
  ];

  const FONT_SCALES: { id: AppearanceSettings['fontSizeScale']; label: string; px: string }[] = [
    { id: 'compact', label: 'Compact Density', px: '13px / Dense data display' },
    { id: 'normal', label: 'Normal / Standard', px: '14px / Balanced readability' },
    { id: 'spacious', label: 'Comfortable Large', px: '15px / Relaxed reading' },
  ];

  const RADIUS_OPTIONS: { id: AppearanceSettings['cardRadius']; label: string }[] = [
    { id: 'md', label: 'Sharp / Small (rounded-lg)' },
    { id: 'xl', label: 'Medium (rounded-xl)' },
    { id: '2xl', label: 'Modern Curved (rounded-2xl)' },
    { id: '3xl', label: 'Ultra Curved (rounded-3xl)' },
  ];

  const ELEVATION_OPTIONS: { id: AppearanceSettings['cardElevation']; label: string }[] = [
    { id: 'flat', label: 'Flat Minimal (Border only)' },
    { id: 'subtle', label: 'Subtle Shadow (Clean SaaS)' },
    { id: 'glow', label: 'Emerald Glow Highlight' },
  ];

  // Save changes
  const handleSave = () => {
    StorageService.saveAppearanceSettings(settings);
    setSavedSettings(settings);
    if (onAppearanceChanged) {
      onAppearanceChanged(settings);
    }
    // Apply theme mode class to documentElement
    if (settings.themeMode === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    showToast('Appearance settings saved and applied successfully!');
  };

  // Undo changes
  const handleUndo = () => {
    setSettings(savedSettings);
    showToast('Reverted unsaved draft changes.');
  };

  // Reset to default design (Crucially preserves all user data!)
  const handleResetToDefault = () => {
    StorageService.resetAppearanceSettings();
    const defaults = StorageService.getAppearanceSettings();
    setSettings(defaults);
    setSavedSettings(defaults);
    if (onAppearanceChanged) {
      onAppearanceChanged(defaults);
    }
    document.documentElement.classList.remove('light-mode');
    showToast('Appearance design reset to default. User admission data preserved!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-xs shadow-2xl shadow-emerald-950 flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
            <Palette className="w-4 h-4" />
            <span>Theme, Layout & Design Customization</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Appearance & Branding Settings</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Customize portal branding, theme palettes, typography scales, card geometry, table density, and live UI components with instant preview and safe reset.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleUndo}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors border border-slate-700"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo Draft</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30 text-slate-400 font-semibold text-xs flex items-center space-x-1.5 transition-colors border border-slate-800"
            title="Resets only appearance settings, user data is safe"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Design</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg transition-all ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950 hover:scale-[1.02]'
                : 'bg-slate-800 text-slate-400 cursor-default opacity-60'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW COMPONENT */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Live Interactive Preview (Simulated Portal Components)</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Palette: {settings.colorPalette} • Font: {settings.fontFamily} • Scale: {settings.fontSizeScale}
          </span>
        </div>

        {/* Mock Portal Preview Box */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            settings.themeMode === 'light'
              ? 'bg-slate-100 text-slate-900 border-slate-300 shadow-md'
              : 'bg-slate-950 text-slate-100 border-slate-800'
          }`}
          style={{
            fontFamily:
              settings.fontFamily === 'inter'
                ? 'Inter, sans-serif'
                : settings.fontFamily === 'jakarta'
                ? '"Plus Jakarta Sans", sans-serif'
                : 'system-ui, sans-serif',
          }}
        >
          {/* Mock Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/40">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                IT
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center space-x-1.5">
                  <span>{settings.brandTitle || 'Italy Journey Portal'}</span>
                  {settings.showBadges && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      {settings.brandBadge || '2026/27'}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">{settings.brandSubtitle}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                Active Round 1
              </span>
              <button
                type="button"
                className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-semibold shadow-sm"
              >
                Sample Button
              </button>
            </div>
          </div>

          {/* Mock Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
            <div
              className={`p-4 border bg-slate-900/60 transition-all ${
                settings.cardRadius === 'md'
                  ? 'rounded-lg'
                  : settings.cardRadius === 'xl'
                  ? 'rounded-xl'
                  : settings.cardRadius === '3xl'
                  ? 'rounded-3xl'
                  : 'rounded-2xl'
              } ${
                settings.cardElevation === 'glow'
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="text-[11px] text-slate-400">Applications Target</div>
              <div className="text-xl font-extrabold text-white mt-1">4 Universities</div>
              <div className="text-[10px] text-emerald-400 mt-1">PoliTO, UniBo, UniPi, Sapienza</div>
            </div>

            <div
              className={`p-4 border bg-slate-900/60 transition-all ${
                settings.cardRadius === 'md'
                  ? 'rounded-lg'
                  : settings.cardRadius === 'xl'
                  ? 'rounded-xl'
                  : settings.cardRadius === '3xl'
                  ? 'rounded-3xl'
                  : 'rounded-2xl'
              } ${
                settings.cardElevation === 'glow'
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="text-[11px] text-slate-400">DSU Regional Grant</div>
              <div className="text-xl font-extrabold text-white mt-1">€7,500 + Meals</div>
              <div className="text-[10px] text-teal-300 mt-1">EDISU Piemonte / ER.GO</div>
            </div>

            <div
              className={`p-4 border bg-slate-900/60 transition-all ${
                settings.cardRadius === 'md'
                  ? 'rounded-lg'
                  : settings.cardRadius === 'xl'
                  ? 'rounded-xl'
                  : settings.cardRadius === '3xl'
                  ? 'rounded-3xl'
                  : 'rounded-2xl'
              } ${
                settings.cardElevation === 'glow'
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="text-[11px] text-slate-400">Roadmap Progress</div>
              <div className="text-xl font-extrabold text-white mt-1">75% Ready</div>
              <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. BRANDING & TITLE CUSTOMIZATION */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>1. Website Title & Portal Branding</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Website Portal Title
              </label>
              <input
                type="text"
                value={settings.brandTitle}
                onChange={(e) => setSettings({ ...settings, brandTitle: e.target.value })}
                placeholder="Italy Journey Portal"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Shown in the sidebar top brand header and browser window tabs.
              </span>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Portal Subtitle / Academic Tagline
              </label>
              <input
                type="text"
                value={settings.brandSubtitle}
                onChange={(e) => setSettings({ ...settings, brandSubtitle: e.target.value })}
                placeholder="University & Visa Admissions Hub"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Intake Badge Tag</label>
                <input
                  type="text"
                  value={settings.brandBadge}
                  onChange={(e) => setSettings({ ...settings, brandBadge: e.target.value })}
                  placeholder="2026/27"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Sidebar Badges Visibility
                </label>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, showBadges: !settings.showBadges })}
                  className={`w-full py-2.5 px-3 rounded-xl border font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                    settings.showBadges
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{settings.showBadges ? 'Badges Visible' : 'Badges Hidden'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. THEME COLORS & PALETTE */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>2. Theme Colors & Mode</span>
          </div>

          {/* Theme Mode Toggle (Dark / Light) */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Color Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, themeMode: 'dark' })}
                  className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 font-bold transition-all ${
                    settings.themeMode === 'dark'
                      ? 'bg-slate-950 text-emerald-300 border-emerald-500/50 shadow-md shadow-slate-950'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4 text-emerald-400" />
                  <span>Dark Navy (Default)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, themeMode: 'light' })}
                  className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 font-bold transition-all ${
                    settings.themeMode === 'light'
                      ? 'bg-white text-slate-900 border-slate-300 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>High Contrast Light</span>
                </button>
              </div>
            </div>

            {/* Color Palette List */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Color Palette</label>
              <div className="space-y-2">
                {PALETTES.map((p) => {
                  const isSelected = settings.colorPalette === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSettings({ ...settings, colorPalette: p.id })}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-slate-950 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-1">
                          <div
                            className="w-4 h-4 rounded-full border border-slate-800"
                            style={{ backgroundColor: p.primaryHex }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-slate-800"
                            style={{ backgroundColor: p.secondaryHex }}
                          />
                        </div>
                        <div>
                          <div
                            className={`font-bold text-xs ${
                              isSelected ? 'text-emerald-300' : 'text-slate-200'
                            }`}
                          >
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{p.description}</div>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. TYPOGRAPHY & FONT SCALING */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Type className="w-4 h-4 text-emerald-400" />
            <span>3. Typography & Font Sizing</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Primary Font Family</label>
              <div className="space-y-2">
                {FONT_OPTIONS.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setSettings({ ...settings, fontFamily: f.id })}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      settings.fontFamily === f.id
                        ? 'bg-slate-950 border-emerald-500/50 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{f.label}</div>
                      <div className="text-[10px] text-slate-400">{f.desc}</div>
                    </div>
                    {settings.fontFamily === f.id && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Global Font Scale</label>
              <div className="grid grid-cols-3 gap-2">
                {FONT_SCALES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, fontSizeScale: s.id })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      settings.fontSizeScale === s.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div className="text-xs">{s.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{s.px}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Heading Size Scale */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Heading Size Preset</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'compact', label: 'Compact', px: '20–24px' },
                  { id: 'standard', label: 'Standard', px: '24–28px' },
                  { id: 'prominent', label: 'Prominent', px: '28–32px' },
                ].map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, headingScale: h.id as any })}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      settings.headingScale === h.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div className="text-xs">{h.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{h.px}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Text Size */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Body Text Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sm', label: 'Small', px: '13–14px' },
                  { id: 'base', label: 'Base', px: '14–16px' },
                  { id: 'lg', label: 'Comfortable', px: '15–17px' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, bodyTextSize: b.id as any })}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      settings.bodyTextSize === b.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div className="text-xs">{b.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{b.px}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Weight & Button Typography */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Font Weight Preset</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'regular', label: 'Clean (400 / 600)' },
                    { id: 'medium', label: 'Medium (500 / 600)' },
                    { id: 'semibold', label: 'Firm (600 / 700)' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, fontWeightPreset: w.id as any })}
                      className={`w-full py-1.5 px-2.5 rounded-lg border text-left text-xs transition-colors ${
                        settings.fontWeightPreset === w.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Button Typography</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'normal', label: 'Regular (400)' },
                    { id: 'medium', label: 'Medium (500)' },
                    { id: 'semibold', label: 'Semibold (600)' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, buttonTypography: btn.id as any })}
                      className={`w-full py-1.5 px-2.5 rounded-lg border text-left text-xs transition-colors ${
                        settings.buttonTypography === btn.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Number Size */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Dashboard Number Size (KPI Statistics)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'compact', label: 'Compact', px: '24px' },
                  { id: 'standard', label: 'Standard', px: '28px' },
                  { id: 'large', label: 'Large', px: '32px' },
                ].map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, dashboardNumberSize: n.id as any })}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      settings.dashboardNumberSize === n.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div className="text-xs">{n.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{n.px}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. CARD CORNERS, ELEVATION & TABLE DENSITY */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Layout className="w-4 h-4 text-emerald-400" />
            <span>4. Card Geometry, Elevation & Tables</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Card & Modal Corner Radius
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, cardRadius: r.id })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      settings.cardRadius === r.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Card Border Elevation</label>
              <div className="grid grid-cols-3 gap-2">
                {ELEVATION_OPTIONS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, cardElevation: e.id })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      settings.cardElevation === e.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Card Grid Spacing</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'compact', label: 'Tight' },
                    { id: 'normal', label: 'Normal' },
                    { id: 'spacious', label: 'Relaxed' },
                  ].map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, cardSpacing: sp.id as any })}
                      className={`py-1.5 px-1.5 rounded-lg border text-center text-xs font-medium ${
                        settings.cardSpacing === sp.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Layout Density</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, layoutDensity: 'compact' })}
                    className={`py-1.5 px-2 rounded-lg border text-center text-xs font-medium ${
                      settings.layoutDensity === 'compact'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Compact
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, layoutDensity: 'comfortable' })}
                    className={`py-1.5 px-2 rounded-lg border text-center text-xs font-medium ${
                      settings.layoutDensity === 'comfortable'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Spacious
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Table Padding Density</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, tableDensity: 'compact' })}
                    className={`py-2 px-2 rounded-xl border text-center font-medium ${
                      settings.tableDensity === 'compact'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Compact
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, tableDensity: 'comfortable' })}
                    className={`py-2 px-2 rounded-xl border text-center font-medium ${
                      settings.tableDensity === 'comfortable'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Spacious
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Active Item Glow</label>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, activeItemGlow: !settings.activeItemGlow })
                  }
                  className={`w-full py-2 px-3 rounded-xl border text-center font-medium ${
                    settings.activeItemGlow
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {settings.activeItemGlow ? 'Glow Enabled' : 'Glow Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Dashboard Editor & Custom Module Shortcut Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-white text-sm">Need to arrange Dashboard Widgets?</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            You can reorder widgets, resize cards, hide statistics, and customize upcoming deadline thresholds.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
          >
            Go to Main Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('custom_modules')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950"
          >
            Custom Module Builder
          </button>
        </div>
      </div>
    </div>
  );
};

