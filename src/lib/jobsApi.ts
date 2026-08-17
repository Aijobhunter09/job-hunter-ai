import type { Job } from '@/types';

const API_URL = '/api/jobs';

export async function fetchRemoteJobs(): Promise<Job[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Unable to load jobs: ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data?.jobs)) {
    return data.jobs;
  }

  if (Array.isArray(data)) {
    return data;
  }

  throw new Error('Invalid jobs API response');
}
