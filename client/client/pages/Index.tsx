import { Link } from "react-router-dom";
import { FileText, Edit, Check } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Index() {
  return (
    <div className="min-h-screen bg-porcelain dark:bg-charcoal">
      {/* Header */}
      <header className="bg-mist dark:bg-graphite border-b border-fog dark:border-ash/20">
        <div className="flex justify-between items-center px-3 sm:px-4 lg:px-10 py-3">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <h1 className="text-base sm:text-lg font-heading font-bold text-ink dark:text-ash">
              ResumeCraft
            </h1>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <nav className="flex items-center gap-9">
              <Link
                to="/templates"
                className="text-sm text-ink dark:text-ash hover:text-slate dark:hover:text-ash/80 transition-colors duration-200 font-body"
              >
                Templates
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <DarkModeToggle showLabels={false} className="hidden sm:flex" />
              <Link
                to="/form-wizard"
                className="bg-violet text-porcelain px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-violet-hover transition-colors duration-200 font-body"
              >
                <span className="hidden sm:inline">Create My Resume</span>
                <span className="sm:hidden">Create</span>
              </Link>
              <Link
                to="/login"
                className="bg-porcelain dark:bg-graphite text-ink dark:text-ash border border-fog dark:border-ash/20 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-mist dark:hover:bg-charcoal transition-colors duration-200 font-body"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Link
              to="/form-wizard"
              className="bg-violet text-porcelain px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-violet-hover transition-colors duration-200 font-body"
            >
              Start
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-porcelain dark:bg-charcoal">
        {/* Hero Section */}
        <section className="px-3 sm:px-4 lg:px-40 py-4 sm:py-5">
          <div className="max-w-6xl mx-auto">
            <div className="p-1 sm:p-2 lg:p-4">
              <div
                className="relative h-[250px] sm:h-[350px] lg:h-[480px] rounded-lg bg-cover bg-center flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.40) 100%), url('https://cdn.builder.io/api/v1/image/assets/TEMP/dcd0eefe6823dd35146a88572b8b6cc926d0f2fe?width=1856')`,
                }}
              >
                <div className="text-center max-w-4xl px-3 sm:px-4 lg:px-8">
                  <h1 className="text-xl sm:text-3xl lg:text-5xl font-heading font-black text-white leading-tight tracking-tight mb-3 sm:mb-4">
                    Craft a Resume That Gets You Hired
                  </h1>
                  <p className="text-white text-xs sm:text-sm lg:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl lg:max-w-2xl mx-auto font-body">
                    Our intuitive resume builder helps you create a professional
                    resume that highlights your skills and experience, making
                    you stand out to potential employers.
                  </p>
                  <Link
                    to="/form-wizard"
                    className="inline-flex bg-violet text-porcelain px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-violet-hover transition-colors duration-200 font-body"
                  >
                    Create My Resume
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-porcelain dark:bg-graphite px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-8 sm:mb-10">
              <div className="mb-4 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-ink dark:text-ash leading-tight tracking-tight mb-4">
                  Why Choose ResumeCraft?
                </h2>
                <p className="text-sm sm:text-base text-slate dark:text-ash/80 leading-relaxed mb-6 max-w-2xl font-body">
                  Our resume builder offers a range of features designed to help
                  you create a standout resume.
                </p>
              </div>
              <div className="text-center sm:text-left">
                <Link
                  to="/templates"
                  className="inline-flex bg-violet text-porcelain px-4 sm:px-5 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-violet-hover transition-colors duration-200 font-body"
                >
                  View Templates
                </Link>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-porcelain dark:bg-charcoal border border-fog dark:border-ash/20 rounded-lg p-4 sm:p-6 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-black/20 transition-shadow duration-200">
                <div className="mb-3">
                  <FileText className="w-6 h-6 text-violet mb-3" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-ink dark:text-ash mb-2">
                    Professional Templates
                  </h3>
                  <p className="text-sm text-slate dark:text-ash/80 leading-relaxed font-body">
                    Choose from a variety of professionally designed templates
                    to match your industry and experience level.
                  </p>
                </div>
              </div>

              <div className="bg-porcelain dark:bg-charcoal border border-fog dark:border-ash/20 rounded-lg p-4 sm:p-6 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-black/20 transition-shadow duration-200">
                <div className="mb-3">
                  <Edit className="w-6 h-6 text-violet mb-3" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-ink dark:text-ash mb-2">
                    Easy Customization
                  </h3>
                  <p className="text-sm text-slate dark:text-ash/80 leading-relaxed font-body">
                    Easily customize your resume with our drag-and-drop
                    interface, ensuring it reflects your unique qualifications.
                  </p>
                </div>
              </div>

              <div className="bg-porcelain dark:bg-charcoal border border-fog dark:border-ash/20 rounded-lg p-4 sm:p-6 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-black/20 transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
                <div className="mb-3">
                  <Check className="w-6 h-6 text-violet mb-3" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-ink dark:text-ash mb-2">
                    ATS-Friendly Formats
                  </h3>
                  <p className="text-sm text-slate dark:text-ash/80 leading-relaxed font-body">
                    Our resumes are optimized for Applicant Tracking Systems
                    (ATS), increasing your chances of getting noticed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-porcelain dark:bg-graphite border-t border-fog dark:border-ash/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Link
              to="/about"
              className="text-slate dark:text-ash/80 text-center text-sm sm:text-base hover:text-violet transition-colors duration-200 font-body"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-slate dark:text-ash/80 text-center text-sm sm:text-base hover:text-violet transition-colors duration-200 font-body"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              className="text-slate dark:text-ash/80 text-center text-sm sm:text-base hover:text-violet transition-colors duration-200 font-body"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-slate dark:text-ash/80 text-center text-sm sm:text-base hover:text-violet transition-colors duration-200 font-body"
            >
              Terms of Service
            </Link>
          </div>
          <div className="text-center border-t border-fog dark:border-ash/20 pt-6">
            <p className="text-slate dark:text-ash/80 text-sm sm:text-base font-body">
              © 2025 ResumeCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
