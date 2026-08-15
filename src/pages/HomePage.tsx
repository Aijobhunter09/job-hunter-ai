import {
  Search,
  Target,
  FileText,
  MessageSquare,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  Award,
} from 'lucide-react';
import { navigate } from '@/lib/router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const valueCards = [
  { icon: Search, title: 'Find Better Jobs', desc: 'Discover roles that match your skills and preferences with AI-powered search.' },
  { icon: Target, title: 'Match Your Skills', desc: 'See how well you fit each role before you spend time applying.' },
  { icon: FileText, title: 'Improve Your Resume', desc: 'Get instant feedback and suggestions to strengthen your application.' },
  { icon: MessageSquare, title: 'Prepare for Interviews', desc: 'Practice with tailored questions and tips for any role.' },
];

const steps = [
  { num: '1', title: 'Build your profile', desc: 'Tell AI about your skills and experience.' },
  { num: '2', title: 'Discover opportunities', desc: 'Find jobs that match your profile.' },
  { num: '3', title: 'Apply with confidence', desc: 'Tailor your application and prepare for the interview.' },
];

const features = [
  { icon: Sparkles, title: 'AI Job Matching', desc: 'Smart algorithms match you to roles based on skills, experience, and preferences.' },
  { icon: FileText, title: 'Resume Analysis', desc: 'Get detailed feedback on your resume with actionable improvement suggestions.' },
  { icon: Briefcase, title: 'Cover Letter Generator', desc: 'Create tailored cover letters for each application in seconds.' },
  { icon: BarChart3, title: 'Application Tracker', desc: 'Track every application from saved to offer in one organized board.' },
  { icon: MessageSquare, title: 'Interview Preparation', desc: 'Practice with role-specific questions and proven interview strategies.' },
  { icon: TrendingUp, title: 'Career Insights', desc: 'Understand market trends and salary data to make informed decisions.' },
];

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="card p-6 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-sm text-slate-500">Your Search Dashboard</p>
            <p className="text-lg font-bold text-slate-900">Overview</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
            <Sparkles className="h-5 w-5 text-primary-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-5">
          <div className="rounded-lg bg-primary-50 p-4">
            <div className="flex items-center justify-between">
              <Target className="h-5 w-5 text-primary-700" />
              <span className="text-2xl font-bold text-primary-700">92%</span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-600">Job Match Score</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">88%</span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-600">Resume Strength</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">12</span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-600">Applications</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">3</span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-600">Interviews</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Senior Frontend Engineer</span>
            <span className="font-semibold text-green-600">92% match</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-green-500" style={{ width: '92%' }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Product Engineer</span>
            <span className="font-semibold text-primary-600">88% match</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-primary-500" style={{ width: '88%' }} />
          </div>
        </div>
      </div>

      <div className="absolute -right-3 -top-3 hidden rounded-lg bg-white shadow-lg border border-slate-200 px-4 py-3 sm:block animate-slide-up">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-slate-700">New match found!</span>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="animate-slide-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3.5 py-1.5 text-sm font-medium text-primary-700">
                <Sparkles className="h-4 w-4" />
                AI-powered job search
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Find Better Jobs.<br />Apply Smarter.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600 leading-relaxed">
                AI Job Hunter helps you discover relevant opportunities, understand your job match, improve your application, and prepare for interviews — all in one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => navigate('/dashboard')}>
                  Start Job Hunting
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" onClick={() => navigate('/jobs')}>
                  Explore Features
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> No credit card needed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Free to start
                </span>
              </div>
            </div>
            <div className="animate-fade-in lg:pl-8">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Value section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">One workspace for your entire job search</h2>
            <p className="mt-3 text-slate-600">Everything you need, from finding jobs to acing interviews.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueCards.map((card) => (
              <Card key={card.title} hover>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                  <card.icon className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-600">Three simple steps to your next role.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700 text-white text-lg font-bold">
                  {step.num}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-slate-600">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-3 hidden h-6 w-6 text-slate-300 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to land your next job</h2>
            <p className="mt-3 text-slate-600">Powerful features designed to make your job search smarter.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} hover>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                  <feature.icon className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Your next opportunity starts here.</h2>
          <p className="mt-4 text-primary-100">Join AI Job Hunter and transform how you search for jobs.</p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/signup')}
              className="btn bg-white text-primary-700 px-7 py-3 hover:bg-primary-50 text-base shadow-lg"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
