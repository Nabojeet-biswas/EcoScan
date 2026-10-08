import { ABOUT_DATA } from '@/data/about';

interface IconProps {
  className?: string;
  'aria-hidden'?: boolean | string;
}

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  cpu: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M15 15h2v2h-2"/></svg>
  ),
  leaf: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 6.1 17 10.3 17 15.8"/><path d="M12 22c2.5 0 4.5-2 4.5-4.5S14.5 13 12 13s-4.5 2-4.5 4.5S9.5 22 12 22z"/></svg>
  ),
  navigation: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
  ),
  users: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  'wifi-off': ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/></svg>
  ),
  lock: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
};

function getIconComponent(name: string) {
  return ICON_MAP[name] || (({ className }) => <span className={className} aria-hidden="true">?</span>);
}

interface FeatureProps {
  feature: typeof ABOUT_DATA.features[0];
}

function Feature({ feature }: FeatureProps) {
  const IconComponent = getIconComponent(feature.icon);
  return (
    <div className="bg-bg-surface border border-line rounded-2xl p-6 flex flex-col gap-3 min-h-[160px]">
      <IconComponent className="w-7 h-7 text-brand" aria-hidden="true" />
      <h3 className="font-medium text-fg">{feature.title}</h3>
      <p className="text-fg-muted text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
}

export function KeyFeatures() {
  return (
    <section aria-labelledby="features-title" className="space-y-6">
      <div className="text-center">
        <h2 id="features-title" className="font-display text-2xl font-normal text-fg">Key Features</h2>
        <p className="mt-2 text-fg-muted max-w-2xl mx-auto">Everything you need to sort waste with confidence.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Features">
        {ABOUT_DATA.features.map((feature, index) => (
          <Feature key={index} feature={feature} />
        ))}
      </div>
    </section>
  );
}