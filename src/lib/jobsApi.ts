import type { Job } from '@/types';

const API_BASE = '/api';

interface HimalayasJob {
  id?: string | number;
  title?: string;
  companyName?: string;
  company?: string;
  location?: string;
  description?: string;
  excerpt?: string;
  employmentType?: string;
  jobType?: string;
  seniority?: string;
  salary?: string;
  salaryRange?: string;
  applicationUrl?: string;
  url?: string;
  skills?: string[];
}

interface HimalayasResponse {
  jobs?: HimalayasJob[];
  data?: HimalayasJob[];
  total?: number;
  count?: number;
}

function mapJob(job: HimalayasJob, index: number): Job {
  const title = job.title || 'Untitled Job';
  const company = job.companyName || job.company || 'Unknown Company';

  return {
    id: String(job.id ?? `${company}-${title}-${index}`),
    title,
    company,
    location: job.location || 'Remote',
    description: job.description || job.excerpt || '',
    workMode: 'Remote',
    jobType: job.employmentType || job.jobType || 'Full-time',
    experienceLevel: job.seniority || 'Not specified',
    salary: job.salary || job.salaryRange || 'Salary not specified',
    applicationUrl: job.applicationUrl || job.url || '',
    skills: Array.isArray(job.skills) ? job.skills : [],
    matchScore: 0,
  };
}

function extractJobs(data: HimalayasResponse | HimalayasJob[]): HimalayasJob[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.jobs)) {
    return data.jobs;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

export async function fetchRemoteJobs(): Promise<Job[]> {
  const response = await fetch(`${API_BASE}/jobs?limit=20&offset=0`);

  if (!response.ok) {
    throw new Error(`Jobs request failed: ${response.status}`);
  }

  const data = (await response.json()) as HimalayasResponse | HimalayasJob[];

  return extractJobs(data).map(mapJob);
}

export async function searchRemoteJobs(
  query: string,
  page = 1
): Promise<Job[]> {
  const params = new URLSearchParams();

  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set('q', trimmedQuery);
  }

  params.set('page', String(page));

  const response = await fetch(
    `${API_BASE}/jobs/search?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Job search failed: ${response.status}`);
  }

  const data = (await response.json()) as HimalayasResponse | HimalayasJob[];

  return extractJobs(data).map(mapJob);
}
