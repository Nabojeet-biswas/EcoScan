import { ABOUT_DATA } from '@/data/about';

export function AboutFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 pt-8 border-t border-line text-center" role="contentinfo">
      <p className="text-fg-dim text-sm">
        © {currentYear} {ABOUT_DATA.appName}. All rights reserved.
      </p>
      <p className="text-fg-dim text-xs mt-1">Version {ABOUT_DATA.version}</p>
    </footer>
  );
}