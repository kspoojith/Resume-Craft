import React, { useEffect, useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-mist dark:bg-charcoal p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-ink dark:text-ash font-heading">
            User Profile
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium font-body transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 bg-porcelain dark:bg-graphite p-6 rounded-lg shadow dark:shadow-xl dark:shadow-black/20 border border-transparent dark:border-ash/20">
            <h2 className="text-xl font-bold text-ink dark:text-ash mb-4 font-heading">
              Profile Information
            </h2>

            {/* Avatar Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink dark:text-ash mb-3 font-body">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-violet/10 dark:bg-violet/20 border-2 border-fog dark:border-ash/20 flex items-center justify-center overflow-hidden">
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="bg-violet text-porcelain px-4 py-2 rounded-lg font-medium hover:bg-violet-hover transition-colors duration-200 cursor-pointer font-body">
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate dark:text-ash/70 font-body">
                    JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink dark:text-ash mb-2 font-body">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-fog dark:border-ash/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                  defaultValue={user.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink dark:text-ash mb-2 font-body">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-fog dark:border-ash/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                  defaultValue={user.email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink dark:text-ash mb-2 font-body">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-fog dark:border-ash/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                  defaultValue={user.phone}
                />
              </div>
              <button
                type="submit"
                className="bg-violet text-porcelain py-2 px-4 rounded-lg font-bold hover:bg-violet-hover transition-colors duration-200 font-body"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Settings */}
          <div className="bg-porcelain dark:bg-graphite p-6 rounded-lg shadow dark:shadow-xl dark:shadow-black/20 border border-transparent dark:border-ash/20">
            <h2 className="text-xl font-bold text-ink dark:text-ash mb-4 font-heading">
              Settings
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-ink dark:text-ash mb-2 font-heading">
                  Appearance
                </h3>
                <div className="flex items-center justify-between p-3 bg-mist dark:bg-graphite rounded-lg border border-fog dark:border-ash/20">
                  <DarkModeToggle />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-ink dark:text-ash mb-2 font-heading">
                  Notifications
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 text-violet focus:ring-violet border-fog dark:border-ash/20 rounded"
                      defaultChecked
                    />
                    <span className="text-sm text-slate dark:text-ash/80 font-body">
                      Email notifications
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 text-violet focus:ring-violet border-fog dark:border-ash/20 rounded"
                    />
                    <span className="text-sm text-slate dark:text-ash/80 font-body">
                      SMS notifications
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
