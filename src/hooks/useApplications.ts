import { useState, useEffect, useCallback } from 'react';
import type { Application } from '@/types';
import { demoApplications } from '@/data/demoData';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

const STORAGE_KEY = 'applications';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(() =>
    loadFromStorage<Application[]>(STORAGE_KEY, demoApplications)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEY, applications);
  }, [applications]);

  const addApplication = useCallback(
    (application: Application) => {
      setApplications((prev) => {
        // Prevent duplicate applications for the same job
        const alreadyExists = prev.some(
          (app) => app.id === application.id
        );

        if (alreadyExists) {
          return prev;
        }

        return [...prev, application];
      });
    },
    []
  );

  const moveApplication = useCallback(
    (id: string, newStatus: Application['status']) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status: newStatus }
            : app
        )
      );
    },
    []
  );

  const removeApplication = useCallback((id: string) => {
    setApplications((prev) =>
      prev.filter((app) => app.id !== id)
    );
  }, []);

  return {
    applications,
    addApplication,
    moveApplication,
    removeApplication,
  };
}
