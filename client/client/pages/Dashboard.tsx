import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import axios from "axios";

interface Resume {
  _id: string;
  title: string;
  latexCode: string;
  clsCode?: string;
  templateId?: {
    _id: string;
    name: string;
    type: string;
  };
  compilationData?: {
    uuid?: string;
    pdfUrl?: string;
    lastCompiled?: string;
  };
  updatedAt: string;
  createdAt: string;
  downloadCount?: number;
}

interface Notification {
  id: number;
  type: 'download' | 'profile' | 'template';
  title: string;
  message: string;
  read: boolean;
  time: string;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('https://resume-craft-cswr.onrender.com/api/resumes', {
          withCredentials: true  // This will include cookies
        });
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axios.get('https://resume-craft-cswr.onrender.com/api/notifications', { withCredentials: true });
      setNotifications(res.data);
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [notificationsOpen]);

  const filteredNotifications = notifications.filter(
    n => n.type === "download" || n.type === "profile" || n.type === "template"
  );

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleEditResume = (resume: Resume) => {
    // Navigate to builder with resume data
    navigate('/builder', {
      state: {
        resumeId: resume._id,
        texContent: resume.latexCode,
        clsContent: resume.clsCode,
        template: resume.templateId,
        uuid: resume.compilationData?.uuid
      }
    });
  };

  const handleDownload = async (resume: Resume) => {
    try {
      await axios.post(
        `https://resume-craft-cswr.onrender.com/api/resumes/${resume._id}/increment-download`,
        {},
        { withCredentials: true }
      );
      setNotifications(prev => [
        {
          id: Date.now(),
          type: "download",
          title: "Resume Download Complete",
          message: `Your ${resume.title} has been successfully downloaded`,
          read: false,
          time: "Just now"
        },
        ...prev
      ]);
      window.open(`https://resume-craft-cswr.onrender.com${resume.compilationData?.pdfUrl}`, '_blank');
      setResumes((prev) =>
        prev.map((r) =>
          r._id === resume._id
            ? { ...r, downloadCount: (r.downloadCount || 0) + 1 }
            : r
        )
      );
    } catch (error) {
      alert('Failed to increment download count or download file.');
    }
  };

  const handleNotificationsOpen = async () => {
    setNotificationsOpen(true);
    await axios.post('https://resume-craft-cswr.onrender.com/api/notifications/mark-all-read', {}, { withCredentials: true });
    // Optionally, update local state:
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const totalDownloads = resumes.reduce((sum, resume) => sum + (resume.downloadCount || 0), 0);

  return (
    <div className="min-h-screen bg-mist dark:bg-charcoal">
      {/* Top Navbar */}
      <div className="bg-porcelain dark:bg-graphite border-b border-fog dark:border-ash/20">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-md hover:bg-mist transition-colors duration-200"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-violet rounded"></div>
              <span className="text-lg sm:text-xl font-heading font-bold text-ink dark:text-ash">
                ResumeCraft
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <DarkModeToggle showLabels={false} className="hidden sm:flex" />
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search resumes..."
                className="w-48 lg:w-64 px-3 py-2 pr-10 border border-fog rounded-md focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent font-body text-sm"
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => handleNotificationsOpen()}
                className="p-1.5 sm:p-2 rounded-md hover:bg-mist dark:hover:bg-charcoal transition-colors duration-200 relative text-ink dark:text-ash"
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
                    d="M15 17h5l-5 5-5-5h5v-6a5 5 0 015-5v5z"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-porcelain dark:bg-graphite border border-fog dark:border-ash/20 rounded-lg shadow-lg dark:shadow-xl dark:shadow-black/20 z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-fog dark:border-ash/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-ink dark:text-ash">
                        Notifications
                      </h3>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-slate dark:text-ash/60 hover:text-ink dark:hover:text-ash p-1 rounded"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-fog dark:border-ash/20 last:border-b-0 hover:bg-mist dark:hover:bg-charcoal transition-colors duration-200 ${
                            !notification.read
                              ? "bg-violet/5 dark:bg-violet/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.type === "download"
                                  ? "bg-green-500"
                                  : notification.type === "profile"
                                    ? "bg-blue-500"
                                    : "bg-violet"
                              }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${!notification.read ? "text-ink dark:text-ash" : "text-slate dark:text-ash/80"}`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-slate dark:text-ash/70 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate dark:text-ash/60 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-violet rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <svg
                          className="w-12 h-12 text-slate dark:text-ash/50 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-5 5-5-5h5v-6a5 5 0 015-5v5z"
                          />
                        </svg>
                        <p className="text-slate dark:text-ash/70 text-sm">
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </div>

                  {filteredNotifications.length > 0 && (
                    <div className="p-3 border-t border-fog dark:border-ash/20 bg-mist dark:bg-charcoal/50">
                      <button className="w-full text-center text-sm text-violet hover:text-violet-hover font-medium">
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-1.5 sm:p-2 rounded-md hover:bg-mist transition-colors duration-200"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-violet rounded-full flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                {user && user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  // fallback initials if no avatar
                  <span>{user && user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) : 'JD'}</span>
                )}
              </div>
              <span className="hidden md:block text-ink dark:text-ash font-medium font-body text-sm">
                {user && user.name ? user.name : 'John Doe'}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "block" : "hidden"} lg:block fixed lg:relative inset-y-0 left-0 z-50 w-64 sm:w-72 bg-porcelain dark:bg-graphite border-r border-fog dark:border-ash/20 transform transition-transform duration-300 ease-in-out lg:transform-none`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 pt-6 pb-4 overflow-y-auto">
              <nav className="px-3 sm:px-4 space-y-1.5 sm:space-y-2">
                <Link
                  to="/dashboard"
                  className="bg-violet/10 text-violet group flex items-center px-3 py-2.5 text-sm font-medium rounded-md font-body"
                >
                  <svg
                    className="mr-3 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                  </svg>
                  Dashboard
                </Link>
                
                <Link
                  to="/builder"
                  className="text-slate hover:bg-mist hover:text-ink group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 font-body"
                >
                  <svg
                    className="mr-3 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Resume Builder
                </Link>
                <Link
                  to="/templates"
                  className="text-slate hover:bg-mist hover:text-ink group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 font-body"
                >
                  <svg
                    className="mr-3 w-5 h-5"
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
                  Templates
                </Link>
                <Link
                  to="/analyzer"
                  className="text-slate hover:bg-mist hover:text-ink group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 font-body"
                >
                  <svg
                    className="mr-3 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5-5-5h5v-6a5 5 0 015-5v5z"
                    />
                  </svg>
                  Resume Analyzer
                </Link>

                <div className="border-t border-gray-border my-4"></div>
                <Link
                  to="/profile"
                  className="text-slate hover:bg-mist hover:text-ink group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 font-body"
                >
                  <svg
                    className="mr-3 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink dark:text-ash">
                    My Resumes
                  </h1>
                  <p className="mt-1 text-slate dark:text-ash/80 font-body text-sm sm:text-base">
                    Create and manage your professional resumes
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link
                    to="/builder"
                    className="bg-violet text-porcelain px-4 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-violet-hover transition-colors duration-200 font-semibold inline-flex items-center justify-center font-body text-sm sm:text-base"
                  >
                    <svg
                      className="mr-2 w-5 h-5"
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
                    Direct Editor
                  </Link>
                  
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-porcelain dark:bg-graphite p-4 sm:p-6 rounded-lg border border-fog dark:border-ash/20">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-violet/10 dark:bg-violet/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-violet"
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
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate dark:text-ash/80">
                      Total Resumes
                    </p>
                    <p className="text-2xl font-bold text-ink dark:text-ash">
                      {resumes.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-porcelain dark:bg-graphite p-4 sm:p-6 rounded-lg border border-fog dark:border-ash/20">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate dark:text-ash/80">
                      Views This Month
                    </p>
                    <p className="text-2xl font-bold text-ink dark:text-ash">
                      47
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-porcelain dark:bg-graphite p-4 sm:p-6 rounded-lg border border-fog dark:border-ash/20">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate dark:text-ash/80">
                      Downloads
                    </p>
                    <p className="text-2xl font-bold text-ink dark:text-ash">
                      {totalDownloads}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-porcelain dark:bg-graphite rounded-lg border border-fog dark:border-ash/20 p-6 animate-pulse">
                    <div className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="bg-porcelain dark:bg-graphite rounded-lg border border-fog dark:border-ash/20 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20 transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-16 bg-violet/10 dark:bg-violet/20 border border-violet/20 dark:border-violet/30 rounded flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-violet"
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
                        <div className="flex space-x-2">
                          <button className="p-2 text-slate dark:text-ash/60 hover:text-ink dark:hover:text-ash rounded">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-ink dark:text-ash mb-2">
                        {resume.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-slate dark:text-ash/80 mb-4">
                        <span>Last modified: {formatDate(resume.updatedAt)}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-violet/10 dark:bg-violet/20 text-violet">
                          {resume.compilationData?.pdfUrl ? 'Complete' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-slate dark:text-ash/70 mb-4">
                        Template: {resume.templateId?.name || 'Custom'}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditResume(resume)}
                          className="flex-1 bg-violet text-porcelain text-center py-2 px-4 rounded-md hover:bg-violet-hover transition-colors duration-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        {resume.compilationData?.pdfUrl && (
                          <button
                            onClick={() => handleDownload(resume)}
                            className="px-4 py-2 border border-fog dark:border-ash/20 text-ink dark:text-ash rounded-md hover:bg-mist dark:hover:bg-charcoal transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
                          >
                            <span>Download</span>
                            <span className="ml-2 text-xs bg-violet/10 text-violet px-2 py-0.5 rounded-full">
                              {resume.downloadCount || 0}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Create New Card */}
              <Link
                to="/templates"
                className="bg-porcelain dark:bg-graphite rounded-lg border-2 border-dashed border-fog dark:border-ash/30 hover:border-violet dark:hover:border-violet hover:bg-violet/5 dark:hover:bg-violet/10 transition-colors duration-200 flex items-center justify-center p-6 min-h-[280px] group"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-violet/10 dark:bg-violet/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-violet transition-colors duration-200">
                    <svg
                      className="w-6 h-6 text-violet group-hover:text-white"
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
                  <h3 className="text-lg font-semibold text-ink dark:text-ash group-hover:text-violet mb-2">
                    Create New Resume
                  </h3>
                  <p className="text-slate dark:text-ash/80 text-sm">
                    Use our guided wizard to build your resume
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
