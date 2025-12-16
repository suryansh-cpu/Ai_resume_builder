import React from "react";

const TechnicalTemplate = ({ resumeData }: { resumeData: any }) => {
  return (
    <div className="p-6 border border-gray-300 w-[800px] bg-white font-mono">
      <h1 className="text-2xl font-bold">{resumeData.name}</h1>
      <p className="text-gray-600">{resumeData.title}</p>
      <p className="text-gray-600">
        <a href={resumeData.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>{" "}
        |{" "}
        <a href={resumeData.portfolio} target="_blank" rel="noopener noreferrer">
          Portfolio
        </a>
      </p>
      <hr className="my-2" />
      <h2 className="text-xl font-semibold">Projects</h2>
      {resumeData.projects.map((project: any, index: number) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">{project.name}</h3>
          <p>{project.description}</p>
          <p>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              {project.link}
            </a>
          </p>
        </div>
      ))}
      <hr className="my-2" />
      <h2 className="text-xl font-semibold">Skills</h2>
      <ul className="list-disc list-inside">
        {resumeData.skills.map((skill: string, index: number) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <hr className="my-2" />
      <h2 className="text-xl font-semibold">Experience</h2>
      {resumeData.experience.map((job: any, index: number) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">{job.company}</h3>
          <p>{job.role} - {job.years}</p>
          <p>{job.description}</p>
        </div>
      ))}
      <hr className="my-2" />
      <h2 className="text-xl font-semibold">Education</h2>
      {resumeData.education.map((edu: any, index: number) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">{edu.institution}</h3>
          <p>{edu.degree} - {edu.years}</p>
        </div>
      ))}
    </div>
  );
};

export default TechnicalTemplate;