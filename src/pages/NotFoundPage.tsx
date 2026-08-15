import { Home, ArrowLeft } from 'lucide-react';
import { navigate } from '@/lib/router';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary-700">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you're looking for doesn't exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate('/')}>
            <Home className="h-4 w-4" /> Go Home
          </Button>
          <Button variant="secondary" onClick={() => navigate('/jobs')}>
            <ArrowLeft className="h-4 w-4" /> Browse Jobs
          </Button>
        </div>
      </div>
    </div>
  );
}
