import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, Sparkles, Zap, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const onStart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Navigate to the resume generation page using Next.js router
    router.push('/generate-resume');
  };

  const onATSCheck = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Navigate to the ATS checker page using Next.js router
    router.push('/ats-checker');
  };

  const onUpdateResume = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Navigate to the resume update page using Next.js router
    router.push('/customize-resume');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Dynamic background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1a1a2e,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#2a1663,transparent_50%)]" />
      
      {/* Geometric patterns */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={`diagonal-${i}`}
              className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-violet-500/10 to-transparent transform -translate-x-1/2"
              style={{
                top: `${i * 20}%`,
                left: '50%',
                transform: `rotate(${35 + i * 5}deg) translateX(-50%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Interactive gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(124, 58, 237, 0.15) 0%,
            transparent 40%),
            radial-gradient(circle at ${mousePosition.x - 200}px ${mousePosition.y + 200}px, 
            rgba(167, 139, 250, 0.1) 0%,
            transparent 30%)
          `
        }}
      />

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Triangles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`triangle-${i}`}
            className="absolute w-24 h-24"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.05))',
              animation: `floatTriangle ${12 + Math.random() * 8}s infinite ease-in-out`,
              animationDelay: `${-Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Glowing dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute w-2 h-2 rounded-full bg-violet-500/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 2}s`,
              animationDelay: `${-Math.random() * 2}s`
            }}
          />
        ))}

        {/* Curved lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`curve-${i}`}
            className="absolute w-96 h-96 border-2 border-violet-500/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${0.5 + Math.random()})`,
              animation: `floatCurve ${15 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${-Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-8 transform hover:scale-105 transition-transform">
              <div className="relative group">
                <Sparkles className="h-14 w-14 text-violet-400 transform group-hover:rotate-180 transition-transform duration-700" />
                <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full group-hover:bg-violet-400/30 transition-colors duration-700" />
              </div>
              <h1 className="text-7xl font-bold bg-gradient-to-br from-violet-300 via-violet-400 to-fuchsia-500 text-transparent bg-clip-text transform hover:scale-105 transition-transform duration-500">
                ResumeForge AI
              </h1>
            </div>

            <p className="text-4xl font-light text-slate-200 mb-8 opacity-0 animate-fadeIn relative">
              Create a professional resume in minutes
              <span className="absolute -right-4 top-0 w-2 h-2 bg-violet-400 rounded-full animate-ping" />
            </p>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Our AI-powered resume builder helps you craft the perfect resume. Answer a few questions and get a
              beautifully formatted resume tailored for your career.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/generate-resume">
              <button onClick={onStart}

                className="group relative px-8 py-4 bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2 text-white font-semibold text-lg">
                  Build Your Resume <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              </Link>
              <Link href="/ats-checker">

              <button onClick={onATSCheck}

                className="group relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-violet-500/30 rounded-xl font-semibold text-lg flex items-center gap-2 text-violet-400 transition-all duration-300 hover:bg-slate-800/70 hover:border-violet-400/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-2">
                  ATS Checker <CheckCircle className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
              </Link>
              <Link href="/customize-resume">

              <button  onClick={onUpdateResume}

                className="group relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-violet-500/30 rounded-xl font-semibold text-lg flex items-center gap-2 text-violet-400 transition-all duration-300 hover:bg-slate-800/70 hover:border-violet-400/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-2">
                  Skill Scout(Under construction) <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                </span>
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features grid with enhanced hover effects */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Quick & Easy",
                description: "Answer 11 simple questions and get your professional resume in minutes. No complex formatting required."
              },
              {
                icon: FileText,
                title: "Professional Design",
                description: "Your resume will be beautifully formatted with a modern, professional design that stands out."
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Our intelligent system guides you through the process, ensuring you include all essential information."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/30 via-slate-800/50 to-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 transition-all duration-500 hover:bg-slate-800/50 hover:border-violet-500/30 hover:transform hover:scale-105 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-colors duration-500 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <feature.icon className="h-8 w-8 text-violet-400 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-slate-200 group-hover:text-violet-300 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;