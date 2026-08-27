import React from 'react';
import { useStore } from '../context/StoreContext';
import { THEME_PRESETS } from '../data/themePresets';
import { X, Palette, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThemeCustomizerDrawer: React.FC = () => {
  const {
    theme,
    setTheme,
    updateThemeVariable,
    resetThemeToDefault,
    isThemeDrawerOpen,
    setIsThemeDrawerOpen,
  } = useStore();

  if (!isThemeDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsThemeDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md bg-brand-surface-card h-full shadow-2xl z-10 flex flex-col border-l border-brand-outline-variant/40"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          {/* Header */}
          <div className="p-5 border-b border-brand-outline-variant/30 flex items-center justify-between bg-brand-surface-container/60">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-brand-on-surface">
                  Personalize Theme
                </h3>
                <p className="text-[11px] text-brand-on-surface-variant">
                  Choose your favorite color palette & style
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsThemeDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-brand-surface text-brand-on-surface transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Curated Theme Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface">
                  Color Palettes:
                </span>
                <button
                  onClick={resetThemeToDefault}
                  className="text-xs text-brand-muted hover:text-brand-primary flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>

              <div className="space-y-2">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setTheme(preset)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      theme.id === preset.id
                        ? 'border-brand-primary bg-brand-surface-container/80 ring-2 ring-brand-primary/20 shadow-xs'
                        : 'border-brand-outline-variant/50 bg-brand-surface-card hover:bg-brand-surface-container/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-brand-on-surface block">
                        {preset.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center -space-x-1.5">
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.primary }}
                          title="Primary color"
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.secondary }}
                          title="Accent color"
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.surface }}
                          title="Background tone"
                        />
                      </div>
                      {theme.id === preset.id && (
                        <Check className="w-4 h-4 text-brand-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Color Adjusters */}
            <div className="space-y-3 pt-2 border-t border-brand-outline-variant/30">
              <span className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface">
                Custom Color Adjustments:
              </span>

              <div className="space-y-3 bg-brand-surface-container/40 p-4 rounded-xl border border-brand-outline-variant/30 text-xs">
                {/* Primary */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-on-surface">Primary Brand Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.primary}
                      onChange={(e) => updateThemeVariable('primary', e.target.value)}
                      className="w-7 h-7 rounded border border-brand-outline-variant cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.primary}
                      onChange={(e) => updateThemeVariable('primary', e.target.value)}
                      className="w-20 p-1 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card text-center text-brand-on-surface"
                    />
                  </div>
                </div>

                {/* Secondary */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-on-surface">Warm Secondary Accent</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.secondary}
                      onChange={(e) => updateThemeVariable('secondary', e.target.value)}
                      className="w-7 h-7 rounded border border-brand-outline-variant cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.secondary}
                      onChange={(e) => updateThemeVariable('secondary', e.target.value)}
                      className="w-20 p-1 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card text-center text-brand-on-surface"
                    />
                  </div>
                </div>

                {/* Surface */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-on-surface">Page Background Tone</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.surface}
                      onChange={(e) => updateThemeVariable('surface', e.target.value)}
                      className="w-7 h-7 rounded border border-brand-outline-variant cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.surface}
                      onChange={(e) => updateThemeVariable('surface', e.target.value)}
                      className="w-20 p-1 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card text-center text-brand-on-surface"
                    />
                  </div>
                </div>

                {/* Outline */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-on-surface">Card Borders & Outlines</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.outline}
                      onChange={(e) => updateThemeVariable('outline', e.target.value)}
                      className="w-7 h-7 rounded border border-brand-outline-variant cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.outline}
                      onChange={(e) => updateThemeVariable('outline', e.target.value)}
                      className="w-20 p-1 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card text-center text-brand-on-surface"
                    />
                  </div>
                </div>

                {/* Button Radius */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-medium text-brand-on-surface">Button Shape</span>
                  <select
                    value={theme.btnRadius}
                    onChange={(e) => updateThemeVariable('btnRadius', e.target.value)}
                    className="p-1.5 text-xs border border-brand-outline-variant/60 rounded bg-brand-surface-card text-brand-on-surface"
                  >
                    <option value="0px">Sharp Edges</option>
                    <option value="4px">Classic Rounded</option>
                    <option value="8px">Smooth Rounded</option>
                    <option value="9999px">Full Pill Curve</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-brand-outline-variant/30 bg-brand-surface-container/40 flex justify-between items-center text-xs">
            <span className="text-brand-muted">Applies instantly</span>
            <button
              onClick={() => setIsThemeDrawerOpen(false)}
              className="px-5 py-2 font-label-brand font-bold uppercase text-white bg-brand-primary rounded-brand-btn cursor-pointer transition active:scale-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
