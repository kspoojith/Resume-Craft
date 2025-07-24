import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DarkModeToggle from "../components/DarkModeToggle";

interface Template {
  _id: string;
  name: string;
  type: string;
  previewImage?: string;
  description?: string;
  texFile?: string;
  clsFile?: string;
  assets?: string[];
  isPremium?: boolean;
  createdAt?: string;
  uuid?: string;
}

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [shuffledTemplates, setShuffledTemplates] = useState<Template[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { template, texContent, clsContent } = location.state || {};

  useEffect(() => {
    axios.get("https://resume-craft-cswr.onrender.com/api/templates").then((res) => {
      setTemplates(res.data);
      setShuffledTemplates(shuffleArray(res.data));
    });
  }, []);

  const allTypes = [
    { id: "classy", name: "Classy" },
    { id: "modern", name: "Modern" },
    { id: "minimal", name: "Minimal" },
    { id: "elegant", name: "Elegant" },
    { id: "creative", name: "Creative" },
  ];

  const categoryCounts = templates.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const allCount = templates.length;
  const categories = [
    { id: "all", name: "All Templates", count: allCount },
    ...allTypes.map(type => ({
      ...type,
      count: categoryCounts[type.id] || 0,
    })),
  ];
  const filteredTemplates = selectedCategory === "all"
    ? shuffleArray(templates)
    : shuffleArray(templates.filter(t => t.type === selectedCategory));

  const handleTemplateClick = async (template: Template) => {
    let texContent = "";
    let clsContent = "";
    
    // Only fetch if the path exists
    if (template.texFile) {
      try {
        const texRes = await axios.get(`https://resume-craft-cswr.onrender.com/${template.texFile}`, { responseType: "text" });
        console.log(texRes.data);
        texContent = texRes.data;
      } catch (err) {
        console.error("Failed to fetch .tex file:", err);
        texContent = ""; // or show an error message
      }
    }
    else{
      console.log("not found tex");
    }

    if (template.clsFile) {
      try {
        const clsRes = await axios.get(`https://resume-craft-cswr.onrender.com/${template.clsFile}`, { responseType: "text" });
        console.log(clsRes);
        clsContent = clsRes.data;
      } catch (err) {
        console.error("Failed to fetch .cls file:", err);
        clsContent = ""; // or show an error message
      }
    }
    else{
      console.log("not found cls file")
    }

    navigate("/builder", {
      state: {
        template,
        texContent,
        clsContent,
        uuid: template._id || template.uuid, // pass the uuid from MongoDB
      },
    });
  };

  function getPreviewImageUrl(previewImage: string) {
    if (!previewImage) return "";
    // Remove everything before 'templates/uploads'
    const match = previewImage.match(/templates[\\/]+uploads[\\/]+.+/);
    const relativePath = match ? match[0].replace(/\\/g, "/") : "";
    return `https://resume-craft-cswr.onrender.com/${relativePath}`;
  }

  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  return (
    <div className="min-h-screen bg-mist dark:bg-charcoal">
      {/* Header */}
      <header className="bg-porcelain dark:bg-graphite border-b border-fog dark:border-ash/20">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-violet rounded"></div>
            <span className="text-lg sm:text-xl font-heading font-bold text-ink dark:text-ash">
              ResumeCraft
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <DarkModeToggle showLabels={false} />
            <Link
              to="/dashboard"
              className="text-sm text-ink dark:text-ash hover:text-violet transition-colors duration-200 font-body"
            >
              Dashboard
            </Link>
            <Link
              to="/form-wizard"
              className="bg-violet text-porcelain px-4 py-2 rounded-md hover:bg-violet-hover transition-colors duration-200 font-semibold text-sm font-body"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-ink dark:text-ash mb-4">
            Get Started With Resume Templates
          </h1>
          <p className="text-lg text-slate dark:text-ash/80 font-body max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates.
            Each template is crafted to help you stand out and get noticed by
            employers.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 ${
                selectedCategory === category.id
                  ? "bg-violet text-porcelain"
                  : "bg-porcelain dark:bg-graphite text-ink dark:text-ash hover:bg-violet/10 dark:hover:bg-violet/20 border border-fog dark:border-ash/20"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(templates || []).map((template) => (
            <div
              key={template._id}
              className="bg-porcelain dark:bg-graphite rounded-lg border border-fog dark:border-ash/20 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 group cursor-pointer"
            >
              {/* Template Preview */}
              {template.previewImage ? (
                <img
                  src={getPreviewImageUrl(template.previewImage)}
                  alt={template.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              ) : (
              <div className="aspect-[3/4] bg-gradient-to-br from-violet/5 to-violet/10 dark:from-violet/10 dark:to-violet/20 rounded-t-lg flex items-center justify-center text-6xl border-b border-fog dark:border-ash/20 group-hover:from-violet/10 group-hover:to-violet/20 transition-all duration-300">
                  {/* No preview, so show a placeholder or nothing */}
              </div>
              )}

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-ink dark:text-ash font-body text-lg">
                    {template.name}
                  </h3>
                  {template.isPremium && (
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      PRO
                    </span>
                  )}
                </div>

                <p className="text-slate dark:text-ash/80 text-sm mb-3 font-body">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {/* No tags, so skip or show nothing */}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleTemplateClick(template)}
                    className="w-full bg-violet text-porcelain py-2 px-4 rounded-md hover:bg-violet-hover transition-colors duration-200 font-semibold text-sm text-center block font-body"
                  >
                    Use Template
                  </button>
                  <button className="w-full border border-fog dark:border-ash/20 text-ink dark:text-ash py-2 px-4 rounded-md hover:bg-mist dark:hover:bg-charcoal transition-colors duration-200 font-medium text-sm font-body">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-ink dark:text-ash mb-2">
              No templates found
            </h3>
            <p className="text-slate dark:text-ash/80">
              Try selecting a different category or check back later for new templates.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-porcelain dark:bg-graphite rounded-lg border border-fog dark:border-ash/20">
          <h2 className="text-2xl font-heading font-bold text-ink dark:text-ash mb-4">
            Can't find the perfect template?
          </h2>
          <p className="text-slate dark:text-ash/80 mb-6 font-body">
            Our AI-powered resume builder can help you create a custom resume
            that matches your unique style and industry.
          </p>
          <Link
            to="/builder"
            className="bg-violet text-porcelain px-6 py-3 rounded-md hover:bg-violet-hover transition-colors duration-200 font-semibold inline-flex items-center space-x-2 font-body"
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Build Custom Resume</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
