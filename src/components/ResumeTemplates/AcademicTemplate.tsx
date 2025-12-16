import React from "react";

const AcademicTemplate = ({ resumeData }: { resumeData: any }) => {
  return (
    <div className="p-6 border border-gray-300 w-[800px] bg-white">
      <h1 className="text-3xl font-bold">{resumeData.name}</h1>
      <p className="text-gray-600">{resumeData.title}</p>
      <p className="text-gray-600">{resumeData.contact}</p>
      <hr className="my-4" />

      <h2 className="text-2xl font-semibold">Education</h2>
      {resumeData.education.map((edu: any, index: number) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">{edu.institution}</h3>
          <p>{edu.degree} - {edu.years}</p>
          <p>{edu.description}</p>
        </div>
      ))}
      <hr className="my-4" />

      <h2 className="text-2xl font-semibold">Research Experience</h2>
      {resumeData.research.map((research: any, index: number) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">{research.title}</h3>
          <p>{research.institution} - {research.years}</p>
          <p>{research.description}</p>
        </div>
      ))}
      <hr className="my-4" />

      <h2 className="text-2xl font-semibold">Publications</h2>
      <ul className="list-disc list-inside">
        {resumeData.publications.map((publication: any, index: number) => (
          <li key={index}>{publication}</li>
        ))}
      </ul>
      <hr className="my-4" />

      <h2 className="text-2xl font-semibold">Achievements</h2>
      <ul className="list-disc list-inside">
        {resumeData.achievements.map((achievement: any, index: number) => (
          <li key={index}>{achievement}</li>
        ))}
      </ul>
      <hr className="my-4" />

      <h2 className="text-2xl font-semibold">Teaching Experience</h2>
      {resumeData.teaching.map((teaching: any, index: number) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">{teaching.course}</h3>
          <p>{teaching.institution} - {teaching.years}</p>
          <p>{teaching.description}</p>
        </div>
      ))}
      <hr className="my-4" />

      <h2 className="text-2xl font-semibold">Professional Memberships</h2>
      <ul className="list-disc list-inside">
        {resumeData.memberships.map((membership: any, index: number) => (
          <li key={index}>{membership}</li>
        ))}
      </ul>
    </div>
  );
};

export default AcademicTemplate;