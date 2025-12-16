import React from 'react';
import { Download } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';

interface DownloadButtonProps {
  fileName?: string;
  resumeData: {
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
  };
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ fileName = 'resume', resumeData }) => {
  const handleDownload = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header with name and contact
            new Paragraph({
              text: resumeData.name,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: resumeData.title,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: resumeData.contact,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Professional Summary
            new Paragraph({
              text: "Professional Summary",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: resumeData.summary,
              spacing: { after: 400 },
            }),

            // Skills Section
            new Paragraph({
              text: "Skills",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: "Technical Skills",
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: resumeData.technicalSkills,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: "Soft Skills",
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: resumeData.softSkills,
              spacing: { after: 400 },
            }),

            // Professional Experience
            new Paragraph({
              text: "Professional Experience",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: "Recent Position",
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 200 },
              border: {
                left: {
                  style: BorderStyle.SINGLE,
                  size: 4,
                  color: "000000",
                },
              },
            }),
            new Paragraph({
              text: resumeData.recentExperience,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: "Previous Position",
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: resumeData.otherExperience,
              spacing: { after: 400 },
            }),

            // Projects
            new Paragraph({
              text: "Notable Projects",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: resumeData.projects,
              spacing: { after: 400 },
            }),

            // Education
            new Paragraph({
              text: "Education",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: resumeData.education,
              spacing: { after: 400 },
            }),

            // Certifications
            new Paragraph({
              text: "Certifications & Awards",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: resumeData.certifications,
              spacing: { after: 400 },
            }),
          ],
        }],
      });

      // Generate and save document
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Document Generation Error:', error);
      alert('Failed to generate document. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
    >
      <Download className="w-5 h-5" />
      <span>Download as DOCX</span>
    </button>
  );
};

export default DownloadButton;