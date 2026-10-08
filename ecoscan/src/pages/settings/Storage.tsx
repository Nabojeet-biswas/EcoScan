import { useState, useEffect } from 'react';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';

export function Storage() {
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 5242880 });

  useEffect(() => {
    const calculateStorage = () => {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      setStorageInfo({ used: total, total: 5242880 });
    };
    calculateStorage();
    const interval = setInterval(calculateStorage, 10000);
    return () => clearInterval(interval);
  }, []);

  const percentage = Math.min((storageInfo.used / storageInfo.total) * 100, 100);
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Local Storage Usage" description="How much space EcoScan uses on your device">
        <SettingRow>
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-fg-dim">Used</span>
                <span className="font-mono text-fg">{formatBytes(storageInfo.used)}</span>
              </div>
              <div className="w-full h-3 bg-bg-surface border border-line rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: percentage > 80 ? 'var(--color-error-dark)' : 'var(--color-accent-dark)',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-fg-dim">
                <span>0 B</span>
                <span>{formatBytes(storageInfo.total)}</span>
              </div>
            </div>
          </div>
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Cache Management" description="Clear temporary data to free up space">
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">Clear Cache</span>
              <p className="text-fg-dim text-xs mt-0.5">Remove temporary files and cached images. Your settings and history will be kept.</p>
            </label>
            <button
              type="button"
              onClick={() => { /* clear cache */ }}
              className="mt-2 px-4 py-2 rounded-xl text-sm font-medium hover-solid text-fg border border-line"
            >
              Clear Cache
            </button>
          </div>
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Storage Details" description="Breakdown of what's stored">
        <SettingRow>
          <div className="flex-1 min-w-0">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-fg-dim">Settings</dt>
                <dd className="font-mono text-fg">~2 KB</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-dim">Scan History</dt>
                <dd className="font-mono text-fg">~1 KB</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-dim">Image Cache</dt>
                <dd className="font-mono text-fg">~100 KB</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="font-medium text-fg">Total</dt>
                <dd className="font-mono text-fg">{formatBytes(storageInfo.used)}</dd>
              </div>
            </dl>
          </div>
        </SettingRow>
      </SettingsCard>
    </div>
  );
}