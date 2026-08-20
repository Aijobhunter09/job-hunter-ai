import { useMemo, useState } from 'react';
import { ArrowRight, Briefcase, CalendarDays, Search, Trash2 } from 'lucide-react';
import type { ApplicationStatus } from '@/types';
import { useApplications } from '@/hooks/useApplications';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { navigate } from '@/lib/router';

const columns: { status: ApplicationStatus; dot: string }[] = [
  { status: 'Saved', dot: 'bg-slate-400' },
  { status: 'Applied', dot: 'bg-blue-500' },
  { status: 'Interview', dot: 'bg-amber-500' },
  { status: 'Offer', dot: 'bg-green-500' },
  { status: 'Rejected', dot: 'bg-red-500' },
];
const statusOrder = columns.map((c) => c.status);

function formatDate(value: string) {
  if (!value) return 'No date';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ApplicationsPage() {
  const { applications, moveApplication, removeApplication } = useApplications();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | ApplicationStatus>('All');

  const filtered = useMemo(() => applications.filter((app) => {
    const matchesFilter = filter === 'All' || app.status === filter;
    const q = query.trim().toLowerCase();
    return matchesFilter && (!q || `${app.title} ${app.company} ${app.location}`.toLowerCase().includes(q));
  }), [applications, filter, query]);

  const counts = useMemo(() => Object.fromEntries(statusOrder.map((s) => [s, applications.filter((a) => a.status === s).length])), [applications]);
  const active = applications.filter((a) => a.status === 'Applied' || a.status === 'Interview').length;

  const handleDrop = (status: ApplicationStatus) => {
    if (draggedId) moveApplication(draggedId, status);
    setDraggedId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Application Tracker</h1>
          <p className="mt-2 text-slate-600">Manage every application from saved to offer in one place.</p>
        </div>
        <button onClick={() => navigate('/jobs')} className="btn-primary w-fit">
          Browse Jobs <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Total', applications.length], ['Active', active], ['Interviews', counts.Interview], ['Offers', counts.Offer],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="card mb-5 flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-9" placeholder="Search company, role, or location..." />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="input sm:w-44">
          <option value="All">All statuses</option>
          {statusOrder.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {columns.map((column) => {
          const items = filtered.filter((a) => a.status === column.status);
          return (
            <section key={column.status} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(column.status)} className="rounded-xl border border-slate-200 bg-slate-50/60">
              <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} /><h2 className="text-sm font-semibold text-slate-900">{column.status}</h2></div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">{counts[column.status]}</span>
              </header>
              <div className="min-h-[180px] space-y-3 p-3">
                {items.length === 0 ? <p className="py-8 text-center text-xs text-slate-400">No applications</p> : items.map((app) => (
                  <article key={app.id} draggable onDragStart={() => setDraggedId(app.id)} onDragEnd={() => setDraggedId(null)} className="cursor-grab rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm hover:shadow-md active:cursor-grabbing">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0"><h3 className="truncate text-sm font-semibold text-slate-900">{app.title}</h3><p className="truncate text-xs text-slate-500">{app.company}</p></div>
                      <button onClick={() => removeApplication(app.id)} className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500" aria-label={`Remove ${app.title}`}><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5"><span className="text-xs text-slate-500">{app.location}</span><Badge variant="neutral">{app.workMode}</Badge></div>
                    {app.salary && <p className="mt-1.5 text-xs font-medium text-slate-600">{app.salary}</p>}
                    <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{formatDate(app.appliedDate)}</div>
                    <select value={app.status} onChange={(e) => moveApplication(app.id, e.target.value as ApplicationStatus)} className="mt-2 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-200">
                      {statusOrder.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {applications.length === 0 && <div className="mt-6"><EmptyState icon={Briefcase} title="No applications yet" description="Start applying to jobs and track your progress here." action={<button onClick={() => navigate('/jobs')} className="btn-primary">Browse Jobs <ArrowRight className="h-4 w-4" /></button>} /></div>}
      {applications.length > 0 && filtered.length === 0 && <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No applications match your search or filter.</div>}
      <div className="mt-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-700">Applications are stored locally in your browser. Drag cards between columns or change status from the dropdown.</div>
    </div>
  );
}
