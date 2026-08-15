import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  neutral: 'bg-slate-100 text-slate-600',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn('badge', variantStyles[variant], className)}>{children}</span>
  );
}
