import { ABOUT_DATA } from '@/data/about';

interface IconProps {
  className?: string;
  'aria-hidden'?: boolean | string;
}

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  recycle: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/><path d="M7 19a10 10 0 0 0 10-10"/><path d="M17 5V3"/><path d="M7 5V3"/></svg>
  ),
  zap: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  shield: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  gift: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8v12"/><path d="M3 14h18"/></svg>
  ),
};

function getIconComponent(name: string) {
  return ICON_MAP[name] || (({ className }) => <span className={className} aria-hidden="true">?</span>);
}

interface StatTileProps {
  icon: string;
  value: string;
  caption: string;
}

function StatTile({ icon, value, caption }: StatTileProps) {
  const IconComponent = getIconComponent(icon);
  return (
    <div className="bg-bg-surface border border-line rounded-2xl p-6 text-center min-h-[140px] flex flex-col items-center justify-center">
      <IconComponent className="w-10 h-10 text-brand mb-3" aria-hidden="true" />
      <div className="font-display text-3xl font-normal text-fg">{value}</div>
      <div className="text-fg-dim text-sm mt-1">{caption}</div>
    </div>
  );
}

export function MissionImpact() {
  return (
    <section aria-labelledby="mission-title" className="space-y-6">
      <div>
        <h2 id="mission-title" className="font-display text-2xl font-normal text-fg">Mission & Impact</h2>
        <p className="mt-2 text-fg-muted max-w-2xl leading-relaxed">
          EcoScan exists because waste sorting is confusing and the environmental cost of mistakes is high.
          Every year, millions of tons of recyclable materials end up in landfills because people don't know
          which bin to use. We're changing that by putting AI-powered waste intelligence in your pocket.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list" aria-label="Key statistics">
        {ABOUT_DATA.stats.map((stat, index) => (
          <StatTile key={index} {...stat} />
        ))}
      </div>
    </section>
  );
}