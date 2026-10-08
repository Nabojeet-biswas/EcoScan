import { ChevronRight, X, FileText, Shield, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSettings } from '@/context/SettingsContext';
import { ABOUT_DATA } from '@/data/about';

const LICENSES = [
  { name: 'React', license: 'MIT', url: 'https://github.com/facebook/react/blob/main/LICENSE' },
  { name: 'React Router', license: 'MIT', url: 'https://github.com/remix-run/react-router/blob/main/LICENSE' },
  { name: 'TypeScript', license: 'Apache-2.0', url: 'https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt' },
  { name: 'Vite', license: 'MIT', url: 'https://github.com/vitejs/vite/blob/main/LICENSE' },
  { name: 'Tailwind CSS', license: 'MIT', url: 'https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE' },
  { name: 'lucide-react', license: 'ISC', url: 'https://github.com/lucide-icons/lucide/blob/main/LICENSE' },
  { name: 'sonner', license: 'MIT', url: 'https://github.com/emilkowalski/sonner/blob/main/LICENSE' },
  { name: 'clsx', license: 'MIT', url: 'https://github.com/lukeed/clsx/blob/main/LICENSE' },
  { name: 'date-fns', license: 'MIT', url: 'https://github.com/date-fns/date-fns/blob/master/LICENSE' },
  { name: 'zod', license: 'MIT', url: 'https://github.com/colinhacks/zod/blob/master/LICENSE' },
  { name: 'recharts', license: 'MIT', url: 'https://github.com/recharts/recharts/blob/master/LICENSE' },
  { name: 'embla-carousel-react', license: 'MIT', url: 'https://github.com/embla-carousel/embla-carousel/blob/main/LICENSE' },
  { name: 'react-hook-form', license: 'MIT', url: 'https://github.com/react-hook-form/react-hook-form/blob/main/LICENSE' },
  { name: '@hookform/resolvers', license: 'MIT', url: 'https://github.com/react-hook-form/resolvers/blob/main/LICENSE' },
  { name: 'cmdk', license: 'MIT', url: 'https://github.com/pacocoursey/cmdk/blob/main/LICENSE' },
  { name: 'react-resizable-panels', license: 'MIT', url: 'https://github.com/bvaughn/react-resizable-panels/blob/main/LICENSE' },
  { name: 'framer-motion', license: 'MIT', url: 'https://github.com/framer/motion/blob/main/LICENSE' },
  { name: 'tw-animate-css', license: 'MIT', url: 'https://github.com/jamiebuilds/tw-animate-css/blob/main/LICENSE' },
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={title}>
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[80vh] bg-bg-surface border border-line rounded-2xl shadow-lg animate-scale-in overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-line">
          <h2 className="font-display text-xl font-normal text-fg">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-fg-dim hover-solid"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

const PRIVACY_POLICY = `
<p className="mb-4">EcoScan ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>

<h3 className="font-medium text-fg mb-2 mt-6">Information We Collect</h3>
<ul className="list-disc pl-6 space-y-2 text-fg-muted mb-4">
  <li>Account information you provide (name, email, city)</li>
  <li>Scan history (if enabled in settings)</li>
  <li>Anonymous usage analytics (if opted in)</li>
  <li>Device information for analytics</li>
</ul>

<h3 className="font-medium text-fg mb-2 mt-6">How We Use Your Information</h3>
<ul className="list-disc pl-6 space-y-2 text-fg-muted mb-4">
  <li>To provide waste identification and sorting guidance</li>
  <li>To personalize your experience</li>
  <li>To improve our AI models (with consent)</li>
  <li>To send notifications (if enabled)</li>
</ul>

<h3 className="font-medium text-fg mb-2 mt-6">Data Storage</h3>
<p className="text-fg-muted mb-4">All scan processing happens on your device. Images never leave your phone unless you explicitly share them. Account data is stored locally and synced only with your consent.</p>

<h3 className="font-medium text-fg mb-2 mt-6">Your Rights</h3>
<p className="text-fg-muted mb-4">You can access, export, or delete your data at any time from the Privacy & Data settings section.</p>
`;

const TERMS_OF_SERVICE = `
<p className="mb-4">By using EcoScan, you agree to these Terms of Service. Please read them carefully.</p>

<h3 className="font-medium text-fg mb-2 mt-6">Acceptance</h3>
<p className="text-fg-muted mb-4">Using the app constitutes acceptance of these terms. If you disagree, please discontinue use.</p>

<h3 className="font-medium text-fg mb-2 mt-6">Service Description</h3>
<p className="text-fg-muted mb-4">EcoScan provides AI-powered waste identification and sorting guidance. Results are for informational purposes only and may not be 100% accurate.</p>

<h3 className="font-medium text-fg mb-2 mt-6">User Responsibilities</h3>
<ul className="list-disc pl-6 space-y-2 text-fg-muted mb-4">
  <li>Use the app for its intended purpose</li>
  <li>Do not attempt to reverse engineer the AI models</li>
  <li>Do not misuse community features</li>
</ul>

<h3 className="font-medium text-fg mb-2 mt-6">Disclaimer</h3>
<p className="text-fg-muted mb-4">EcoScan is provided "as is" without warranties. We are not liable for incorrect sorting guidance or any damages arising from app use.</p>

<h3 className="font-medium text-fg mb-2 mt-6">Changes</h3>
<p className="text-fg-muted mb-4">We may update these terms. Continued use after changes constitutes acceptance.</p>
`;

function LicenseList() {
  return (
    <div className="space-y-3">
      {LICENSES.map((lib, index) => (
        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-line/50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-fg-dim" aria-hidden="true" />
            <span className="font-medium text-fg">{lib.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-brand/10 text-brand border border-brand/20">{lib.license}</span>
            <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-fg-dim hover:text-brand" aria-label={`View ${lib.name} license`}>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LegalSupport() {
  const { showToast } = useSettings();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [licensesOpen, setLicensesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
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

  const handleReportProblem = () => {
    const subject = encodeURIComponent('EcoScan bug report');
    const body = encodeURIComponent(
      `EcoScan ${ABOUT_DATA.version} (${ABOUT_DATA.buildDate})\n` +
      `Browser: ${navigator.userAgent}\n` +
      `Platform: ${navigator.platform}\n` +
      `Screen: ${window.screen.width}x${window.screen.height}\n` +
      `Language: ${navigator.language}\n` +
      `Online: ${navigator.onLine ? 'Yes' : 'No'}\n\n` +
      `Describe the problem:\n`
    );
    window.location.href = `mailto:support@ecoscan.app?subject=${subject}&body=${body}`;
  };

  const handleSendFeedback = () => {
    const subject = encodeURIComponent('EcoScan feedback');
    const body = encodeURIComponent(
      `EcoScan ${ABOUT_DATA.version} (${ABOUT_DATA.buildDate})\n\nYour feedback:\n`
    );
    window.location.href = `mailto:feedback@ecoscan.app?subject=${subject}&body=${body}`;
  };

  return (
    <section aria-labelledby="legal-title" className="space-y-4">
      <h2 id="legal-title" className="font-display text-2xl font-normal text-fg">Legal & Support</h2>
      <div className="bg-bg-surface border border-line rounded-2xl overflow-hidden">
        <div className="divide-y divide-line">
          <button
            onClick={() => setPrivacyOpen(true)}
            className="w-full flex items-center justify-between p-4 hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface text-left"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-fg-dim" aria-hidden="true" />
              <span className="font-medium text-fg">Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-fg-dim" aria-hidden="true" />
          </button>
          <button
            onClick={() => setTermsOpen(true)}
            className="w-full flex items-center justify-between p-4 hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface text-left"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-fg-dim" aria-hidden="true" />
              <span className="font-medium text-fg">Terms of Service</span>
            </div>
            <ChevronRight className="w-5 h-5 text-fg-dim" aria-hidden="true" />
          </button>
          <button
            onClick={handleSendFeedback}
            className="w-full flex items-center justify-between p-4 hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface text-left"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-fg-dim" aria-hidden="true" />
              <span className="font-medium text-fg">Send Feedback</span>
            </div>
            <ChevronRight className="w-5 h-5 text-fg-dim" aria-hidden="true" />
          </button>
          <button
            onClick={handleReportProblem}
            className="w-full flex items-center justify-between p-4 hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface text-left"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-fg-dim" aria-hidden="true" />
              <span className="font-medium text-fg">Report a Problem</span>
            </div>
            <ChevronRight className="w-5 h-5 text-fg-dim" aria-hidden="true" />
          </button>
          <button
            onClick={() => setLicensesOpen(true)}
            className="w-full flex items-center justify-between p-4 hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface text-left"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-fg-dim" aria-hidden="true" />
              <span className="font-medium text-fg">Open-Source Licenses</span>
            </div>
            <ChevronRight className="w-5 h-5 text-fg-dim" aria-hidden="true" />
          </button>
        </div>
        <div className="p-4 border-t border-line">
          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-sm w-full flex items-center justify-center gap-2"
            aria-label={copied ? 'Copied' : 'Copy app info for support'}
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            {copied ? 'Copied' : 'Copy app info for support'}
          </button>
        </div>
      </div>

      <Modal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
        <div className="prose prose-invert max-w-none text-fg-muted">{PRIVACY_POLICY}</div>
      </Modal>
      <Modal isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Service">
        <div className="prose prose-invert max-w-none text-fg-muted">{TERMS_OF_SERVICE}</div>
      </Modal>
      <Modal isOpen={licensesOpen} onClose={() => setLicensesOpen(false)} title="Open-Source Licenses">
        <LicenseList />
      </Modal>
    </section>
  );
}