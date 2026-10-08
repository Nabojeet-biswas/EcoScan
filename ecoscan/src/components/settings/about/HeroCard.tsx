import { Logo } from '@/components/common/Logo';
import { Copy, Mail } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { ABOUT_DATA } from '@/data/about';

export function HeroCard() {
  const { showToast } = useSettings();
  const [copied, setCopied] = useState(false);

  const handleCopyAppInfo = () => {
    const info = [
      `App: ${ABOUT_DATA.appName}`,
      `Version: ${ABOUT_DATA.version}`,
      `Build Date: ${ABOUT_DATA.buildDate}`,
      `Browser: ${navigator.userAgent}`,
      `Platform: ${navigator.platform}`,
      `Screen: ${window.screen.width}x${window.screen.height}`,
      `Language: ${navigator.language}`,
      `Online: ${navigator.onLine ? 'Yes' : 'No'}`,
      `Date: ${new Date().toLocaleString()}`,
    ].join('\n');

    navigator.clipboard.writeText(info).then(() => {
      setCopied(true);
      showToast('Copied app info', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSendFeedback = () => {
    const subject = encodeURIComponent('EcoScan feedback');
    const body = encodeURIComponent(
      `EcoScan ${ABOUT_DATA.version} (${ABOUT_DATA.buildDate})\n\nYour feedback:\n`
    );
    window.location.href = `mailto:feedback@ecoscan.app?subject=${subject}&body=${body}`;
  };

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a36] via-[#131c16] to-[#0b120e] p-8 md:p-12">
      <div className="relative z-10 max-w-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Logo size={64} variant="symbol" aria-label={ABOUT_DATA.appName} />
            <div>
              <h2 id="hero-title" className="font-display text-4xl md:text-5xl font-normal text-white tracking-tight">
                {ABOUT_DATA.appName}
              </h2>
              <p className="text-brand-light text-lg font-medium mt-1">{ABOUT_DATA.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
              v{ABOUT_DATA.version}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-primary/20 text-green-primary border border-green-primary/30">
              Stable
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/20">
              Built {ABOUT_DATA.buildDate}
            </span>
          </div>
        </div>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">{ABOUT_DATA.mission}</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopyAppInfo}
            className="btn btn-secondary btn-md flex items-center gap-2"
            aria-label={copied ? 'Copied' : 'Copy app info'}
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            {copied ? 'Copied' : 'Copy app info'}
          </button>
          <button
            onClick={handleSendFeedback}
            className="btn btn-ghost btn-md flex items-center gap-2 text-white hover:text-green-primary"
            aria-label="Send feedback via email"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            Send feedback
          </button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
        <Logo size={300} variant="symbol" className="absolute bottom-0 right-0 opacity-10" />
      </div>
    </section>
  );
}