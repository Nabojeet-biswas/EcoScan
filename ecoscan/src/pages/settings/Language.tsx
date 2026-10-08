import { useSettings } from '@/context/SettingsContext';
import { LANGUAGES, UNITS_OPTIONS, DATE_FORMATS } from '@/context/SettingsTypes';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';
import { SelectField } from '@/components/settings/SelectField';
import { useState, useEffect } from 'react';

export function Language() {
  const { settings, updateSettings } = useSettings();
  const language = settings.language;

  const handleLanguageChange = (value: string) => {
    updateSettings({ language: { ...language, language: value as any } });
  };

  const handleUnitsChange = (value: string) => {
    updateSettings({ language: { ...language, units: value as any } });
  };

  const handleDateFormatChange = (value: string) => {
    updateSettings({ language: { ...language, dateFormat: value as any } });
  };

  const [today, setToday] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date, format: string) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    switch (format) {
      case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
      default: return `${year}-${month}-${day}`;
    }
  };

  const previewDate = formatDate(today, language.dateFormat);

  return (
    <div className="space-y-6">
      <SettingsCard title="Language" description="Choose your preferred language">
        <SettingRow>
          <SelectField
            name="language"
            label="Language"
            value={language.language}
            onChange={handleLanguageChange}
            options={LANGUAGES.map(l => ({ value: l.value, label: `${l.label} (${l.nativeLabel})` }))}
            helperText="Changes take effect immediately"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Measurement Units" description="Preferred system for weights and distances">
        <SettingRow>
          <SelectField
            name="units"
            label="Units"
            value={language.units}
            onChange={handleUnitsChange}
            options={UNITS_OPTIONS.map(u => ({ value: u.value, label: u.label }))}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Date Format" description="How dates are displayed throughout the app">
        <SettingRow>
          <SelectField
            name="dateFormat"
            label="Format"
            value={language.dateFormat}
            onChange={handleDateFormatChange}
            options={DATE_FORMATS.map(f => ({ value: f.value, label: `${f.label} — ${f.example}` }))}
          />
        </SettingRow>
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">Live Preview</span>
              <p className="text-fg-dim text-xs mt-0.5">Today's date in your selected format</p>
            </label>
            <div className="mt-2 px-4 py-3 rounded-xl bg-bg-surface border border-line font-mono text-lg text-fg">
              {previewDate}
            </div>
          </div>
        </SettingRow>
      </SettingsCard>
    </div>
  );
}