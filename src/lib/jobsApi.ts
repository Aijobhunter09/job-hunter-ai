import type { Job } from '@/types';

export async function fetchJobs(): Promise<Job[]> {
  const response = await fetch('/api/jobs');

  if (!response.ok) {
    throw new Error(`Unable to load jobs: ${response.status}`);
  }

  const data = await response.json();

  // Himalayas returns the jobs inside a "jobs" property.
  if (Array.isArray(data?.jobs)) {
    return data.jobs;
  }

  // Fallback in case the API returns an array directly.
  if (Array.isArray(data)) {
    return data;
  }

  throw new Error('Invalid jobs API response');
}
