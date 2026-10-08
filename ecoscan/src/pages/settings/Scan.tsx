import { useSettings } from '@/context/SettingsContext';
import { CAMERA_POSITIONS, IMAGE_QUALITIES } from '@/context/SettingsTypes';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';
import { SelectField } from '@/components/settings/SelectField';
import { ToggleSwitch } from '@/components/settings/ToggleSwitch';

export function Scan() {
  const { settings, updateSettings } = useSettings();
  const scan = settings.scan;

  const handleChange = <K extends keyof typeof scan>(key: K, value: any) => {
    updateSettings({ scan: { ...scan, [key]: value } });
  };

  const handleToggle = (key: keyof typeof scan) => (checked: boolean) => {
    handleChange(key, checked);
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Camera" description="Configure camera behavior for scanning">
        <SettingRow>
          <SelectField
            name="defaultCamera"
            label="Default Camera"
            value={scan.defaultCamera}
            onChange={(v) => handleChange('defaultCamera', v)}
            options={CAMERA_POSITIONS.map(c => ({ value: c.value, label: c.label }))}
            helperText="Camera used when opening the scanner"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Image Quality" description="Balance between speed and detection accuracy">
        <SettingRow>
          <SelectField
            name="imageQuality"
            label="Quality"
            value={scan.imageQuality}
            onChange={(v) => handleChange('imageQuality', v)}
            options={IMAGE_QUALITIES.map(q => ({ value: q.value, label: q.label }))}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Behavior" description="Automation and data preferences">
        <SettingRow>
          <ToggleSwitch
            checked={scan.autoStartScanning}
            onChange={handleToggle('autoStartScanning')}
            label="Auto-start Scanning"
            helperText="Begin scanning immediately when opening the scanner page"
          />
        </SettingRow>
        <SettingRow>
          <ToggleSwitch
            checked={scan.saveScanHistory}
            onChange={handleToggle('saveScanHistory')}
            label="Save Scan History"
            helperText="Keep a record of your past scans for reference"
          />
        </SettingRow>
        <SettingRow>
          <ToggleSwitch
            checked={scan.showConfidenceScore}
            onChange={handleToggle('showConfidenceScore')}
            label="Show Confidence Score"
            helperText="Display AI confidence percentage in results"
          />
        </SettingRow>
        <SettingRow>
          <ToggleSwitch
            checked={scan.showEnvironmentalImpact}
            onChange={handleToggle('showEnvironmentalImpact')}
            label="Show Environmental Impact"
            helperText="Display environmental impact details after each scan"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Feedback" description="Audio and haptic responses">
        <SettingRow>
          <ToggleSwitch
            checked={scan.soundEffects}
            onChange={handleToggle('soundEffects')}
            label="Sound Effects"
            helperText="Play sounds for scan completion and actions"
          />
        </SettingRow>
        <SettingRow>
          <ToggleSwitch
            checked={scan.hapticFeedback}
            onChange={handleToggle('hapticFeedback')}
            label="Haptic Feedback"
            helperText="Vibrate on scan completion (where supported)"
          />
        </SettingRow>
      </SettingsCard>
    </div>
  );
}