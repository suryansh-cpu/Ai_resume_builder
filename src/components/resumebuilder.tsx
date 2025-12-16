import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./chat-message";
import ResumePreview from "./resumepreview";
import CoverLetterGenerator from "./CoverLetterGeneration";
import Sidebar from "./ui/sidebar";
import { Send, Code, Layout, Palette, Database, Settings, FileText, FileCode, File } from "lucide-react";
import MinimalTemplate from "./ResumeTemplates/MinimalTemplate";
import ModernTemplate from "./ResumeTemplates/ModernTemplate";
import TemplateSelection from './ResumeTemplates/TemplateSelection';
import PDFButton from './PDFButton';
// import ResumePreview from "./resumepreview";

// Define professional roles
const ROLES = [
    {
        id: "software-engineer",
        title: "Software Engineer",
        icon: Code,
        description: "Build and maintain software applications and systems",
    },
    {
        id: "product-manager",
        title: "Product Manager",
        icon: Layout,
        description: "Lead product strategy and development",
    },
    {
        id: "ux-designer",
        title: "UX Designer",
        icon: Palette,
        description: "Create user-centered digital experiences",
    },
    {
        id: "data-scientist",
        title: "Data Scientist",
        icon: Database,
        description: "Analyze data and build ML models",
    },
    {
        id: "devops-engineer",
        title: "DevOps Engineer",
        icon: Settings,
        description: "Manage infrastructure and deployment pipelines",
    },
];

// Add this after your ROLES constant
const TEMPLATES = {
    minimal: MinimalTemplate,
    modern: ModernTemplate
} as const;

// General questions for all roles
const GENERAL_QUESTIONS = [
    "What's your full name?",
    "What's your email address and phone number?",
    "What's your location (City, State/Country)?",
    "Tell me about your educational background (degrees, institutions, years).",
    "What are your top 3 soft skills?",
    "List any certifications or awards you've received.",
    "What's your LinkedIn profile URL?",
];

// Role-specific questions
const ROLE_SPECIFIC_QUESTIONS = {
    "software-engineer": [
        "What programming languages are you most proficient in? List them in order of expertise.",
        "Describe your experience with software development frameworks and tools.",
        "Share details about a challenging technical project you led or contributed to significantly.",
        "What's your experience with testing and CI/CD practices?",
        "Describe your experience with code review and collaboration tools.",
        "Tell me about your notable projects. Include project names, technologies used, and key achievements. Format: Project Name (Year)\n• Key achievement\n• Technologies used\n• Impact or results",
    ],
    "product-manager": [
        "What's your experience with product lifecycle management?",
        "Describe a successful product launch you managed.",
        "What product metrics do you typically track and why?",
        "How do you prioritize features in your product roadmap?",
        "Share an example of how you've used data to make product decisions.",
        "Tell me about your most successful product initiative. Format: Product Name\n• Challenge addressed\n• Strategy implemented\n• Results achieved",
    ],
    "ux-designer": [
        "What design tools are you proficient in?",
        "Describe your user research methodology.",
        "Share a case study of a UX problem you solved.",
        "What's your approach to accessibility in design?",
        "How do you handle stakeholder feedback in your design process?",
        "Tell me about your most impactful design project. Format: Project Name\n• User problem solved\n• Design process\n• Impact metrics",
    ],
    "data-scientist": [
        "What's your experience with machine learning algorithms?",
        "Which data analysis tools and languages do you use?",
        "Describe a data project that delivered significant business impact.",
        "How do you approach data cleaning and preprocessing?",
        "Share your experience with big data technologies.",
        "Tell me about your most innovative data project. Format: Project Name\n• Problem statement\n• Methodology used\n• Results and impact",
    ],
    "devops-engineer": [
        "What's your experience with cloud platforms (AWS, Azure, GCP)?",
        "Describe your experience with containerization and orchestration.",
        "How do you approach infrastructure as code?",
        "Share your experience with monitoring and logging solutions.",
        "How do you handle security in your DevOps practices?",
        "Tell me about your most complex infrastructure project. Format: Project Name\n• Infrastructure challenge\n• Solution implemented\n• Performance improvements",
    ],
};

