import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function Register() {
  useAuthRedirect(); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    toast({
      title: "Password mismatch",
      description: "Passwords do not match",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);
  try {
    const name=firstName + " " + lastName;
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      { name, email, password },
      { withCredentials: true }
    );

    toast({
      title: "Account created!",
      description: "You're now registered. Redirecting...",
    });

    navigate("/login");
  } catch (err: any) {
    toast({
      title: "Registration failed",
      description:
        err.response?.data?.message || "Something went wrong. Try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-mist dark:bg-charcoal">
      {/* Header */}
      <div className="bg-porcelain dark:bg-graphite border-b border-fog dark:border-ash/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-violet rounded"></div>
              <span className="text-xl font-bold text-ink dark:text-ash font-heading">
                ResumeCraft
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-slate dark:text-ash/80 font-body">
                Already have an account?
              </span>
              <Link
                to="/login"
                className="text-violet hover:text-violet-hover font-medium font-body"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-porcelain dark:bg-graphite rounded-lg shadow-lg dark:shadow-xl dark:shadow-black/20 p-8 border border-transparent dark:border-ash/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-ink dark:text-ash font-heading">
                Create Account
              </h2>
              <p className="mt-2 text-slate dark:text-ash/80 font-body">
                Join thousands of professionals who trust ResumeCraft
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-ink dark:text-ash mb-2 font-body"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-fog dark:border-ash/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                    placeholder="John"
                    onChange={(e) => setFirstName(e.target.value)}

                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-ink dark:text-ash mb-2 font-body"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-fog dark:border-ash/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink dark:text-ash mb-2 font-body"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-fog dark:border-ash/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                  placeholder="john.doe@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ink dark:text-ash mb-2 font-body"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-fog dark:border-ash/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-ink dark:text-ash mb-2 font-body"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-fog dark:border-ash/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent bg-porcelain dark:bg-charcoal text-ink dark:text-ash font-body"
                  placeholder="••••••••"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-violet focus:ring-violet border-fog dark:border-ash/20 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-ink dark:text-ash font-body"
                >
                  I agree to the{" "}
                  <a href="#" className="text-violet hover:text-violet-hover">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-violet hover:text-violet-hover">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-violet text-porcelain py-2 px-4 rounded-md hover:bg-violet-hover transition-colors duration-200 font-medium font-body"
              >
                Create Account
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

              <button className="mt-4 w-full bg-porcelain dark:bg-graphite border border-fog dark:border-ash/20 text-ink dark:text-ash py-2 px-4 rounded-md hover:bg-mist dark:hover:bg-charcoal transition-colors duration-200 flex items-center justify-center space-x-2 font-body">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
