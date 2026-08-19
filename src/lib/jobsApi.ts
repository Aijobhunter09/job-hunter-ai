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

function normalizeCountry(country: string): string {
  const value = country.trim().toLowerCase();

  const countryMap: Record<string, string> = {
    usa: 'US',
    us: 'US',
    'united states': 'US',
    'united states of america': 'US',
    america: 'US',

    uk: 'GB',
    'united kingdom': 'GB',
    britain: 'GB',
    'great britain': 'GB',

    pakistan: 'PK',
    pk: 'PK',

    canada: 'CA',
    ca: 'CA',

    australia: 'AU',
    au: 'AU',

    germany: 'DE',
    de: 'DE',

    france: 'FR',
    fr: 'FR',

    india: 'IN',
    in: 'IN',

    brazil: 'BR',
    br: 'BR',

    spain: 'ES',
    es: 'ES',

    italy: 'IT',
    it: 'IT',

    japan: 'JP',
    jp: 'JP',

    china: 'CN',
    cn: 'CN',

    singapore: 'SG',
    sg: 'SG',

    'new zealand': 'NZ',
    nz: 'NZ',

    netherlands: 'NL',
    nl: 'NL',

    ireland: 'IE',
    ie: 'IE',

    switzerland: 'CH',
    ch: 'CH',

    sweden: 'SE',
    se: 'SE',

    norway: 'NO',
    no: 'NO',

    denmark: 'DK',
    dk: 'DK',

    finland: 'FI',
    fi: 'FI',

    poland: 'PL',
    pl: 'PL',

    portugal: 'PT',
    pt: 'PT',

    austria: 'AT',
    at: 'AT',

    belgium: 'BE',
    be: 'BE',

    'south africa': 'ZA',
    za: 'ZA',

    'south korea': 'KR',
    korea: 'KR',
    kr: 'KR',

    mexico: 'MX',
    mx: 'MX',
  };

  return countryMap[value] || country.trim();
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

  const params = new URLSearchParams();

  params.set(
    'limit',
    String(limit)
  );

  params.set(
    'offset',
    String(offset)
  );

  const response = await fetch(
    `${API_BASE}/jobs?${params.toString()}`
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
    const normalizedCountry =
      normalizeCountry(
        options.country
      );

    params.set(
      'country',
      normalizedCountry
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

  const url =
    `${API_BASE}/jobs/search?${params.toString()}`;

  console.log(
    'Jobs API request:',
    url
  );

  const response =
    await fetch(url);

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
