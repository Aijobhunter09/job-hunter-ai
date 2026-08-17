import type { Job } from '@/types';

interface HimalayasJob {
  guid?: string;
  id?: string;
  title?: string;
  companyName?: string;

  locationRestrictions?: string[];

  employmentType?: string;

  seniority?: string | string[];

  description?: string;
  excerpt?: string;

  minSalary?: number | null;
  maxSalary?: number | null;
  currency?: string;
  salaryPeriod?: string;

  categories?: string[];

  applicationLink?: string;

  pubDate?: string | number;
}

interface HimalayasResponse {
  jobs?: HimalayasJob[];
  totalCount?: number;
}

const API_URL =
  'https://himalayas.app/jobs/api?limit=20&offset=0';

function getLocation(job: HimalayasJob): string {
  if (
    Array.isArray(job.locationRestrictions) &&
    job.locationRestrictions.length > 0
  ) {
    return job.locationRestrictions.join(', ');
  }

  return 'Worldwide / Remote';
}

function getExperience(
  seniority?: string | string[]
): Job['experienceLevel'] {
  const value = Array.isArray(seniority)
    ? seniority.join(' ')
    : seniority || '';

  const text = value.toLowerCase();

  if (
    text.includes('senior') ||
    text.includes('director') ||
    text.includes('executive')
  ) {
    return 'Senior';
  }

  if (
    text.includes('manager') ||
    text.includes('lead')
  ) {
    return 'Lead';
  }

  if (
    text.includes('mid') ||
    text.includes('intermediate')
  ) {
    return 'Mid';
  }

  return 'Entry';
}

function getJobType(
  employmentType?: string
): Job['jobType'] {
  const value =
    employmentType?.toLowerCase() || '';

  if (
    value.includes('part') ||
    value.includes('part-time')
  ) {
    return 'Part-time';
  }

  if (
    value.includes('contract') ||
    value.includes('contractor')
  ) {
    return 'Contract';
  }

  if (
    value.includes('intern')
  ) {
    return 'Internship';
  }

  return 'Full-time';
}

function getPostedDate(
  pubDate?: string | number
): string {
  if (!pubDate) {
    return new Date().toISOString();
  }

  if (typeof pubDate === 'number') {
    return new Date(pubDate).toISOString();
  }

  return pubDate;
}

function normalizeJob(
  job: HimalayasJob,
  index: number
): Job {
  const company =
    job.companyName ||
    'Unknown Company';

  const location =
    getLocation(job);

  const salaryMin =
    typeof job.minSalary === 'number'
      ? job.minSalary
      : 0;

  const salaryMax =
    typeof job.maxSalary === 'number'
      ? job.maxSalary
      : 0;

  const currency =
    job.currency || 'USD';

  let salary = 'Salary not specified';

  if (salaryMin > 0 && salaryMax > 0) {
    salary =
      `${currency} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`;
  } else if (salaryMin > 0) {
    salary =
      `${currency} ${salaryMin.toLocaleString()}+`;
  } else if (salaryMax > 0) {
    salary =
      `Up to ${currency} ${salaryMax.toLocaleString()}`;
  }

  const description =
    job.excerpt ||
    job.description ||
    'No description available.';

  const skills =
    Array.isArray(job.categories)
      ? job.categories
      : [];

  return {
    id:
      `himalayas-${job.guid || job.id || index}`,

    title:
      job.title || 'Untitled Job',

    company,

    location,

    workMode:
      'Remote',

    jobType:
      getJobType(job.employmentType),

    salary,

    salaryMin,

    postedDate:
      getPostedDate(job.pubDate),

    matchScore:
      0,

    skills,

    experienceLevel:
      getExperience(job.seniority),

    description,

    responsibilities:
      [],

    requirements:
      skills,

    applicationUrl:
      job.applicationLink,
  };
}

export async function fetchRemoteJobs(): Promise<Job[]> {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Jobs API request failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as HimalayasResponse;

  const jobs =
    Array.isArray(data.jobs)
      ? data.jobs
      : [];

  return jobs.map(normalizeJob);
}
