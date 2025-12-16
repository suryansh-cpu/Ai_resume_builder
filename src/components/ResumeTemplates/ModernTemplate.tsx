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

const ModernTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const [email, phone] = (resumeData?.contact || '').split('|').map(item => item.trim());

  return (
    <div className="flex border border-gray-300 w-[800px] min-h-[1000px]">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{resumeData?.name || 'Your Name'}</h1>
          <h2 className="text-lg text-gray-300 mb-4">{resumeData?.title}</h2>
          <div className="space-y-2 text-gray-300">
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

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-1">
            Technical Skills
          </h2>
          <p className="text-gray-300">{resumeData?.technicalSkills}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-1">
            Soft Skills
          </h2>
          <p className="text-gray-300">{resumeData?.softSkills}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-1">
            Certifications & Awards
          </h2>
          <p className="text-gray-300">{resumeData?.certifications}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6 bg-white">
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle2 className="text-gray-700" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Professional Summary</h2>
          </div>
          <p className="text-gray-700">{resumeData?.summary}</p>
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="text-gray-700" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Professional Experience</h2>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-gray-900 pl-4">
              <h3 className="font-medium text-gray-900 mb-2">Recent Position</h3>
              <p className="text-gray-700">{resumeData?.recentExperience}</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <h3 className="font-medium text-gray-900 mb-2">Previous Position</h3>
              <p className="text-gray-700">{resumeData?.otherExperience}</p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FolderGit2 className="text-gray-700" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Notable Projects</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-line">{resumeData?.projects}</p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="text-gray-700" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{resumeData?.education}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModernTemplate;