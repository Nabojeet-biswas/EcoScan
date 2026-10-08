import { useSettings } from '@/context/SettingsContext';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';
import { ToggleSwitch } from '@/components/settings/ToggleSwitch';
import { DangerZone } from '@/components/settings/DangerZone';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import { useState } from 'react';

export function Privacy() {
  const { settings, updateSettings } = useSettings();
  const privacy = settings.privacy;
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  const exportData = () => {
    const data = JSON.stringify({ settings, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoscan-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearScanHistory = () => {
    localStorage.removeItem('ecoscan_history');
    localStorage.removeItem('ecoscan_points');
  };

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Privacy First" description="How your data is processed and protected">
        <SettingRow>
          <ToggleSwitch
            checked={privacy.privacyFirstProcessing}
            onChange={(checked) => updateSettings({ privacy: { ...privacy, privacyFirstProcessing: checked } })}
            label="Privacy-First Processing"
            helperText="All scanning happens on-device. No images leave your device."
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Analytics" description="Help improve EcoScan with anonymous usage data">
        <SettingRow>
          <ToggleSwitch
            checked={privacy.anonymousAnalytics}
            onChange={(checked) => updateSettings({ privacy: { ...privacy, anonymousAnalytics: checked } })}
            label="Allow Anonymous Usage Analytics"
            helperText="No personal data collected. Helps us improve detection accuracy and features."
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Your Data" description="Export or remove your personal data">
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">Export My Data</span>
              <p className="text-fg-dim text-xs mt-0.5">Download all your settings and scan history as JSON</p>
            </label>
            <button
              type="button"
              onClick={exportData}
              className="mt-2 px-4 py-2 rounded-xl text-sm font-medium hover-solid text-fg border border-line"
            >
              Export Data
            </button>
          </div>
        </SettingRow>
      </SettingsCard>

      <DangerZone>
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">Clear Scan History</span>
              <p className="text-fg-dim text-xs mt-0.5">Remove all past scan records. Cannot be undone.</p>
            </label>
            <button
              type="button"
              onClick={() => setShowClearHistoryDialog(true)}
              className="mt-2 px-4 py-2 rounded-xl text-sm font-medium hover-solid text-error border border-error/30"
            >
              Clear History
            </button>
          </div>
        </SettingRow>
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">Clear All Local Data</span>
              <p className="text-fg-dim text-xs mt-0.5">Reset all settings and clear all stored data. Cannot be undone.</p>
            </label>
            <button
              type="button"
              onClick={() => setShowClearAllDialog(true)}
              className="mt-2 px-4 py-2 rounded-xl text-sm font-medium hover-solid text-error border border-error/30"
            >
              Clear All Data
            </button>
          </div>
        </SettingRow>
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">Reset All Settings to Default</span>
              <p className="text-fg-dim text-xs mt-0.5">Restore all preferences to their original values.</p>
            </label>
            <button
              type="button"
              onClick={() => setShowExportDialog(true)}
              className="mt-2 px-4 py-2 rounded-xl text-sm font-medium hover-solid text-fg border border-line"
            >
              Reset Settings
            </button>
          </div>
        </SettingRow>
      </DangerZone>

      <ConfirmDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onConfirm={() => { /* reset settings */ }}
        title="Reset All Settings"
        description="This will restore all settings to their default values. Your scan history will not be affected."
        confirmLabel="Reset"
        variant="warning"
      />
      <ConfirmDialog
        isOpen={showClearHistoryDialog}
        onClose={() => setShowClearHistoryDialog(false)}
        onConfirm={clearScanHistory}
        title="Clear Scan History"
        description="This will permanently delete all your past scan records. This action cannot be undone."
        confirmLabel="Clear History"
        variant="danger"
      />
      <ConfirmDialog
        isOpen={showClearAllDialog}
        onClose={() => setShowClearAllDialog(false)}
        onConfirm={clearAllData}
        title="Clear All Local Data"
        description="This will permanently delete ALL local data including settings, scan history, and preferences. This action cannot be undone."
        confirmLabel="Clear Everything"
        variant="danger"
      />
    </div>
  );
}