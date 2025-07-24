import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { usePrompt } from "../utils/usePrompt"; // adjust path as needed

export default function Builder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { template, texContent, clsContent, uuid: passedUuid, resumeId } = location.state || {};
  const [uuid] = useState(passedUuid || template?._id || template?.uuid);

  const [activeFile, setActiveFile] = useState<"tex" | "cls">("tex");
  const [tex, setTex] = useState(texContent ?? "");
  const [cls, setCls] = useState(clsContent ?? "");
  // Show .cls tab if the template has a clsFile, or if cls content is present
  const hasCls = !!cls || !!template?.clsFile;

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumeTitle, setResumeTitle] = useState(() => {
    // Use a random default title if none provided
    return (
      texContent?.split('\n').find(line => line.startsWith('\\title{'))?.replace(/\\title\{|\}/g, '').trim() ||
      `Resume ${Math.floor(Math.random() * 10000)}`
    );
  });
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsDirty(true);
    if (activeFile === "tex") setTex(e.target.value);
    else setCls(e.target.value);
  };

  usePrompt("You have unsaved changes. Are you sure you want to leave without saving?", isDirty);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Load resume data if resumeId is provided
  useEffect(() => {
    const loadResume = async () => {
      if (resumeId) {
        try {
          const response = await axios.get(`https://resume-craft-cswr.onrender.com/api/resumes/${resumeId}`, {
            withCredentials: true  // Add this line to include cookies
          });
          const resume = response.data;
          
          setTex(resume.latexCode || "");
          setCls(resume.clsCode || "");
          setResumeTitle(resume.title || "Untitled Resume");
          
          // If there's compilation data, try to load the PDF
          if (resume.compilationData?.pdfUrl) {
            setPdfUrl(`https://resume-craft-cswr.onrender.com${resume.compilationData.pdfUrl}`);
          }
        } catch (error) {
          console.error("Error loading resume:", error);
        }
      } else {
        // Check if LaTeX content was passed from FormWizard
        if (location.state?.texContent) {
          setTex(location.state.texContent);
        } else {
          // Default LaTeX content
          setTex(`% Your LaTeX resume content will go here
\\documentclass{article}
\\begin{document}
\\title{Your Name}
\\author{Software Engineer}
\\date{}
\\maketitle

\\section{Experience}
% Add your experience here

\\section{Education}
% Add your education here

\\end{document}`);
        }
      }
    };

    loadResume();
  }, [resumeId, location.state]);

  useEffect(() => {
    setCls(clsContent ?? "");
  }, [clsContent]);

  const handleGeneratePreview = async () => {
    const hasCustomFiles = !!texContent || !!clsContent;

    setLoading(true);

    try {
      console.log("📤 Uploading custom files:", {
        uuid,
        hasTex: !!texContent,
        hasCls: !!clsContent,
      });

      if (hasCustomFiles) {
        const formData = new FormData();
        formData.append("uuid", uuid);
        formData.append("files", new Blob([tex], { type: "text/plain" }), "resume.tex");
        if (clsContent) {
          formData.append("files", new Blob([cls], { type: "text/plain" }), "resume.cls");
        }

        await axios.post("https://resume-craft-cswr.onrender.com/api/latex/upload", formData);
      }

      let filename = "resume.tex";

      console.log(" Compiling uploaded files:", {
        uuid,
        filename,
        templateId: template?._id,
      });

      const response = await axios.post(
        "https://resume-craft-cswr.onrender.com/api/latex/compile",
        {
          uuid,
          filename,
          templateId: template?._id,
        },
        {
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);

    } catch (err: any) {
      console.error("❌ Compilation failed:", err.response?.data || err.message);
      console.log(err.message);
      console.log(err.response);
      setPdfUrl(null);
      alert("Compilation failed. Check logs.");
    }

    setLoading(false);
  };

  const doSave = async () => {
    setSaving(true);
    
    try {
      const compilationData = {
        uuid,
        texFilename: "resume.tex",
        clsFilename: "resume.cls",
        pdfUrl: pdfUrl ? `/templates/uploads/${uuid}/resume.pdf` : null,
        lastCompiled: new Date()
      };

      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (resumeId) {
        // Update existing resume
        await axios.put(`https://resume-craft-cswr.onrender.com/api/resumes/${resumeId}`, {
          title: resumeTitle,
          latexCode: tex,
          clsCode: cls,
          compilationData
        }, {
          withCredentials: true  // Include cookies
        });
      } else {
        // Create new resume
        await axios.post('https://resume-craft-cswr.onrender.com/api/resumes', {
          title: resumeTitle,
          latexCode: tex,
          clsCode: cls,
          templateId: template?._id,
          source: 'template',
          compilationData
        }, {
          withCredentials: true  // Include cookies
        });
      }

      setIsDirty(false);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please try again.");
    } finally {
      setSaving(false);
      setPendingSaveData(false);
    }
  };

  const handleSaveAndExit = () => {
    if (!resumeTitle.trim()) {
      setShowTitleModal(true);
      setPendingSaveData(true);
      return;
    }
    doSave();
  };

  const handleTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeTitle.trim()) {
      alert("Title is required.");
      return;
    }
    setShowTitleModal(false);
    if (pendingSaveData) {
      await doSave(); // This time, resumeTitle is set
    }
  };

  return (
    <div className="min-h-screen bg-mist dark:bg-charcoal">
      {/* Header */}
      <div className="bg-porcelain dark:bg-graphite border-b border-fog dark:border-ash/20">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-violet rounded"></div>
              <span className="text-lg sm:text-xl font-heading font-bold text-ink dark:text-ash">
                ResumeCraft
              </span>
            </Link>
            <div className="hidden sm:block">
              <span className="text-slate dark:text-ash/80 font-body">
                Resume Builder
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <input
              type="text"
              value={resumeTitle}
              onChange={e => setResumeTitle(e.target.value)}
              className="px-2 py-1 rounded border border-fog dark:border-ash/20 text-sm font-body w-40 sm:w-64"
              placeholder="Resume Title"
            />
            <button 
              onClick={handleSaveAndExit}
              disabled={saving}
              className="bg-violet text-porcelain px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold hover:bg-violet-hover transition-colors duration-200 text-xs sm:text-sm font-body disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save & Exit"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-porcelain dark:bg-graphite border-b border-fog dark:border-ash/20">
        <div className="flex">
          <button
            onClick={() => setActiveFile("tex")}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-center font-semibold font-body text-sm ${
              activeFile === "tex"
                ? "bg-violet/10 dark:bg-violet/20 text-violet border-b-2 border-violet"
                : "text-slate dark:text-ash/80 hover:bg-mist dark:hover:bg-charcoal"
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveFile("cls")}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-center font-semibold font-body text-sm ${
              activeFile === "cls"
                ? "bg-violet/10 dark:bg-violet/20 text-violet border-b-2 border-violet"
                : "text-slate dark:text-ash/80 hover:bg-mist dark:hover:bg-charcoal"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] sm:h-[calc(100vh-128px)] lg:h-[calc(100vh-80px)]">
        {/* Left Panel: Editor */}
        <div className="w-full lg:w-1/2 flex flex-col h-[60vh] lg:h-full">
          {/* Editor takes 100% of vertical space now */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* LaTeX Editor Section */}
            <div className="flex-1 flex flex-col min-h-0 mt-3">
              
              {/* File Switcher */}
              <div className="flex gap-2 mb-2 px-3 sm:px-4">
                <button
                  className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${
                    activeFile === "tex" 
                      ? "bg-violet text-white" 
                      : "bg-fog dark:bg-charcoal text-ink dark:text-ash hover:bg-fog/80"
                  }`}
                  onClick={() => setActiveFile("tex")}
                >
                  .tex
                </button>
                {hasCls && (
                  <button
                    className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${
                      activeFile === "cls" 
                        ? "bg-violet text-white" 
                        : "bg-fog dark:bg-charcoal text-ink dark:text-ash hover:bg-fog/80"
                    }`}
                    onClick={() => setActiveFile("cls")}
                  >
                    .cls
                  </button>
                )}
              </div>

              {/* Editor */}
              <div className="flex-1 px-3 sm:px-4 pb-3 sm:pb-4">
                <textarea
                  value={activeFile === "tex" ? tex : cls}
                  onChange={handleChange}
                  className="w-full h-full min-h-[300px] p-3 sm:p-4 border border-fog dark:border-ash/20 rounded-lg resize-none font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                  placeholder="Enter your resume content in LaTeX format..."
                />
              </div>

              {/* Generate Button */}
              <div className="p-3 sm:p-4 border-t border-fog dark:border-ash/20">
                <button 
                  onClick={handleGeneratePreview} 
                  disabled={loading} 
                  className="w-full bg-violet text-porcelain px-4 py-2.5 rounded-lg font-medium hover:bg-violet-hover transition-colors duration-200 text-sm font-body disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Compiling..." : "Generate Preview"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="w-full lg:w-1/2 bg-mist dark:bg-charcoal flex flex-col">
          {/* Live Preview */}
          <div className="flex-1 p-3 sm:p-4 overflow-auto">
            {pdfUrl ? (
              <div className="bg-porcelain dark:bg-graphite rounded-lg shadow-lg dark:shadow-xl dark:shadow-black/20 h-full max-w-full mx-auto border border-fog dark:border-ash/20">
                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  className="w-full h-full rounded-lg"
                  style={{ border: "none" }}
                />
              </div>
            ) : (
              // Show basic preview when no PDF
              <div className="bg-porcelain dark:bg-graphite rounded-lg shadow-lg dark:shadow-xl dark:shadow-black/20 h-full max-w-full mx-auto border border-fog dark:border-ash/20">
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink dark:text-ash mb-2">
                      Your Name
                    </h1>
                    <p className="text-slate dark:text-ash/80 font-body">
                      Software Engineer
                    </p>
                    <div className="mt-2 text-xs sm:text-sm text-slate dark:text-ash/70 font-body">
                      <p>your.email@example.com | (555) 123-4567</p>
                      <p>LinkedIn: linkedin.com/in/yourname</p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h2 className="text-base sm:text-lg font-heading font-semibold text-ink dark:text-ash border-b border-fog dark:border-ash/20 pb-1 mb-2 sm:mb-3">
                        Experience
                      </h2>
                      <div className="text-slate dark:text-ash/80 text-xs sm:text-sm font-body">
                        <p className="italic">
                          Add your experience details in the LaTeX editor
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base sm:text-lg font-heading font-semibold text-ink dark:text-ash border-b border-fog dark:border-ash/20 pb-1 mb-2 sm:mb-3">
                        Education
                      </h2>
                      <div className="text-slate dark:text-ash/80 text-xs sm:text-sm font-body">
                        <p className="italic">
                          Add your education details in the LaTeX editor
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base sm:text-lg font-heading font-semibold text-ink dark:text-ash border-b border-fog dark:border-ash/20 pb-1 mb-2 sm:mb-3">
                        Skills
                      </h2>
                      <div className="text-slate dark:text-ash/80 text-xs sm:text-sm font-body">
                        <p className="italic">
                          Add your skills in the LaTeX editor
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTitleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            onSubmit={handleTitleSubmit}
            className="bg-porcelain dark:bg-graphite p-6 rounded-lg shadow-lg flex flex-col items-center"
            style={{ minWidth: 300 }}
          >
            <h2 className="text-lg font-bold mb-4 text-ink dark:text-ash">Enter Resume Title</h2>
            <input
              type="text"
              value={resumeTitle}
              onChange={e => setResumeTitle(e.target.value)}
              className="border border-fog dark:border-ash/20 rounded px-3 py-2 mb-4 w-full"
              placeholder="Resume Title"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-violet text-porcelain px-4 py-2 rounded hover:bg-violet-hover font-medium"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 dark:bg-gray-700 text-ink dark:text-ash px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 font-medium"
                onClick={() => setShowTitleModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
