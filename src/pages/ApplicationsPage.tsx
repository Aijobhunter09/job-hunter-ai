import { useState } from 'react';
import { Trash2, ArrowRight, Briefcase } from 'lucide-react';
import type { ApplicationStatus } from '@/types';
import { useApplications } from '@/hooks/useApplications';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { navigate } from '@/lib/router';

const columns: { status: ApplicationStatus; color: string }[] = [
  { status: 'Saved', color: 'bg-slate-100 text-slate-600' },
  { status: 'Applied', color: 'bg-blue-100 text-blue-700' },
  { status: 'Interview', color: 'bg-amber-100 text-amber-700' },
  { status: 'Offer', color: 'bg-green-100 text-green-700' },
  { status: 'Rejected', color: 'bg-red-100 text-red-700' },
];

const statusOrder: ApplicationStatus[] = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

export function ApplicationsPage() {
  const { applications, moveApplication, removeApplication } = useApplications();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (status: ApplicationStatus) => {
    if (draggedId) {
      moveApplication(draggedId, status);
      setDraggedId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Application Tracker</h1>
        <p className="mt-2 text-slate-600">
          Track and manage your job applications. Drag cards between columns or use the menu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {columns.map((col) => {
          const items = applications.filter((a) => a.status === col.status);
          return (
            <div
              key={col.status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.status)}
              className="rounded-xl border border-slate-200 bg-slate-50/50"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-2.5 w-2.5 rounded-full ${col.color.split(' ')[0].replace('bg-', 'bg-')}`} />
                  <h3 className="text-sm font-semibold text-slate-900">{col.status}</h3>
                </div>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {items.length}
                </span>
              </div>
              <div className="space-y-3 p-3 min-h-[200px]">
                {items.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">No applications</p>
                ) : (
                  items.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={() => setDraggedId(app.id)}
                      onDragEnd={() => setDraggedId(null)}
                      className="cursor-grab rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:shadow-card-hover active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-slate-900">{app.title}</h4>
                          <p className="truncate text-xs text-slate-500">{app.company}</p>
                        </div>
                        <button
                          onClick={() => removeApplication(app.id)}
                          className="rounded p-1 text-slate-300 hover:bg-slate-100 hover:text-red-500"
                          aria-label="Remove application"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <span>{app.location}</span>
                        <span>·</span>
                        <Badge variant="neutral">{app.workMode}</Badge>
                      </div>
                      {app.salary && (
                        <p className="mt-1.5 text-xs font-medium text-slate-600">{app.salary}</p>
                      )}
                      <div className="mt-3 border-t border-slate-100 pt-2.5">
                        <select
                          value={app.status}
                          onChange={(e) => moveApplication(app.id, e.target.value as ApplicationStatus)}
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200"
                        >
                          {statusOrder.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {applications.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={Briefcase}
            title="No applications yet"
            description="Start applying to jobs and track your progress here."
            action={
              <button onClick={() => navigate('/jobs')} className="btn-primary">
                Browse Jobs <ArrowRight className="h-4 w-4" />
              </button>
            }
          />
        </div>
      )}

      <div className="mt-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-700">
        Applications are stored locally in your browser. Drag cards between columns to update status.
      </div>
    </div>
  );
}
