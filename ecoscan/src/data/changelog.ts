export type ChangelogTag = 'new' | 'improved' | 'fixed';

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  items: string[];
  tag: ChangelogTag;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2025-01-15',
    title: 'Sidebar drawer & animated menu',
    items: [
      'Added collapsible sidebar with smooth slide animation',
      'New hamburger menu with spring transitions',
      'Keyboard navigation support for all menu items',
      'Mobile drawer with backdrop and swipe-to-close',
    ],
    tag: 'new',
  },
  {
    version: '1.1.0',
    date: '2024-12-20',
    title: 'Settings page redesign',
    items: [
      'Complete overhaul of all settings sections',
      'New search with keyboard shortcut (/)',
      'Unsaved changes bar with save/discard actions',
      'Consistent card-based layout across sections',
    ],
    tag: 'new',
  },
  {
    version: '1.0.0',
    date: '2024-11-10',
    title: 'Community Feed with map',
    items: [
      'Live cleanup event feed with geolocation',
      'Interactive map clustering for nearby events',
      'Join/leave events with real-time counts',
      'Share your impact to the community feed',
    ],
    tag: 'new',
  },
  {
    version: '0.9.0',
    date: '2024-10-05',
    title: 'Scanner improvements',
    items: [
      'Reduced model size by 40% for faster loads',
      'Added confidence score display option',
      'Fixed camera permission handling on iOS',
      'Improved low-light detection accuracy',
    ],
    tag: 'improved',
  },
  {
    version: '0.8.0',
    date: '2024-09-12',
    title: 'Privacy & data controls',
    items: [
      'Added privacy-first processing toggle',
      'Anonymous analytics opt-in',
      'Export all data as JSON',
      'Clear local storage with confirmation',
    ],
    tag: 'new',
  },
  {
    version: '0.7.0',
    date: '2024-08-20',
    title: 'Accessibility upgrades',
    items: [
      'Full keyboard navigation support',
      'Screen reader descriptions for scan results',
      'High contrast mode',
      'Reduced motion preference respected',
    ],
    tag: 'improved',
  },
];