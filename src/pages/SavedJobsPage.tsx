import { useEffect, useMemo, useState } from 'react';
import {
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Briefcase,
  Trash2,
  Search,
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

const SAVED_JOBS_KEY = 'saved_jobs';

/*
 * Keep these jobs synchronized with the jobs
 * available in JobsPage.tsx.
 */
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

export function SavedJobsPage() {
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_JOBS_KEY);

      if (!stored) {
        setSavedJobIds([]);
        return;
      }

      const parsed = JSON.parse(stored);

      setSavedJobIds(
        Array.isArray(parsed)
          ? parsed.filter((id): id is number => typeof id === 'number')
          : []
      );
    } catch {
      setSavedJobIds([]);
    }
  }, []);

  const savedJobs = useMemo(() => {
    const saved = jobs.filter((job) => savedJobIds.includes(job.id));

    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return saved;
    }

    return saved.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.description,
        ...job.skills,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(searchText);
    });
  }, [savedJobIds, search]);

  const removeSavedJob = (id: number) => {
    const next = savedJobIds.filter((jobId) => jobId !== id);

    setSavedJobIds(next);
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(next));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Saved Jobs
        </h1>

        <p className="mt-2 text-slate-600">
          Keep track of the jobs you want to apply for.
        </p>
      </div>

      {savedJobIds.length > 0 && (
        <div className="card mb-6 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              className="input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your saved jobs..."
            />
          </div>
        </div>
      )}

      {savedJobIds.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <BookmarkCheck className="h-7 w-7 text-slate-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No saved jobs yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            When you save a job from the Jobs page, it will appear here.
          </p>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-6 w-6 text-slate-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No matching saved jobs
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-primary-600" />

            <p className="font-medium text-slate-900">
              {savedJobs.length}{' '}
              {savedJobs.length === 1 ? 'saved job' : 'saved jobs'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {savedJobs.map((job) => (
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
                    onClick={() => removeSavedJob(job.id)}
                    className="shrink-0 rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                    aria-label={`Remove ${job.title} from saved jobs`}
                    title="Remove saved job"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

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

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                    {job.workplace}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {job.experience}
                  </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800">
                  {job.salary}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {job.description}
                </p>

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
                    onClick={() => removeSavedJob(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
