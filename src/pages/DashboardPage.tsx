import {
  ArrowRight,
  Bookmark,
  Briefcase,
  CheckCircle2,
  Clock3,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';
import type { ResumeData } from '@/types';
import { StatCard } from '@/components/StatCard';
import { JobCard } from '@/components/JobCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { demoJobs } from '@/data/demoData';
import { loadFromStorage } from '@/lib/storage';
import { navigate } from '@/lib/router';

const RESUME_STORAGE_KEY = 'resume';

const statusStyles = {
  Saved: 'bg-slate-100 text-slate-600',
  Applied: 'bg-blue-100 text-blue-700',
  Interview: 'bg-amber-100 text-amber-700',
  Offer: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
} as const;

function getProfileCompletion(
  profile: ReturnType<typeof useProfile>['profile'],
  resume: ResumeData
) {
  const checks = [
    Boolean(profile.name.trim() || resume.fullName.trim()),
    Boolean(profile.jobTitle.trim()),
    Boolean(profile.location.trim()),
    profile.skills.length > 0 || resume.skills.length > 0,
    Boolean(resume.summary.trim()),
    resume.experience.length > 0,
    resume.education.length > 0,
    Boolean(profile.linkedinUrl.trim() || profile.portfolioUrl.trim()),
  ];

  return Math.round(
    (checks.filter(Boolean).length / checks.length) * 100
  );
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardPage() {
  const { applications } = useApplications();
  const { profile } = useProfile();
  const { savedJobs, isSaved, toggleSave } = useSavedJobs();

  const resume = useMemo(
    () => loadFromStorage<ResumeData>(RESUME_STORAGE_KEY, {
      fullName: '',
      email: '',
      phone: '',
      summary: '',
      skills: [],
      experience: [],
      education: [],
      projects: [],
    }),
    []
  );

  const profileCompletion = getProfileCompletion(profile, resume);

  const interviewCount = applications.filter(
    (application) => application.status === 'Interview'
  ).length;

  const offerCount = applications.filter(
    (application) => application.status === 'Offer'
  ).length;

  const activeApplications = applications.filter(
    (application) =>
      application.status !== 'Rejected' &&
      application.status !== 'Offer'
  ).length;

  const applicationRate =
    savedJobs.length > 0
      ? Math.round((applications.length / savedJobs.length) * 100)
      : 0;

  const recommendedJobs = useMemo(() => {
    const profileSkills = new Set(
      [...profile.skills, ...resume.skills].map((skill) =>
        skill.trim().toLowerCase()
      )
    );

    return [...demoJobs]
      .map((job) => {
        const matchingSkills = job.skills.filter((skill) =>
          profileSkills.has(skill.toLowerCase())
        );

        const personalizedScore =
          profileSkills.size > 0
            ? Math.min(
                99,
                Math.round(
                  (matchingSkills.length / job.skills.length) * 100
                )
              )
            : job.matchScore;

        return {
          job: {
            ...job,
            matchScore: personalizedScore || job.matchScore,
          },
          matchingSkills: matchingSkills.length,
        };
      })
      .sort(
        (a, b) =>
          b.matchingSkills - a.matchingSkills ||
          b.job.matchScore - a.job.matchScore
      )
      .slice(0, 4)
      .map(({ job }) => job);
  }, [profile.skills, resume.skills]);

  const recentApplications = useMemo(
    () =>
      [...applications]
        .filter((application) => application.status !== 'Saved')
        .sort((a, b) => {
          const aTime = a.appliedDate
            ? new Date(a.appliedDate).getTime()
            : 0;
          const bTime = b.appliedDate
            ? new Date(b.appliedDate).getTime()
            : 0;

          return bTime - aTime;
        })
        .slice(0, 4),
    [applications]
  );

  const savedJobCards = useMemo(
    () =>
      savedJobs
        .map((id) => demoJobs.find((job) => job.id === id))
        .filter(Boolean)
        .slice(0, 3),
    [savedJobs]
  );

  const profileReady = profileCompletion >= 75;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-primary-50/70 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
              <Sparkles className="h-3.5 w-3.5" />
              Job search command center
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {getGreeting()}
              {profile.name ? `, ${profile.name.split(' ')[0]}` : ''}.
            </h1>

            <p className="mt-2 text-slate-600">
              Keep your applications organized, discover stronger matches, and
              stay ready for your next opportunity.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => navigate('/jobs')}>
                Find jobs
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button variant="secondary" onClick={() => navigate('/applications')}>
                Track applications
              </Button>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-xl border border-primary-100 bg-white/90 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Profile readiness
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {profileCompletion}%
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                <Target className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary-600 transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              {profileReady
                ? 'Your profile is in good shape for job matching.'
                : 'Complete your profile and resume to improve job matching.'}
            </p>

            {!profileReady && (
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="mt-3 text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                Complete profile →
              </button>
            )}
          </div>
        </div>
      </section>

      <section aria-label="Job search statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Bookmark}
            label="Jobs Saved"
            value={savedJobs.length}
            color="primary"
          />
          <StatCard
            icon={FileText}
            label="Applications"
            value={applications.length}
            trend={applications.length > 0 ? `${applicationRate}% of saved jobs` : undefined}
            color="info"
          />
          <StatCard
            icon={Briefcase}
            label="Interviews"
            value={interviewCount}
            color="warning"
          />
          <StatCard
            icon={Target}
            label="Profile Completion"
            value={`${profileCompletion}%`}
            color="success"
          />
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Application progress
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick view of where your active opportunities stand.
            </p>
          </div>

          <Button variant="ghost" onClick={() => navigate('/applications')}>
            Open tracker
          </Button>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
            <div className="p-5">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock3 className="h-4 w-4" />
                <span className="text-sm">Active</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {activeApplications}
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-amber-600">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">Interviews</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {interviewCount}
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Offers</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {offerCount}
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-primary-700">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Saved</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {savedJobs.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recommended jobs
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {profile.skills.length || resume.skills.length
                  ? 'Prioritized using the skills in your profile and resume.'
                  : 'Complete your profile to personalize these recommendations.'}
              </p>
            </div>

            <Button variant="ghost" onClick={() => navigate('/jobs')}>
              View all
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {recommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={isSaved(job.id)}
                onToggleSave={toggleSave}
                compact
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent applications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest application activity.
              </p>
            </div>

            <Button variant="ghost" onClick={() => navigate('/applications')}>
              View all
            </Button>
          </div>

          <div className="card divide-y divide-slate-100">
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => navigate('/applications')}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {application.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {application.company}
                    </p>
                  </div>

                  <Badge
                    variant="neutral"
                    className={statusStyles[application.status]}
                  >
                    {application.status}
                  </Badge>
                </button>
              ))
            ) : (
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Apply to a job and it will appear here."
                action={
                  <Button onClick={() => navigate('/jobs')}>
                    Browse jobs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Saved for later
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Quickly return to opportunities you bookmarked.
            </p>
          </div>

          <Button variant="ghost" onClick={() => navigate('/saved-jobs')}>
            View saved jobs
          </Button>
        </div>

        {savedJobCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {savedJobCards.map((job) => (
              <JobCard
                key={job!.id}
                job={job!}
                isSaved={isSaved(job!.id)}
                onToggleSave={toggleSave}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Bookmark className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">
              Nothing saved yet
            </h3>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Save interesting jobs from the Jobs page and they will show up here.
            </p>
            <Button className="mt-4" onClick={() => navigate('/jobs')}>
              Explore jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

      <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50/70 p-4 text-sm text-primary-800">
        <span className="font-semibold">Local data:</span> your saved jobs,
        applications, profile, and resume are currently stored in your browser.
      </div>
    </div>
  );
}
