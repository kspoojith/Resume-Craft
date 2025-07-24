import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Resume {
  _id: string;
  title: string;
  latexCode: string;
  pdfUrl?: string;
}

interface AnalysisResult {
  atsScore: number;
  suggestedJobs: string[];
  keywords: string[];
  summary: string;
}

export default function Analyzer() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's resumes
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/resumes", { withCredentials: true })
      .then((res) => setResumes(res.data))
      .catch(() => setResumes([]));
  }, []);

  const handleAnalyze = async () => {
    if (!selectedResume) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/analyze",
        { latexCode: selectedResume.latexCode, title: selectedResume.title },
        { withCredentials: true }
      );
      setResult(response.data);
    } catch (err: any) {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist dark:bg-charcoal">
      {/* Header */}
      <div className="bg-porcelain dark:bg-graphite border-b border-fog dark:border-ash/20">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-violet rounded"></div>
            <span className="text-lg font-heading font-bold text-ink dark:text-ash">
              ResumeCraft
            </span>
          </Link>
          <span className="text-xl font-bold text-violet">Resume Analyzer</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-ink dark:text-ash">Select a Resume to Analyze</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {resumes.length === 0 && (
            <div className="col-span-2 text-center text-slate dark:text-ash/70">
              No resumes found. <Link to="/dashboard" className="text-violet underline">Create one</Link>
            </div>
          )}
          {resumes.map((resume) => (
            <button
              key={resume._id}
              onClick={() => setSelectedResume(resume)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedResume?._id === resume._id
                  ? "border-violet bg-violet/10 dark:bg-violet/20"
                  : "border-fog dark:border-ash/20 hover:border-violet"
              }`}
            >
              <div className="font-bold text-lg text-ink dark:text-ash">{resume.title}</div>
              <div className="text-xs text-slate dark:text-ash/70 mt-1 truncate">
                {resume.latexCode.slice(0, 80)}...
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!selectedResume || analyzing}
          className="w-full bg-violet text-porcelain px-4 py-3 rounded-lg font-semibold hover:bg-violet-hover transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {analyzing ? "Analyzing..." : "Analyze Resume"}
        </button>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        )}

        {result && (
          <div className="bg-porcelain dark:bg-graphite rounded-lg shadow-lg p-6 border border-fog dark:border-ash/20">
            <h3 className="text-xl font-bold mb-4 text-violet">Analysis Results</h3>
            <div className="mb-4">
              <span className="font-semibold">ATS Score:</span>{" "}
              <span className="text-lg font-bold text-green-600">{result.atsScore}/100</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Summary:</span>
              <div className="mt-1 text-slate dark:text-ash/80">{result.summary}</div>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Recommended Jobs:</span>
              <ul className="list-disc ml-6 mt-1">
                {result.suggestedJobs.map((job, idx) => (
                  <li key={idx}>{job}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Keywords to Improve:</span>
              <ul className="list-disc ml-6 mt-1">
                {result.keywords.map((kw, idx) => (
                  <li key={idx}>{kw}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}