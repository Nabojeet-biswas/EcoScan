import { ABOUT_DATA } from '@/data/about';

interface IconProps {
  className?: string;
  'aria-hidden'?: boolean | string;
}

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  camera: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="12" r="4"/></svg>
  ),
  brain: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M9 17a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z"/><path d="M12 7v5"/></svg>
  ),
  package: ({ className, 'aria-hidden': ariaHidden }) => (
    <svg className={className} aria-hidden={ariaHidden === 'true' || ariaHidden === true} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  ),
};

function getIconComponent(name: string) {
  return ICON_MAP[name] || (({ className }) => <span className={className} aria-hidden="true">?</span>);
}

interface StepProps {
  step: typeof ABOUT_DATA.steps[0];
  isLast: boolean;
}

function Step({ step, isLast }: StepProps) {
  const IconComponent = getIconComponent(step.icon);
  return (
    <div className="relative flex-1 flex flex-col items-center text-center">
      <div className="relative z-10 w-16 h-16 rounded-2xl bg-bg-surface border border-line flex items-center justify-center mb-4">
        <IconComponent className="w-8 h-8 text-brand" aria-hidden="true" />
      </div>
      <div className="font-display text-2xl font-normal text-fg mb-1">{step.title}</div>
      <p className="text-fg-muted text-sm max-w-xs">{step.description}</p>
      {!isLast && (
        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-line -z-10" aria-hidden="true" />
      )}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="space-y-6">
      <div className="text-center">
        <h2 id="how-title" className="font-display text-2xl font-normal text-fg">How It Works</h2>
        <p className="mt-2 text-fg-muted max-w-2xl mx-auto">Three simple steps to sort waste correctly every time.</p>
      </div>
      <div className="relative flex flex-col md:flex-row gap-8 md:gap-0" role="list" aria-label="How it works steps">
        {ABOUT_DATA.steps.map((step, index) => (
          <Step key={step.number} step={step} isLast={index === ABOUT_DATA.steps.length - 1} />
        ))}
      </div>
    </section>
  );
}