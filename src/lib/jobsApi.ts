import type { Job } from '@/types';

interface HimalayasJob {
  id?: string;
  title?: string;
  companyName?: string;
  company?: {
    name?: string;
  };
  location?: string;
  locations?: string[];
  employmentType?: string;
  seniority?: string;
  description?: string;
  excerpt?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  skills?: string[];
  applicationLink?: string;
  applicationUrl?: string;
  url?: string;
  pubDate?: string;
  publishedAt?: string;
  createdAt?: string;
}

interface HimalayasResponse {
  jobs?: HimalayasJob[];
  data?: HimalayasJob[];
}

const API_URL = 'https://himalayas.app/jobs/api/search';

function normalizeJob(job: HimalayasJob, index: number): Job {
  const company =
    job.companyName ||
    job.company?.name ||
    'Unknown Company';

  const location =
    job.location ||
    job.locations?.join(', ') ||
    'Remote';

  const salaryMin =
    job.minSalary ||
    job.salary?.min ||
    0;

  const salaryMax =
    job.maxSalary ||
    job.salary?.max ||
    0;

  const currency =
    job.currency ||
    job.salary?.currency ||
    'USD';

  const salary =
    salaryMin || salaryMax
      ? `${currency} ${salaryMin.toLocaleString()}${salaryMax ? ` - ${salaryMax.toLocaleString()}` : '+'}`
      : 'Salary not specified';

  const jobType =
    job.employmentType?.toLowerCase().includes('part')
      ? 'Part-time'
      : job.employmentType?.toLowerCase().includes('contract')
        ? 'Contract'
        : 'Full-time';

  const experience =
    job.seniority?.toLowerCase().includes('senior')
      ? 'Senior'
      : job.seniority?.toLowerCase().includes('lead')
        ? 'Lead'
        : job.seniority?.toLowerCase().includes('mid')
          ? 'Mid'
          : 'Entry';

  const description =
    job.description ||
    job.excerpt ||
    'No description available.';

  const skills =
    Array.isArray(job.skills) && job.skills.length > 0
      ? job.skills
      : [];

  const postedDate =
    job.pubDate ||
    job.publishedAt ||
    job.createdAt ||
    new Date().toISOString();

  return {
    id: `himalayas-${job.id || index}`,
    title: job.title || 'Untitled Job',
    company,
    location,
    workMode: 'Remote',
    jobType,
    salary,
    salaryMin,
    postedDate,
    matchScore: 0,
    skills,
    experienceLevel: experience,
    description,
    responsibilities: [],
    requirements: skills,
  };
}

export async function fetchRemoteJobs(): Promise<Job[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Jobs API request failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as HimalayasResponse;

  const jobs = data.jobs || data.data || [];

  return jobs.map(normalizeJob);
}
