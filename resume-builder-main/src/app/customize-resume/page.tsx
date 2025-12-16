"use client";
import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Chart from 'chart.js/auto';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Skill {
  name: string;
  platform: string;
  url: string;
}

interface AnalysisResults {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
}

export default function CareerSkillsAnalyzer() {
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js`;
  }, []);

  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [manualSkills, setManualSkills] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({
    matchPercentage: 0,
    matchingSkills: [],
    missingSkills: []
  });

  const commonTechSkills = [
    "Python", "Java", "JavaScript", "HTML", "CSS", "SQL", "React", "Angular", 
    "Node.js", "TypeScript", "Docker", "Kubernetes", "AWS", "Git", "CI/CD",
    "REST API", "GraphQL", "MySQL", "MongoDB", "PostgreSQL", "Redis", "Django", 
    "Flask", "Spring Boot", "TensorFlow", "PyTorch", "Pandas", "NumPy", "R",
    "Tableau", "Power BI", "Swift", "Kotlin", "Flutter", "React Native", "iOS",
    "Android", "C++", "C#", ".NET", "Rust", "Go", "Ruby", "Ruby on Rails",
    "PHP", "Laravel", "Agile", "Scrum", "Jira", "Data Structures", "Algorithms",
    "Machine Learning", "Artificial Intelligence", "Natural Language Processing",
    "Computer Vision", "Blockchain", "UI/UX", "Figma", "Sketch", "Adobe XD",
    "Linux", "Terraform", "Ansible", "Microservices", "Object-Oriented Programming", "DSA"
  ];

  const ROLE_SKILLS = {
    "Software Engineer": [
        "Python", "Java", "Data Structures", "Algorithms", "Problem Solving",
        "Git", "CI/CD", "System Design", "Object-Oriented Programming", 
        "Unit Testing", "REST APIs", "Agile", "Design Patterns", 
        "Microservices", "SQL", "Code Review"
    ],
    "Frontend Developer": [
        "HTML", "CSS", "JavaScript", "React", "TypeScript", "Responsive Design",
        "Redux", "Webpack", "UI/UX Principles", "Jest", "CSS Preprocessors", 
        "Browser DevTools", "Web Performance", "Accessibility", "GraphQL", 
        "Animation", "Web Components"
    ],
    "Backend Developer": [
        "Python", "Java", "Node.js", "SQL", "NoSQL", "Django", "Spring Boot",
        "Express.js", "RESTful APIs", "GraphQL", "Microservices", "Docker",
        "Message Queues", "Authentication", "Database Design", "ORM",
        "Server Architecture", "Performance Optimization"
    ],
    "Data Scientist": [
        "Python", "R", "SQL", "Machine Learning", "Statistical Analysis", 
        "Data Visualization", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", 
        "Jupyter Notebooks", "Feature Engineering", "A/B Testing", "Data Cleaning",
        "Regression Analysis", "Clustering", "Big Data", "Hypothesis Testing"
    ],
    "DevOps Engineer": [
        "Linux", "Shell Scripting", "Docker", "Kubernetes", "CI/CD Pipelines",
        "AWS", "Azure", "Terraform", "Ansible", "Jenkins", "Monitoring", 
        "Prometheus", "ELK Stack", "Networking", "Infrastructure as Code",
        "Site Reliability Engineering", "Security Practices", "Cloud Architecture"
    ],
    "UX/UI Designer": [
        "Figma", "Sketch", "Adobe XD", "Prototyping", "Wireframing",
        "User Research", "Usability Testing", "Responsive Design", "Typography", 
        "Color Theory", "Information Architecture", "Interaction Design", 
        "User Persona Creation", "Design Systems", "Visual Design Principles",
        "Accessibility Standards", "UX Writing"
    ],
    "Product Manager": [
        "Product Strategy", "Market Research", "User Interviews", "Agile", 
        "Scrum", "Jira", "Roadmapping", "Stakeholder Management", "Data Analysis",
        "KPI Tracking", "Presentation Skills", "Leadership", "Communication", 
        "Competitive Analysis", "Customer Journey Mapping", "Backlog Prioritization",
        "Requirements Gathering", "Value Proposition Design"
    ],
    "Cybersecurity Analyst": [
        "Network Security", "Penetration Testing", "Ethical Hacking", 
        "Security Auditing", "Intrusion Detection", "Firewalls", "Encryption", 
        "Risk Assessment", "SIEM Tools", "Security Protocols", 
        "Vulnerability Analysis", "Incident Response", "Threat Modeling",
        "Security Compliance", "Digital Forensics", "Authentication Systems",
        "Secure Coding Practices", "Security Frameworks"
    ],
    "Mobile Developer": [
        "Swift", "Kotlin", "Java", "Flutter", "React Native", "Mobile UI Design",
        "API Integration", "Local Data Storage", "Push Notifications", 
        "Authentication", "App Performance", "App Store Deployment", "Testing",
        "Responsive Design", "Native APIs", "State Management", 
        "Mobile Security", "Cross-Platform Development"
    ],
    "Full Stack Developer": [
        "JavaScript", "HTML", "CSS", "React", "Node.js", "MongoDB", "Express",
        "RESTful APIs", "Git", "Authentication", "Frontend Architecture",
        "Backend Architecture", "Database Design", "Responsive Design",
        "Testing", "CI/CD", "Cloud Services", "Deployment Strategies"
    ]
  };

  const FREE_COURSES = {
    "Python": [
        {"name": "Python for Everybody", "platform": "Coursera", "url": "https://www.coursera.org/specializations/python"},
        {"name": "Learn Python", "platform": "Codecademy", "url": "https://www.codecademy.com/learn/learn-python-3"}
    ],
    "Java": [
        {"name": "Java Programming and Software Engineering Fundamentals", "platform": "Coursera", "url": "https://www.coursera.org/specializations/java-programming"},
        {"name": "Java Tutorial for Complete Beginners", "platform": "Udemy", "url": "https://www.udemy.com/course/java-tutorial/"}
    ],
    "JavaScript": [
        {"name": "Introduction to JavaScript", "platform": "Codecademy", "url": "https://www.codecademy.com/learn/introduction-to-javascript"},
        {"name": "JavaScript Basics", "platform": "freeCodeCamp", "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"}
    ],
    "HTML": [
        {"name": "HTML5 and CSS Fundamentals", "platform": "edX", "url": "https://www.edx.org/course/html5-and-css-fundamentals"},
        {"name": "Responsive Web Design", "platform": "freeCodeCamp", "url": "https://www.freecodecamp.org/learn/responsive-web-design/"}
    ],
    "CSS": [
        {"name": "CSS - The Complete Guide", "platform": "Udemy", "url": "https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/"},
        {"name": "CSS Basics", "platform": "W3Schools", "url": "https://www.w3schools.com/css/"}
    ],
    "React": [
        {"name": "React - The Complete Guide", "platform": "Udemy", "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/"},
        {"name": "Learn React", "platform": "Scrimba", "url": "https://scrimba.com/learn/learnreact"}
    ],
    "SQL": [
        {"name": "SQL for Data Science", "platform": "Coursera", "url": "https://www.coursera.org/learn/sql-for-data-science"},
        {"name": "Learn SQL", "platform": "Codecademy", "url": "https://www.codecademy.com/learn/learn-sql"}
    ],
    "Data Structures": [
        {"name": "Data Structures Fundamentals", "platform": "edX", "url": "https://www.edx.org/course/data-structures-fundamentals"},
        {"name": "Data Structures", "platform": "Coursera", "url": "https://www.coursera.org/learn/data-structures"}
    ],
    "Algorithms": [
        {"name": "Algorithms, Part I", "platform": "Coursera", "url": "https://www.coursera.org/learn/algorithms-part1"},
        {"name": "Intro to Algorithms", "platform": "Udacity", "url": "https://www.udacity.com/course/intro-to-algorithms--cs215"}
    ],
    "Machine Learning": [
        {"name": "Machine Learning", "platform": "Coursera", "url": "https://www.coursera.org/learn/machine-learning"},
        {"name": "Intro to Machine Learning", "platform": "Udacity", "url": "https://www.udacity.com/course/intro-to-machine-learning--ud120"}
    ],
    "AWS": [
        {"name": "AWS Fundamentals", "platform": "Coursera", "url": "https://www.coursera.org/specializations/aws-fundamentals"},
        {"name": "AWS Cloud Practitioner Essentials", "platform": "AWS Training", "url": "https://aws.amazon.com/training/learn-about/cloud-practitioner/"}
    ],
    "Docker": [
        {"name": "Docker for Beginners", "platform": "Docker Labs", "url": "https://training.play-with-docker.com/"},
        {"name": "Docker & Kubernetes: The Practical Guide", "platform": "Udemy", "url": "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/"}
    ],
    "Git": [
        {"name": "Version Control with Git", "platform": "Coursera", "url": "https://www.coursera.org/learn/version-control-with-git"},
        {"name": "Git & GitHub Crash Course", "platform": "YouTube", "url": "https://www.youtube.com/watch?v=RGOj5yH7evk"}
    ],
    "Node.js": [
        {"name": "Node.js Tutorial", "platform": "W3Schools", "url": "https://www.w3schools.com/nodejs/"},
        {"name": "Learn Node.js", "platform": "Codecademy", "url": "https://www.codecademy.com/learn/learn-node-js"}
    ],
    "TypeScript": [
        {"name": "TypeScript Tutorial", "platform": "Tutorialspoint", "url": "https://www.tutorialspoint.com/typescript/index.htm"},
        {"name": "Understanding TypeScript", "platform": "Udemy", "url": "https://www.udemy.com/course/understanding-typescript/"}
    ],
    "UI/UX Principles": [
        {"name": "UI/UX Design Specialization", "platform": "Coursera", "url": "https://www.coursera.org/specializations/ui-ux-design"},
        {"name": "Google UX Design Professional Certificate", "platform": "Coursera", "url": "https://www.coursera.org/professional-certificates/google-ux-design"}
    ],
    "Linux": [
        {"name": "Introduction to Linux", "platform": "edX", "url": "https://www.edx.org/course/introduction-to-linux"},
        {"name": "Linux Command Line Basics", "platform": "Udacity", "url": "https://www.udacity.com/course/linux-command-line-basics--ud595"}
    ],
    "Figma": [
        {"name": "Figma Tutorial", "platform": "YouTube", "url": "https://www.youtube.com/watch?v=FTFaQWZBqQ8"},
        {"name": "Learn Figma", "platform": "Figma", "url": "https://help.figma.com/hc/en-us/categories/360002051933-Getting-Started"}
    ],
    "Responsive Design": [
        {"name": "Responsive Web Design", "platform": "freeCodeCamp", "url": "https://www.freecodecamp.org/learn/responsive-web-design/"},
        {"name": "Responsive Web Design Fundamentals", "platform": "Udacity", "url": "https://www.udacity.com/course/responsive-web-design-fundamentals--ud893"}
    ]
  };

  const PERSONALIZED_TIPS = {
    "Software Engineer": [
        "Create a GitHub portfolio with 2-3 high-quality projects that demonstrate your strongest skills",
        "Practice algorithmic problems on LeetCode or HackerRank (aim for at least 100 problems)",
        "Contribute to open-source projects to demonstrate collaborative coding skills",
        "Document your code thoroughly to showcase your communication skills",
        "Build projects that demonstrate your understanding of design patterns"
    ],
    "Frontend Developer": [
        "Build a personal portfolio website that showcases your design and coding abilities",
        "Create responsive web applications that work on mobile and desktop",
        "Develop projects using modern frameworks like React, Vue or Angular",
        "Ensure your projects include accessibility features (WCAG compliance)",
        "Demonstrate your UI/UX skills through clean, intuitive interfaces"
    ],
    "Backend Developer": [
        "Create API-focused projects that demonstrate your understanding of backend architecture",
        "Build systems that handle authentication, database operations, and business logic",
        "Showcase projects with thorough documentation of API endpoints",
        "Demonstrate understanding of security principles in your backend implementations",
        "Practice writing efficient, scalable code with proper error handling"
    ],
    "Data Scientist": [
        "Create a portfolio of data analysis projects on GitHub or a personal website",
        "Participate in Kaggle competitions to demonstrate practical skills",
        "Blog about your analyses to showcase your communication abilities",
        "Develop projects that demonstrate both statistical knowledge and programming skills",
        "Show examples of how you've used data to drive business decisions"
    ],
    "DevOps Engineer": [
        "Set up CI/CD pipelines for sample applications to demonstrate practical skills",
        "Create infrastructure-as-code examples using tools like Terraform or CloudFormation",
        "Document your approach to monitoring and observability in your projects",
        "Contribute to DevOps open-source tools or plugins",
        "Demonstrate knowledge of security best practices in your infrastructure work"
    ],
    "UX/UI Designer": [
        "Create a design portfolio showcasing your process from research to final designs",
        "Include case studies that explain your design decisions and problem-solving approach",
        "Demonstrate responsive designs that work across multiple devices",
        "Show before-and-after examples of interfaces you've improved",
        "Include user testing results and how you incorporated feedback"
    ],
    "Product Manager": [
        "Document your approach to product development with case studies",
        "Highlight metrics-driven decisions you've made in previous roles",
        "Create sample product roadmaps and development plans",
        "Demonstrate customer research methods and how you incorporated findings",
        "Show examples of how you've prioritized features and managed stakeholders"
    ],
    "Cybersecurity Analyst": [
        "Document security assessments or penetration testing you've conducted (without revealing sensitive information)",
        "Create write-ups of vulnerabilities you've discovered or mitigated",
        "Participate in CTF (Capture The Flag) competitions to demonstrate practical skills",
        "Stay current with recent CVEs (Common Vulnerabilities and Exposures)",
        "Obtain industry-recognized certifications like Security+, CISSP, or CEH"
    ],
    "Mobile Developer": [
        "Publish apps to the App Store or Google Play to demonstrate your abilities",
        "Create a portfolio showcasing your mobile development projects",
        "Highlight responsive designs that work across different screen sizes",
        "Demonstrate knowledge of platform-specific best practices",
        "Show examples of how you've optimized performance on mobile devices"
    ],
    "Full Stack Developer": [
        "Create end-to-end applications that showcase both frontend and backend skills",
        "Demonstrate deployment and DevOps knowledge alongside development skills",
        "Show examples of responsive, accessible frontends connected to well-designed APIs",
        "Document your architecture decisions and technology choices",
        "Highlight performance optimizations across the full stack"
    ]
  };

  const DEFAULT_COURSE = [
    {"name": "Related Courses on YouTube", "platform": "YouTube", "url": "https://www.youtube.com/results?search_query=learn+"},
    {"name": "Free Tutorials on freeCodeCamp", "platform": "freeCodeCamp", "url": "https://www.freecodecamp.org/news/search/?query="}
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      extractTextFromPDF(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      extractTextFromPDF(file);
    }
  };

  const extractTextFromPDF = async (pdfFile: File) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;
      const textPromises = [];
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        textPromises.push(pageText);
      }
      
      const fullText = textPromises.join(' ');
      extractSkillsFromText(fullText);
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Could not load the PDF file. Please try another file.');
    }
  };

  const extractSkillsFromText = (text:any) => {
    const foundSkills = [];
    const textLower = text.toLowerCase();
    
    commonTechSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (textLower.includes(skillLower)) {
        foundSkills.push(skill);
      }
    });
    
    setExtractedSkills(foundSkills);
  };

  const addManualSkill = () => {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim();
    
    if (skill && !manualSkills.includes(skill)) {
      setManualSkills(prev => [...prev, skill]);
      skillInput.value = '';
    }
  };

  const removeSkill = (skill) => {
    if (extractedSkills.includes(skill)) {
      setExtractedSkills(prev => prev.filter(s => s !== skill));
    }
    if (manualSkills.includes(skill)) {
      setManualSkills(prev => prev.filter(s => s !== skill));
    }
  };

  const analyzeResume = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const allSkills = [...new Set([...extractedSkills, ...manualSkills])];
      const roleSkills = ROLE_SKILLS[selectedRole] || [];
      const matchingSkills = allSkills.filter(skill => roleSkills.includes(skill));
      const missingSkills = roleSkills.filter(skill => !allSkills.includes(skill));
      const matchPercentage = Math.round((matchingSkills.length / roleSkills.length) * 100);

      setAnalysisResults({
        matchPercentage,
        matchingSkills,
        missingSkills
      });

      setIsLoading(false);
      setShowResults(true);
      
      setTimeout(() => {
        initializeChart(matchPercentage);
      }, 100);
    }, 1000);
  };

  const initializeChart = (percentage: number) => {
    const ctx = document.getElementById('matchChart') as HTMLCanvasElement;
    if (!ctx) return;
  
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percentage, 100 - percentage],
          backgroundColor: ['#4F46E5', '#E5E7EB']
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  };

  const isAnalyzeDisabled = !selectedRole || (extractedSkills.length === 0 && manualSkills.length === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            Career Skills Analyzer
          </h1>
          <p className="text-gray-400">Upload your resume, select a role, and get personalized feedback</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 text-black bg-gray-300 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
            
            <div className="mb-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-indigo-500');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-indigo-500');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-indigo-500');
                  handleFileDrop(e);
                }}
              >
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-1">Drag and drop your resume (PDF)</p>
                <p className="text-xs text-gray-500">or</p>
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
                <button 
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                  onClick={() => {
                    const fileInput = document.getElementById('fileInput');
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                >
                  Browse File
                </button>
              </div>
              {fileName && <p className="mt-2 text-sm text-gray-600">{fileName}</p>}
            </div>

            <h2 className="text-xl text-black font-semibold mb-4">Select Role</h2>
            <div className="mb-6">
              <select 
                id="roleSelect" 
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="" disabled>Choose a role</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="UX/UI Designer">UX/UI Designer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Manually add skills (optional)</h3>
              <div className="flex">
                <input 
                  type="text" 
                  id="skillInput" 
                  placeholder="Enter skill (e.g., Python)" 
                  className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addManualSkill();
                    }
                  }}
                />
                <button 
                  id="addSkillBtn" 
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-r-md hover:bg-indigo-700"
                  onClick={addManualSkill}
                >
                  Add
                </button>
              </div>
            </div>

            <div id="skillTags" className="flex flex-wrap gap-2 mb-6">
              {[...new Set([...extractedSkills, ...manualSkills])].map((skill, index) => (
                <div key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  <span>{skill}</span>
                  <button 
                    className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    onClick={() => removeSkill(skill)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <button 
              id="analyzeBtn" 
              className={`w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
              disabled={isAnalyzeDisabled}
              onClick={analyzeResume}
            >
              Analyze Resume
            </button>
          </div>

          <div className="md:col-span-2">
            {isLoading && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl p-8 text-center border border-gray-700">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Analyzing your skills...</p>
              </div>
            )}

            {!showResults && !isLoading && manualSkills.length === 0 && extractedSkills.length === 0 && (
              <div className="text-center text-black mt-8">
                <p>No skills analyzed yet. Upload your resume and select a role to begin.</p>
              </div>
            )}

            {showResults && !isLoading && (
              <div className="space-y-6">
                <div className="bg-gray-300 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl p-6  border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-indigo-600">{selectedRole} Match Analysis</h2>
                    <div className="flex items-center">
                      <div className="relative h-20 w-20">
                        <canvas id="matchChart"></canvas>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-indigo-400">
                            {analysisResults.matchPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-300 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold text-indigo-600 mb-4">Skills Assessment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-green-600 mb-2">Matching Skills</h3>
                      <ul id="matchingSkillsList" className="space-y-2 text-black">
                        {analysisResults.matchingSkills.map((skill, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {skill}
                          </li>
                        ))}
                        {analysisResults.matchingSkills.length === 0 && (
                          <li className="text-black">No matching skills found.</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-red-600 mb-2">Missing Skills</h3>
                      <ul id="missingSkillsList" className="space-y-2 text-black">
                        {analysisResults.missingSkills.map((skill, index) => {
                          const courses = FREE_COURSES[skill] || DEFAULT_COURSE.map(course => ({
                            ...course,
                            url: `${course.url}${encodeURIComponent(skill)}`
                          }));

                          return (
                            <li key={index} className="flex flex-col gap-2">
                              <span className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                {skill}
                              </span>
                              <div className="ml-7">
                                <h4 className="text-sm font-medium text-black mb-1">Recommended Courses:</h4>
                                <ul className="space-y-1">
                                  {courses.map((course, courseIndex) => (
                                    <li key={courseIndex}>
                                      <a 
                                        href={course.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-indigo-600 hover:underline"
                                      >
                                        {course.name} ({course.platform})
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>

                <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Career Tips for {selectedRole}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2">
                      {PERSONALIZED_TIPS[selectedRole]?.map((tip, index) => (
                        <li key={index} className="text-gray-300">{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomizeResume() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Choose Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-zinc-700 rounded-lg hover:border-blue-500 transition-colors">
                <p className="text-white">Minimal</p>
              </button>
              <button className="p-4 border border-zinc-700 rounded-lg hover:border-blue-500 transition-colors">
                <p className="text-white">Modern</p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[1/1.4] bg-white rounded-lg p-4">
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Download Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Download as PDF
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Download as DOCX
              </button>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}