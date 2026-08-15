import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

const STORAGE_KEY = 'profile';

const defaultProfile: UserProfile = {
  name: '',
  jobTitle: '',
  location: '',
  experience: '',
  skills: [],
  preferredJobType: 'Full-time',
  preferredLocation: '',
  remotePreference: 'Open to remote',
  linkedinUrl: '',
  portfolioUrl: '',
};

function loadProfile(): UserProfile {
  const stored = loadFromStorage<Partial<UserProfile>>(STORAGE_KEY, {});

  return {
    ...defaultProfile,
    ...stored,
    skills: Array.isArray(stored.skills)
      ? stored.skills
      : defaultProfile.skills,
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, profile);
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  return { profile, updateProfile };
}
