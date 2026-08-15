import { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { JobCard } from '@/components/JobCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { demoJobs } from '@/data/demoData';

export function JobsPage() {
  const { isSaved, toggleSave } = useSavedJobs();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [experience, setExperience] = useState('');

  const filtered = useMemo(() => {
    return demoJobs.filter((job) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.skills.some((s) => s.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (workMode && job.workMode !== workMode) return false;
      if (jobType && job.jobType !== jobType) return false;
      if (salaryMin && job.salaryMin < parseInt(salaryMin, 10)) return false;
      if (experience && job.experienceLevel !== experience) return false;
      return true;
    });
  }, [search, location, workMode, jobType, salaryMin, experience]);

  const resetFilters = () => {
    setSearch('');
    setLocation('');
    setWorkMode('');
    setJobType('');
    setSalaryMin('');
    setExperience('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Browse Jobs</h1>
        <p className="mt-2 text-slate-600">Discover opportunities matched to your profile.</p>
      </div>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="mb-6">
        <FilterPanel
          location={location}
          onLocationChange={setLocation}
          workMode={workMode}
          onWorkModeChange={setWorkMode}
          jobType={jobType}
          onJobTypeChange={setJobType}
          salaryMin={salaryMin}
          onSalaryMinChange={setSalaryMin}
          experience={experience}
          onExperienceChange={setExperience}
          onReset={resetFilters}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No jobs match your filters"
          description="Try adjusting your search or filters to find more opportunities."
          action={
            <button onClick={resetFilters} className="btn-secondary">
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} isSaved={isSaved(job.id)} onToggleSave={toggleSave} />
          ))}
        </div>
      )}

      <div className="mt-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-700">
        Showing demo job listings. Real job data will be connected in a future update.
      </div>
    </div>
  );
}
