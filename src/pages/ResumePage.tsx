import { useState } from 'react';
import { Save, Sparkles, TrendingUp, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import type { ResumeData } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

const STORAGE_KEY = 'resume';

const defaultResume: ResumeData = {
  fullName: '',
  email: '',
  phone: '',
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
};

export function ResumePage() {
  const [resume, setResume] = useState<ResumeData>(() =>
    loadFromStorage<ResumeData>(STORAGE_KEY, defaultResume)
  );
  const [newSkill, setNewSkill] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [improveOpen, setImproveOpen] = useState(false);

  const update = (updates: Partial<ResumeData>) => setResume((prev) => ({ ...prev, ...updates }));

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !resume.skills.includes(s)) {
      update({ skills: [...resume.skills, s] });
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    update({ skills: resume.skills.filter((s) => s !== skill) });
  };
const addExperience = () => {
  update({
    experience: [
      ...resume.experience,
      {
        role: '',
        company: '',
        period: '',
        description: '',
      },
    ],
  });
};

const removeExperience = (index: number) => {
  update({
    experience: resume.experience.filter((_, i) => i !== index),
  });
};
  const handleSave = () => {
    saveToStorage(STORAGE_KEY, resume);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const analysisResults = [
    { type: 'good', text: 'Strong professional summary with clear value proposition.' },
    { type: 'good', text: 'Good use of quantified achievements in experience.' },
    { type: 'good', text: 'Skills section covers relevant, in-demand technologies.' },
    { type: 'warn', text: 'Consider adding metrics to your second role description.' },
    { type: 'warn', text: 'Add a LinkedIn profile link for better visibility.' },
    { type: 'good', text: 'Clean formatting with clear section hierarchy.' },
  ];

  const improvementSuggestions = [
    'Add 2-3 quantified metrics to each experience entry (e.g., "reduced load time by 40%").',
    'Include a certifications section to stand out from other candidates.',
    'Tailor your summary keywords to match job descriptions you are targeting.',
    'Add links to live project demos alongside your GitHub repository.',
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Resume</h1>
          <p className="mt-2 text-slate-600">Build and optimize your resume with AI feedback.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setAnalysisOpen(true)}>
            <Sparkles className="h-4 w-4" /> Analyze Resume
          </Button>
          <Button variant="secondary" onClick={() => setImproveOpen(true)}>
            <TrendingUp className="h-4 w-4" /> Improve Resume
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Resume
          </Button>
        </div>
      </div>

      {savedMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-slide-up">
          <CheckCircle2 className="h-4 w-4" /> Resume saved successfully.
        </div>
      )}

      <div className="space-y-6">
        {/* Personal info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input"
                value={resume.fullName}
                onChange={(e) => update({ fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={resume.email}
                onChange={(e) => update({ email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                className="input"
                value={resume.phone}
                onChange={(e) => update({ phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Professional Summary</h2>
          <textarea
            className="input mt-3 min-h-[100px] resize-y"
            value={resume.summary}
            onChange={(e) => update({ summary: e.target.value })}
            rows={4}
          />
        </div>

        {/* Skills */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-primary-400 hover:text-primary-600" aria-label={`Remove ${skill}`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              className="input"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill..."
            />
            <Button variant="secondary" onClick={addSkill}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        {/* Experience */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Experience</h2>
          <div className="mt-4 space-y-4">
            {resume.experience.map((exp, i) => (
  <div key={i} className="rounded-lg border border-slate-200 p-4">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-700">
        Experience {i + 1}
      </h3>
      <button
        type="button"
        onClick={() => removeExperience(i)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
        aria-label={`Delete experience ${i + 1}`}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">Role</label>
                    <input
                      className="input"
                      value={exp.role}
                      onChange={(e) => {
                        const next = [...resume.experience];
                        next[i] = { ...exp, role: e.target.value };
                        update({ experience: next });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Company</label>
                    <input
                      className="input"
                      value={exp.company}
                      onChange={(e) => {
                        const next = [...resume.experience];
                        next[i] = { ...exp, company: e.target.value };
                        update({ experience: next });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Period</label>
                    <input
                      className="input"
                      value={exp.period}
                      onChange={(e) => {
                        const next = [...resume.experience];
                        next[i] = { ...exp, period: e.target.value };
                        update({ experience: next });
                      }}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="label">Description</label>
                  <textarea
                    className="input min-h-[60px] resize-y"
                    value={exp.description}
                    onChange={(e) => {
                      const next = [...resume.experience];
                      next[i] = { ...exp, description: e.target.value };
                      update({ experience: next });
                    }}
                    rows={2}
                  />
                </div>
              </div>
            ))}
                    </div>

          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={addExperience}>
              <Plus className="h-4 w-4" /> Add Experience
            </Button>
          </div>
        </div>

        {/* Education */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Education</h2>
          <div className="mt-4 space-y-4">
            {resume.education.map((edu, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">Degree</label>
                    <input
                      className="input"
                      value={edu.degree}
                      onChange={(e) => {
                        const next = [...resume.education];
                        next[i] = { ...edu, degree: e.target.value };
                        update({ education: next });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">School</label>
                    <input
                      className="input"
                      value={edu.school}
                      onChange={(e) => {
                        const next = [...resume.education];
                        next[i] = { ...edu, school: e.target.value };
                        update({ education: next });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Period</label>
                    <input
                      className="input"
                      value={edu.period}
                      onChange={(e) => {
                        const next = [...resume.education];
                        next[i] = { ...edu, period: e.target.value };
                        update({ education: next });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
          <div className="mt-4 space-y-4">
            {resume.projects.map((proj, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Project Name</label>
                    <input
                      className="input"
                      value={proj.name}
                      onChange={(e) => {
                        const next = [...resume.projects];
                        next[i] = { ...proj, name: e.target.value };
                        update({ projects: next });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Link</label>
                    <input
                      className="input"
                      value={proj.link}
                      onChange={(e) => {
                        const next = [...resume.projects];
                        next[i] = { ...proj, link: e.target.value };
                        update({ projects: next });
                      }}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="label">Description</label>
                  <textarea
                    className="input min-h-[60px] resize-y"
                    value={proj.description}
                    onChange={(e) => {
                      const next = [...resume.projects];
                      next[i] = { ...proj, description: e.target.value };
                      update({ projects: next });
                    }}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis modal */}
      <Modal open={analysisOpen} onClose={() => setAnalysisOpen(false)} title="Resume Analysis">
        <div className="space-y-3">
          {analysisResults.map((r, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {r.type === 'good' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              )}
              <span className="text-sm text-slate-600">{r.text}</span>
            </div>
          ))}
          <div className="mt-4 rounded-lg bg-primary-50 p-3 text-center">
            <p className="text-sm text-slate-600">Resume Strength</p>
            <p className="text-2xl font-bold text-primary-700">88%</p>
          </div>
          <p className="text-xs text-slate-400">Demo analysis based on sample data.</p>
        </div>
      </Modal>

      {/* Improve modal */}
      <Modal open={improveOpen} onClose={() => setImproveOpen(false)} title="Improvement Suggestions">
        <div className="space-y-3">
          {improvementSuggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <span className="text-sm text-slate-600">{s}</span>
            </div>
          ))}
          <p className="text-xs text-slate-400">Demo suggestions. AI-powered suggestions coming soon.</p>
        </div>
      </Modal>
    </div>
  );
}
