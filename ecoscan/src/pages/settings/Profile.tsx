import { useSettings } from '@/context/SettingsContext';
import { AVATAR_OPTIONS, type AvatarOption } from '@/context/SettingsTypes';
import { SettingsCard, SettingRow } from '@/components/settings/SettingsCard';
import { TextField } from '@/components/settings/TextField';
import { AvatarPicker } from '@/components/settings/AvatarPicker';
import { ConfirmDialog } from '@/components/settings/ConfirmDialog';
import { useState } from 'react';

export function Profile() {
  const { settings, updateSettings, setDirtyField } = useSettings();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const profile = settings.profile;

  const handleNameChange = (value: string) => {
    if (value.length <= 40) {
      updateSettings({ profile: { ...profile, displayName: value } });
      setDirtyField('profile.displayName', value);
    }
  };

  const handleEmailChange = (value: string) => {
    updateSettings({ profile: { ...profile, email: value } });
    setDirtyField('profile.email', value);
  };

  const handleCityChange = (value: string) => {
    updateSettings({ profile: { ...profile, city: value } });
    setDirtyField('profile.city', value);
  };

  const handleAvatarChange = (avatar: string) => {
    updateSettings({ profile: { ...profile, avatar: avatar as AvatarOption } });
    setDirtyField('profile.avatar', avatar);
  };

  const emailError = profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)
    ? 'Please enter a valid email address'
    : undefined;

  return (
    <div className="space-y-6">
      <SettingsCard title="Profile" description="How you appear to others">
        <SettingRow>
          <div className="flex-1 min-w-0">
            <label className="block">
              <span className="font-medium text-fg">Display Name</span>
              <span className="text-fg-dim text-xs ml-2">1-40 characters</span>
            </label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => handleNameChange(e.target.value)}
              maxLength={40}
              placeholder="Your name"
              className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-bg-surface border border-line text-fg placeholder:text-fg-dim text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface hover-solid"
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="flex-1 min-w-0">
            <AvatarPicker
              value={profile.avatar}
              onChange={handleAvatarChange}
              label="Avatar"
              helperText="Choose an emoji to represent you"
              options={AVATAR_OPTIONS}
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="flex-1 min-w-0">
            <TextField
              name="email"
              label="Email (optional)"
              type="email"
              value={profile.email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              error={emailError}
              helperText="Used for account recovery"
            />
          </div>
        </SettingRow>
        <SettingRow>
          <div className="flex-1 min-w-0">
            <TextField
              name="city"
              label="City (optional)"
              value={profile.city}
              onChange={handleCityChange}
              placeholder="Your city"
              helperText="Used for local recycling tips"
            />
          </div>
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Preview" description="How your profile appears">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-4xl">
              {profile.avatar}
            </div>
            <div>
              <p className="font-medium text-fg text-lg">{profile.displayName || 'Your Name'}</p>
              <p className="text-fg-dim text-sm">{profile.city ? `${profile.city}` : 'No city set'}</p>
            </div>
          </div>
        </div>
      </SettingsCard>

      <ConfirmDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={() => { /* reset profile */ }}
        title="Reset Profile"
        description="This will clear your display name, avatar, email, and city. This cannot be undone."
        confirmLabel="Reset"
        variant="danger"
      />
    </div>
  );
}