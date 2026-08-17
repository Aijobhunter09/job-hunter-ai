import { useEffect, useMemo, useState } from 'react';
import {
Search,
MapPin,
Briefcase,
Bookmark,
BookmarkCheck,
ExternalLink,
SlidersHorizontal,
X,
CheckCircle2,
Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { useApplications } from '@/hooks/useApplications';
import { jobs as demoJobs } from '@/data/jobs';
import { fetchRemoteJobs } from '@/lib/jobsApi';
import type { Application, Job } from '@/types';

const SAVED_JOBS_KEY = 'saved_jobs';

export function JobsPage() {
const [search, setSearch] = useState('');
const [location, setLocation] = useState('');
const [workplace, setWorkplace] = useState('All');
const [jobType, setJobType] = useState('All');
const [experience, setExperience] = useState('All');
const [showFilters, setShowFilters] = useState(false);

const [remoteJobs, setRemoteJobs] = useState<Job[]>([]);
const [loading, setLoading] = useState(true);
const [apiError, setApiError] = useState('');

const [savedJobs, setSavedJobs] = useState<string[]>(() => {
try {
const stored = localStorage.getItem(SAVED_JOBS_KEY);

```
  if (!stored) {
    return [];
  }

  const parsed = JSON.parse(stored);

  return Array.isArray(parsed)
    ? parsed.filter(
        (id): id is string => typeof id === 'string'
      )
    : [];
} catch {
  return [];
}
```

});

const { applications, addApplication } = useApplications();

useEffect(() => {
let cancelled = false;

```
async function loadJobs() {
  try {
    setLoading(true);
    setApiError('');

    const fetchedJobs = await fetchRemoteJobs();

    if (!cancelled) {
      setRemoteJobs(fetchedJobs);
    }
  } catch (error) {
    console.error('Failed to load remote jobs:', error);

    if (!cancelled) {
      setApiError(
        'Unable to load live jobs right now. Showing demo jobs instead.'
      );
      setRemoteJobs([]);
    }
  } finally {
    if (!cancelled) {
      setLoading(false);
    }
  }
}

loadJobs();

return () => {
  cancelled = true;
};
```

}, []);

const availableJobs =
remoteJobs.length > 0
? remoteJobs
: demoJobs;

const toggleSavedJob = (id: string) => {
setSavedJobs((previous) => {
const next = previous.includes(id)
? previous.filter((jobId) => jobId !== id)
: [...previous, id];

```
  localStorage.setItem(
    SAVED_JOBS_KEY,
    JSON.stringify(next)
  );

  return next;
});
```

};

const isJobApplied = (jobId: string) => {
return applications.some(
(application) => application.jobId === jobId
);
};

const handleApply = (job: Job) => {
const alreadyApplied = isJobApplied(job.id);

```
if (!alreadyApplied) {
  const application: Application = {
    id: `application-${job.id}`,
    jobId: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    workMode: job.workMode,
    salary: job.salary,
    appliedDate: new Date().toISOString(),
    status: 'Applied',
  };

  addApplication(application);
}

window.open(
  'https://www.linkedin.com/jobs/',
  '_blank',
  'noopener,noreferrer'
);
```

};

const filteredJobs = useMemo(() => {
const searchText = search.trim().toLowerCase();
const locationText = location.trim().toLowerCase();

```
return availableJobs.filter((job) => {
  const searchableText = [
    job.title,
    job.company,
    job.location,
    job.description,
    job.experienceLevel,
    job.workMode,
    job.jobType,
    ...job.skills,
  ]
    .join(' ')
    .toLowerCase();

  const matchesSearch =
    !searchText ||
    searchableText.includes(searchText);

  const matchesLocation =
    !locationText ||
    job.location.toLowerCase().includes(locationText) ||
    job.workMode.toLowerCase().includes(locationText);

  const matchesWorkplace =
    workplace === 'All' ||
    job.workMode === workplace;

  const matchesType =
    jobType === 'All' ||
    job.jobType === jobType;

  const matchesExperience =
    experience === 'All' ||
    job.experienceLevel === experience;

  return (
    matchesSearch &&
    matchesLocation &&
    matchesWorkplace &&
    matchesType &&
    matchesExperience
  );
});
```

}, [
availableJobs,
search,
location,
workplace,
jobType,
experience,
]);

const clearFilters = () => {
setSearch('');
setLocation('');
setWorkplace('All');
setJobType('All');
setExperience('All');
};

const hasFilters =
search.trim() ||
location.trim() ||
workplace !== 'All' ||
jobType !== 'All' ||
experience !== 'All';

return ( <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"> <div className="mb-8"> <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
Find Your Next Job </h1>

```
    <p className="mt-2 max-w-2xl text-slate-600">
      Search for real remote jobs, filter opportunities,
      and save positions you want to apply for.
    </p>
  </div>

  <div className="card p-4">
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          className="input pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Job title, skill, or company..."
        />
      </div>

      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          className="input pl-10"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, country, or remote..."
        />
      </div>

      <Button
        onClick={() =>
          setShowFilters((value) => !value)
        }
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>
    </div>

    {showFilters && (
      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 sm:grid-cols-3">
        <div>
          <label className="label">
            Workplace
          </label>

          <select
            className="input"
            value={workplace}
            onChange={(e) =>
              setWorkplace(e.target.value)
            }
          >
            <option>All</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
        </div>

        <div>
          <label className="label">
            Job Type
          </label>

          <select
            className="input"
            value={jobType}
            onChange={(e) =>
              setJobType(e.target.value)
            }
          >
            <option>All</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>

        <div>
          <label className="label">
            Experience
          </label>

          <select
            className="input"
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value)
            }
          >
            <option>All</option>
            <option>Entry</option>
            <option>Mid</option>
            <option>Senior</option>
            <option>Lead</option>
          </select>
        </div>
      </div>
    )}
  </div>

  {apiError && (
    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
      {apiError}
    </div>
  )}

  <div className="mb-4 mt-8 flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="font-medium text-slate-900">
        {loading
          ? 'Loading jobs...'
          : `${filteredJobs.length} ${
              filteredJobs.length === 1
                ? 'job'
                : 'jobs'
            } found`}
      </p>

      <p className="text-sm text-slate-500">
        {loading
          ? 'Fetching the latest remote opportunities.'
          : remoteJobs.length > 0
            ? 'Live jobs loaded from the jobs API.'
            : 'Showing demo opportunities.'}
      </p>
    </div>

    {hasFilters && (
      <button
        type="button"
        onClick={clearFilters}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        <X className="h-4 w-4" />
        Clear filters
      </button>
    )}
  </div>

  {loading ? (
    <div className="card flex min-h-[300px] items-center justify-center p-10">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />

        <p className="text-sm">
          Loading real jobs...
        </p>
      </div>
    </div>
  ) : filteredJobs.length > 0 ? (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {filteredJobs.map((job) => {
        const isSaved = savedJobs.includes(job.id);
        const isApplied = isJobApplied(job.id);

        return (
          <div
            key={job.id}
            className="card flex flex-col p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  {job.title}
                </h2>

                <p className="mt-1 font-medium text-primary-600">
                  {job.company}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  toggleSavedJob(job.id)
                }
                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-primary-600"
                aria-label={
                  isSaved
                    ? `Remove ${job.title} from saved jobs`
                    : `Save ${job.title}`
                }
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary-600" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {job.jobType}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                {job.workMode}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {job.experienceLevel}
              </span>

              {job.matchScore > 0 && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {job.matchScore}% Match
                </span>
              )}
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              {job.salary}
            </p>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
              {job.description}
            </p>

            {job.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Button
                onClick={() => handleApply(job)}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Applied
                  </>
                ) : (
                  <>
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </>
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  toggleSavedJob(job.id)
                }
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save Job
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="card p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Search className="h-6 w-6 text-slate-400" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        No jobs found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Try changing your search keywords, location,
        or filters to find more opportunities.
      </p>

      <div className="mt-5">
        <Button
          variant="secondary"
          onClick={clearFilters}
        >
          Clear Search
        </Button>
      </div>
    </div>
  )}

  {savedJobs.length > 0 && (
    <div className="mt-8 rounded-lg border border-primary-100 bg-primary-50 p-4">
      <div className="flex items-center gap-2">
        <BookmarkCheck className="h-5 w-5 text-primary-600" />

        <p className="text-sm font-medium text-slate-800">
          You have {savedJobs.length}{' '}
          {savedJobs.length === 1
            ? 'saved job'
            : 'saved jobs'}.
        </p>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Saved jobs are stored locally in your browser.
      </p>
    </div>
  )}

  {applications.length > 0 && (
    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-blue-600" />

        <p className="text-sm font-medium text-slate-800">
          You have {applications.length}{' '}
          {applications.length === 1
            ? 'application'
            : 'applications'}{' '}
          tracked.
        </p>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Your applications are automatically tracked in
        the Applications section.
      </p>
    </div>
  )}
</div>
```

);
}
