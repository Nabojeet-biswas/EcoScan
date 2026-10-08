import { Route, Routes, Navigate } from 'react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { SettingsIndex } from './SettingsIndex';
import { SettingsProvider } from '@/context/SettingsContext';
import { Profile } from './Profile';
import { Appearance } from './Appearance';
import { Language } from './Language';
import { Scan } from './Scan';
import { Sorting } from './Sorting';
import { Notifications } from './Notifications';
import { Privacy } from './Privacy';
import { Accessibility } from './Accessibility';
import { Storage } from './Storage';
import { About } from './About';

export function Settings() {
  return (
    <SettingsProvider>
      <SettingsLayout>
        <Routes>
          <Route path="/settings" element={<SettingsIndex />} />
          <Route path="/settings/profile" element={<Profile />} />
          <Route path="/settings/appearance" element={<Appearance />} />
          <Route path="/settings/language" element={<Language />} />
          <Route path="/settings/scan" element={<Scan />} />
          <Route path="/settings/sorting" element={<Sorting />} />
          <Route path="/settings/notifications" element={<Notifications />} />
          <Route path="/settings/privacy" element={<Privacy />} />
          <Route path="/settings/accessibility" element={<Accessibility />} />
          <Route path="/settings/storage" element={<Storage />} />
          <Route path="/settings/about" element={<About />} />
          <Route path="/settings/*" element={<Navigate to="/settings/profile" replace />} />
        </Routes>
      </SettingsLayout>
    </SettingsProvider>
  );
}