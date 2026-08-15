import { useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  workplace: 'Remote' | 'On-site' | 'Hybrid';
  experience: 'Entry Level' | 'Mid Level' | 'Senior Level';
  salary: string;
  description: string;
  skills: string[];
  url: string;
};

const jobs: Job[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechNova Solutions',
    location: 'Lahore, Pakistan',
    type: 'Full-time',
    workplace: 'Remote',
    experience: 'Mid Level',
    salary: '$1,000 - $1,800 / month',
    description:
      'Build responsive web applications using React, TypeScript, and modern frontend technologies.',
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS'],
    url: 'https://www.linkedin.com/jobs/',
  },
  {
    id: 2,
    title: 'SEO Specialist',
    company: 'Digital Growth Agency',
    location: 'Karachi, Pakistan',
    type: 'Full-time',
    workplace: 'Hybrid',
    experience: 'Mid Level',
    salary: '$700 - $1,400 / month',
    description:
      'Develop SEO strategies, perform keyword research, optimize websites, and monitor search performance.',
    skills: ['SEO', 'Google Search Console', 'Keyword Research', 'Analytics'],
    url: 'https://www.linkedin.com/jobs/',
  },
  {
    id: 3,
    title: 'Junior Web Developer',
    company: 'WebCraft Studio',
    location: 'Islamabad, Pakistan',
    type: 'Full-time',
    workplace: 'On-site',
    experience: 'Entry Level',
    salary: '$500 - $900 / month',
    description:
      'Work with a development team to create and maintain modern business websites.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    url: 'https://www.linkedin.com/jobs/',
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'CloudCore Technologies',
    location: 'Remote',
    type: 'Contract',
    workplace: 'Remote',
    experience: 'Senior Level',
    salary: '$2,000 - $3,500 / month',
    description:
      'Develop scalable full-stack applications and work with APIs, databases, and cloud services.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    url: 'https://www.linkedin.com/jobs/',
  },
  {
    id: 5,
    title: 'Digital Marketing Specialist',
    company: 'MarketBoost',
    location: 'Dubai, UAE',
    type: 'Full-time',
    workplace: 'Hybrid',
    experience: 'Mid Level',
    salary: '$1,500 - $2,500 / month',
    description:
      'Manage digital marketing campaigns, SEO initiatives, content strategies, and performance reporting.',
    skills: ['SEO', 'Google Ads', 'Content Marketing', 'Analytics'],
    url: 'https://www.linkedin.com/jobs/',
  },
  {
    id: 6,
    title: 'UI/UX Designer',
    company: 'Creative Labs',
    location: 'Remote',
    type: 'Part-time',
    workplace: 'Remote',
    experience: 'Entry Level',
    salary: '$600 - $1,200 / month',
    description:
      'Design intuitive interfaces and user experiences for web and mobile applications.',
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    url: 'https://www.linkedin.com/jobs/',
  },
];

const SAVED_JOBS_KEY = 'saved_jobs';

export function JobsPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workplace, setWorkplace] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const [savedJobs, setSavedJobs] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_JOBS_KEY);

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const toggleSavedJob = (id: number) => {
    setSavedJobs((previous) => {
      const next = previous.includes(id)
        ? previous.filter((jobId) => jobId !== id)
        : [...previous, id];

      localStorage.setItem(
        SAVED_JOBS_KEY,
        JSON.stringify(next)
      );

      return next;
    });
  };

  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.description,
        ...job.skills,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !searchText || searchableText.includes(searchText);

      const matchesLocation =
        !locationText ||
        job.location.toLowerCase().includes(locationText);

      const matchesWorkplace =
        workplace === 'All' || job.workplace === workplace;

      const matchesType =
        jobType === 'All' || job.type === jobType;

      const matchesExperience =
        experience === 'All' || job.experience === experience;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesWorkplace &&
        matchesType &&
        matchesExperience
      );
    });
  }, [
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Find Your Next Job
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Search for jobs, filter opportunities, and save positions
          you want to apply for.
        </p>
      </div>

      {/* Search */}
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

          <Button onClick={() => setShowFilters((value) => !value)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 sm:grid-cols-3">
            <div>
              <label className="label">Workplace</label>

              <select
                className="input"
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
              >
                <option>All</option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>

            <div>
              <label className="label">Job Type</label>

              <select
                className="input"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option>All</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <div>
              <label className="label">Experience</label>

              <select
                className="input"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option>All</option>
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior Level</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="mb-4 mt-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">
            {filteredJobs.length}{' '}
            {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>

          <p className="text-sm text-slate-500">
            Browse opportunities matching your search.
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

      {/* Job List */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredJobs.map((job) => {
            const isSaved = savedJobs.includes(job.id);

            return (
              <div
                key={job.id}
                className="card flex flex-col p-5 transition-shadow hover:shadow-md"
              >
                {/* Job Header */}
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
                    onClick={() => toggleSavedJob(job.id)}
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

                {/* Job Info */}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </span>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                    {job.workplace}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {job.experience}
                  </span>
                </div>

                {/* Salary */}
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  {job.salary}
                </p>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {job.description}
                </p>

                {/* Skills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <Button
                    onClick={() =>
                      window.open(
                        job.url,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => toggleSavedJob(job.id)}
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
        /* Empty State */
        <div className="card p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-6 w-6 text-slate-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No jobs found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Try changing your search keywords, location, or filters
            to find more opportunities.
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

      {/* Saved Jobs */}
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
    </div>
  );
}
