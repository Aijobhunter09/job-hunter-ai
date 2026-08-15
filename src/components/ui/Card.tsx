import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'card p-6',
        hover && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}
