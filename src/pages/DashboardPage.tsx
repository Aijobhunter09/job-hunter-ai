import { Bookmark, Briefcase, FileText, Target } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { JobCard } from '@/components/JobCard';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { demoJobs } from '@/data/demoData';
import { navigate } from '@/lib/router';
import { Button } from '@/components/ui/Button';

const progressSteps = ['Saved', 'Applied', 'Interview', 'Offer'];
const progressCounts = [4, 3, 2, 1];

export function DashboardPage() {
  const { isSaved, toggleSave } = useSavedJobs();
  const recommended = demoJobs.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Good morning! Ready to find your next opportunity?
        </h1>
        <p className="mt-2 text-slate-600">Here's what's happening with your job search today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Bookmark} label="Jobs Saved" value={12} color="primary" />
        <StatCard icon={FileText} label="Applications" value={8} color="info" />
        <StatCard icon={Briefcase} label="Interviews" value={2} color="warning" />
        <StatCard icon={Target} label="Profile Match" value="86%" color="success" />
      </div>

      {/* Progress */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Application Progress</h2>
        <div className="card p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {progressSteps.map((step, i) => (
              <div key={step} className="relative">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">{progressCounts[i]}</p>
                  <p className="mt-1 text-sm font-medium text-slate-600">{step}</p>
                </div>
                {i < progressSteps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-slate-200 md:block" style={{ left: '100%' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended jobs */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recommended Jobs</h2>
          <Button variant="ghost" onClick={() => navigate('/jobs')}>
            View all
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {recommended.map((job) => (
            <JobCard key={job.id} job={job} isSaved={isSaved(job.id)} onToggleSave={toggleSave} />
          ))}
        </div>
      </div>

      {/* Demo notice */}
      <div className="mt-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-700">
        Showing demo data. Connect a profile to get personalized recommendations.
      </div>
    </div>
  );
}
