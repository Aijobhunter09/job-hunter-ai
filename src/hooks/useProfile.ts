import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

const STORAGE_KEY = 'profile';

const defaultProfile: UserProfile = {
  name: 'Alex Morgan',
  jobTitle: 'Senior Frontend Engineer',
  location: 'San Francisco, CA',
  experience: '5 years',
  skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'Git'],
  preferredJobType: 'Full-time',
  preferredLocation: 'Remote',
  remotePreference: 'Open to remote',
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage<UserProfile>(STORAGE_KEY, defaultProfile)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEY, profile);
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  return { profile, updateProfile };
}
