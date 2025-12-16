'use client';

import { useState, useEffect } from 'react';
import companiesData from "@/data/company_roles.json"; // Path to your JSON file
import { Anybody } from 'next/font/google';

interface ResumeData {
  name: string;
  skills: string[];
  workExperience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications?: string[];
  projects?: Array<{
    name: string;
    description: string;
  }>;
  achievements?: string[];
}

interface CompaniesData  {
  companies: Array<Record<string, string[]>>;
}

interface CoverLetterGeneratorProps {
  resumeData: ResumeData;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ resumeData }) => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Extract companies list on component mount
  useEffect(() => {
    if (Array.isArray(companiesData.companies)) {
      const companyNames = companiesData.companies.map(
        companyObj => Object.keys(companyObj)[0]
      );
      setCompanies(companyNames);
    } else {
      console.error("Invalid companies data format");
    }
  }, []);

  // Update roles when company changes
  useEffect(() => {
    if (selectedCompany) {
      const companyObj = companiesData.companies.find(
        (obj) => Object.keys(obj)[0] === selectedCompany
      );
  
      if (companyObj) {
        const rolesList = companyObj[selectedCompany as keyof typeof companyObj] as string[];
        setRoles(rolesList || []);
      } else {
        setRoles([]);
      }
  
      setSelectedRole('');
      setCoverLetter('');
    }
  }, [selectedCompany]);
  

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const generateCoverLetter = () => {
    if (!selectedCompany || !selectedRole) {
      alert('Please select both a company and a role');
      return;
    }

    setIsGenerating(true);

    try {
      // Get current date
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Extract relevant skills (you can enhance this with more logic)
      const relevantSkills = resumeData.skills.slice(0, 5);
      
      // Get most recent work experience
      const recentExperience = resumeData.workExperience[0];
      
      // Get highest education
      const education = resumeData.education[0];

      // Create a template-based cover letter
      const letter = `
${date}

Hiring Manager
${selectedCompany}

Dear Hiring Manager,

I am writing to express my interest in the ${selectedRole} position at ${selectedCompany}. With my background in ${education.degree} and skills in ${relevantSkills.join(', ')}, I believe I am well-qualified for this role.

${recentExperience ? `In my most recent role as ${recentExperience.title} at ${recentExperience.company}, I ${recentExperience.description.slice(0, 150)}...` : 'Throughout my career, I have developed strong skills that align well with this position.'}

My educational background from ${education.institution} has provided me with the knowledge and foundation necessary to excel in this position.

${resumeData.achievements && resumeData.achievements.length > 0 ? 
  `Some of my key achievements include:\n- ${resumeData.achievements.join('\n- ')}` : ''}

I am particularly drawn to ${selectedCompany} because of its reputation for innovation and excellence in the industry. After researching your company's mission and values, I am confident that my skills and experiences make me a strong candidate for the ${selectedRole} position.

I look forward to the opportunity to discuss how my qualifications align with your needs. Thank you for considering my application.

Sincerely,
${resumeData.name}
      `;

      setCoverLetter(letter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    alert('Cover letter copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${selectedCompany}_${selectedRole.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1">
              Select Company
            </label>
            <select
              id="company"
              className="w-full p-2 border border-gray-300 rounded-md bg-black"
              value={selectedCompany}
              onChange={handleCompanyChange}
            >
              <option value="">-- Select a company --</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {selectedCompany && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Select Role
              </label>
              <select
                id="role"
                className="w-full p-2 border border-gray-300 rounded-md bg-black"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                <option value="">-- Select a role --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            onClick={generateCoverLetter}
            disabled={!selectedCompany || !selectedRole || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </div>

        <div className="bg-black p-4 rounded-md">
          <h3 className="font-medium mb-2">Resume Summary</h3>
          <div className="text-sm space-y-2">
            <p><strong>Name:</strong> {resumeData.name}</p>
            <p><strong>Skills:</strong> {resumeData.skills.join(', ')}</p>
            <p><strong>Education:</strong> {resumeData.education[0]?.degree} - {resumeData.education[0]?.institution}</p>
            <p><strong>Experience:</strong> {resumeData.workExperience[0]?.title} at {resumeData.workExperience[0]?.company}</p>
          </div>
        </div>
      </div>

      {coverLetter && (
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Cover Letter</h2>
            <div className="space-x-2">
              <button
                className="px-3 py-1 bg-blue-400 text-gray-800 rounded hover:bg-gray-300"
                onClick={handleCopy}
              >
                Copy
              </button>
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          </div>
          <div className="p-6 bg-black border border-gray-300 rounded-md whitespace-pre-line">
            {coverLetter}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;