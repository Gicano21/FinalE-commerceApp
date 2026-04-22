import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router"; // Added useLocation
import {useEffect} from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, X } from "lucide-react";
import logo from "../assets/TechStoreLogo-removebg-preview.png";
import { toast } from "sonner";

const API_URL = "https://finale-commerceserver.onrender.com";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [serverCode, setServerCode] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
const { pathname } = useLocation(); // Hook to listen for route changes

  // --- SCROLL TO TOP LOGIC ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); 
  // ---------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    let agreed = document.getElementById("agreed") as HTMLInputElement;;

    // Validate passwords match
    console.log(agreed.checked);
    if (!agreed.checked) {
      setError("Bruhhh");
      toast.error("Do you Agree?", {
        description: "Your Consent is Needed Before Proceding",
      });
      return;
    }
    else if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", {
        description: "Please make sure both passwords are identical",
      });
      return;
    }
    setIsLoading(true);

    try {
      // Send verification code request to API
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Email: email })
      });

      if (!res.ok) {
        throw new Error("Failed to send verification code");
      }

      const data = await res.json();
      setServerCode(data.code); // Store the server code
      
      setIsLoading(false);
      // Show verification modal
      setShowVerificationModal(true);
      toast.info("Verification Required", {
        description: "Please check your email for the verification code",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
      toast.error("Sign up failed", {
        description: err instanceof Error ? err.message : "Failed to create account",
      });
      setIsLoading(false);
      return;
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Compare the verification code from server with user input
      if (serverCode === verificationCode) {
        // Code is correct, now create the account
        await signup(email, password, name);
        setShowVerificationModal(false);
        navigate("/products");
        toast.success("Account verified successfully!", {
          description: "Welcome to Tech Store!",
        });
      } else {
        toast.error("Invalid verification code", {
          description: "Please check the code and try again",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed", {
        description: error instanceof Error ? error.message : "Unable to verify your email. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logo} alt="Tech Store" className="h-32 w-auto rounded-[5px]" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-3 text-gray-600 text-lg">Sign up for a new account</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-gray-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-in slide-in-from-top">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded-xl">
              <p className="font-semibold mb-2">Password must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be at least 6 characters long</li>
                <li>Match the confirmation password</li>
              </ul>
            </div>

            <label className="flex items-center cursor-pointer group">
               <input id="agreed" type="checkbox" className="mr-2 w-4 h-4 accent-blue-600" />
                <span className="group-hover:text-gray-900">
                 <Link to="/useragreement" className="text-blue-600 hover:text-blue-800">I Have Read and Agree</Link>
                </span>
            </label>



            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold">
              Sign in
            </Link>
             <br></br>
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h3>
              <p className="text-gray-600">
                We've sent a verification code to
              </p>
              <p className="text-blue-600 font-semibold mt-1">{email}</p>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl font-bold tracking-widest"
                  placeholder="2106"
                  required
                  maxLength={4}
                  pattern="[0-9]{4}"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the 4-digit code from your email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </span>
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              <button
                type="button"
                className="w-full text-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Didn't receive the code? <span className="font-semibold">Resend</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}