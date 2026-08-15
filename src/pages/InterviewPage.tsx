import { useState } from 'react';
import { Sparkles, Code, User, Briefcase, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { interviewQuestions } from '@/data/demoData';

type QuestionCategory = 'technical' | 'behavioral' | 'role';

const categoryConfig = {
  technical: { icon: Code, label: 'Technical Questions', color: 'bg-primary-50 text-primary-700' },
  behavioral: { icon: User, label: 'Behavioral Questions', color: 'bg-blue-50 text-blue-700' },
  role: { icon: Briefcase, label: 'Role-Specific Questions', color: 'bg-green-50 text-green-700' },
};

export function InterviewPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [generated, setGenerated] = useState(false);
  const [expanded, setExpanded] = useState<QuestionCategory | null>('technical');

  const handleGenerate = () => {
    setGenerated(true);
    setExpanded('technical');
  };

  const categories: QuestionCategory[] = ['technical', 'behavioral', 'role'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Interview Preparation</h1>
        <p className="mt-2 text-slate-600">Generate practice questions and tips tailored to your target role.</p>
      </div>

      {/* Input form */}
      <div className="card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Job Title</label>
            <input
              className="input"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
            />
          </div>
          <div>
            <label className="label">Experience Level</label>
            <select
              className="input"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
              <option value="Lead">Lead / Staff</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Job Description (optional)</label>
          <textarea
            className="input min-h-[120px] resize-y"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description for more tailored questions..."
            rows={5}
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleGenerate}>
            <Sparkles className="h-4 w-4" /> Generate Interview Questions
          </Button>
        </div>
      </div>

      {/* Results */}
      {generated && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              {jobTitle || 'Your Role'} — {experienceLevel} Level
            </h2>
          </div>

          {categories.map((cat) => {
            const config = categoryConfig[cat];
            const questions = interviewQuestions[cat];
            const isOpen = expanded === cat;
            return (
              <div key={cat} className="card overflow-hidden p-0">
                <button
                  onClick={() => setExpanded(isOpen ? null : cat)}
                  className="flex w-full items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.color}`}>
                      <config.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-slate-900">{config.label}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {questions.length}
                    </span>
                  </div>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <ol className="space-y-3">
                      {questions.map((q, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                            {i + 1}
                          </span>
                          <span className="text-sm text-slate-700">{q}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}

          {/* Tips */}
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Interview Tips</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {interviewQuestions.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-primary-50 p-4 text-sm text-primary-700">
            Demo questions based on common interview patterns. AI-tailored questions coming soon.
          </div>
        </div>
      )}
    </div>
  );
}
