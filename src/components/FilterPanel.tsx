interface FilterOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  location: string;
  onLocationChange: (v: string) => void;
  workMode: string;
  onWorkModeChange: (v: string) => void;
  jobType: string;
  onJobTypeChange: (v: string) => void;
  salaryMin: string;
  onSalaryMinChange: (v: string) => void;
  experience: string;
  onExperienceChange: (v: string) => void;
  onReset: () => void;
}

const workModeOptions: FilterOption[] = [
  { value: '', label: 'All modes' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'On-site', label: 'On-site' },
];

const jobTypeOptions: FilterOption[] = [
  { value: '', label: 'All types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

const salaryOptions: FilterOption[] = [
  { value: '', label: 'Any salary' },
  { value: '80000', label: '$80k+' },
  { value: '100000', label: '$100k+' },
  { value: '120000', label: '$120k+' },
  { value: '150000', label: '$150k+' },
];

const experienceOptions: FilterOption[] = [
  { value: '', label: 'All levels' },
  { value: 'Entry', label: 'Entry' },
  { value: 'Mid', label: 'Mid' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead' },
];

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterPanel({
  location,
  onLocationChange,
  workMode,
  onWorkModeChange,
  jobType,
  onJobTypeChange,
  salaryMin,
  onSalaryMinChange,
  experience,
  onExperienceChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="card p-5" aria-label="Job filters">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">Filters</h3>
          <p className="mt-0.5 text-xs text-slate-500">Narrow jobs by location, type, salary and experience.</p>
        </div>
        <button
          onClick={onReset}
          className="text-sm font-medium text-primary-700 hover:text-primary-800"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="label">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="City or state"
            className="input"
          />
        </div>
        <Select label="Work Mode" value={workMode} onChange={onWorkModeChange} options={workModeOptions} />
        <Select label="Job Type" value={jobType} onChange={onJobTypeChange} options={jobTypeOptions} />
        <Select label="Salary" value={salaryMin} onChange={onSalaryMinChange} options={salaryOptions} />
        <Select label="Experience" value={experience} onChange={onExperienceChange} options={experienceOptions} />
      </div>
    </div>
  );
}
