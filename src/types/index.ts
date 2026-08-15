export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior' | 'Lead';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  salary: string;
  salaryMin: number;
  postedDate: string;
  matchScore: number;
  skills: string[];
  experienceLevel: ExperienceLevel;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  salary: string;
  appliedDate: string;
  status: ApplicationStatus;
}

export interface UserProfile {
  name: string;
  jobTitle: string;
  location: string;
  experience: string;
  skills: string[];
  preferredJobType: string;
  preferredLocation: string;
  remotePreference: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: { role: string; company: string; period: string; description: string }[];
  education: { degree: string; school: string; period: string }[];
  projects: { name: string; description: string; link: string }[];
}