type Message = {
    id: string;
    content: string;
    role: "user" | "assistant";
    isEditing?: boolean;
    questionIndex?: number;
};

// type Conversation = {
//     id: string;
//     name: string;
//     active: boolean;
//     messages: Message[];
//     currentQuestion: number;
//     resumeData: Record<number, string>;
//     showPreview: boolean;
//     selectedRole?: string;
//     activeTab?: "resume" | "coverLetter" | "template";
// };
type Conversation = {
    id: string;
    name: string;
    active: boolean;
    messages: Message[];
    currentQuestion: number;
    resumeData: Record<number, string>;
    showPreview: boolean;
  
    // ✅ ADD THESE (missing earlier)
    selectedRole?: string;
    processedResume?: any;
  
    activeTab?: "resume" | "coverLetter" | "template";
  };  

interface ResumeBuilderProps {
    onBack?: () => void;
}

export default function ResumeBuilder({ onBack = () => {} }: ResumeBuilderProps) {
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: "1",
            name: "Resume Builder",
            active: true,
            messages: [],
            currentQuestion: -1,
            resumeData: {},
            showPreview: false,
            activeTab: "resume",
        },
    ]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>("minimal");
    const [resumeData, setResumeData] = useState({
        name: "",
        skills: [],
        workExperience: [
            {
                title: "",
                company: "",
                duration: "",
                description: "",
            },
        ],
        education: [
            {
                degree: "",
                institution: "",
                year: "",
            },
        ],
        certifications: [],
        projects: [],
        achievements: [],
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const activeConversation = conversations.find((c) => c.active) || conversations[0];

    const getQuestionsForRole = (roleId: string) => {
        const roleQuestions = ROLE_SPECIFIC_QUESTIONS[roleId as keyof typeof ROLE_SPECIFIC_QUESTIONS] || [];
        return [...GENERAL_QUESTIONS, ...roleQuestions];
    };

    useEffect(() => {
        if (activeConversation.messages.length === 0) {
            const roleOptions = ROLES.map(
                (role) => `${role.title}: ${role.description}`
            ).join("\n");

            updateActiveConversation((prev) => ({
                ...prev,
                messages: [
                    {
                        id: "1",
                        content:
                            "Hi! I'm your resume building assistant. First, please select your role from the following options:\n\n" +
                            roleOptions +
                            "\n\nPlease type the role title exactly as shown above.",
                        role: "assistant",
                    },
                ],
            }));
        }
    }, [activeConversation.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConversation.messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeConversation.currentQuestion]);

    const updateActiveConversation = (updater: (prev: Conversation) => Conversation) => {
        setConversations((prev) => prev.map((conv) => (conv.active ? updater(conv) : conv)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: "user",
            questionIndex: activeConversation.currentQuestion,
        };

        updateActiveConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, userMessage],
        }));

        if (!activeConversation.selectedRole) {
            const selectedRole = ROLES.find(
                (role) => role.title.toLowerCase() === input.toLowerCase()
            );

            if (selectedRole) {
                updateActiveConversation((prev) => ({
                    ...prev,
                    selectedRole: selectedRole.id,
                    currentQuestion: 0,
                    messages: [
                        ...prev.messages,
                        {
                            id: (Date.now() + 1).toString(),
                            content: `Great! You've selected ${selectedRole.title}. Let's build your resume.\n\n${getQuestionsForRole(selectedRole.id)[0]
                                }`,
                            role: "assistant",
                            questionIndex: 0,
                        },
                    ],
                }));
            } else {
                updateActiveConversation((prev) => ({
                    ...prev,
                    messages: [
                        ...prev.messages,
                        {
                            id: (Date.now() + 1).toString(),
                            content:
                                "Please select a valid role by typing the role title exactly as shown above.",
                            role: "assistant",
                        },
                    ],
                }));
            }
            setInput("");
            return;
        }

        updateActiveConversation((prev) => ({
            ...prev,
            resumeData: {
                ...prev.resumeData,
                [prev.currentQuestion]: input,
            },
        }));

        setInput("");

        const questions = getQuestionsForRole(activeConversation.selectedRole);

        if (activeConversation.currentQuestion < questions.length - 1) {
            const nextQuestion = activeConversation.currentQuestion + 1;

            updateActiveConversation((prev) => ({
                ...prev,
                currentQuestion: nextQuestion,
            }));

            setTimeout(() => {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: questions[nextQuestion],
                    role: "assistant",
                    questionIndex: nextQuestion,
                };

                updateActiveConversation((prev) => ({
                    ...prev,
                    messages: [...prev.messages, assistantMessage],
                }));
            }, 500);
        } else {
            setIsGenerating(true);
          
            try {
                const payload = {
                    role: ROLES.find(r => r.id === activeConversation.selectedRole)?.title || "Software Engineer",
                    messages: activeConversation.messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                };
                  
                const response = await fetch("http://127.0.0.1:8000/resume/from-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                  
            
          
              const data = await response.json();
          
              updateActiveConversation((prev) => ({
                ...prev,
                processedResume: data.resume, // store AI-enhanced resume
                showPreview: true,
                activeTab: "resume",
                messages: [
                  ...prev.messages,
                  {
                    id: Date.now().toString(),
                    content: "Your optimized, AI-enhanced resume has been generated!",
                    role: "assistant",
                  },
                ],
              }));
          
            } catch (err) {
              console.error("Resume generation error:", err);
            }
          
            setIsGenerating(false);
          }               
    };

    const resetChat = () => {
        updateActiveConversation((prev) => ({
            ...prev,
            messages: [],
            currentQuestion: -1,
            resumeData: {},
            showPreview: false,
            selectedRole: undefined,
            activeTab: "resume",
        }));
    };

    const startNewChat = () => {
        const newId = Date.now().toString();
        setConversations((prev) => [
            ...prev.map((conv) => ({ ...conv, active: false })),
            {
                id: newId,
                name: "New Resume",
                active: true,
                messages: [],
                currentQuestion: -1,
                resumeData: {},
                showPreview: false,
                activeTab: "resume",
            },
        ]);
    };

    const deleteChat = (id: string) => {
        if (conversations.length <= 1) return;

        const isActive = conversations.find((c) => c.id === id)?.active;

        setConversations((prev) => {
            const filtered = prev.filter((conv) => conv.id !== id);

            if (isActive && filtered.length > 0) {
                filtered[0].active = true;
            }

            return filtered;
        });
    };

    const selectChat = (id: string) => {
        setConversations((prev) => prev.map((conv) => ({ ...conv, active: conv.id === id })));
    };

    const toggleMessageEdit = (id: string) => {
        updateActiveConversation((prev) => ({
            ...prev,
            messages: prev.messages.map((msg) => (msg.id === id ? { ...msg, isEditing: !msg.isEditing } : msg)),
        }));
    };

    const updateMessage = (id: string, newContent: string) => {
        updateActiveConversation((prev) => {
            const updatedMessages = prev.messages.map((msg) => {
                if (msg.id === id) {
                    return { ...msg, content: newContent, isEditing: false };
                }
                return msg;
            });

            const updatedMsg = updatedMessages.find((m) => m.id === id);
            const updatedResumeData = { ...prev.resumeData };

            if (updatedMsg?.role === "user" && updatedMsg.questionIndex !== undefined) {
                updatedResumeData[updatedMsg.questionIndex] = newContent;
            }

            return {
                ...prev,
                messages: updatedMessages,
                resumeData: updatedResumeData,
            };
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Function to switch between resume, cover letter, and template tabs
    const switchTab = (tab: "resume" | "coverLetter" | "template") => {
        updateActiveConversation((prev) => ({
            ...prev,
            activeTab: tab,
        }));
    };

    // Format resume data for the cover letter generator
    const formatResumeData = () => {
        const questions = activeConversation.selectedRole
            ? getQuestionsForRole(activeConversation.selectedRole)
            : [];

        // Basic structure for resume data
        const formattedData = {
            name: activeConversation.resumeData[0] || "", // Assuming first question is name
            skills: [],
            workExperience: [
                {
                    title: "",
                    company: "",
                    duration: "",
                    description: "",
                },
            ],
            education: [
                {
                    degree: "",
                    institution: "",
                    year: "",
                },
            ],
            certifications: [],
            projects: [],
            achievements: [],
        };

        // Find skill-related question index and extract skills
        const skillsQuestionIndex = questions.findIndex(
            (q) => q.includes("soft skills") || q.includes("proficient in")
        );
        if (skillsQuestionIndex >= 0 && activeConversation.resumeData[skillsQuestionIndex]) {
            formattedData.skills = activeConversation.resumeData[skillsQuestionIndex]
                .split(",")
                .map((skill) => skill.trim());
        }

        // Find education-related question index
        const educationQuestionIndex = questions.findIndex((q) => q.includes("educational background"));
        if (educationQuestionIndex >= 0 && activeConversation.resumeData[educationQuestionIndex]) {
            const eduText = activeConversation.resumeData[educationQuestionIndex];
            // Simple parsing - this could be more sophisticated
            const parts = eduText.split(",");
            if (parts.length >= 2) {
                formattedData.education[0] = {
                    degree: parts[0].trim(),
                    institution: parts[1].trim(),
                    year: parts[2]?.trim() || "",
                };
            }
        }

        // Find work experience question
        const workQuestionIndex = questions.findIndex(
            (q) =>
                q.includes("challenging technical project") ||
                q.includes("successful product") ||
                q.includes("experience with")
        );

        if (workQuestionIndex >= 0 && activeConversation.resumeData[workQuestionIndex]) {
            formattedData.workExperience[0] = {
                title: ROLES.find((r) => r.id === activeConversation.selectedRole)?.title || "",
                company: "Previous Company",
                duration: "2022-2024",
                description: activeConversation.resumeData[workQuestionIndex],
            };
        }

        // Find certifications
        const certQuestionIndex = questions.findIndex((q) => q.includes("certifications"));
        if (certQuestionIndex >= 0 && activeConversation.resumeData[certQuestionIndex]) {
            formattedData.certifications = activeConversation.resumeData[certQuestionIndex]
                .split(",")
                .map((cert) => cert.trim());
        }

        return formattedData;
    };

    const handleTemplateChange = (template: keyof typeof TEMPLATES) => {
        setSelectedTemplate(template);
    };

    const handleResumeDataChange = (newData: any) => {
        setResumeData(newData);
    };

    const TemplateComponent = TEMPLATES[selectedTemplate];

    // Add this function after your existing imports
    const formatResumeDataForTemplate = (conversations: any[], selectedRole: string) => {
        const messages = conversations.filter(msg => msg.role === "user");
        
        // Find answers to specific questions
        const findAnswer = (keyword: string) => {
          const message = messages.find(msg => msg.content.toLowerCase().includes(keyword));
          return message ? message.content : '';
        };
      
        // Format contact information
        const email = findAnswer('email');
        const phone = findAnswer('phone');
        const contact = `${email}|${phone}`;
      
        return {
          name: findAnswer('name'),
          contact: contact,
          title: selectedRole ? selectedRole.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '',
          education: findAnswer('education'),
          technicalSkills: findAnswer('technical skills'),
          softSkills: findAnswer('soft skills'),
          recentExperience: findAnswer('recent experience'),
          otherExperience: findAnswer('previous experience'),
          certifications: findAnswer('certifications'),
          summary: findAnswer('summary'),
          projects: findAnswer('projects')
        };
      };

    return (
        <div className="flex h-full w-full bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
            <Sidebar
                conversations={conversations}
                onNewChat={startNewChat}
                onSelectChat={selectChat}
                onDeleteChat={deleteChat}
                visible={showSidebar}
                onToggle={() => setShowSidebar(!showSidebar)}
            />

            <div className="flex-1 flex flex-col lg:flex-row">
                <div className="flex-1 flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {activeConversation.messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    onEdit={() => toggleMessageEdit(message.id)}
                                    onSave={(content) => updateMessage(message.id, content)}
                                />
                            ))}
                            <div ref={messagesEndRef} />

                            {isGenerating && (
                                <div className="flex items-center space-x-2 text-zinc-400 p-4 rounded-lg bg-zinc-800/30 backdrop-blur-sm">
                                    <div className="animate-pulse h-2 w-2 rounded-full bg-indigo-500"></div>
                                    <div className="animate-pulse h-2 w-2 rounded-full bg-indigo-500 delay-150"></div>
                                    <div className="animate-pulse h-2 w-2 rounded-full bg-indigo-500 delay-300"></div>
                                    <span className="ml-2 text-white">Generating your resume...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                            <div className="relative">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your answer here..."
                                    className="w-full p-4 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none bg-zinc-800/50 backdrop-blur-sm border-zinc-700 text-white"
                                    rows={2}
                                    disabled={isGenerating || activeConversation.showPreview}
                                />
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isGenerating || activeConversation.showPreview}
                                    className="absolute right-2 bottom-2 bg-gradient-to-r from-indigo-500 to-amber-600 hover:from-indigo-600 hover:to-amber-700 text-white rounded-lg"
                                    size="sm"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2 text-center">Press Enter to send, Shift+Enter for a new line</p>
                        </form>
                    </div>
                </div>

                {activeConversation.showPreview && (
                    <div className="lg:w-1/2 h-full overflow-y-auto border-l border-zinc-800">
                        <div className="flex border-b border-zinc-800">
                            <button
                                className={`flex-1 py-3 px-4 ${
                                    activeConversation.activeTab === "resume"
                                        ? "bg-zinc-800 text-white"
                                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800/50"
                                }`}
                                onClick={() => switchTab("resume")}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <FileText className="h-4 w-4" />
                                    <span>Resume</span>
                                </div>
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 ${
                                    activeConversation.activeTab === "coverLetter"
                                        ? "bg-zinc-800 text-white"
                                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800/50"
                                }`}
                                onClick={() => switchTab("coverLetter")}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <FileCode className="h-4 w-4" />
                                    <span>Cover Letter</span>
                                </div>
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 ${
                                    activeConversation.activeTab === "template"
                                        ? "bg-zinc-800 text-white"
                                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800/50"
                                }`}
                                onClick={() => switchTab("template")}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <File className="h-4 w-4" />
                                    <span>Template</span>
                                </div>
                            </button>
                        </div>

                        <div className="p-6">
                            {activeConversation.activeTab === "resume" ? (
                                <ResumePreview
                                    resumeText={activeConversation.processedResume}
                                />
                            ) : activeConversation.activeTab === "coverLetter" ? (
                                <div className="bg-zinc-800/50 rounded-lg p-6">
                                    <h2 className="text-xl font-bold mb-4 text-white">Cover Letter Generator</h2>
                                    <CoverLetterGenerator resumeData={formatResumeData()} />
                                </div>
                            ) : (
                                <div className="bg-zinc-800/50 rounded-lg p-6">
                                    <h2 className="text-xl font-bold mb-4 text-white">Select a Template</h2>
                                    <TemplateSelection
                                        selectedTemplate={selectedTemplate}
                                        onTemplateChange={(template) => handleTemplateChange(template as keyof typeof TEMPLATES)}
                                    />
                                    <div id="resume-preview" className="border p-4 mt-4 bg-white shadow">
                                        <TemplateComponent 
                                            resumeData={formatResumeDataForTemplate(
                                                activeConversation.messages,
                                                activeConversation.selectedRole
                                            )} 
                                        />
                                    </div>
                                    <PDFButton 
                                        resumeData={formatResumeDataForTemplate(
                                            activeConversation.messages,
                                            activeConversation.selectedRole
                                        )} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}