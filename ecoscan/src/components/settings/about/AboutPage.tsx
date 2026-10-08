import { HeroCard } from './HeroCard';
import { MissionImpact } from './MissionImpact';
import { HowItWorks } from './HowItWorks';
import { KeyFeatures } from './KeyFeatures';
import { ChangelogTimeline } from './ChangelogTimeline';
import { BuiltWith } from './BuiltWith';
import { TeamCredits } from './TeamCredits';
import { SystemInfo } from './SystemInfo';
import { LegalSupport } from './LegalSupport';
import { AboutFooter } from './AboutFooter';
import { ScrollAnimation } from '@/components/common/ScrollAnimation';

export function AboutPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 pb-12">
      <HeroCard />
      
      <ScrollAnimation>
        <MissionImpact />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <HowItWorks />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <KeyFeatures />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <ChangelogTimeline />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <BuiltWith />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <TeamCredits />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <SystemInfo />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <LegalSupport />
      </ScrollAnimation>
      
      <AboutFooter />
    </div>
  );
}