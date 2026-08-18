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
  page?: number;
  totalPages?: number;
  hasMore?: boolean;
}

function mapJob(
  job: HimalayasJob,
  index: number
): Job {
  const title =
    job.title || 'Untitled Job';

  const company =
    job.companyName ||
    job.company ||
    'Unknown Company';

  return {
    id: String(
      job.id ??
        `${company}-${title}-${index}`
    ),

    title,

    company,

    location:
      job.location || 'Remote',

    description:
      job.description ||
      job.excerpt ||
      '',

    workMode: 'Remote',

    jobType:
      job.employmentType ||
      job.jobType ||
      'Full-time',

    experienceLevel:
      job.seniority ||
      'Not specified',

    salary:
      job.salary ||
      job.salaryRange ||
      'Salary not specified',

    applicationUrl:
      job.applicationUrl ||
      job.url ||
      '',

    skills:
      Array.isArray(job.skills)
        ? job.skills
        : [],

    matchScore: 0,
  };
}

function extractJobs(
  data:
    | HimalayasResponse
    | HimalayasJob[]
): HimalayasJob[] {
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

/**
 * Load the first batch of live jobs.
 */
export async function fetchRemoteJobs(
  options: {
    limit?: number;
    offset?: number;
  } = {}
): Promise<Job[]> {
  const limit =
    options.limit ?? 20;

  const offset =
    options.offset ?? 0;

  const response = await fetch(
    `${API_BASE}/jobs?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error(
      `Jobs request failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as
      | HimalayasResponse
      | HimalayasJob[];

  return extractJobs(data).map(
    (job, index) =>
      mapJob(
        job,
        offset + index
      )
  );
}

/**
 * Search options supported by the
 * Himalayas search endpoint.
 */
export interface JobSearchOptions {
  query?: string;
  country?: string;
  seniority?: string;
  employmentType?: string;
  timezone?: string;
  sort?: string;

  /**
   * Himalayas search page.
   * Starts at 1.
   */
  page?: number;
}

/**
 * Search live Himalayas jobs.
 */
export async function searchRemoteJobs(
  options: JobSearchOptions = {}
): Promise<Job[]> {
  const params =
    new URLSearchParams();

  if (options.query?.trim()) {
    params.set(
      'q',
      options.query.trim()
    );
  }

  if (options.country?.trim()) {
    params.set(
      'country',
      options.country.trim()
    );
  }

  if (options.seniority?.trim()) {
    params.set(
      'seniority',
      options.seniority.trim()
    );
  }

  if (
    options.employmentType?.trim()
  ) {
    params.set(
      'employment_type',
      options.employmentType.trim()
    );
  }

  if (options.timezone?.trim()) {
    params.set(
      'timezone',
      options.timezone.trim()
    );
  }

  if (options.sort?.trim()) {
    params.set(
      'sort',
      options.sort.trim()
    );
  }

  params.set(
    'page',
    String(options.page ?? 1)
  );

  const response = await fetch(
    `${API_BASE}/jobs/search?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Job search failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as
      | HimalayasResponse
      | HimalayasJob[];

  return extractJobs(data).map(
    (job, index) =>
      mapJob(
        job,
        index
      )
  );
}
