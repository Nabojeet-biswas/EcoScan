import { useSettings } from '@/context/SettingsContext';
import { ACCENT_COLORS, TEXT_SIZES } from '@/context/SettingsTypes';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';
import { SegmentedControl } from '@/components/settings/SegmentedControl';
import { ToggleSwitch } from '@/components/settings/ToggleSwitch';
import { clsx } from 'clsx';

export function Appearance() {
  const { settings, updateSettings } = useSettings();
  const appearance = settings.appearance;

  const handleAccentChange = (value: string) => {
    updateSettings({ appearance: { ...appearance, accentColor: value as any } });
  };

  const handleTextSizeChange = (value: string) => {
    updateSettings({ appearance: { ...appearance, textSize: value as any } });
  };

  const handleCompactChange = (value: boolean) => {
    updateSettings({ appearance: { ...appearance, compactMode: value } });
  };

  const handleReduceMotionChange = (value: boolean) => {
    updateSettings({ appearance: { ...appearance, reduceMotion: value } });
  };

  const currentAccent = ACCENT_COLORS.find(c => c.value === appearance.accentColor);

  return (
    <div className="space-y-6">
      <SettingsCard title="Accent Color" description="Choose the primary color used throughout the app">
        <SettingRow>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleAccentChange(color.value)}
                  className={clsx(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface',
                    'hover-solid',
                    appearance.accentColor === color.value
                      ? 'ring-2 ring-brand ring-offset-2 ring-offset-bg-surface scale-105'
                      : 'hover:scale-105'
                  )}
                  style={{ backgroundColor: color.preview }}
                  aria-label={color.label}
                  aria-pressed={appearance.accentColor === color.value}
                >
                  {appearance.accentColor === color.value && <span className="w-5 h-5 text-white">✓</span>}
                </button>
              ))}
            </div>
            <p className="mt-2 text-fg-dim text-xs">Current: {currentAccent?.label}</p>
          </div>
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Text Size" description="Adjust the base font size across the app">
        <SettingRow>
          <SegmentedControl
            value={appearance.textSize}
            onChange={handleTextSizeChange}
            options={TEXT_SIZES.map(t => ({ value: t.value, label: t.label }))}
            label="Text Size"
            helperText="Affects all text in the app"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Layout" description="Adjust the density of the interface">
        <SettingRow>
          <ToggleSwitch
            checked={appearance.compactMode}
            onChange={handleCompactChange}
            label="Compact Mode"
            helperText="Reduce padding and spacing for more content on screen"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Motion" description="Control animations and transitions">
        <SettingRow>
          <ToggleSwitch
            checked={appearance.reduceMotion}
            onChange={handleReduceMotionChange}
            label="Reduce Motion"
            helperText="Minimize animations and transitions (also respects system preference)"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Live Preview" description="See how your changes look in real time">
        <div className="p-6">
          <div className="space-y-3">
            <div className="px-4 py-3 rounded-xl bg-bg-surface border border-line">
              <p className="font-medium text-fg">Sample Heading</p>
              <p className="text-fg-dim text-sm mt-1">Sample body text with the current text size setting.</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors">
              Primary Button
            </button>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">✓</span>
              <span className="text-fg">Success State</span>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}