import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navigate } from '@/lib/router';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Jobs', path: '/jobs' },
  { label: 'Saved Jobs', path: '/saved-jobs' },
  { label: 'Resume', path: '/resume' },
  { label: 'Applications', path: '/applications' },
  { label: 'Interview Prep', path: '/interview' },
  { label: 'Profile', path: '/profile' },
];
interface HeaderProps {
  currentPath: string;
}

export function Header({ currentPath }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button onClick={() => go('/')} className="flex items-center gap-2.5" aria-label="AI Job Hunter home">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white font-bold text-sm">
            AI
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Job Hunter
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => go(link.path)}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition',
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => go('/login')}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => go('/signup')}
            className="btn-primary text-sm"
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden animate-slide-up">
          <nav className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => go(link.path)}
                className={cn(
                  'block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition',
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-slate-200 pt-3">
              <button
                onClick={() => go('/login')}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </button>
              <button
                onClick={() => go('/signup')}
                className="mt-1 block w-full rounded-lg bg-primary-700 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-800"
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
