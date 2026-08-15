import { useState } from 'react';
import {
  Save,
  Sparkles,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
  const [previewOpen, setPreviewOpen] = useState(false);

  const update = (updates: Partial<ResumeData>) => {
    setResume((prev) => ({ ...prev, ...updates }));
  };

  /* =========================
     SKILLS
  ========================= */

  const addSkill = () => {
    const skill = newSkill.trim();

    if (skill && !resume.skills.includes(skill)) {
      update({
        skills: [...resume.skills, skill],
      });
    }

    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    update({
      skills: resume.skills.filter((s) => s !== skill),
    });
  };

  /* =========================
     EXPERIENCE
  ========================= */

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

  /* =========================
     EDUCATION
  ========================= */

  const addEducation = () => {
    update({
      education: [
        ...resume.education,
        {
          degree: '',
          school: '',
          period: '',
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    update({
      education: resume.education.filter((_, i) => i !== index),
    });
  };

  /* =========================
     PROJECTS
  ========================= */

  const addProject = () => {
    update({
      projects: [
        ...resume.projects,
        {
          name: '',
          description: '',
          link: '',
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    update({
      projects: resume.projects.filter((_, i) => i !== index),
    });
  };

  /* =========================
     SAVE
  ========================= */

  const handleSave = () => {
    saveToStorage(STORAGE_KEY, resume);

    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
  };

  /* =========================
     RESUME ANALYSIS
  ========================= */

  const getAnalysisResults = () => {
    const results: {
      type: 'good' | 'warn';
      text: string;
    }[] = [];

    if (resume.fullName.trim()) {
      results.push({
        type: 'good',
        text: 'Your full name is provided.',
      });
    } else {
      results.push({
        type: 'warn',
        text: 'Add your full name to your resume.',
      });
    }

    if (resume.email.trim()) {
      results.push({
        type: 'good',
        text: 'Email address is provided.',
      });
    } else {
      results.push({
        type: 'warn',
        text: 'Add a professional email address.',
      });
    }

    if (resume.summary.trim().length >= 80) {
      results.push({
        type: 'good',
        text: 'Your professional summary has useful detail.',
      });
    } else {
      results.push({
        type: 'warn',
        text: 'Expand your professional summary to clearly explain your value.',
      });
    }

    if (resume.skills.length >= 5) {
      results.push({
        type: 'good',
        text: 'Your resume contains a good number of skills.',
      });
    } else {
      results.push({
        type: 'warn',
        text: 'Add more relevant skills. Aim for at least 5–8 skills.',
      });
    }

    if (resume.experience.length > 0) {
      results.push({
        type: 'good',
        text: 'Experience section has been added.',
      });
    } else {
      results.push({
        type: 'warn',
        text: 'Add relevant work or freelance experience.',
      });
    }

    if (resume.education.length > 0) {
      results.push({
        type: 'good',
        text: 'Education information is included.',
      });
    } else {
      results.push({
        type: 'warn',
        text: 'Add your education information.',
      });
    }

    if (resume.projects.length > 0) {
      results.push({
        type: 'good',
        text: 'Projects section contains at least one project.',
      });
    } else {
      results.push({
        type: 'warn',
        text: 'Add projects to demonstrate your practical skills.',
      });
    }

    const experienceWithMetrics = resume.experience.some((exp) =>
      /\d+%|\d+\+|\$\d+|\d+\s*(users|clients|projects|leads|sales)/i.test(
        exp.description
      )
    );

    if (experienceWithMetrics) {
      results.push({
        type: 'good',
        text: 'Your experience includes measurable achievements.',
      });
    } else if (resume.experience.length > 0) {
      results.push({
        type: 'warn',
        text: 'Add numbers and measurable achievements to your experience descriptions.',
      });
    }

    return results;
  };

  const analysisResults = getAnalysisResults();

  const goodCount = analysisResults.filter(
    (item) => item.type === 'good'
  ).length;

  const resumeScore =
    analysisResults.length > 0
      ? Math.round((goodCount / analysisResults.length) * 100)
      : 0;

  /* =========================
     DYNAMIC IMPROVEMENTS
  ========================= */

  const getImprovementSuggestions = () => {
    const suggestions: string[] = [];

    if (!resume.fullName.trim()) {
      suggestions.push(
        'Add your full name at the top of your resume.'
      );
    }

    if (!resume.email.trim()) {
      suggestions.push(
        'Add a professional email address so employers can contact you.'
      );
    }

    if (!resume.phone.trim()) {
      suggestions.push(
        'Add a phone number if you are comfortable being contacted by phone.'
      );
    }

    if (resume.summary.trim().length < 80) {
      suggestions.push(
        'Improve your professional summary. Explain your main skills, experience, specialization, and the value you can provide to an employer.'
      );
    }

    if (resume.skills.length < 5) {
      suggestions.push(
        'Add more relevant skills. Try to include at least 5–8 skills that match the jobs you are targeting.'
      );
    }

    if (resume.experience.length === 0) {
      suggestions.push(
        'Add work, freelance, internship, or relevant practical experience.'
      );
    }

    resume.experience.forEach((exp, index) => {
      if (!exp.role.trim() || !exp.company.trim()) {
        suggestions.push(
          `Complete the role and company information for Experience ${index + 1}.`
        );
      }

      if (exp.description.trim().length < 80) {
        suggestions.push(
          `Expand the description for Experience ${index + 1}. Focus on responsibilities, achievements, and results.`
        );
      }

      if (
        exp.description.trim() &&
        !/\d+%|\d+\+|\$\d+|\d+\s*(users|clients|projects|leads|sales)/i.test(
          exp.description
        )
      ) {
        suggestions.push(
          `Add measurable results to Experience ${index + 1}, such as percentages, number of clients, projects completed, traffic growth, or time saved.`
        );
      }
    });

    if (resume.education.length === 0) {
      suggestions.push(
        'Add your education details, including degree, institution, and dates.'
      );
    }

    if (resume.projects.length === 0) {
      suggestions.push(
        'Add 2–3 relevant projects to demonstrate your practical abilities.'
      );
    }

    resume.projects.forEach((project, index) => {
      if (!project.name.trim()) {
        suggestions.push(
          `Add a name for Project ${index + 1}.`
        );
      }

      if (project.description.trim().length < 50) {
        suggestions.push(
          `Write a stronger description for Project ${index + 1}. Explain what you built, which technologies you used, and the result.`
        );
      }

      if (!project.link.trim()) {
        suggestions.push(
          `Consider adding a live demo, GitHub repository, or portfolio link for Project ${index + 1}.`
        );
      }
    });

    if (suggestions.length === 0) {
      suggestions.push(
        'Your resume looks well structured. Continue tailoring your keywords and achievements to each job description.'
      );
    }

    return suggestions;
  };

  const improvementSuggestions = getImprovementSuggestions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Resume
          </h1>

          <p className="mt-2 text-slate-600">
            Build and optimize your resume with AI feedback.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => setAnalysisOpen(true)}
          >
            <Sparkles className="h-4 w-4" />
            Analyze Resume
          </Button>

          <Button
            variant="secondary"
            onClick={() => setImproveOpen(true)}
          >
            <TrendingUp className="h-4 w-4" />
            Improve Resume
          </Button>
<Button
  variant="secondary"
  onClick={() => setPreviewOpen(true)}
>
  Preview Resume
</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Resume
          </Button>
        </div>
      </div>

      {/* =========================
          SAVE MESSAGE
      ========================= */}

      {savedMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-slide-up">
          <CheckCircle2 className="h-4 w-4" />
          Resume saved successfully.
        </div>
      )}

      <div className="space-y-6">
        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Personal Information
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name</label>

              <input
                className="input"
                value={resume.fullName}
                onChange={(e) =>
                  update({ fullName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Email</label>

              <input
                className="input"
                type="email"
                value={resume.email}
                onChange={(e) =>
                  update({ email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Phone</label>

              <input
                className="input"
                value={resume.phone}
                onChange={(e) =>
                  update({ phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* =========================
            SUMMARY
        ========================= */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Professional Summary
          </h2>

          <textarea
            className="input mt-3 min-h-[100px] resize-y"
            value={resume.summary}
            onChange={(e) =>
              update({ summary: e.target.value })
            }
            rows={4}
            placeholder="Write a short professional summary..."
          />
        </div>

        {/* =========================
            SKILLS
        ========================= */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700"
              >
                {skill}

                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-primary-400 hover:text-primary-600"
                  aria-label={`Remove ${skill}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              className="input"
              value={newSkill}
              onChange={(e) =>
                setNewSkill(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSkill();
                }
              }}
              placeholder="Add a skill..."
            />

            <Button
              variant="secondary"
              onClick={addSkill}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* =========================
            EXPERIENCE
        ========================= */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Experience
          </h2>

          <div className="mt-4 space-y-4">
            {resume.experience.map((exp, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Experience {i + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeExperience(i)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
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
                        const next = [
                          ...resume.experience,
                        ];

                        next[i] = {
                          ...exp,
                          role: e.target.value,
                        };

                        update({
                          experience: next,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="label">Company</label>

                    <input
                      className="input"
                      value={exp.company}
                      onChange={(e) => {
                        const next = [
                          ...resume.experience,
                        ];

                        next[i] = {
                          ...exp,
                          company: e.target.value,
                        };

                        update({
                          experience: next,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="label">Period</label>

                    <input
                      className="input"
                      value={exp.period}
                      onChange={(e) => {
                        const next = [
                          ...resume.experience,
                        ];

                        next[i] = {
                          ...exp,
                          period: e.target.value,
                        };

                        update({
                          experience: next,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="label">
                    Description
                  </label>

                  <textarea
                    className="input min-h-[60px] resize-y"
                    value={exp.description}
                    onChange={(e) => {
                      const next = [
                        ...resume.experience,
                      ];

                      next[i] = {
                        ...exp,
                        description: e.target.value,
                      };

                      update({
                        experience: next,
                      });
                    }}
                    rows={3}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={addExperience}
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </div>
        </div>

        {/* =========================
            EDUCATION
        ========================= */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Education
          </h2>

          <div className="mt-4 space-y-4">
            {resume.education.map((edu, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Education {i + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeEducation(i)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">Degree</label>

                    <input
                      className="input"
                      value={edu.degree}
                      onChange={(e) => {
                        const next = [
                          ...resume.education,
                        ];

                        next[i] = {
                          ...edu,
                          degree: e.target.value,
                        };

                        update({
                          education: next,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="label">School</label>

                    <input
                      className="input"
                      value={edu.school}
                      onChange={(e) => {
                        const next = [
                          ...resume.education,
                        ];

                        next[i] = {
                          ...edu,
                          school: e.target.value,
                        };

                        update({
                          education: next,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="label">Period</label>

                    <input
                      className="input"
                      value={edu.period}
                      onChange={(e) => {
                        const next = [
                          ...resume.education,
                        ];

                        next[i] = {
                          ...edu,
                          period: e.target.value,
                        };

                        update({
                          education: next,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={addEducation}
            >
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </div>
        </div>

        {/* =========================
            PROJECTS
        ========================= */}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Projects
          </h2>

          <div className="mt-4 space-y-4">
            {resume.projects.map((proj, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Project {i + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeProject(i)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">
                      Project Name
                    </label>

                    <input
                      className="input"
                      value={proj.name}
                      onChange={(e) => {
                        const next = [
                          ...resume.projects,
                        ];

                        next[i] = {
                          ...proj,
                          name: e.target.value,
                        };

                        update({
                          projects: next,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="label">
                      Link
                    </label>

                    <input
                      className="input"
                      value={proj.link}
                      onChange={(e) => {
                        const next = [
                          ...resume.projects,
                        ];

                        next[i] = {
                          ...proj,
                          link: e.target.value,
                        };

                        update({
                          projects: next,
                        });
                      }}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="label">
                    Description
                  </label>

                  <textarea
                    className="input min-h-[60px] resize-y"
                    value={proj.description}
                    onChange={(e) => {
                      const next = [
                        ...resume.projects,
                      ];

                      next[i] = {
                        ...proj,
                        description: e.target.value,
                      };

                      update({
                        projects: next,
                      });
                    }}
                    rows={3}
                    placeholder="Describe the project, technologies used, and results..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={addProject}
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>
      </div>

      {/* =========================
          ANALYZE RESUME MODAL
      ========================= */}

      <Modal
        open={analysisOpen}
        onClose={() => setAnalysisOpen(false)}
        title="Resume Analysis"
      >
        <div className="space-y-3">
          {analysisResults.map((result, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5"
            >
              {result.type === 'good' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              )}

              <span className="text-sm text-slate-600">
                {result.text}
              </span>
            </div>
          ))}

          <div className="mt-4 rounded-lg bg-primary-50 p-4 text-center">
            <p className="text-sm text-slate-600">
              Resume Strength
            </p>

            <p className="text-3xl font-bold text-primary-700">
              {resumeScore}%
            </p>
          </div>

          <p className="text-xs text-slate-400">
            This score is calculated from the information currently entered in your resume.
          </p>
        </div>
      </Modal>

      {/* =========================
          IMPROVE RESUME MODAL
      ========================= */}

      <Modal
        open={improveOpen}
        onClose={() => setImproveOpen(false)}
        title="Improve Resume"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-primary-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Resume improvement analysis
            </p>

            <p className="mt-1 text-xs text-slate-500">
              These suggestions are based on the information currently entered in your resume.
            </p>
          </div>

          <div className="space-y-3">
            {improvementSuggestions.map(
              (suggestion, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5"
                >
                  <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />

                  <span className="text-sm text-slate-600">
                    {suggestion}
                  </span>
                </div>
              )
            )}
          </div>

          <p className="text-xs text-slate-400">
            Suggestions are generated from your resume data. AI-powered rewriting can be added later.
          </p>
        </div>
      </Modal>
      {/* =========================
    RESUME PREVIEW MODAL
========================= */}

<Modal
  open={previewOpen}
  onClose={() => setPreviewOpen(false)}
  title="Resume Preview"
>
  <div className="max-h-[75vh] overflow-y-auto rounded-lg bg-white p-6">
    {/* Header */}
    <div className="border-b border-slate-200 pb-5">
      <h1 className="text-2xl font-bold text-slate-900">
        {resume.fullName || 'Your Name'}
      </h1>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
        {resume.email && <span>{resume.email}</span>}
        {resume.phone && <span>{resume.phone}</span>}
      </div>
    </div>

    {/* Summary */}
    {resume.summary && (
      <section className="mt-6">
        <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
          Professional Summary
        </h2>

        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
          {resume.summary}
        </p>
      </section>
    )}

    {/* Skills */}
    {resume.skills.length > 0 && (
      <section className="mt-6">
        <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
          Skills
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Experience */}
    {resume.experience.length > 0 && (
      <section className="mt-6">
        <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
          Experience
        </h2>

        <div className="mt-4 space-y-5">
          {resume.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex flex-col justify-between sm:flex-row">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {exp.role || 'Role'}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {exp.company || 'Company'}
                  </p>
                </div>

                {exp.period && (
                  <span className="mt-1 text-xs text-slate-400 sm:mt-0">
                    {exp.period}
                  </span>
                )}
              </div>

              {exp.description && (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Education */}
    {resume.education.length > 0 && (
      <section className="mt-6">
        <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
          Education
        </h2>

        <div className="mt-4 space-y-4">
          {resume.education.map((edu, i) => (
            <div key={i}>
              <div className="flex flex-col justify-between sm:flex-row">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {edu.degree || 'Degree'}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {edu.school || 'School'}
                  </p>
                </div>

                {edu.period && (
                  <span className="mt-1 text-xs text-slate-400 sm:mt-0">
                    {edu.period}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Projects */}
    {resume.projects.length > 0 && (
      <section className="mt-6">
        <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
          Projects
        </h2>

        <div className="mt-4 space-y-5">
          {resume.projects.map((project, i) => (
            <div key={i}>
              <h3 className="font-semibold text-slate-900">
                {project.name || 'Project'}
              </h3>

              {project.link && (
                <p className="mt-1 break-all text-xs text-primary-600">
                  {project.link}
                </p>
              )}

              {project.description && (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Empty state */}
    {!resume.fullName &&
      !resume.summary &&
      resume.skills.length === 0 &&
      resume.experience.length === 0 &&
      resume.education.length === 0 &&
      resume.projects.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">
            Start filling out your resume to see the preview here.
          </p>
        </div>
      )}
  </div>
</Modal>
    </div>
  );
}
