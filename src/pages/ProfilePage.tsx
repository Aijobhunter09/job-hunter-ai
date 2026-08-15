import { useState } from 'react';
import { Save, Plus, Trash2, CheckCircle2, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useProfile';

export function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !profile.skills.includes(s)) {
      updateProfile({ skills: [...profile.skills, s] });
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    updateProfile({ skills: profile.skills.filter((s) => s !== skill) });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
const profileFields = [
  profile.name,
  profile.jobTitle,
  profile.location,
  profile.experience,
  profile.skills.length > 0 ? 'skills' : '',
  profile.preferredLocation,
];

const completedFields = profileFields.filter((field) => field.trim().length > 0).length;
const profileCompletion = Math.round(
  (completedFields / profileFields.length) * 100
);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>
        <p className="mt-2 text-slate-600">Tell AI about yourself to get better job matches.</p>
      </div>
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-slate-900">Profile Strength</p>
      <p className="mt-1 text-xs text-slate-500">
        Complete your profile to improve job matching.
      </p>
    </div>
    <span className="text-lg font-bold text-primary-700">
      {profileCompletion}%
    </span>
  </div>

  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
    <div
      className="h-full rounded-full bg-primary-600 transition-all duration-500"
      style={{ width: `${profileCompletion}%` }}
    />
  </div>
</div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700 animate-slide-up">
          <CheckCircle2 className="h-4 w-4" /> Profile saved successfully.
        </div>
      )}

      <div className="space-y-6">
        {/* Basic info */}
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <User className="h-5 w-5 text-primary-700" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Job Title</label>
              <input
                className="input"
                value={profile.jobTitle}
                onChange={(e) => updateProfile({ jobTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Location</label>
              <input
                className="input"
                value={profile.location}
                onChange={(e) => updateProfile({ location: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Experience</label>
              <input
                className="input"
                value={profile.experience}
                onChange={(e) => updateProfile({ experience: e.target.value })}
                placeholder="e.g., 5 years"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700"
              >
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

        {/* Preferences */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Job Preferences</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Preferred Job Type</label>
              <select
                className="input"
                value={profile.preferredJobType}
                onChange={(e) => updateProfile({ preferredJobType: e.target.value })}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="label">Preferred Location</label>
              <input
                className="input"
                value={profile.preferredLocation}
                onChange={(e) => updateProfile({ preferredLocation: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Remote Preference</label>
              <select
                className="input"
                value={profile.remotePreference}
                onChange={(e) => updateProfile({ remotePreference: e.target.value })}
              >
                <option>Open to remote</option>
                <option>Remote only</option>
                <option>On-site only</option>
                <option>Hybrid preferred</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Profile
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-700">
        Your profile is stored locally and persists across page refreshes.
      </div>
    </div>
  );
}
