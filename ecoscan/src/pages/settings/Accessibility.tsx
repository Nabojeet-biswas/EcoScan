import { useSettings } from '@/context/SettingsContext';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';
import { ToggleSwitch } from '@/components/settings/ToggleSwitch';

export function Accessibility() {
  const { settings, updateSettings } = useSettings();
  const accessibility = settings.accessibility;

  const handleToggle = (key: keyof typeof accessibility) => (checked: boolean) => {
    updateSettings({ accessibility: { ...accessibility, [key]: checked } });
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Visual" description="Adjust visual presentation for better readability">
        <SettingRow>
          <ToggleSwitch
            checked={accessibility.highContrast}
            onChange={handleToggle('highContrast')}
            label="High Contrast"
            helperText="Increase color contrast for better visibility"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Interaction" description="Adjust touch and focus behavior">
        <SettingRow>
          <ToggleSwitch
            checked={accessibility.largerTapTargets}
            onChange={handleToggle('largerTapTargets')}
            label="Larger Tap Targets"
            helperText="Increase touch target sizes for easier interaction"
          />
        </SettingRow>
        <SettingRow>
          <ToggleSwitch
            checked={accessibility.focusHighlight}
            onChange={handleToggle('focusHighlight')}
            label="Focus Highlight"
            helperText="Show visible outline on focused elements"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Screen Reader" description="Improve experience for screen reader users">
        <SettingRow>
          <ToggleSwitch
            checked={accessibility.screenReaderDescriptions}
            onChange={handleToggle('screenReaderDescriptions')}
            label="Verbose Descriptions"
            helperText="Provide more detailed descriptions for screen readers"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Live Preview" description="Test your accessibility settings">
        <div className="p-6 space-y-4">
          <div className="px-4 py-3 rounded-xl bg-bg-surface border border-line">
            <p className="font-medium text-fg">Sample Card</p>
            <p className="text-fg-dim text-sm mt-1">This is how content appears with your current settings.</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface">
            Focusable Button
          </button>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-surface border border-line">
            <span className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">✓</span>
            <span className="text-fg">Large tap target example</span>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}