// import React from "react";
// import {
//   Briefcase,
//   GraduationCap,
//   Award,
//   Code,
//   UserCircle2,
//   FolderGit2,
// } from "lucide-react";
// import GeneratePDF from "./ResumeTemplates/GeneratePDF";

// interface ResumeData {
//   Summary?: string;
//   Experience?: string;
//   Projects?: string;
//   Skills?: string;
//   Role?: string;
// }

// interface ResumePreviewProps {
//   resumeText: ResumeData; // ✅ OBJECT, not string
// }

// export default function ResumePreview({ resumeText }: ResumePreviewProps) {
//   if (!resumeText) {
//     return (
//       <p className="text-zinc-400 p-6">
//         No resume generated yet.
//       </p>
//     );
//   }

//   const {
//     Summary = "Not provided",
//     Experience = "Not provided",
//     Projects = "Not provided",
//     Skills = "Not provided",
//     Role = "Professional",
//   } = resumeText;

//   return (
//     <div className="relative">
//       <div
//         id="resume-preview"
//         className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
//       >
//         {/* Header */}
//         <div className="bg-slate-900 text-white px-8 py-12">
//           <h1 className="text-4xl font-bold mb-2">
//             {Role}
//           </h1>
//           <h2 className="text-xl text-slate-300 font-medium">
//             Resume Preview
//           </h2>
//         </div>

//         <div className="p-8">
//           {/* Summary */}
//           <section className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <UserCircle2 size={24} />
//               <h2 className="text-2xl font-semibold">
//                 Professional Summary
//               </h2>
//             </div>
//             <p className="text-slate-700 whitespace-pre-line">
//               {Summary}
//             </p>
//           </section>

//           {/* Skills */}
//           <section className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <Code size={24} />
//               <h2 className="text-2xl font-semibold">
//                 Skills
//               </h2>
//             </div>
//             <div className="bg-slate-50 p-4 rounded-lg">
//               <p className="text-slate-700 whitespace-pre-line">
//                 {Skills}
//               </p>
//             </div>
//           </section>

//           {/* Experience */}
//           <section className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <Briefcase size={24} />
//               <h2 className="text-2xl font-semibold">
//                 Experience
//               </h2>
//             </div>
//             <p className="text-slate-700 whitespace-pre-line">
//               {Experience}
//             </p>
//           </section>

//           {/* Projects */}
//           <section className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <FolderGit2 size={24} />
//               <h2 className="text-2xl font-semibold">
//                 Projects
//               </h2>
//             </div>
//             <p className="text-slate-700 whitespace-pre-line">
//               {Projects}
//             </p>
//           </section>

//           {/* Education / Certifications (optional later) */}
//           <section className="mb-4 opacity-60">
//             <div className="flex items-center gap-2 mb-4">
//               <GraduationCap size={24} />
//               <Award size={24} />
//               <h2 className="text-xl font-semibold">
//                 Additional Sections
//               </h2>
//             </div>
//             <p className="text-slate-600">
//               Can be expanded later
//             </p>
//           </section>
//         </div>
//       </div>

//       {/* PDF */}
//       <GeneratePDF
//         fileName={`${Role.replace(/\s+/g, "_")}_resume`}
//         resumeData={{
//           summary: Summary,
//           skills: Skills,
//           experience: Experience,
//           projects: Projects,
//           role: Role,
//         }}
//       />
//     </div>
//   );
// }


import React from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  UserCircle2,
  FolderGit2,
} from "lucide-react";
import GeneratePDF from "./ResumeTemplates/GeneratePDF";

interface ResumeData {
  Summary?: string;
  Experience?: string;
  Projects?: string;
  Skills?: string;
  Role?: string;
}

interface ResumePreviewProps {
  resumeText: ResumeData; // ✅ OBJECT, not string
}

export default function ResumePreview({ resumeText }: ResumePreviewProps) {
  if (!resumeText) {
    return (
      <p className="text-zinc-400 p-6">
        No resume generated yet.
      </p>
    );
  }

  const {
    Summary = "Not provided",
    Experience = "Not provided",
    Projects = "Not provided",
    Skills = "Not provided",
    Role = "Professional",
  } = resumeText;

  return (
    <div className="relative">
      <div
        id="resume-preview"
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">
            {Role}
          </h1>
          <h2 className="text-xl text-slate-300 font-medium">
            Resume Preview
          </h2>
        </div>

        <div className="p-8">
          {/* Summary */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle2 size={24} />
              <h2 className="text-2xl font-semibold">
                Professional Summary
              </h2>
            </div>
            <p className="text-slate-700 whitespace-pre-line">
              {Summary}
            </p>
          </section>

          {/* Skills */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Code size={24} />
              <h2 className="text-2xl font-semibold">
                Skills
              </h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700 whitespace-pre-line">
                {Skills}
              </p>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={24} />
              <h2 className="text-2xl font-semibold">
                Experience
              </h2>
            </div>
            <p className="text-slate-700 whitespace-pre-line">
              {Experience}
            </p>
          </section>

          {/* Projects */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FolderGit2 size={24} />
              <h2 className="text-2xl font-semibold">
                Projects
              </h2>
            </div>
            <p className="text-slate-700 whitespace-pre-line">
              {Projects}
            </p>
          </section>

          {/* Education / Certifications (optional later) */}
          <section className="mb-4 opacity-60">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={24} />
              <Award size={24} />
              <h2 className="text-xl font-semibold">
                Additional Sections
              </h2>
            </div>
            <p className="text-slate-600">
              Can be expanded later
            </p>
          </section>
        </div>
      </div>

      {/* PDF */}
      <GeneratePDF
        fileName={`${Role.replace(/\s+/g, "_")}_resume`}
        resumeData={{
          summary: Summary,
          skills: Skills,
          experience: Experience,
          projects: Projects,
          role: Role,
        }}
      />
    </div>
  );
}
