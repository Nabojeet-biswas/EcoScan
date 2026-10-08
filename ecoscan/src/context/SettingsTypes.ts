export type AccentColor = 'green' | 'blue' | 'purple' | 'orange' | 'red';

export type TextSize = 'small' | 'medium' | 'large';

export type Language = 'en' | 'bn' | 'hi';

export type Units = 'metric' | 'imperial';

export type DateFormat = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';

export type CameraPosition = 'back' | 'front';

export type ImageQuality = 'low' | 'medium' | 'high';

export type BinColorSystem = 'standard' | 'regional';

export type AvatarOption = 
  | '🌱' | '🌿' | '🍃' | '🌲' 
  | '♻️' | '🗂️' | '📦' | '🌍';

export interface ProfileSettings {
  displayName: string;
  avatar: AvatarOption;
  email: string;
  city: string;
}

export interface AppearanceSettings {
  accentColor: AccentColor;
  textSize: TextSize;
  compactMode: boolean;
  reduceMotion: boolean;
}

export interface LanguageSettings {
  language: Language;
  units: Units;
  dateFormat: DateFormat;
}

export interface ScanSettings {
  defaultCamera: CameraPosition;
  imageQuality: ImageQuality;
  autoStartScanning: boolean;
  saveScanHistory: boolean;
  showConfidenceScore: boolean;
  showEnvironmentalImpact: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
}

export interface SortingSettings {
  binColorSystem: BinColorSystem;
  showDisposalTips: boolean;
  localRecyclingReminders: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  dailyEcoTip: boolean;
  weeklyImpactSummary: boolean;
  scanReminders: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface PrivacySettings {
  privacyFirstProcessing: boolean;
  anonymousAnalytics: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largerTapTargets: boolean;
  screenReaderDescriptions: boolean;
  focusHighlight: boolean;
  reduceMotion: boolean;
}

export interface StorageInfo {
  used: number;
  total: number;
}

export interface Settings {
  version: number;
  profile: ProfileSettings;
  appearance: AppearanceSettings;
  language: LanguageSettings;
  scan: ScanSettings;
  sorting: SortingSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export const DEFAULT_SETTINGS: Settings = {
  version: 1,
  profile: {
    displayName: '',
    avatar: '🌱',
    email: '',
    city: '',
  },
  appearance: {
    accentColor: 'green',
    textSize: 'medium',
    compactMode: false,
    reduceMotion: false,
  },
  language: {
    language: 'en',
    units: 'metric',
    dateFormat: 'YYYY-MM-DD',
  },
  scan: {
    defaultCamera: 'back',
    imageQuality: 'high',
    autoStartScanning: false,
    saveScanHistory: true,
    showConfidenceScore: true,
    showEnvironmentalImpact: true,
    soundEffects: true,
    hapticFeedback: true,
  },
  sorting: {
    binColorSystem: 'standard',
    showDisposalTips: true,
    localRecyclingReminders: true,
  },
  notifications: {
    enabled: false,
    dailyEcoTip: true,
    weeklyImpactSummary: true,
    scanReminders: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  },
  privacy: {
    privacyFirstProcessing: true,
    anonymousAnalytics: false,
  },
  accessibility: {
    highContrast: false,
    largerTapTargets: false,
    screenReaderDescriptions: false,
    focusHighlight: true,
    reduceMotion: false,
  },
};

export const ACCENT_COLORS: { value: AccentColor; label: string; cssVar: string; preview: string }[] = [
  { value: 'green', label: 'Green', cssVar: '#35c997', preview: '#35c997' },
  { value: 'blue', label: 'Blue', cssVar: '#3b82f6', preview: '#3b82f6' },
  { value: 'purple', label: 'Purple', cssVar: '#a855f7', preview: '#a855f7' },
  { value: 'orange', label: 'Orange', cssVar: '#f97316', preview: '#f97316' },
  { value: 'red', label: 'Red', cssVar: '#ef4444', preview: '#ef4444' },
];

export const TEXT_SIZES: { value: TextSize; label: string; htmlFontSize: string }[] = [
  { value: 'small', label: 'Small', htmlFontSize: '14px' },
  { value: 'medium', label: 'Medium', htmlFontSize: '16px' },
  { value: 'large', label: 'Large', htmlFontSize: '18px' },
];

export const LANGUAGES: { value: Language; label: string; nativeLabel: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

export const UNITS_OPTIONS: { value: Units; label: string }[] = [
  { value: 'metric', label: 'Metric (kg, cm)' },
  { value: 'imperial', label: 'Imperial (lb, in)' },
];

export const DATE_FORMATS: { value: DateFormat; label: string; example: string }[] = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2025-01-15' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '15/01/2025' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '01/15/2025' },
];

export const CAMERA_POSITIONS: { value: CameraPosition; label: string }[] = [
  { value: 'back', label: 'Back Camera' },
  { value: 'front', label: 'Front Camera' },
];

export const IMAGE_QUALITIES: { value: ImageQuality; label: string }[] = [
  { value: 'low', label: 'Low (faster)' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High (detailed)' },
];

export const BIN_COLOR_SYSTEMS: { value: BinColorSystem; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'regional', label: 'Regional' },
];

export const AVATAR_OPTIONS: AvatarOption[] = ['🌱', '🌿', '🍃', '🌲', '♻️', '🗂️', '📦', '🌍'];

export type SettingsSection = 
  | 'profile' 
  | 'appearance' 
  | 'language' 
  | 'scan' 
  | 'sorting' 
  | 'notifications' 
  | 'privacy' 
  | 'accessibility' 
  | 'storage' 
  | 'about';

export interface SectionMeta {
  key: SettingsSection;
  label: string;
  description: string;
  icon: string;
  group: string;
}

export const SECTIONS: SectionMeta[] = [
  { key: 'profile', label: 'Profile', description: 'Display name, avatar, contact info', icon: 'User', group: 'ACCOUNT' },
  { key: 'appearance', label: 'Appearance', description: 'Theme, colors, text size', icon: 'Palette', group: 'PREFERENCES' },
  { key: 'language', label: 'Language & Region', description: 'Language, units, date format', icon: 'Globe', group: 'PREFERENCES' },
  { key: 'scan', label: 'Scan Preferences', description: 'Camera, quality, auto-start', icon: 'Camera', group: 'PREFERENCES' },
  { key: 'sorting', label: 'Waste & Sorting', description: 'Bin colors, tips, reminders', icon: 'Recycle', group: 'PREFERENCES' },
  { key: 'notifications', label: 'Notifications', description: 'Tips, summaries, quiet hours', icon: 'Bell', group: 'SYSTEM' },
  { key: 'privacy', label: 'Privacy & Data', description: 'Analytics, export, clear data', icon: 'Shield', group: 'SYSTEM' },
  { key: 'accessibility', label: 'Accessibility', description: 'Contrast, tap targets, focus', icon: 'Accessibility', group: 'SYSTEM' },
  { key: 'storage', label: 'Storage', description: 'Local storage usage, cache', icon: 'Database', group: 'SYSTEM' },
  { key: 'about', label: 'About', description: 'Version, links, credits', icon: 'Info', group: 'HELP' },
];

export const GROUPS = ['ACCOUNT', 'PREFERENCES', 'SYSTEM', 'HELP'] as const;