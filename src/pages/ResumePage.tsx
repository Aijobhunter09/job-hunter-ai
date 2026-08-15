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

  const update = (updates: Partial<ResumeData>) => {
    setResume((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // -----------------------------
  // Skills
  // -----------------------------

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

  // -----------------------------
  // Experience
  // -----------------------------

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

  const updateExperience = (
    index: number,
    field: 'role' | 'company' | 'period' | 'description',
    value: string
  ) => {
    const next = [...resume.experience];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    update({
      experience: next,
    });
  };

  // -----------------------------
  // Education
  // -----------------------------

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

  const updateEducation = (
    index: number,
    field: 'degree' | 'school' | 'period',
    value: string
  ) => {
    const next = [...resume.education];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    update({
      education: next,
    });
  };

  // -----------------------------
  // Projects
  // -----------------------------

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

  const updateProject = (
    index: number,
    field: 'name' | 'description' | 'link',
    value: string
  ) => {
    const next = [...resume.projects];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    update({
      projects: next,
    });
  };

  // -----------------------------
  // Save
  // -----------------------------

  const handleSave = () => {
    saveToStorage(STORAGE_KEY, resume);

    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
  };

  // -----------------------------
  // Analysis
  // -----------------------------

 const analysisResults = [
  {
    type: resume.fullName && resume.email && resume.phone ? 'good' : 'warn',
    text:
      resume.fullName && resume.email && resume.phone
        ? 'Personal information is complete.'
        : 'Complete your name, email, and phone number.',
  },
  {
    type: resume.summary.trim().length >= 50 ? 'good' : 'warn',
    text:
      resume.summary.trim().length >= 50
        ? 'Professional summary has good detail.'
        : 'Add a professional summary of at least 50 characters.',
  },
  {
    type: resume.skills.length >= 5 ? 'good' : 'warn',
    text:
      resume.skills.length >= 5
        ? 'Good number of relevant skills added.'
        : 'Add at least 5 relevant skills.',
  },
  {
    type: resume.experience.length > 0 ? 'good' : 'warn',
    text:
      resume.experience.length > 0
        ? 'Experience section has been added.'
        : 'Add at least one experience entry.',
  },
  {
    type: resume.education.length > 0 ? 'good' : 'warn',
    text:
      resume.education.length > 0
        ? 'Education information has been added.'
        : 'Add your education history.',
  },
  {
    type: resume.projects.length > 0 ? 'good' : 'warn',
    text:
      resume.projects.length > 0
        ? 'Project section contains at least one project.'
        : 'Add projects to demonstrate your practical experience.',
  },
];

  // -----------------------------
  // Improvement Suggestions
  // -----------------------------

  const improvementSuggestions = [
  ...(resume.summary.trim().length < 50
    ? ['Write a stronger professional summary with your experience, strengths, and career goal.']
    : []),

  ...(resume.skills.length < 5
    ? ['Add more relevant skills. Aim for at least 5-10 skills that match your target jobs.']
    : []),

  ...(resume.experience.length === 0
    ? ['Add your work experience, freelance work, internships, or relevant professional experience.']
    : []),

  ...resume.experience
    .filter(
      (exp) =>
        exp.description.trim().length < 50
    )
    .map(() =>
      'Add measurable achievements to your experience description, such as percentages, revenue, users, or time saved.'
    ),

  ...(resume.education.length === 0
    ? ['Add your education history, including your degree, school, and dates.']
    : []),

  ...(resume.projects.length === 0
    ? ['Add 2-3 projects with descriptions and live/GitHub links to demonstrate your abilities.']
    : []),

  ...resume.projects
    .filter((project) => !project.link.trim())
    .map(() =>
      'Add a live demo or GitHub link to your project so employers can view your work.'
    ),

  ...(resume.fullName.trim() === ''
    ? ['Add your full name to your resume.']
    : []),

  ...(resume.email.trim() === ''
    ? ['Add a professional email address.']
    : []),
];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
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

          <Button onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Resume
          </Button>
        </div>
      </div>

      {/* Save message */}
      {savedMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-slide-up">
          <CheckCircle2 className="h-4 w-4" />
          Resume saved successfully.
        </div>
      )}

      <div className="space-y-6">
        {/* Personal Information */}
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
                  update({
                    fullName: e.target.value,
                  })
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
                  update({
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="label">Phone</label>

              <input
                className="input"
                value={resume.phone}
                onChange={(e) =>
                  update({
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Professional Summary
          </h2>

          <textarea
            className="input mt-3 min-h-[100px] resize-y"
            value={resume.summary}
            onChange={(e) =>
              update({
                summary: e.target.value,
              })
            }
            rows={4}
          />
        </div>

        {/* Skills */}
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
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSkill();
                }
              }}
              placeholder="Add a skill..."
            />

            <Button variant="secondary" onClick={addSkill}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Experience */}
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
                      onChange={(e) =>
                        updateExperience(
                          i,
                          'role',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="label">Company</label>

                    <input
                      className="input"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(
                          i,
                          'company',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="label">Period</label>

                    <input
                      className="input"
                      value={exp.period}
                      onChange={(e) =>
                        updateExperience(
                          i,
                          'period',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="label">Description</label>

                  <textarea
                    className="input min-h-[60px] resize-y"
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(
                        i,
                        'description',
                        e.target.value
                      )
                    }
                    rows={2}
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

        {/* Education */}
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
                    onClick={() => removeEducation(i)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    aria-label={`Delete education ${i + 1}`}
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
                      onChange={(e) =>
                        updateEducation(
                          i,
                          'degree',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="label">School</label>

                    <input
                      className="input"
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(
                          i,
                          'school',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="label">Period</label>

                    <input
                      className="input"
                      value={edu.period}
                      onChange={(e) =>
                        updateEducation(
                          i,
                          'period',
                          e.target.value
                        )
                      }
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

        {/* Projects */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Projects
          </h2>

          <div className="mt-4 space-y-4">
            {resume.projects.map((project, i) => (
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
                    onClick={() => removeProject(i)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    aria-label={`Delete project ${i + 1}`}
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
                      value={project.name}
                      onChange={(e) =>
                        updateProject(
                          i,
                          'name',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="label">Link</label>

                    <input
                      className="input"
                      type="url"
                      placeholder="https://..."
                      value={project.link}
                      onChange={(e) =>
                        updateProject(
                          i,
                          'link',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="label">
                    Description
                  </label>

                  <textarea
                    className="input min-h-[60px] resize-y"
                    value={project.description}
                    onChange={(e) =>
                      updateProject(
                        i,
                        'description',
                        e.target.value
                      )
                    }
                    rows={2}
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

      {/* Resume Analysis Modal */}
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

          <div className="mt-4 rounded-lg bg-primary-50 p-3 text-center">
            <p className="text-sm text-slate-600">
              Resume Strength
            </p>

            <p className="text-2xl font-bold text-primary-700">
  {Math.round(
    (
      [
        resume.fullName && resume.email && resume.phone,
        resume.summary.trim().length >= 50,
        resume.skills.length >= 5,
        resume.experience.length > 0,
        resume.education.length > 0,
        resume.projects.length > 0,
      ].filter(Boolean).length / 6
    ) * 100
  )}
%
</p>
          </div>

          <p className="text-xs text-slate-400">
            Demo analysis based on sample data.
          </p>
        </div>
      </Modal>

      {/* Improve Resume Modal */}
      <Modal
        open={improveOpen}
        onClose={() => setImproveOpen(false)}
        title="Improvement Suggestions"
      >
       <div className="space-y-3">
  {improvementSuggestions.length > 0 ? (
    improvementSuggestions.map((suggestion, i) => (
      <div
        key={i}
        className="flex items-start gap-2.5"
      >
        <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />

        <span className="text-sm text-slate-600">
          {suggestion}
        </span>
      </div>
    ))
  ) : (
    <div className="rounded-lg bg-green-50 p-4 text-center">
      <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />

      <p className="mt-2 text-sm font-medium text-green-700">
        Your resume looks great!
      </p>

      <p className="mt-1 text-xs text-green-600">
        No major improvements are currently needed.
      </p>
    </div>
  )}
</div>
      </Modal>
    </div>
  );
}
