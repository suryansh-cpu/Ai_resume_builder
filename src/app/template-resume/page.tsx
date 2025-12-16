"use client";
import { useState } from "react";
import TemplatePreview from "@/components/ResumeTemplates/TemplatePreview";
import PDFButton from "@/components/ResumeTemplates/GeneratePDF";

const templateOptions: ("minimal" | "modern")[] = [
    "minimal",
    "modern"
];

const ResumeBuilder = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<"minimal" | "modern">("minimal");

    const resumeData = {
        name: "John Doe",
        location: {
            city: "San Francisco",
            state: "CA",
            country: "USA"
        },
        education: [
            {
                degree: "Master of Science in Computer Science",
                institution: "Stanford University",
                years: "2018-2020"
            }
        ],
        softSkills: [
            "Team Leadership",
            "Problem Solving",
            "Communication"
        ],
        certificates: [
            "AWS Certified Solutions Architect",
            "Google Cloud Professional Developer"
        ],
        linkedinUrl: "https://linkedin.com/in/johndoe",
        projects: [
            {
                name: "AI-Powered Resume Builder",
                description: "Built a resume generator using OpenAI's GPT-3",
                technologies: ["React", "Node.js", "OpenAI API"],
                link: "https://github.com/johndoe/resume-builder"
            }
        ]
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Choose a Resume Template</h1>
            <div className="flex gap-4 my-4">
                {templateOptions.map((template) => (
                    <button
                        key={template}
                        className={`p-2 border ${selectedTemplate === template ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setSelectedTemplate(template)}
                    >
                        {template.charAt(0).toUpperCase() + template.slice(1)}
                    </button>
                ))}
            </div>

            <div className="border p-4 mt-4 bg-white shadow">
                <TemplatePreview selectedTemplate={selectedTemplate} resumeData={resumeData} />
            </div>
            <PDFButton resumeData={resumeData} />
        </div>
    );
};

export default ResumeBuilder;
