export interface TeamMember {
  name: string;
  role: string;
  avatarInitials: string;
  // TODO: Replace with real team member data
}

export interface AboutData {
  appName: string;
  tagline: string;
  mission: string;
  version: string;
  buildDate: string;
  stats: StatTile[];
  steps: HowItWorksStep[];
  features: FeatureItem[];
  team: TeamMember[];
  acknowledgements: string[];
  closingLine: string;
}

export interface StatTile {
  icon: string;
  value: string;
  caption: string;
}

export interface HowItWorksStep {
  number: number;
  icon: string;
  title: string;
  description: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export const ABOUT_DATA: AboutData = {
  appName: 'EcoScan',
  tagline: 'AI Waste Intelligence',
  mission: 'Scan an object. Understand its impact. Sort it right.',
  version: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
  buildDate: import.meta.env.VITE_BUILD_DATE ?? new Date().toISOString().split('T')[0],
  stats: [
    { icon: 'recycle', value: '9+', caption: 'Waste types' },
    { icon: 'zap', value: 'Instant', caption: 'Results' },
    { icon: 'shield', value: 'Privacy', caption: 'First' },
    { icon: 'gift', value: 'Free', caption: 'To use' },
  ],
  steps: [
    {
      number: 1,
      icon: 'camera',
      title: 'Scan',
      description: 'Point the camera at any object',
    },
    {
      number: 2,
      icon: 'brain',
      title: 'Learn',
      description: 'See what it\'s made of and its environmental impact',
    },
    {
      number: 3,
      icon: 'package',
      title: 'Sort',
      description: 'Get the right bin and disposal tips',
    },
  ],
  features: [
    { icon: 'cpu', title: 'AI waste recognition', description: 'Identify materials instantly with on-device ML' },
    { icon: 'leaf', title: 'Environmental impact insights', description: 'See carbon footprint and recyclability scores' },
    { icon: 'navigation', title: 'Smart sorting guidance', description: 'Get precise bin colors and local rules' },
    { icon: 'users', title: 'Community cleanup feed', description: 'Join local events and share your impact' },
    { icon: 'wifi-off', title: 'Offline-friendly demo mode', description: 'Try core features without an account' },
    { icon: 'lock', title: 'Privacy-first processing', description: 'Images never leave your device' },
  ],
  team: [
    // TODO: Replace with real team members
    { name: 'Alex Chen', role: 'Founder & CEO', avatarInitials: 'AC' },
    { name: 'Maria Santos', role: 'Lead Engineer', avatarInitials: 'MS' },
    { name: 'Jordan Kim', role: 'ML Research', avatarInitials: 'JK' },
    { name: 'Sam Okafor', role: 'Product Design', avatarInitials: 'SO' },
  ],
  acknowledgements: [
    'Lucide icons (lucide-react)',
    'React & React Router teams',
    'Vite & Tailwind CSS',
    'Google Maps Platform',
    'Open source community',
  ],
  closingLine: 'Made with care for a cleaner planet.',
};