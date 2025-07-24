import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  linkedIn: string;
  portfolio: string;
  summary: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa: string;
  relevantCourses: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  tags: string[];
  isPremium: boolean;
}

interface FormData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
  awards: string[];
  selectedTemplate?: Template;
}

// Mock existing resumes for demonstration
const mockExistingResumes = [
  {
    id: 1,
    title: "Software Engineer Resume",
    lastModified: "2 hours ago",
    template: "Modern",
  },
  {
    id: 2,
    title: "Product Manager CV",
    lastModified: "1 day ago",
    template: "Professional",
  },
  {
    id: 3,
    title: "Marketing Specialist",
    lastModified: "3 days ago",
    template: "Creative",
  },
];

const mockTemplates: Template[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description:
      "Clean, minimalist design perfect for tech and creative industries",
    category: "Professional",
    preview: "/api/templates/modern/preview.jpg",
    tags: ["Clean", "Minimalist", "ATS-Friendly"],
    isPremium: false,
  },
  {
    id: "classic",
    name: "Classic Executive",
    description:
      "Traditional format ideal for corporate and executive positions",
    category: "Corporate",
    preview: "/api/templates/classic/preview.jpg",
    tags: ["Traditional", "Corporate", "Professional"],
    isPremium: false,
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    description:
      "Vibrant design showcasing creativity for designers and artists",
    category: "Creative",
    preview: "/api/templates/creative/preview.jpg",
    tags: ["Creative", "Colorful", "Portfolio"],
    isPremium: true,
  },
  {
    id: "technical",
    name: "Technical Expert",
    description:
      "Code-focused layout highlighting technical skills and projects",
    category: "Technical",
    preview: "/api/templates/technical/preview.jpg",
    tags: ["Technical", "Code", "Projects"],
    isPremium: false,
  },
  {
    id: "academic",
    name: "Academic Research",
    description:
      "Research-oriented format for academic and scientific positions",
    category: "Academic",
    preview: "/api/templates/academic/preview.jpg",
    tags: ["Academic", "Research", "Publications"],
    isPremium: true,
  },
  {
    id: "startup",
    name: "Startup Innovator",
    description: "Dynamic design for entrepreneurs and startup professionals",
    category: "Startup",
    preview: "/api/templates/startup/preview.jpg",
    tags: ["Dynamic", "Innovation", "Startup"],
    isPremium: true,
  },
];

// Mock LinkedIn data extraction
const mockLinkedInData: FormData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    linkedIn: "linkedin.com/in/johndoe",
    portfolio: "johndoe.dev",
    summary:
      "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.",
  },
  experiences: [
    {
      id: "1",
      jobTitle: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description:
        "Lead development of microservices architecture serving 1M+ users. Built React applications with TypeScript and integrated with AWS services. Mentored junior developers and improved team productivity by 30%.",
    },
    {
      id: "2",
      jobTitle: "Software Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      startDate: "2020-06",
      endDate: "2021-12",
      current: false,
      description:
        "Developed full-stack web applications using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines and reduced deployment time by 50%. Collaborated with cross-functional teams in agile environment.",
    },
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      graduationDate: "2020-05",
      gpa: "3.8",
      relevantCourses:
        "Data Structures, Algorithms, Software Engineering, Database Systems, Machine Learning",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "Agile",
    "Team Leadership",
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description:
        "Built a full-stack e-commerce platform with React, Node.js, and Stripe integration. Implemented features like product catalog, shopping cart, payment processing, and admin dashboard.",
      technologies: "React, Node.js, Express, MongoDB, Stripe, AWS",
      link: "https://github.com/johndoe/ecommerce-platform",
    },
  ],
  certifications: [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional Developer",
  ],
  awards: [
    "Employee of the Month - Tech Corp (2023)",
    "Best Hackathon Project - StartupXYZ (2021)",
  ],
};

const steps = [
  { id: 0, name: "Get Started", description: "Choose how to begin" },
  { id: 1, name: "Personal Info", description: "Basic information" },
  { id: 2, name: "Experience", description: "Work history" },
  { id: 3, name: "Education", description: "Academic background" },
  { id: 4, name: "Skills", description: "Technical & soft skills" },
  { id: 5, name: "Projects", description: "Notable projects" },
  { id: 6, name: "Additional", description: "Certifications & awards" },
  { id: 7, name: "Template", description: "Choose design & finish" },
];

