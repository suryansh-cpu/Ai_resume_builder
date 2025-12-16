"use client";

import ResumeBuilder from "../../components/resumebuilder";

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <ResumeBuilder onBack={() => console.log("Back button clicked")} />
    </div>
  );
}
