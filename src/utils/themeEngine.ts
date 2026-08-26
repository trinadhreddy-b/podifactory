import { ThemeConfig } from '../types';
import { THEME_PRESETS } from '../data/themePresets';

const THEME_STORAGE_KEY = 'the_podi_factory_theme';

export function applyThemeToDOM(theme: ThemeConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-hover', theme.primaryHover || theme.primary);
  root.style.setProperty('--color-primary-container', theme.primaryContainer || theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-surface', theme.surface);
  root.style.setProperty('--color-surface-container', theme.surfaceContainer);
  root.style.setProperty('--color-surface-card', theme.surfaceCard || '#ffffff');
  root.style.setProperty('--color-on-surface', theme.onSurface);
  root.style.setProperty('--color-on-surface-variant', theme.onSurfaceVariant);
  root.style.setProperty('--color-outline', theme.outline);
  root.style.setProperty('--radius-btn', theme.btnRadius);
  root.style.setProperty('--radius-card', theme.cardRadius);

  // Save to storage
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (e) {
    console.warn('Could not save theme to localStorage', e);
  }
}

export function loadSavedTheme(): ThemeConfig {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (e) {
    console.warn('Could not load theme from localStorage', e);
  }
  return THEME_PRESETS[0];
}

export function generateCssVariablesSnippet(theme: ThemeConfig): string {
  return `:root {
  /* Centralized Theme CSS Variables */
  --color-primary: ${theme.primary};
  --color-primary-hover: ${theme.primaryHover};
  --color-primary-container: ${theme.primaryContainer};
  --color-secondary: ${theme.secondary};
  --color-surface: ${theme.surface};
  --color-surface-container: ${theme.surfaceContainer};
  --color-surface-card: ${theme.surfaceCard};
  --color-on-surface: ${theme.onSurface};
  --color-on-surface-variant: ${theme.onSurfaceVariant};
  --color-outline: ${theme.outline};
  --radius-btn: ${theme.btnRadius};
  --radius-card: ${theme.cardRadius};
}`;
}
