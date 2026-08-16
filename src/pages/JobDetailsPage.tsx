```tsx
import { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bookmark,
  FileText,
} from 'lucide-react';

import type { Job } from '@/types';
import { jobs } from '@/data/jobs';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MatchScore } from '@/components/MatchScore';

import { navigate } from '@/lib/router';
import { useSavedJobs } from '@/hooks/useSavedJobs';

interface JobDetailsPageProps {
  jobId: string;
}

export function JobDetailsPage({
  jobId,
}: JobDetailsPageProps) {
  const { isSaved, toggleSave } = useSavedJobs();

  const [analyzed, setAnalyzed] = useState(false);

  /*
   * Find the job from the centralized jobs.ts file.
   *
   * The router passes the ID as a string:
   * /jobs/1
   *
   * jobs.ts also contains string IDs:
   * id: '1'
   */
  const job: Job | undefined = jobs.find(
    (j) => j.id === jobId
  );

  /*
   * Job not found
   */
  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Job not found
        </h1>

        <p className="mt-2 text-slate-600">
          This job may have been removed or doesn't exist.
        </p>

        <div className="mt-6">
          <Button onClick={() => navigate('/jobs')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const saved = isSaved(job.id);

  /*
   * Demo AI match information.
   *
   * We will improve this later so it uses
   * the actual user's profile and skills.
   */
  const strengths = [
    'React',
    'TypeScript',
    'Git',
    'API development',
  ];

  const missing = ['AWS'];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Back to Jobs */}
      <button
        type="button"
        onClick={() => navigate('/jobs')}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </button>

      {/* =========================
          JOB HEADER
      ========================== */}
      <div className="card p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          {/* Company + Job Information */}
          <div className="flex items-start gap-4">

            {/* Company initials */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-lg font-bold text-primary-700">
              {job.company
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0">

              {/* Job title */}
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {job.title}
              </h1>

              {/* Company */}
              <p className="mt-1 text-slate-600">
                {job.company}
              </p>

              {/* Job metadata */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">

                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>

                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {job.jobType}
                </span>

                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {job.postedDate}
                </span>

              </div>
            </div>
          </div>

          {/* Match Score */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            <MatchScore
              score={job.matchScore}
              size="lg"
            />
          </div>

        </div>

        {/* Job Tags */}
        <div className="mt-5 flex flex-wrap gap-2">

          <Badge
            variant={
              job.workMode === 'Remote'
                ? 'success'
                : 'info'
            }
          >
            {job.workMode}
          </Badge>

          <Badge variant="neutral">
            {job.experienceLevel} level
          </Badge>

          {job.skills.map((skill) => (
            <Badge
              key={skill}
              variant="primary"
            >
              {skill}
            </Badge>
          ))}

        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          {/* Apply */}
          <Button
            onClick={() => navigate('/applications')}
            className="flex-1 sm:flex-none"
          >
            <FileText className="h-4 w-4" />
            Apply Now
          </Button>

          {/* Save */}
          <Button
            variant="secondary"
            onClick={() => toggleSave(job.id)}
            className="flex-1 sm:flex-none"
          >
            <Bookmark
              className={
                saved
                  ? 'h-4 w-4 fill-current'
                  : 'h-4 w-4'
              }
            />

            {saved
              ? 'Saved'
              : 'Save Job'}
          </Button>

        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* =====================
            LEFT COLUMN
        ====================== */}
        <div className="space-y-6 lg:col-span-2">

          {/* Job Description */}
          <div className="card p-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Job Description
            </h2>

            <p className="mt-3 leading-relaxed text-slate-600">
              {job.description}
            </p>

          </div>

          {/* Responsibilities */}
          <div className="card p-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Responsibilities
            </h2>

            <ul className="mt-3 space-y-2.5">

              {job.responsibilities.map(
                (responsibility, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />

                    <span>
                      {responsibility}
                    </span>
                  </li>
                )
              )}

            </ul>

          </div>

          {/* Requirements */}
          <div className="card p-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Requirements
            </h2>

            <ul className="mt-3 space-y-2.5">

              {job.requirements.map(
                (requirement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                    <span>
                      {requirement}
                    </span>
                  </li>
                )
              )}

            </ul>

          </div>

        </div>

        {/* =====================
            RIGHT SIDEBAR
        ====================== */}
        <div className="space-y-6">

          {/* AI Match Analysis */}
          <div className="card p-6">

            <div className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-primary-700" />

              <h2 className="text-lg font-semibold text-slate-900">
                AI Match Analysis
              </h2>

            </div>

            {!analyzed ? (

              <div className="mt-4">

                <p className="text-sm text-slate-600">
                  Get a detailed breakdown of how your
                  skills match this role.
                </p>

                <Button
                  onClick={() =>
                    setAnalyzed(true)
                  }
                  className="mt-4 w-full"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze My Match
                </Button>

              </div>

            ) : (

              <div className="mt-4 animate-slide-up">

                {/* Match percentage */}
                <div className="rounded-lg bg-primary-50 p-4 text-center">

                  <p className="text-sm text-slate-600">
                    Your Match
                  </p>

                  <p className="text-3xl font-bold text-primary-700">
                    {job.matchScore}%
                  </p>

                </div>

                {/* Strengths */}
                <div className="mt-4">

                  <h3 className="text-sm font-semibold text-green-700">
                    Strengths
                  </h3>

                  <ul className="mt-2 space-y-1.5">

                    {strengths.map(
                      (strength) => (
                        <li
                          key={strength}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {strength}
                        </li>
                      )
                    )}

                  </ul>

                </div>

                {/* Missing skills */}
                <div className="mt-4">

                  <h3 className="text-sm font-semibold text-amber-700">
                    Missing / Preferred
                  </h3>

                  <ul className="mt-2 space-y-1.5">

                    {missing.map(
                      (skill) => (
                        <li
                          key={skill}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <XCircle className="h-4 w-4 text-amber-500" />
                          {skill}
                        </li>
                      )
                    )}

                  </ul>

                </div>

                <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                  Demo analysis based on sample
                  profile data.
                </p>

              </div>

            )}

          </div>

          {/* Required Skills */}
          <div className="card p-6">

            <h2 className="text-sm font-semibold text-slate-900">
              Required Skills
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">

              {job.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="primary"
                >
                  {skill}
                </Badge>
              ))}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
```
