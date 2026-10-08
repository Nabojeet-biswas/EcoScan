interface TechChip {
  name: string;
  icon?: string;
  color?: string;
}

const TECH_STACK: TechChip[] = [
  { name: 'React', icon: '⚛', color: '#61dafb' },
  { name: 'TypeScript', icon: 'TS', color: '#3178c6' },
  { name: 'Vite', icon: '▲', color: '#646cff' },
  { name: 'Tailwind CSS', icon: '🌊', color: '#06b6d4' },
  { name: 'React Router', icon: '🛣', color: '#ca4245' },
  { name: 'Google Maps', icon: '🗺', color: '#4285f4' },
];

export function BuiltWith() {
  return (
    <section aria-labelledby="builtwith-title" className="space-y-6">
      <div className="text-center">
        <h2 id="builtwith-title" className="font-display text-2xl font-normal text-fg">Built With</h2>
        <p className="mt-2 text-fg-muted max-w-2xl mx-auto">Modern tools and platforms powering EcoScan.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3" role="list" aria-label="Technology stack">
        {TECH_STACK.map((tech, index) => (
          <span
            key={index}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-bg-surface border border-line flex items-center gap-2"
            style={{ borderColor: 'var(--border)' }}
            role="listitem"
          >
            {tech.icon ? (
              <span className="text-lg" aria-hidden="true">{tech.icon}</span>
            ) : (
              <span className="w-5 h-5 rounded bg-brand/20 text-brand flex items-center justify-center text-xs font-bold" aria-hidden="true" style={{ backgroundColor: tech.color + '20', color: tech.color }}>
                {tech.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="text-fg">{tech.name}</span>
          </span>
        ))}
      </div>
    </section>
  );
}