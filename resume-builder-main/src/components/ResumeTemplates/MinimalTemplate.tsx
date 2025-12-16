import React from "react";
import { Mail, Phone, Briefcase, GraduationCap, Award, Code, UserCircle2, FolderGit2 } from 'lucide-react';

interface ResumeData {
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

const MinimalTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const [email, phone] = (resumeData?.contact || '').split('|').map(item => item.trim());

  return (
    <div className="p-8 border border-gray-200 w-[800px] bg-black font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light mb-2 text-white">{resumeData?.name || 'Your Name'}</h1>
        <h2 className="text-xl text-gray-300 mb-4">{resumeData?.title}</h2>
        <div className="flex items-center justify-center gap-6 text-gray-300">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>{phone}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCircle2 className="text-gray-300" size={24} />
          <h2 className="text-xl font-semibold text-white">Professional Summary</h2>
        </div>
        <p className="text-gray-300">{resumeData?.summary}</p>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="text-gray-300" size={24} />
          <h2 className="text-xl font-semibold text-white">Skills</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-white mb-2">Technical Skills</h3>
            <p className="text-gray-300">{resumeData?.technicalSkills}</p>
          </div>
          <div>
            <h3 className="font-medium text-white mb-2">Soft Skills</h3>
            <p className="text-gray-300">{resumeData?.softSkills}</p>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="text-gray-300" size={24} />
          <h2 className="text-xl font-semibold text-white">Professional Experience</h2>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-gray-300 pl-4">
            <h3 className="font-medium text-white mb-2">Recent Position</h3>
            <p className="text-gray-300">{resumeData?.recentExperience}</p>
          </div>
          <div className="border-l-4 border-gray-500 pl-4">
            <h3 className="font-medium text-white mb-2">Previous Position</h3>
            <p className="text-gray-300">{resumeData?.otherExperience}</p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FolderGit2 className="text-gray-300" size={24} />
          <h2 className="text-xl font-semibold text-white">Notable Projects</h2>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-300 whitespace-pre-line">{resumeData?.projects}</p>
        </div>
      </section>

      {/* Education */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="text-gray-300" size={24} />
          <h2 className="text-xl font-semibold text-white">Education</h2>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-300">{resumeData?.education}</p>
        </div>
      </section>

      {/* Certifications */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-gray-300" size={24} />
          <h2 className="text-xl font-semibold text-white">Certifications & Awards</h2>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-300">{resumeData?.certifications}</p>
        </div>
      </section>
    </div>
  );
};

export default MinimalTemplate;
