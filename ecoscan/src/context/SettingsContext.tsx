import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Settings } from './SettingsTypes';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: DeepPartial<Settings>) => void;
  resetToDefaults: () => void;
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  dirtyFields: Record<string, unknown>;
  setDirtyField: (path: string, value: unknown) => void;
  clearDirtyField: (path: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  requestNotificationPermission: () => Promise<NotificationPermission>;
}

const SETTINGS_VERSION = 1;

const DEFAULT_SETTINGS_VALUES: Settings = {
  version: 1,
  profile: { displayName: '', avatar: '🌱', email: '', city: '' },
  appearance: { accentColor: 'green', textSize: 'medium', compactMode: false, reduceMotion: false },
  language: { language: 'en', units: 'metric', dateFormat: 'YYYY-MM-DD' },
  scan: { defaultCamera: 'back', imageQuality: 'high', autoStartScanning: false, saveScanHistory: true, showConfidenceScore: true, showEnvironmentalImpact: true, soundEffects: true, hapticFeedback: true },
  sorting: { binColorSystem: 'standard', showDisposalTips: true, localRecyclingReminders: true },
  notifications: { enabled: false, dailyEcoTip: true, weeklyImpactSummary: true, scanReminders: true, quietHoursStart: '22:00', quietHoursEnd: '08:00' },
  privacy: { privacyFirstProcessing: true, anonymousAnalytics: false },
  accessibility: { highContrast: false, largerTapTargets: false, screenReaderDescriptions: false, focusHighlight: true, reduceMotion: false },
};

function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target } as Record<string, unknown>;
  const sourceObj = source as Record<string, unknown>;
  const targetObj = target as Record<string, unknown>;
  
  for (const key of Object.keys(sourceObj)) {
    const sourceValue = sourceObj[key];
    const targetValue = targetObj[key];
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }
  return result as T;
}

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS_VALUES;
  try {
    const stored = localStorage.getItem('ecoscan:settings');
    if (!stored) return DEFAULT_SETTINGS_VALUES;
    const parsed = JSON.parse(stored);
    if (parsed.version !== 1) return DEFAULT_SETTINGS_VALUES;
    return deepMerge(DEFAULT_SETTINGS_VALUES, parsed);
  } catch {
    return DEFAULT_SETTINGS_VALUES;
  }
}

function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ecoscan:settings', JSON.stringify({ ...settings, version: SETTINGS_VERSION }));
  } catch {
    // ignore
  }
}

function applyAppearanceSettings(settings: Settings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const { reduceMotion: accessibilityReduceMotion } = settings.accessibility;

  const accentVars: Record<string, string> = {
    green: '#35c997',
    blue: '#3b82f6',
    purple: '#a855f7',
    orange: '#f97316',
    red: '#ef4444',
  };
  root.style.setProperty('--color-accent-dark', accentVars[settings.appearance.accentColor] ?? '#35c997');
  root.style.setProperty('--color-brand-light', accentVars[settings.appearance.accentColor] ?? '#35c997');
  
  const textSizes = { small: '14px', medium: '16px', large: '18px' };
  root.style.setProperty('font-size', textSizes[settings.appearance.textSize] ?? '16px');

  root.classList.toggle('compact-mode', settings.appearance.compactMode);
  root.classList.toggle('reduce-motion', settings.appearance.reduceMotion || accessibilityReduceMotion);
  root.classList.toggle('high-contrast', settings.accessibility.highContrast);
  root.classList.toggle('larger-tap-targets', settings.accessibility.largerTapTargets);
  root.classList.toggle('focus-highlight', settings.accessibility.focusHighlight);
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [isDirty, setIsDirty] = useState(false);
  const [dirtyFields, setDirtyFields] = useState<Record<string, unknown>>({});
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([]);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applyAppearanceSettings(loaded);
  }, []);

  useEffect(() => {
    applyAppearanceSettings(settings);
  }, [settings.appearance, settings.accessibility]);

  const updateSettings = useCallback((partial: DeepPartial<Settings>) => {
    setSettings((prev) => {
      const merged = deepMerge(prev, partial as Partial<Settings>);
      saveSettings(merged);
      return merged;
    });
    showToast('Saved', 'success');
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = { ...DEFAULT_SETTINGS_VALUES, version: SETTINGS_VERSION };
    setSettings(defaults);
    saveSettings(defaults);
    showToast('Reset to defaults', 'success');
  }, []);

  const setDirty = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
    if (!dirty) setDirtyFields({});
  }, []);

  const setDirtyField = useCallback((path: string, value: unknown) => {
    setDirtyFields((prev) => ({ ...prev, [path]: value }));
    setIsDirty(true);
  }, []);

  const clearDirtyField = useCallback((path: string) => {
    setDirtyFields((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
    setIsDirty(Object.keys(dirtyFields).length > 1);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    return await Notification.requestPermission();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetToDefaults,
        isDirty,
        setDirty,
        dirtyFields,
        setDirtyField,
        clearDirtyField,
        showToast,
        requestNotificationPermission,
      }}
    >
      {children}
      {toasts.map((t) => (
        <div
          key={t.id}
          className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 animate-slide-up"
          data-toast-type={t.type}
          role="status"
          aria-live="polite"
        >
          {t.message}
        </div>
      ))}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}