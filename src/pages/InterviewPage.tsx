import { useMemo, useState } from 'react';
import { Briefcase, CheckCircle2, ChevronDown, ChevronUp, Code, Lightbulb, RefreshCw, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useProfile';

type QuestionCategory = 'technical' | 'behavioral' | 'role';
type GeneratedQuestions = Record<QuestionCategory, string[]>;

const categoryConfig = {
  technical: { icon: Code, label: 'Technical Questions', color: 'bg-primary-50 text-primary-700' },
  behavioral: { icon: User, label: 'Behavioral Questions', color: 'bg-blue-50 text-blue-700' },
  role: { icon: Briefcase, label: 'Role-Specific Questions', color: 'bg-green-50 text-green-700' },
};

const baseTips = [
  'Use the STAR method (Situation, Task, Action, Result) for behavioral questions.',
  'Prepare 2–3 thoughtful questions about the team, product, and role.',
  'Review projects from your resume and be ready to explain your technical decisions.',
  'Practice explaining complex ideas clearly without relying on jargon.',
  'Research the company and connect your answers to the problems the role needs to solve.',
];

function getKeywords(jobDescription: string, skills: string[]): string[] {
  const text = `${jobDescription} ${skills.join(' ')}`.toLowerCase();
  const known = ['react','typescript','javascript','node.js','node','python','java','sql','postgresql','mongodb','aws','docker','kubernetes','graphql','rest api','git','testing','accessibility','performance','security','ci/cd','terraform'];
  const matches = known.filter((keyword) => text.includes(keyword));
  const extra = skills.filter((skill) => skill && !matches.some((match) => match.toLowerCase() === skill.trim().toLowerCase()));
  return [...matches, ...extra].slice(0, 5);
}

function buildQuestions(jobTitle: string, experienceLevel: string, jobDescription: string, skills: string[]): GeneratedQuestions {
  const role = jobTitle.trim() || 'this role';
  const keywords = getKeywords(jobDescription, skills);
  const focus = keywords.length ? keywords.join(', ') : 'the technologies and responsibilities listed in the role';
  const seniority = experienceLevel.toLowerCase();

  return {
    technical: [
      `What technical approach would you take to design and build the core responsibilities of ${role}?`,
      `How would you evaluate the trade-offs involved in using ${focus}?`,
      'Describe how you would test, debug, and monitor a production feature in this role.',
      'What performance, scalability, or reliability risks would you look for before shipping?',
      `For a ${seniority}-level engineer, how would you balance implementation speed with maintainability and technical quality?`,
    ],
    behavioral: [
      'Tell me about a project where you had to make an important decision with incomplete information.',
      'Describe a time you disagreed with a teammate or stakeholder. How did you reach a decision?',
      'Tell me about a difficult bug, failure, or setback and what you changed afterward.',
      `How do you prioritize when several ${role} responsibilities compete for your attention?`,
      'What is an example of feedback that changed how you work?',
    ],
    role: [
      `What would you want to understand about the product, users, and team during your first 30 days as ${role}?`,
      "How would you turn the job description's main requirements into a practical delivery plan?",
      'Which part of this role would be your strongest contribution, and where would you expect a learning curve?',
      'How would you communicate progress, risks, and trade-offs to a non-technical stakeholder?',
      `If you joined tomorrow, what would you measure to decide whether you were succeeding in ${role}?`,
    ],
  };
}

export function InterviewPage() {
  const { profile } = useProfile();
  const [jobTitle, setJobTitle] = useState(profile.jobTitle || '');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState(profile.experience || 'Mid');
  const [generated, setGenerated] = useState(false);
  const [expanded, setExpanded] = useState<QuestionCategory | null>('technical');
  const [copied, setCopied] = useState(false);

  const questions = useMemo(
    () => buildQuestions(jobTitle, experienceLevel, jobDescription, profile.skills),
    [jobTitle, experienceLevel, jobDescription, profile.skills]
  );
  const profileSkills = profile.skills.filter(Boolean);
  const isReady = jobTitle.trim().length > 0 || jobDescription.trim().length > 0;

  const handleGenerate = () => {
    if (!isReady) return;
    setGenerated(true);
    setExpanded('technical');
    setCopied(false);
  };

  const handleCopyAll = async () => {
    const text = Object.entries(questions)
      .map(([category, items]) => `${category.toUpperCase()}\n${items.map((item, index) => `${index + 1}. ${item}`).join('\n')}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-700"><Sparkles className="h-4 w-4" />Personalized practice</div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Interview Preparation</h1>
        <p className="mt-2 text-slate-600">Build targeted practice questions from the role, job description, experience level, and your saved profile skills.</p>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="job-title">Job Title</label>
            <input id="job-title" className="input" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="e.g., Senior Frontend Engineer" />
          </div>
          <div>
            <label className="label" htmlFor="experience-level">Experience Level</label>
            <select id="experience-level" className="input" value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)}>
              <option value="Entry">Entry Level</option><option value="Mid">Mid Level</option><option value="Senior">Senior Level</option><option value="Lead">Lead / Staff</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="job-description">Job Description (optional)</label>
          <textarea id="job-description" className="input min-h-[140px] resize-y" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description to make the questions more specific..." rows={6} />
        </div>
        {profileSkills.length > 0 && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile skills used</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profileSkills.slice(0, 10).map((skill) => <span key={skill} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{skill}</span>)}
            </div>
          </div>
        )}
        {!isReady && <p className="mt-3 text-sm text-amber-700">Enter a job title or paste a job description to generate practice questions.</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleGenerate} disabled={!isReady}><Sparkles className="h-4 w-4" />{generated ? 'Regenerate Questions' : 'Generate Questions'}</Button>
          {generated && <Button variant="secondary" onClick={handleCopyAll}>{copied ? <CheckCircle2 className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}{copied ? 'Copied' : 'Copy All'}</Button>}
        </div>
      </div>

      {generated && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary-700" /><h2 className="text-lg font-semibold text-slate-900">{jobTitle.trim() || 'Target Role'} — {experienceLevel} Level</h2></div>
            <span className="text-xs text-slate-500">15 questions generated from your inputs</span>
          </div>

          {(Object.keys(categoryConfig) as QuestionCategory[]).map((category) => {
            const config = categoryConfig[category];
            const categoryQuestions = questions[category];
            const isOpen = expanded === category;
            const Icon = config.icon;
            return (
              <div key={category} className="card overflow-hidden p-0">
                <button type="button" onClick={() => setExpanded(isOpen ? null : category)} className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50" aria-expanded={isOpen}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.color}`}><Icon className="h-5 w-5" /></div>
                    <span className="font-semibold text-slate-900">{config.label}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{categoryQuestions.length}</span>
                  </div>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <ol className="space-y-4">
                      {categoryQuestions.map((question, index) => (
                        <li key={question} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">{index + 1}</span>
                          <span className="text-sm leading-6 text-slate-700">{question}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50"><Lightbulb className="h-5 w-5 text-amber-600" /></div>
              <div><h3 className="font-semibold text-slate-900">Interview Tips</h3><p className="text-xs text-slate-500">Use these while practicing your answers.</p></div>
            </div>
            <ul className="mt-4 space-y-3">
              {baseTips.map((tip) => <li key={tip} className="flex items-start gap-2.5 text-sm text-slate-600"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /><span>{tip}</span></li>)}
            </ul>
          </div>

          <div className="rounded-lg border border-primary-100 bg-primary-50 p-4 text-sm text-primary-800">
            <strong>How this works:</strong> questions are tailored locally from your role, experience level, job description, and saved profile skills. No external AI request is required.
          </div>
        </div>
      )}
    </div>
  );
}
