import { MapPin, Briefcase, DollarSign, Bookmark } from 'lucide-react';
import type { Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { MatchScore } from '@/components/MatchScore';
import { navigate } from '@/lib/router';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  compact?: boolean;
}

export function JobCard({ job, isSaved, onToggleSave, compact = false }: JobCardProps) {
  const workModeVariant = job.workMode === 'Remote' ? 'success' : job.workMode === 'Hybrid' ? 'info' : 'neutral';

  return (
    <div
      className={cn(
        'card p-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        compact && 'p-4'
      )}
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-700">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">{job.title}</h3>
              <p className="truncate text-sm text-slate-500">{job.company}</p>
            </div>
          </div>
        </div>
        <MatchScore score={job.matchScore} size="sm" showLabel={false} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" /> {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-4 w-4" /> {job.jobType}
        </span>
        <span className="flex items-center gap-1.5">
          <DollarSign className="h-4 w-4" /> {job.salary}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant={workModeVariant as 'success' | 'info' | 'neutral'}>{job.workMode}</Badge>
        {job.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="neutral">{skill}</Badge>
        ))}
        {job.skills.length > 3 && (
          <Badge variant="neutral">+{job.skills.length - 3}</Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">{job.postedDate}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            className={cn(
              'rounded-lg p-2 transition',
              isSaved
                ? 'text-primary-700 bg-primary-50 hover:bg-primary-100'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            )}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
          >
            <Bookmark className={cn('h-4.5 w-4.5', isSaved && 'fill-current')} style={{ width: 18, height: 18 }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jobs/${job.id}`);
            }}
            className="rounded-lg bg-primary-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-800 transition"
          >
            View Job
          </button>
        </div>
      </div>
    </div>
  );
}
