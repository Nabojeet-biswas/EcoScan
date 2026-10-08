import { useSettings } from '@/context/SettingsContext';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';
import { ToggleSwitch } from '@/components/settings/ToggleSwitch';
import { useState, useEffect } from 'react';

export function Notifications() {
  const { settings, updateSettings, requestNotificationPermission } = useSettings();
  const notifications = settings.notifications;
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleToggle = (key: keyof typeof notifications) => (checked: boolean) => {
    if (key === 'enabled' && checked && permission !== 'granted') {
      requestNotificationPermission().then(perm => {
        setPermission(perm);
        if (perm === 'granted') {
          updateSettings({ notifications: { ...notifications, [key]: true } });
        }
      });
    } else {
      updateSettings({ notifications: { ...notifications, [key]: checked } });
    }
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Master Toggle" description="Enable or disable all notifications">
        <SettingRow>
          <ToggleSwitch
            checked={notifications.enabled}
            onChange={handleToggle('enabled')}
            label="Enable Notifications"
            helperText={permission === 'denied' ? 'Permission denied in browser settings. Enable there first.' : 'Allow EcoScan to send you notifications'}
            disabled={permission === 'denied'}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Content" description="What kind of notifications you want to receive">
        <SettingRow>
          <ToggleSwitch
            checked={notifications.dailyEcoTip}
            onChange={handleToggle('dailyEcoTip')}
            disabled={!notifications.enabled}
            label="Daily Eco Tip"
            helperText="A quick tip each morning to reduce waste"
          />
        </SettingRow>
        <SettingRow>
          <ToggleSwitch
            checked={notifications.weeklyImpactSummary}
            onChange={handleToggle('weeklyImpactSummary')}
            disabled={!notifications.enabled}
            label="Weekly Impact Summary"
            helperText="Your environmental impact for the week"
          />
        </SettingRow>
        <SettingRow>
          <ToggleSwitch
            checked={notifications.scanReminders}
            onChange={handleToggle('scanReminders')}
            disabled={!notifications.enabled}
            label="Scan Reminders"
            helperText="Gentle nudges to scan items you've saved"
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Quiet Hours" description="Times when notifications are silenced">
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">Start</span>
            </label>
            <input
              type="time"
              value={notifications.quietHoursStart}
              onChange={(e) => updateSettings({ notifications: { ...notifications, quietHoursStart: e.target.value } })}
              disabled={!notifications.enabled}
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-line text-fg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">End</span>
            </label>
            <input
              type="time"
              value={notifications.quietHoursEnd}
              onChange={(e) => updateSettings({ notifications: { ...notifications, quietHoursEnd: e.target.value } })}
              disabled={!notifications.enabled}
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-line text-fg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            />
          </div>
        </SettingRow>
      </SettingsCard>
    </div>
  );
}