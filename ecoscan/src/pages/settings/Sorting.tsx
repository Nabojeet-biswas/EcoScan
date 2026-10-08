import { useSettings } from '@/context/SettingsContext';
import { BIN_COLOR_SYSTEMS } from '@/context/SettingsTypes';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';
import { SelectField } from '@/components/settings/SelectField';
import { ToggleSwitch } from '@/components/settings/ToggleSwitch';

export function Sorting() {
  const { settings, updateSettings } = useSettings();
  const sorting = settings.sorting;

  const handleChange = <K extends keyof typeof sorting>(key: K, value: any) => {
    updateSettings({ sorting: { ...sorting, [key]: value } });
  };

  const handleToggle = (key: keyof typeof sorting) => (checked: boolean) => {
    handleChange(key, checked);
  };

  const handleSelect = (key: keyof typeof sorting) => (value: string) => {
    handleChange(key, value);
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Bin Colors" description="Choose the color coding system for recycling bins">
        <SettingRow>
          <SelectField
            name="binColorSystem"
            label="Color System"
            value={sorting.binColorSystem}
            onChange={handleSelect('binColorSystem')}
            options={BIN_COLOR_SYSTEMS.map(s => ({ value: s.value, label: s.label }))}
            helperText="Standard uses universal colors; Regional adapts to local guidelines"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Tips & Reminders" description="Helpful guidance during and after sorting">
        <SettingRow>
          <ToggleSwitch
            checked={settings.sorting.showDisposalTips}
            onChange={handleToggle('showDisposalTips')}
            label="Show Disposal Tips"
            helperText="Display specific disposal instructions after each scan"
          />
        </SettingRow>
        <SettingRow>
          <ToggleSwitch
            checked={settings.sorting.localRecyclingReminders}
            onChange={handleToggle('localRecyclingReminders')}
            label="Local Recycling Reminders"
            helperText="Periodic reminders about local recycling rules and updates"
          />
        </SettingRow>
      </SettingsCard>
    </div>
  );
}