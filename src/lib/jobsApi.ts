import type { Job } from '@/types';

const API_URL = '/api/jobs';

interface HimalayasLocation {
  alpha2?: string;
  name?: string;
  slug?: string;
}

interface HimalayasJob {
  title?: string;
  excerpt?: string;
  companyName?: string;
  companySlug?: string;
  companyLogo?: string;
  employmentType?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryPeriod?: string;
  currency?: string;
  seniority?: string[];
  locationRestrictions?: HimalayasLocation[];
  timezoneRestrictions?: string[];
  categories?: string[];
  parentCategories?: string[];
  description?: string;
  pubDate?: number;
  expiryDate?: number;
  applicationLink?: string;
  guid?: string;
}

interface HimalayasResponse {
  jobs?: HimalayasJob[];
}

function getWorkMode(job: HimalayasJob): string {
  const locations = job.locationRestrictions ?? [];

  if (locations.length === 0) {
    return 'Remote';
  }

  return 'Remote';
}

function getLocation(job: HimalayasJob): string {
  const locations = job.locationRestrictions ?? [];

  if (locations.length === 0) {
    return 'Worldwide';
  }

  return locations
    .map((location) => location.name)
    .filter(Boolean)
    .join(', ') || 'Remote';
}

function getSalary(job: HimalayasJob): string {
  const min = job.minSalary;
  const max = job.maxSalary;
  const currency = job.currency || 'USD';

  if (min != null && max != null) {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} / ${job.salaryPeriod || 'annual'}`;
  }

  if (min != null) {
    return `${currency} ${min.toLocaleString()}+ / ${job.salaryPeriod || 'annual'}`;
  }

  if (max != null) {
    return `Up to ${currency} ${max.toLocaleString()} / ${job.salaryPeriod || 'annual'}`;
  }

  return 'Salary not specified';
}

function getExperienceLevel(job: HimalayasJob): string {
  const seniority = job.seniority?.[0]?.toLowerCase() || '';

  if (seniority.includes('entry')) {
    return 'Entry';
  }

  if (seniority.includes('junior')) {
    return 'Entry';
  }

  if (seniority.includes('mid')) {
    return 'Mid';
  }

  if (seniority.includes('senior')) {
    return 'Senior';
  }

  if (
    seniority.includes('manager') ||
    seniority.includes('director') ||
    seniority.includes('executive')
  ) {
    return 'Lead';
  }

  return 'All Levels';
}

function getJobType(employmentType?: string): string {
  switch (employmentType?.toLowerCase()) {
    case 'full time':
      return 'Full-time';

    case 'part time':
      return 'Part-time';

    case 'contractor':
      return 'Contract';

    case 'temporary':
      return 'Contract';

    case 'intern':
      return 'Internship';

    default:
      return employmentType || 'Full-time';
  }
}

function cleanDescription(description?: string, excerpt?: string): string {
  const source = description || excerpt || 'No description available.';

  return source
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapHimalayasJob(job: HimalayasJob, index: number): Job {
  const id =
    job.guid ||
    job.applicationLink ||
    `${job.companySlug || 'job'}-${index}`;

  return {
    id,
    title: job.title || 'Untitled Job',
    company: job.companyName || 'Unknown Company',
    location: getLocation(job),
    workMode: getWorkMode(job),
    jobType: getJobType(job.employmentType),
    experienceLevel: getExperienceLevel(job),
    salary: getSalary(job),
    description: cleanDescription(
      job.description,
      job.excerpt
    ),
    skills: [
      ...(job.categories || []),
      ...(job.parentCategories || []),
    ].filter(
      (skill, index, array) =>
        array.indexOf(skill) === index
    ),
    matchScore: 0,
    applicationUrl: job.applicationLink || '',
  };
}

export async function fetchRemoteJobs(): Promise<Job[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Unable to load jobs: ${response.status}`
    );
  }

  const data: HimalayasResponse = await response.json();

  if (!Array.isArray(data.jobs)) {
    throw new Error('Invalid jobs API response');
  }

  return data.jobs.map(mapHimalayasJob);
}
