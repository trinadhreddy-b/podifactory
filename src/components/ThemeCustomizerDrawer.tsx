import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { THEME_PRESETS } from '../data/themePresets';
import { generateCssVariablesSnippet } from '../utils/themeEngine';
import { X, Palette, Check, RotateCcw, Copy, Code } from 'lucide-react';
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

  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  if (!isThemeDrawerOpen) return null;

  const copyCss = () => {
    navigator.clipboard.writeText(generateCssVariablesSnippet(theme));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                  Theme & CSS Variables
                </h3>
                <p className="text-[11px] text-brand-on-surface-variant">
                  Centralized styling controller
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
                  Curated Presets:
                </span>
                <button
                  onClick={resetThemeToDefault}
                  className="text-xs text-brand-muted hover:text-brand-primary flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
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
                        ? 'border-brand-primary bg-brand-surface-container/80 ring-2 ring-brand-primary/20'
                        : 'border-brand-outline-variant/50 bg-brand-surface-card hover:bg-brand-surface-container/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-brand-on-surface block">
                        {preset.name}
                      </span>
                      <span className="text-[11px] text-brand-muted font-mono">
                        {preset.primary} • {preset.secondary}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-1.5">
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.surface }}
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

            {/* Individual CSS Variable Adjusters */}
            <div className="space-y-3 pt-2 border-t border-brand-outline-variant/30">
              <span className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface">
                Fine-tune CSS Variables:
              </span>

              <div className="space-y-3 bg-brand-surface-container/40 p-4 rounded-xl border border-brand-outline-variant/30 text-xs">
                {/* Primary */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-on-surface">--color-primary</span>
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
                      className="w-20 p-1 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card text-center"
                    />
                  </div>
                </div>

                {/* Secondary */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-on-surface">--color-secondary</span>
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
                      className="w-20 p-1 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card text-center"
                    />
                  </div>
                </div>

                {/* Surface */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-on-surface">--color-surface</span>
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
                      className="w-20 p-1 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card text-center"
                    />
                  </div>
                </div>

                {/* Outline */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-on-surface">--color-outline</span>
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
                      className="w-20 p-1 text-xs font-mono border border-brand-outline-variant/60 rounded bg-brand-surface-card text-center"
                    />
                  </div>
                </div>

                {/* Button Radius */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-medium text-brand-on-surface">--radius-btn</span>
                  <select
                    value={theme.btnRadius}
                    onChange={(e) => updateThemeVariable('btnRadius', e.target.value)}
                    className="p-1.5 text-xs border border-brand-outline-variant/60 rounded bg-brand-surface-card"
                  >
                    <option value="0px">0px (Sharp)</option>
                    <option value="4px">4px (Classic)</option>
                    <option value="8px">8px (Medium)</option>
                    <option value="9999px">9999px (Pill)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Toggle CSS Code View */}
            <div className="space-y-2 pt-2 border-t border-brand-outline-variant/30">
              <button
                onClick={() => setShowCode(!showCode)}
                className="w-full flex items-center justify-between text-xs font-semibold text-brand-on-surface-variant hover:text-brand-primary"
              >
                <div className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>View theme.css Output</span>
                </div>
                <span>{showCode ? 'Hide ▲' : 'Show ▼'}</span>
              </button>

              {showCode && (
                <div className="space-y-2 pt-1">
                  <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-lg text-[10px] font-mono overflow-x-auto">
                    {generateCssVariablesSnippet(theme)}
                  </pre>
                  <button
                    onClick={copyCss}
                    className="w-full py-2 text-xs font-semibold bg-brand-surface-container hover:bg-brand-surface-container-high rounded text-brand-on-surface flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy :root CSS Snippet'}</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-brand-outline-variant/30 bg-brand-surface-container/40 flex justify-between items-center text-xs">
            <span className="text-brand-muted">Applies to all screens instantly</span>
            <button
              onClick={() => setIsThemeDrawerOpen(false)}
              className="px-4 py-2 font-label-brand font-bold uppercase text-white bg-brand-primary rounded-brand-btn"
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
