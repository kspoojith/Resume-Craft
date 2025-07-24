import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import {jwtDecode,JwtPayload} from "jwt-decode";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google: any; 
  }
}

interface GoogleJwtPayload extends JwtPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
}


export default function Login() {
  useAuthRedirect(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLoginSuccess,
        auto_select: true, // One Tap
      });

      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );

      // Enable One Tap popup
      window.google.accounts.id.prompt();
    }
  }, []);


  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);

      const res = await axios.post(
        "http://localhost:5000/api/auth/oauth",
        {
          provider: "google",
          providerId: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          avatar: decoded.picture,
        },
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      toast({ title: "Logged in with Google" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Google login failed", err);
      toast({
        title: "Google login failed",
        variant: "destructive",
      });
    }
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Trying login with:", email, password);
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(res.data));

      toast({
        title: "Login successful!",
        description: `Welcome back, ${res.data.name || "user"} 👋`,
      });

      navigate("/dashboard"); // or wherever
    } catch (err: any) {
      toast({
        title: "Login failed!",
        description:
          err.response?.data?.message || "Something went wrong, try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-mist dark:bg-charcoal flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet/10 dark:bg-violet/20 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet/10 dark:bg-violet/20 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-porcelain dark:bg-graphite p-6 sm:p-8 rounded-xl shadow-2xl dark:shadow-xl dark:shadow-black/20 max-w-md w-full transform hover:scale-105 transition-all duration-300 hover:shadow-3xl border border-transparent dark:border-ash/20">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 mb-4 group"
          >
            <div className="w-8 h-8 bg-violet rounded group-hover:bg-violet-hover transition-colors duration-200"></div>
            <span className="text-xl font-heading font-bold text-ink dark:text-ash group-hover:text-violet transition-colors duration-200">
              ResumeCraft
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-ink dark:text-ash mb-2">
            Welcome Back
          </h1>
          <p className="text-slate dark:text-ash/80 font-body">
            Sign in to continue building amazing resumes
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="group">
            <label className="block text-sm font-medium text-ink dark:text-ash mb-2 group-focus-within:text-violet transition-colors duration-200 font-body">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-fog dark:border-ash/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent transition-all duration-200 hover:border-violet bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-ink dark:text-ash mb-2 group-focus-within:text-violet transition-colors duration-200 font-body">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-fog dark:border-ash/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent transition-all duration-200 hover:border-violet bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            
            <Link
              to="#"
              className="text-sm text-violet hover:text-violet-hover transition-colors duration-200 font-body"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-violet text-porcelain py-3 px-4 rounded-lg font-semibold hover:bg-violet-hover hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 font-body"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-fog dark:border-ash/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-porcelain dark:bg-graphite text-slate dark:text-ash/80 font-body">
                Or continue with
              </span>
            </div>
          </div>

          <div id="google-signin" className="mt-4 flex justify-center"></div>

        </div>

        <div className="mt-6 text-center">
          <span className="text-slate dark:text-ash/80 font-body">
            Don't have an account?{" "}
          </span>
          <Link
            to="/register"
            className="text-violet hover:text-violet-hover font-medium transition-colors duration-200 font-body"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
