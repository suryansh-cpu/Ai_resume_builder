'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CoverLetterGenerator from '@/components/CoverLetterGeneration';

export default function CoverLetterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a resumeId
    if (!resumeId) {
      alert('No resume data found. Please generate a resume first.');
      router.push('/resume-builder');
      return;
    }

    // Fetch resume data (this would use your actual data storage method)
    const fetchResumeData = async () => {
      try {
        // This is a placeholder - replace with your actual data fetching logic
        // Example: API call or retrieving from localStorage
        const data = localStorage.getItem(`resume-${resumeId}`);
        if (!data) {
          throw new Error('Resume data not found');
        }
        
        setResumeData(JSON.parse(data));
      } catch (error) {
        console.error('Error fetching resume data:', error);
        alert('Could not load resume data. Please try again.');
        router.push('/resume-builder');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [resumeId, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading resume data...</div>;
  }

  if (!resumeData) {
    return <div className="flex justify-center items-center h-screen">Resume data not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cover Letter Generator</h1>
      <p className="mb-6">
        Create a personalized cover letter based on your resume and the company you're applying to.
      </p>
      
      <CoverLetterGenerator resumeData={resumeData} />
    </div>
  );
}