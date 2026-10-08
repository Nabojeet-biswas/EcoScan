import { ABOUT_DATA } from '@/data/about';

export function TeamCredits() {
  return (
    <section aria-labelledby="team-title" className="space-y-6">
      <div className="text-center">
        <h2 id="team-title" className="font-display text-2xl font-normal text-fg">Team & Credits</h2>
        <p className="mt-2 text-fg-muted max-w-2xl mx-auto">The people behind EcoScan.</p>
      </div>
      <div className="bg-bg-surface border border-line rounded-2xl p-6 space-y-4" role="list" aria-label="Team members">
        <div className="flex items-center gap-3 text-fg-dim text-sm">
          <span className="font-medium text-fg">Made by</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
          {ABOUT_DATA.team.map((member, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-bg-elevated border border-line/50" role="listitem">
              <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white font-medium text-lg flex-shrink-0" aria-hidden="true">
                {member.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-fg truncate">{member.name}</div>
                <div className="text-fg-dim text-sm truncate">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-fg-dim text-sm">
          Acknowledgements: {ABOUT_DATA.acknowledgements.join(', ')}.
        </p>
        <p className="font-medium text-fg">{ABOUT_DATA.closingLine}</p>
      </div>
    </section>
  );
}