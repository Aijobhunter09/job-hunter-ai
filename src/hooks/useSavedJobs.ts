import { useState, useEffect } from 'react';

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('aijh:savedJobs');
      return raw ? (JSON.parse(raw) as string[]) : ['j1', 'j3'];
    } catch {
      return ['j1', 'j3'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aijh:savedJobs', JSON.stringify(savedJobs));
    } catch {
      // ignore
    }
  }, [savedJobs]);

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const isSaved = (jobId: string) => savedJobs.includes(jobId);

  return { savedJobs, toggleSave, isSaved };
}
