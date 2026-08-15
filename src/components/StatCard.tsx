import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
}

const colorMap = {
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-blue-50 text-blue-600',
};

export function StatCard({ icon: Icon, label, value, trend, color = 'primary' }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', colorMap[color])}>
          <Icon className="h-5.5 w-5.5" style={{ width: 22, height: 22 }} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600">{trend}</span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
