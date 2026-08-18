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
import {
  fetchRemoteJobs,
  searchRemoteJobs,
} from '@/lib/jobsApi';
import type { Application, Job } from '@/types';

const SAVED_JOBS_KEY = 'saved_jobs';

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  'Full-time': 'Full Time',
  'Part-time': 'Part Time',
  Contract: 'Contractor',
  Internship: 'Intern',
};

const SENIORITY_MAP: Record<string, string> = {
  Entry: 'Entry-level',
  Mid: 'Mid-level',
  Senior: 'Senior',
  Lead: 'Manager',
};

export function JobsPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workplace, setWorkplace] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [experience, setExperience] = useState('All');

  const [showFilters, setShowFilters] = useState(false);

  const [remoteJobs, setRemoteJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [apiError, setApiError] = useState('');

  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = window.localStorage.getItem(
        SAVED_JOBS_KEY
      );

      if (!stored) {
        return [];
      }

      const parsed: unknown = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (id): id is string =>
          typeof id === 'string'
      );
    } catch (error) {
      console.error(
        'Unable to load saved jobs:',
        error
      );

      return [];
    }
  });

  const { applications, addApplication } =
    useApplications();

  /*
   * Initial live jobs load
   */
  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setApiError('');

        const fetchedJobs = await fetchRemoteJobs();

        if (cancelled) {
          return;
        }

        setRemoteJobs(
          Array.isArray(fetchedJobs)
            ? fetchedJobs
            : []
        );
      } catch (error) {
        console.error(
          'Failed to load remote jobs:',
          error
        );

        if (!cancelled) {
          setApiError(
            'Unable to load live jobs right now. Please try again.'
          );

          setRemoteJobs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Search live jobs
   */
  const handleLiveSearch = async ({
    nextSearch = search,
    nextLocation = location,
    nextJobType = jobType,
    nextExperience = experience,
  }: {
    nextSearch?: string;
    nextLocation?: string;
    nextJobType?: string;
    nextExperience?: string;
  } = {}) => {
    try {
      setSearching(true);
      setApiError('');

      const query = nextSearch.trim();

      const employmentType =
        nextJobType !== 'All'
          ? EMPLOYMENT_TYPE_MAP[nextJobType]
          : undefined;

      const seniority =
        nextExperience !== 'All'
          ? SENIORITY_MAP[nextExperience]
          : undefined;

      const country =
        nextLocation.trim() || undefined;

      console.log(
        'Searching Himalayas jobs:',
        {
          query,
          country,
          employmentType,
          seniority,
        }
      );

      const searchedJobs =
        await searchRemoteJobs({
          query,
          country,
          employmentType,
          seniority,
          sort: 'date',
          page: 1,
        });

      setRemoteJobs(
        Array.isArray(searchedJobs)
          ? searchedJobs
          : []
      );
    } catch (error) {
      console.error(
        'Failed to search live jobs:',
        error
      );

      setApiError(
        'Unable to search live jobs right now. Please try again.'
      );

      setRemoteJobs([]);
    } finally {
      setSearching(false);
    }
  };

  /*
   * Save / unsave job
   */
  const toggleSavedJob = (id: string) => {
    setSavedJobs((previous) => {
      const next = previous.includes(id)
        ? previous.filter(
            (jobId) => jobId !== id
          )
        : [...previous, id];

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(
            SAVED_JOBS_KEY,
            JSON.stringify(next)
          );
        } catch (error) {
          console.error(
            'Unable to save jobs locally:',
            error
          );
        }
      }

      return next;
    });
  };

  /*
   * Check whether a job has already been applied for
   */
  const isJobApplied = (jobId: string) => {
    return applications.some(
      (application) =>
        application.jobId === jobId
    );
  };

  /*
   * Apply for a job
   */
  const handleApply = (job: Job) => {
    const alreadyApplied =
      isJobApplied(job.id);

    if (!alreadyApplied) {
      const application: Application = {
        id: `application-${job.id}`,
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        workMode: job.workMode,
        salary: job.salary,
        appliedDate:
          new Date().toISOString(),
        status: 'Applied',
      };

      addApplication(application);
    }

    const applicationUrl =
      job.applicationUrl?.trim();

    if (applicationUrl) {
      window.open(
        applicationUrl,
        '_blank',
        'noopener,noreferrer'
      );

      return;
    }

    const fallbackUrl =
      `https://www.google.com/search?q=${encodeURIComponent(
        `${job.title} ${job.company} jobs`
      )}`;

    window.open(
      fallbackUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /*
   * Workplace filtering is handled locally.
   *
   * Job type and experience are sent to the
   * Himalayas API when changed.
   */
  const filteredJobs = useMemo(() => {
    if (workplace === 'All') {
      return remoteJobs;
    }

    return remoteJobs.filter(
      (job) => job.workMode === workplace
    );
  }, [remoteJobs, workplace]);

  /*
   * Submit search
   */
  const handleSearchSubmit = () => {
    void handleLiveSearch({
      nextSearch: search,
      nextLocation: location,
      nextJobType: jobType,
      nextExperience: experience,
    });
  };

  /*
   * Job type filter
   */
  const handleJobTypeChange = (
    value: string
  ) => {
    setJobType(value);

    void handleLiveSearch({
      nextSearch: search,
      nextLocation: location,
      nextJobType: value,
      nextExperience: experience,
    });
  };

  /*
   * Experience filter
   */
  const handleExperienceChange = (
    value: string
  ) => {
    setExperience(value);

    void handleLiveSearch({
      nextSearch: search,
      nextLocation: location,
      nextJobType: jobType,
      nextExperience: value,
    });
  };

  /*
   * Workplace filter
   */
  const handleWorkplaceChange = (
    value: string
  ) => {
    setWorkplace(value);
  };

  /*
   * Reset all filters and reload live jobs
   */
  const clearFilters = async () => {
    setSearch('');
    setLocation('');
    setWorkplace('All');
    setJobType('All');
    setExperience('All');

    try {
      setSearching(true);
      setApiError('');

      const freshJobs =
        await fetchRemoteJobs();

      setRemoteJobs(
        Array.isArray(freshJobs)
          ? freshJobs
          : []
      );
    } catch (error) {
      console.error(
        'Failed to reset jobs:',
        error
      );

      setApiError(
        'Unable to reload live jobs right now. Please try again.'
      );

      setRemoteJobs([]);
    } finally {
      setSearching(false);
    }
  };

  const hasFilters =
    Boolean(search.trim()) ||
    Boolean(location.trim()) ||
    workplace !== 'All' ||
    jobType !== 'All' ||
    experience !== 'All';

  const isBusy =
    loading || searching;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Find Your Next Job
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Search for real remote jobs, filter
          opportunities, and save positions you
          want to apply for.
        </p>
      </div>

      {/* Search and filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_auto]">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              className="input pl-10"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              placeholder="Job title, skill, or company..."
              aria-label="Search jobs"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              className="input pl-10"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              placeholder="Country, city, or remote..."
              aria-label="Search by location"
            />
          </div>

          {/* Filters button */}
          <Button
            onClick={() =>
              setShowFilters(
                (value) => !value
              )
            }
            type="button"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filter controls */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 sm:grid-cols-3">
            {/* Workplace */}
            <div>
              <label
                htmlFor="workplace-filter"
                className="label"
              >
                Workplace
              </label>

              <select
                id="workplace-filter"
                className="input"
                value={workplace}
                onChange={(event) =>
                  handleWorkplaceChange(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Remote">
                  Remote
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="On-site">
                  On-site
                </option>
              </select>
            </div>

            {/* Job type */}
            <div>
              <label
                htmlFor="job-type-filter"
                className="label"
              >
                Job Type
              </label>

              <select
                id="job-type-filter"
                className="input"
                value={jobType}
                onChange={(event) =>
                  handleJobTypeChange(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Full-time">
                  Full-time
                </option>

                <option value="Part-time">
                  Part-time
                </option>

                <option value="Contract">
                  Contract
                </option>

                <option value="Internship">
                  Internship
                </option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label
                htmlFor="experience-filter"
                className="label"
              >
                Experience
              </label>

              <select
                id="experience-filter"
                className="input"
                value={experience}
                onChange={(event) =>
                  handleExperienceChange(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Entry">
                  Entry level
                </option>

                <option value="Mid">
                  Mid level
                </option>

                <option value="Senior">
                  Senior
                </option>

                <option value="Lead">
                  Lead / Manager
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* API error */}
      {apiError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700"
        >
          {apiError}
        </div>
      )}

      {/* Results heading */}
      <div className="mb-4 mt-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">
            {isBusy
              ? searching
                ? 'Searching jobs...'
                : 'Loading jobs...'
              : `${filteredJobs.length} ${
                  filteredJobs.length === 1
                    ? 'job'
                    : 'jobs'
                } found`}
          </p>

          <p className="text-sm text-slate-500">
            {isBusy
              ? searching
                ? 'Searching the live Himalayas jobs database.'
                : 'Fetching the latest remote opportunities.'
              : remoteJobs.length > 0
                ? 'Live jobs loaded from the Himalayas jobs API.'
                : 'No live jobs matched your search.'}
          </p>
        </div>

        {hasFilters && !isBusy && (
          <button
            type="button"
            onClick={() => {
              void clearFilters();
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <X className="h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>

      {/* Loading */}
      {isBusy ? (
        <div className="card flex min-h-[300px] items-center justify-center p-10">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />

            <p className="text-sm">
              {searching
                ? 'Searching live jobs...'
                : 'Loading real jobs...'}
            </p>
          </div>
        </div>
      ) : filteredJobs.length > 0 ? (
        /* Job cards */
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredJobs.map((job) => {
            const isSaved =
              savedJobs.includes(job.id);

            const isApplied =
              isJobApplied(job.id);

            return (
              <div
                key={job.id}
                className="card flex flex-col p-5 transition-shadow hover:shadow-md"
              >
                {/* Job header */}
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
                      toggleSavedJob(
                        job.id
                      )
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

                {/* Job metadata */}
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

                {/* Job badges */}
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

                {/* Salary */}
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  {job.salary}
                </p>

                {/* Description */}
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {job.description}
                </p>

                {/* Skills */}
                {job.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills
                      .slice(0, 8)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <Button
                    onClick={() =>
                      handleApply(job)
                    }
                    type="button"
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
                      toggleSavedJob(
                        job.id
                      )
                    }
                    type="button"
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
        /* Empty state */
        <div className="card p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-6 w-6 text-slate-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No jobs found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            No live Himalayas jobs matched
            your current search and filters.
            Try another combination.
          </p>

          <div className="mt-5">
            <Button
              variant="secondary"
              onClick={() => {
                void clearFilters();
              }}
              type="button"
            >
              Clear Search
            </Button>
          </div>
        </div>
      )}

      {/* Saved jobs summary */}
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
            Saved jobs are stored locally in
            your browser.
          </p>
        </div>
      )}

      {/* Source */}
      <div className="mt-8 text-center text-sm text-slate-500">
        Live remote jobs sourced from{' '}

        <a
          href="https://himalayas.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          Himalayas
        </a>
      </div>

      {/* Applications summary */}
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
            Your applications are automatically
            tracked in the Applications section.
          </p>
        </div>
      )}
    </div>
  );
}
