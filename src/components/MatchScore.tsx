import { cn } from '@/lib/utils';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function MatchScore({ score, size = 'md', showLabel = true }: MatchScoreProps) {
  const sizes = {
    sm: { ring: 'h-12 w-12', text: 'text-xs', stroke: 4, radius: 18 },
    md: { ring: 'h-16 w-16', text: 'text-sm', stroke: 5, radius: 24 },
    lg: { ring: 'h-24 w-24', text: 'text-lg', stroke: 6, radius: 36 },
  };
  const s = sizes[size];
  const circumference = 2 * Math.PI * s.radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 85 ? '#16a34a' : score >= 70 ? '#3366ff' : score >= 50 ? '#f59e0b' : '#dc2626';

  return (
    <div className="flex flex-col items-center">
      <div className={cn('relative flex items-center justify-center', s.ring)}>
        <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${s.radius * 2 + s.stroke} ${s.radius * 2 + s.stroke}`}>
          <circle
            cx={s.radius + s.stroke / 2}
            cy={s.radius + s.stroke / 2}
            r={s.radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={s.stroke}
          />
          <circle
            cx={s.radius + s.stroke / 2}
            cy={s.radius + s.stroke / 2}
            r={s.radius}
            fill="none"
            stroke={color}
            strokeWidth={s.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        <span className={cn('font-bold text-slate-900', s.text)}>{score}%</span>
      </div>
      {showLabel && (
        <span className="mt-1.5 text-xs font-medium text-slate-500">Match</span>
      )}
    </div>
  );
}
