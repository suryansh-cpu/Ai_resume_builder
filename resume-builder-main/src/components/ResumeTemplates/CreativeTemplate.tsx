import React from "react";

const CreativeTemplate = ({ resumeData }: { resumeData: any }) => {
  return (
    <div className="border-4 border-indigo-500 p-6 w-[800px] shadow-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-extrabold text-center">{resumeData.name}</h1>
      <p className="text-lg text-center">{resumeData.title}</p>
      <hr className="my-4 border-white" />

      <h2 className="text-2xl font-bold mt-4 underline">Experience</h2>
      {resumeData.experience.map((job: any, index: number) => (
        <div key={index} className="mt-4 p-4 bg-white text-black rounded-lg shadow-md">
          <h3 className="text-xl font-bold">{job.company}</h3>
          <p className="text-gray-700">{job.role} - {job.years}</p>
          <p className="text-gray-600">{job.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CreativeTemplate;