export default function FormWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      linkedIn: "",
      portfolio: "",
      summary: "",
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    awards: [],
    selectedTemplate: undefined,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      // Simulate file processing
      setTimeout(() => {
        // Mock extracted data from resume file
        const extractedData: Partial<FormData> = {
          personalInfo: {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@email.com",
            phone: "(555) 987-6543",
            address: "456 Oak Avenue",
            city: "Seattle",
            state: "WA",
            zipCode: "98101",
            linkedIn: "",
            portfolio: "",
            summary:
              "Marketing professional with 3+ years of experience in digital marketing and brand management.",
          },
          experiences: [
            {
              id: "1",
              jobTitle: "Marketing Specialist",
              company: "Digital Agency",
              location: "Seattle, WA",
              startDate: "2021-03",
              endDate: "",
              current: true,
              description:
                "Managed social media campaigns, increased engagement by 40%, and coordinated with design team for brand assets.",
            },
          ],
          skills: [
            "Digital Marketing",
            "Social Media",
            "Content Creation",
            "Analytics",
            "Adobe Creative Suite",
          ],
        };

        setFormData((prev) => ({
          ...prev,
          ...extractedData,
          personalInfo: { ...prev.personalInfo, ...extractedData.personalInfo },
          experiences: extractedData.experiences || [],
          skills: extractedData.skills || [],
        }));
        setIsProcessing(false);
        setShowResumeModal(false);
        setCurrentStep(1);
      }, 2000);
    }
  };

  const handleLinkedInConnect = () => {
    setIsProcessing(true);
    // Simulate LinkedIn API call
    setTimeout(() => {
      setFormData(mockLinkedInData);
      setIsProcessing(false);
      setShowLinkedInModal(false);
      setCurrentStep(1);
    }, 3000);
  };

  const handleExistingResume = (resumeId: number) => {
    setIsProcessing(true);
    // Simulate loading existing resume data
    setTimeout(() => {
      // Mock data based on selected resume
      const resumeData: Partial<FormData> = {
        personalInfo: {
          firstName: "Alex",
          lastName: "Johnson",
          email: "alex.johnson@email.com",
          phone: "(555) 456-7890",
          address: "789 Pine Street",
          city: "Austin",
          state: "TX",
          zipCode: "73301",
          linkedIn: "linkedin.com/in/alexjohnson",
          portfolio: "alexjohnson.com",
          summary:
            "Full-stack developer with expertise in modern web technologies and cloud infrastructure.",
        },
        experiences: [
          {
            id: "1",
            jobTitle: "Full Stack Developer",
            company: "Tech Solutions Inc",
            location: "Austin, TX",
            startDate: "2021-08",
            endDate: "",
            current: true,
            description:
              "Developed and maintained web applications using React, Node.js, and AWS. Collaborated with product team to deliver features on time.",
          },
        ],
        skills: [
          "React",
          "Node.js",
          "AWS",
          "TypeScript",
          "MongoDB",
          "REST APIs",
        ],
      };

      setFormData((prev) => ({
        ...prev,
        ...resumeData,
        personalInfo: { ...prev.personalInfo, ...resumeData.personalInfo },
        experiences: resumeData.experiences || [],
        skills: resumeData.skills || [],
      }));
      setIsProcessing(false);
      setShowResumeModal(false);
      setCurrentStep(1);
    }, 1500);
  };

  const generateLatex = (data: FormData): string => {
    const {
      personalInfo,
      experiences,
      education,
      skills,
      projects,
      certifications,
      awards,
    } = data;

    let latex = `\\documentclass[letterpaper,11pt]{article}
\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}

% Custom colors
\\definecolor{headercolor}{RGB}{0,153,99}

% Section formatting
\\titleformat{\\section}{\\Large\\bfseries\\color{headercolor}}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{0.5\\baselineskip}{0.3\\baselineskip}

\\begin{document}

% Header
\\begin{center}
{\\Huge\\bfseries ${personalInfo.firstName} ${personalInfo.lastName}} \\\\[0.5em]
${personalInfo.email} $\\cdot$ ${personalInfo.phone} \\\\
${personalInfo.address}, ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode} \\\\`;

    if (personalInfo.linkedIn) {
      latex += `LinkedIn: ${personalInfo.linkedIn} `;
    }
    if (personalInfo.portfolio) {
      latex += `$\\cdot$ Portfolio: ${personalInfo.portfolio}`;
    }

    latex += `
\\end{center}

`;

    // Professional Summary
    if (personalInfo.summary) {
      latex += `\\section{Professional Summary}
${personalInfo.summary}

`;
    }

    // Experience
    if (experiences.length > 0) {
      latex += `\\section{Experience}
`;
      experiences.forEach((exp) => {
        latex += `\\textbf{${exp.jobTitle}} \\hfill ${exp.startDate} -- ${exp.current ? "Present" : exp.endDate} \\\\
\\textit{${exp.company}, ${exp.location}} \\\\[0.5em]
${exp.description}

`;
      });
    }

    // Education
    if (education.length > 0) {
      latex += `\\section{Education}
`;
      education.forEach((edu) => {
        latex += `\\textbf{${edu.degree}} \\hfill ${edu.graduationDate} \\\\
\\textit{${edu.institution}, ${edu.location}}`;
        if (edu.gpa) {
          latex += ` \\\\
GPA: ${edu.gpa}`;
        }
        if (edu.relevantCourses) {
          latex += ` \\\\
Relevant Coursework: ${edu.relevantCourses}`;
        }
        latex += `

`;
      });
    }

    // Skills
    if (skills.length > 0) {
      latex += `\\section{Skills}
${skills.join(", ")}

`;
    }

    // Projects
    if (projects.length > 0) {
      latex += `\\section{Projects}
`;
      projects.forEach((project) => {
        latex += `\\textbf{${project.name}}`;
        if (project.link) {
          latex += ` -- ${project.link}`;
        }
        latex += ` \\\\
${project.description} \\\\
Technologies: ${project.technologies}

`;
      });
    }

    // Certifications
    if (certifications.length > 0) {
      latex += `\\section{Certifications}
\\begin{itemize}[noitemsep]
`;
      certifications.forEach((cert) => {
        latex += `\\item ${cert}
`;
      });
      latex += `\\end{itemize}

`;
    }

    // Awards
    if (awards.length > 0) {
      latex += `\\section{Awards \\& Achievements}
\\begin{itemize}[noitemsep]
`;
      awards.forEach((award) => {
        latex += `\\item ${award}
`;
      });
      latex += `\\end{itemize}

`;
    }

    latex += `\\end{document}`;
    return latex;
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate LaTeX and navigate to builder
      const latexCode = generateLatex(formData);
      navigate("/builder", { state: { latexCode } });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setFormData({
      ...formData,
      experiences: [...formData.experiences, newExp],
    });
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: any,
  ) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    });
  };

  const removeExperience = (id: string) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
      relevantCourses: "",
    };
    setFormData({
      ...formData,
      education: [...formData.education, newEdu],
    });
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string,
  ) => {
    setFormData({
      ...formData,
      education: formData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    });
  };

  const removeEducation = (id: string) => {
    setFormData({
      ...formData,
      education: formData.education.filter((edu) => edu.id !== id),
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
    };
    setFormData({
      ...formData,
      projects: [...formData.projects, newProject],
    });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project,
      ),
    });
  };

  const removeProject = (id: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((project) => project.id !== id),
    });
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            First Name *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo.firstName}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  firstName: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Last Name *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo.lastName}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  lastName: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.personalInfo.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  email: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="john.doe@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.personalInfo.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  phone: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Address
        </label>
        <input
          type="text"
          value={formData.personalInfo.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              personalInfo: {
                ...formData.personalInfo,
                address: e.target.value,
              },
            })
          }
          className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            City
          </label>
          <input
            type="text"
            value={formData.personalInfo.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  city: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="New York"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            State
          </label>
          <input
            type="text"
            value={formData.personalInfo.state}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  state: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="NY"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            value={formData.personalInfo.zipCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  zipCode: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="10001"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.personalInfo.linkedIn}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  linkedIn: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Portfolio Website
          </label>
          <input
            type="url"
            value={formData.personalInfo.portfolio}
            onChange={(e) =>
              setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  portfolio: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            placeholder="johndoe.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Professional Summary
        </label>
        <textarea
          rows={4}
          value={formData.personalInfo.summary}
          onChange={(e) =>
            setFormData({
              ...formData,
              personalInfo: {
                ...formData.personalInfo,
                summary: e.target.value,
              },
            })
          }
          className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
          placeholder="Brief professional summary highlighting your key strengths and career objectives..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-ink">Work Experience</h3>
        <button
          onClick={addExperience}
          className="bg-violet text-white px-4 py-2 rounded-lg hover:bg-violet-hover transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Experience</span>
        </button>
      </div>

      {formData.experiences.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
            />
          </svg>
          <p className="text-slate">
            No work experience added yet. Click "Add Experience" to get started.
          </p>
        </div>
      ) : (
        formData.experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="bg-white border border-fog rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-ink">
                Experience #{index + 1}
              </h4>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={exp.jobTitle}
                  onChange={(e) =>
                    updateExperience(exp.id, "jobTitle", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="Tech Company Inc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, "location", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="New York, NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(exp.id, "startDate", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperience(exp.id, "endDate", e.target.value)
                  }
                  disabled={exp.current}
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    updateExperience(exp.id, "current", e.target.checked)
                  }
                  className="h-4 w-4 text-green-primary focus:ring-violet border-fog rounded"
                />
                <span className="ml-2 text-sm text-ink">
                  I currently work here
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Job Description
              </label>
              <textarea
                rows={4}
                value={exp.description}
                onChange={(e) =>
                  updateExperience(exp.id, "description", e.target.value)
                }
                className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                placeholder="Describe your responsibilities, achievements, and key contributions..."
              />
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-ink">Education</h3>
        <button
          onClick={addEducation}
          className="bg-violet text-white px-4 py-2 rounded-lg hover:bg-violet-hover transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Education</span>
        </button>
      </div>

      {formData.education.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
          <p className="text-slate">
            No education added yet. Click "Add Education" to get started.
          </p>
        </div>
      ) : (
        formData.education.map((edu, index) => (
          <div
            key={edu.id}
            className="bg-white border border-fog rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-ink">Education #{index + 1}</h4>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, "degree", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, "institution", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="University of Technology"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) =>
                    updateEducation(edu.id, "location", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="Boston, MA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Graduation Date
                </label>
                <input
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) =>
                    updateEducation(edu.id, "graduationDate", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  GPA (Optional)
                </label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) =>
                    updateEducation(edu.id, "gpa", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Relevant Coursework (Optional)
              </label>
              <textarea
                rows={2}
                value={edu.relevantCourses}
                onChange={(e) =>
                  updateEducation(edu.id, "relevantCourses", e.target.value)
                }
                className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                placeholder="Data Structures, Algorithms, Software Engineering, Database Systems..."
              />
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Skills (one per line)
        </label>
        <textarea
          rows={8}
          value={formData.skills.join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              skills: e.target.value
                .split("\n")
                .filter((skill) => skill.trim() !== ""),
            })
          }
          className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
          placeholder="JavaScript&#10;React&#10;Node.js&#10;Python&#10;SQL&#10;Git&#10;AWS&#10;Communication&#10;Problem Solving&#10;Team Leadership"
        />
        <p className="text-sm text-slate mt-2">
          Enter each skill on a new line. Include both technical and soft
          skills.
        </p>
      </div>

      {formData.skills.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-ink mb-3">Preview:</h4>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-green-secondary text-green-primary px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-ink">Projects</h3>
        <button
          onClick={addProject}
          className="bg-violet text-white px-4 py-2 rounded-lg hover:bg-violet-hover transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Project</span>
        </button>
      </div>

      {formData.projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-slate">
            No projects added yet. Click "Add Project" to showcase your work.
          </p>
        </div>
      ) : (
        formData.projects.map((project, index) => (
          <div
            key={project.id}
            className="bg-white border border-fog rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-ink">Project #{index + 1}</h4>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) =>
                    updateProject(project.id, "name", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="E-commerce Platform"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Project Link (Optional)
                </label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) =>
                    updateProject(project.id, "link", e.target.value)
                  }
                  className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-ink mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) =>
                  updateProject(project.id, "technologies", e.target.value)
                }
                className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                placeholder="React, Node.js, MongoDB, AWS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Project Description
              </label>
              <textarea
                rows={4}
                value={project.description}
                onChange={(e) =>
                  updateProject(project.id, "description", e.target.value)
                }
                className="w-full px-3 py-2.5 sm:py-2 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                placeholder="Describe the project, your role, key features, and impact..."
              />
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderAdditional = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-ink mb-4">Certifications</h3>
        <textarea
          rows={6}
          value={formData.certifications.join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              certifications: e.target.value
                .split("\n")
                .filter((cert) => cert.trim() !== ""),
            })
          }
          className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
          placeholder="AWS Certified Solutions Architect&#10;Google Cloud Professional&#10;PMP Certification&#10;Scrum Master Certification"
        />
        <p className="text-sm text-slate mt-2">
          Enter each certification on a new line.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-ink mb-4">
          Awards & Achievements
        </h3>
        <textarea
          rows={6}
          value={formData.awards.join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              awards: e.target.value
                .split("\n")
                .filter((award) => award.trim() !== ""),
            })
          }
          className="w-full px-4 py-3 border border-fog rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
          placeholder="Employee of the Month - January 2024&#10;Best Innovation Award - Tech Conference 2023&#10;Dean's List - Fall 2022&#10;Hackathon Winner - CodeFest 2023"
        />
        <p className="text-sm text-slate mt-2">
          Enter each award or achievement on a new line.
        </p>
      </div>
    </div>
  );

  const renderGetStarted = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-heading font-semibold text-ink mb-4">
          How would you like to start building your resume?
        </h3>
        <p className="text-slate font-body">
          Choose one of the options below to get started quickly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fill with Resume Option */}
        <div
          onClick={() => setShowResumeModal(true)}
          className="bg-porcelain-light border-2 border-fog rounded-xl p-6 hover:border-accent hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-violet/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-violet/20 transition-colors duration-200">
              <svg
                className="w-8 h-8 text-violet"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-heading font-semibold text-ink mb-2">
              Fill with Resume
            </h4>
            <p className="text-sm text-slate font-body mb-4">
              Import information from an existing resume or upload a resume file
            </p>
            <div className="text-violet font-medium text-sm font-body">
              Use existing or upload file →
            </div>
          </div>
        </div>

        {/* Fill with LinkedIn Option */}
        <div
          onClick={() => setShowLinkedInModal(true)}
          className="bg-porcelain-light border-2 border-fog rounded-xl p-6 hover:border-accent hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-violet/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-violet/20 transition-colors duration-200">
              <svg
                className="w-8 h-8 text-violet"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <h4 className="text-lg font-heading font-semibold text-ink mb-2">
              Fill with LinkedIn
            </h4>
            <p className="text-sm text-slate font-body mb-4">
              Automatically extract your professional information from LinkedIn
            </p>
            <div className="text-violet font-medium text-sm font-body">
              Connect LinkedIn profile →
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Option */}
      <div className="text-center pt-6 border-t border-fog">
        <button
          onClick={() => setCurrentStep(1)}
          className="text-slate hover:text-violet transition-colors duration-200 font-body"
        >
          Or start from scratch manually
        </button>
      </div>
    </div>
  );

  const renderTemplateSelection = () => {
    const handleTemplateSelect = (template: Template) => {
      setFormData((prev) => ({
        ...prev,
        selectedTemplate: template,
      }));
    };

    const handleBuildFromScratch = () => {
      setFormData((prev) => ({
        ...prev,
        selectedTemplate: {
          id: "scratch",
          name: "Build from Scratch",
          description: "Start with a blank template and customize everything",
          category: "Custom",
          preview: "",
          tags: ["Custom", "Blank"],
          isPremium: false,
        },
      }));
    };

    return (
      <div className="space-y-8">
        {/* Template Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Build from Scratch Option */}
          <div
            onClick={handleBuildFromScratch}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              formData.selectedTemplate?.id === "scratch"
                ? "border-violet bg-violet/5 dark:bg-violet/10"
                : "border-fog dark:border-ash/20 hover:border-violet/50 bg-porcelain dark:bg-charcoal"
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-violet/10 dark:bg-violet/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-violet"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-semibold text-ink dark:text-ash mb-2">
                Build from Scratch
              </h3>
              <p className="text-sm text-slate dark:text-ash/80 font-body">
                Start with a blank canvas and create your own custom design
              </p>
              {formData.selectedTemplate?.id === "scratch" && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="bg-violet text-porcelain px-3 py-1 rounded-full text-xs font-medium">
                    Selected
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Library */}
          <div className="p-6 rounded-xl border-2 border-fog dark:border-ash/20 bg-porcelain dark:bg-charcoal">
            <div className="text-center">
              <div className="w-16 h-16 bg-violet/10 dark:bg-violet/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-violet"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-semibold text-ink dark:text-ash mb-2">
                Choose a Template
              </h3>
              <p className="text-sm text-slate dark:text-ash/80 font-body">
                Select from our professionally designed templates
              </p>
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div>
          <h3 className="text-xl font-heading font-semibold text-ink dark:text-ash mb-6">
            Professional Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  formData.selectedTemplate?.id === template.id
                    ? "border-violet bg-violet/5 dark:bg-violet/10 shadow-lg"
                    : "border-fog dark:border-ash/20 hover:border-violet/50 hover:shadow-md"
                }`}
              >
                {/* Template Preview */}
                <div className="aspect-[3/4] bg-mist dark:bg-charcoal flex items-center justify-center relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-violet/20 to-violet/5 dark:from-violet/30 dark:to-violet/10 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 text-violet/60 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-xs text-violet/70 font-body">
                        Preview
                      </p>
                    </div>
                  </div>
                  {template.isPremium && (
                    <div className="absolute top-2 right-2 bg-violet text-porcelain px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </div>
                  )}
                  {formData.selectedTemplate?.id === template.id && (
                    <div className="absolute inset-0 bg-violet/20 flex items-center justify-center">
                      <div className="bg-violet text-porcelain p-2 rounded-full">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-heading font-semibold text-ink dark:text-ash group-hover:text-violet transition-colors duration-200">
                      {template.name}
                    </h4>
                    <span className="text-xs text-slate dark:text-ash/70 bg-mist dark:bg-graphite px-2 py-1 rounded font-body">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate dark:text-ash/80 mb-3 font-body">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-violet bg-violet/10 dark:bg-violet/20 px-2 py-1 rounded-full font-body"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {formData.selectedTemplate && (
          <div className="mt-8 p-4 bg-violet/10 dark:bg-violet/20 rounded-xl border border-violet/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-violet rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-porcelain"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-ink dark:text-ash">
                  {formData.selectedTemplate.name} Selected
                </h4>
                <p className="text-sm text-slate dark:text-ash/80 font-body">
                  {formData.selectedTemplate.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderGetStarted();
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderExperience();
      case 3:
        return renderEducation();
      case 4:
        return renderSkills();
      case 5:
        return renderProjects();
      case 6:
        return renderAdditional();
      case 7:
        return renderTemplateSelection();
      default:
        return renderGetStarted();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true; // Get Started step is always valid
      case 1:
        return (
          formData.personalInfo.firstName &&
          formData.personalInfo.lastName &&
          formData.personalInfo.email &&
          formData.personalInfo.phone
        );
      case 2:
        return true; // Experience is optional
      case 3:
        return true; // Education is optional
      case 4:
        return true; // Skills is optional
      case 5:
        return true; // Projects is optional
      case 6:
        return true; // Additional is optional
      case 7:
        return formData.selectedTemplate !== undefined; // Template selection is required
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-mist dark:bg-charcoal">
      {/* Header */}
      <div className="bg-porcelain dark:bg-graphite border-b border-fog dark:border-ash/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-violet rounded"></div>
              <span className="text-xl font-heading font-bold text-ink dark:text-ash">
                ResumeCraft
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-slate dark:text-ash/80 font-body">
                Resume Builder Wizard
              </span>
              <Link
                to="/dashboard"
                className="text-violet hover:text-violet-hover font-medium transition-colors duration-200 font-body"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-full">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-violet border-violet text-porcelain"
                      : "border-fog dark:border-ash/20 text-slate dark:text-ash/80"
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : step.id === 0 ? (
                    "🚀"
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-4 hidden sm:block">
                  <div
                    className={`text-sm font-medium font-body ${currentStep >= step.id ? "text-violet" : "text-slate dark:text-ash/80"}`}
                  >
                    {step.name}
                  </div>
                  <div className="text-xs text-slate dark:text-ash/70 font-body">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 sm:mx-8">
                    <div
                      className={`h-0.5 ${currentStep > step.id ? "bg-violet" : "bg-fog dark:bg-ash/20"}`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-porcelain dark:bg-graphite rounded-xl shadow-lg dark:shadow-xl dark:shadow-black/20 p-6 sm:p-8 border border-transparent dark:border-ash/20">
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-ink dark:text-ash mb-2">
              {steps[currentStep].name}
            </h2>
            <p className="text-slate dark:text-ash/80 font-body">
              {steps[currentStep].description}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-fog">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-fog text-ink rounded-lg hover:bg-mist disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-body"
            >
              Previous
            </button>

            <div className="text-sm text-slate font-body">
              Step {currentStep + 1} of {steps.length}
            </div>

            {currentStep === 0 ? (
              <div></div>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-3 bg-violet text-porcelain rounded-lg hover:bg-violet-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold font-body"
              >
                {currentStep === steps.length - 1 ? "Generate Resume" : "Next"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-porcelain rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading font-semibold text-ink">
                  Fill with Resume
                </h3>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="text-slate hover:text-ink transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Existing Resumes */}
                <div>
                  <h4 className="text-lg font-heading font-medium text-ink mb-4">
                    Use Existing Resume
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {mockExistingResumes.map((resume) => (
                      <div
                        key={resume.id}
                        onClick={() => handleExistingResume(resume.id)}
                        className="bg-porcelain-light border border-fog rounded-lg p-4 hover:border-accent hover:shadow-md transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-heading font-medium text-ink group-hover:text-violet transition-colors duration-200">
                              {resume.title}
                            </h5>
                            <p className="text-sm text-slate font-body">
                              Last modified: {resume.lastModified}
                            </p>
                            <p className="text-xs text-slate font-body">
                              Template: {resume.template}
                            </p>
                          </div>
                          <svg
                            className="w-5 h-5 text-slate group-hover:text-violet transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Resume */}
                <div className="border-t border-fog pt-6">
                  <h4 className="text-lg font-heading font-medium text-ink mb-4">
                    Upload Resume File
                  </h4>
                  <div className="border-2 border-dashed border-fog rounded-lg p-8 text-center hover:border-accent transition-colors duration-200">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <svg
                        className="w-12 h-12 text-slate mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-ink font-heading font-medium mb-2">
                        Upload Resume File
                      </p>
                      <p className="text-sm text-slate font-body">
                        Supports PDF, DOC, DOCX files
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {isProcessing && (
                <div className="mt-6 bg-violet/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
                    <span className="text-violet font-body">
                      Processing your resume...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Modal */}
      {showLinkedInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-porcelain rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading font-semibold text-ink">
                  Connect LinkedIn
                </h3>
                <button
                  onClick={() => setShowLinkedInModal(false)}
                  className="text-slate hover:text-ink transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>

                <div>
                  <p className="text-ink font-heading font-medium mb-2">
                    Import from LinkedIn
                  </p>
                  <p className="text-sm text-slate font-body">
                    Connect your LinkedIn profile to automatically import your
                    professional information
                  </p>
                </div>

                <button
                  onClick={handleLinkedInConnect}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold font-body flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>Connect with LinkedIn</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-slate font-body">
                  We'll only access your public profile information
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
