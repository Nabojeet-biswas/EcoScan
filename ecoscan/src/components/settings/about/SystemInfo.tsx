import { ChevronDown, ChevronUp, Copy, Wifi, WifiOff, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { ABOUT_DATA } from '@/data/about';

function getStorageUsed(): string {
  if (typeof window === 'undefined') return 'Unknown';
  try {
    let total = 0;
    for (const key in localStorage) {
      if (key.startsWith('ecoscan:')) {
        total += localStorage[key].length;
      }
    }
    const kb = (total / 1024).toFixed(1);
    return `${kb} KB`;
  } catch {
    return 'Unknown';
  }
}

function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome') && !ua.includes('Chromium')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown';
}

function getPlatformInfo(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const platform = navigator.platform;
  if (platform.includes('Win')) return 'Windows';
  if (platform.includes('Mac')) return 'macOS';
  if (platform.includes('Linux')) return 'Linux';
  if (platform.includes('iPhone') || platform.includes('iPad')) return 'iOS';
  if (platform.includes('Android')) return 'Android';
  return platform;
}

interface SystemInfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function SystemInfoRow({ label, value, icon }: SystemInfoRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 py-3 border-b border-line/50 last:border-0 items-center">
      <div className="flex items-center gap-3 text-fg-dim">
        {icon && <span className="w-5 h-5" aria-hidden="true">{icon}</span>}
        <span className="font-medium text-fg">{label}</span>
      </div>
      <div className="font-mono text-sm text-fg-muted break-all">{value}</div>
    </div>
  );
}

export function SystemInfo() {
  const { showToast } = useSettings();
  const [expanded, setExpanded] = useState(false);
  const [online, setOnline] = useState(true);
  const [storageUsed, setStorageUsed] = useState('Calculating...');

  useEffect(() => {
    setOnline(navigator.onLine);
    setStorageUsed(getStorageUsed());

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCopy = () => {
    const info = [
      `App: ${ABOUT_DATA.appName}`,
      `Version: ${ABOUT_DATA.version}`,
      `Build Date: ${ABOUT_DATA.buildDate}`,
      `Browser: ${getBrowserInfo()}`,
      `Platform: ${getPlatformInfo()}`,
      `Screen: ${window.screen.width}x${window.screen.height}`,
      `Language: ${navigator.language}`,
      `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      `Online: ${online ? 'Yes' : 'No'}`,
      `Storage: ${storageUsed}`,
      `Date: ${new Date().toLocaleString()}`,
    ].join('\n');

    navigator.clipboard.writeText(info).then(() => {
      showToast('Copied system info', 'success');
    });
  };

  return (
    <section aria-labelledby="systeminfo-title" className="space-y-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg-surface border border-line hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
        aria-expanded={expanded}
        aria-controls="system-info-content"
      >
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-fg-dim" aria-hidden="true" />
          <span className="font-medium text-fg">System Information</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-fg-dim" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-fg-dim" aria-hidden="true" />}
      </button>
      <div id="system-info-content" className="overflow-hidden transition-all duration-200" style={{ maxHeight: expanded ? '500px' : '0', opacity: expanded ? 1 : 0 }}>
        <div className="bg-bg-surface border border-line rounded-2xl p-4 pt-0 space-y-0" role="region" aria-label="System details">
          <SystemInfoRow label="App version" value={ABOUT_DATA.version} />
          <SystemInfoRow label="Build date" value={ABOUT_DATA.buildDate} />
          <SystemInfoRow label="Browser" value={getBrowserInfo()} />
          <SystemInfoRow label="Platform" value={getPlatformInfo()} />
          <SystemInfoRow label="Screen size" value={`${window.screen.width}x${window.screen.height}`} />
          <SystemInfoRow label="Language" value={navigator.language} />
          <SystemInfoRow label="Time zone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
          <SystemInfoRow
            label="Online status"
            value={online ? 'Online' : 'Offline'}
            icon={online ? <Wifi className="w-5 h-5 text-green-primary" aria-hidden="true" /> : <WifiOff className="w-5 h-5 text-red-primary" aria-hidden="true" />}
          />
          <SystemInfoRow
            label="Storage used"
            value={storageUsed}
            icon={<Database className="w-5 h-5 text-fg-dim" aria-hidden="true" />}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-sm flex items-center gap-2"
            aria-label="Copy system information"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            Copy
          </button>
        </div>
      </div>
    </section>
  );
}