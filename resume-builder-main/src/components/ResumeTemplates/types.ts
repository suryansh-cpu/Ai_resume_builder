export interface ResumeData {
  name: string;
  contact: string;
  title: string;
  education: string;
  technicalSkills: string;
  softSkills: string;
  recentExperience: string;
  otherExperience: string;
  certifications: string;
  summary: string;
  projects: string;
}

export interface TemplateProps {
  resumeData: ResumeData;
}