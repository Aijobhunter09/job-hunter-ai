import { useRouter, matchRoute } from '@/lib/router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { JobsPage } from '@/pages/JobsPage';
import { SavedJobsPage } from '@/pages/SavedJobsPage';
import { JobDetailsPage } from '@/pages/JobDetailsPage';
import { ResumePage } from '@/pages/ResumePage';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { InterviewPage } from '@/pages/InterviewPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const routes = [
  { pattern: '/', component: 'home' },
  { pattern: '/dashboard', component: 'dashboard' },
  { pattern: '/jobs', component: 'jobs' },
  { pattern: '/jobs/:id', component: 'jobDetails' },
  { pattern: '/resume', component: 'resume' },
  { pattern: '/applications', component: 'applications' },
  { pattern: '/interview', component: 'interview' },
  { pattern: '/profile', component: 'profile' },
  { pattern: '/login', component: 'login' },
  { pattern: '/signup', component: 'signup' },
];

function renderPage(path: string) {
  const match = matchRoute(path, routes);
  if (!match) return <NotFoundPage />;

  switch (match.component) {
    case 'home':
      return <HomePage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'jobs':
      return <JobsPage />;
    case 'jobDetails':
      return <JobDetailsPage jobId={match.params.id} />;
    case 'resume':
      return <ResumePage />;
    case 'applications':
      return <ApplicationsPage />;
    case 'interview':
      return <InterviewPage />;
    case 'profile':
      return <ProfilePage />;
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    default:
      return <NotFoundPage />;
  }
}

function App() {
  const { path } = useRouter();

  const isAuthPage = path === '/login' || path === '/signup';

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <Header currentPath={path} />
        <main className="flex-1">
          {renderPage(path)}
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
