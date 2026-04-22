import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Mail, AlertCircle, ArrowLeft, X, Lock } from "lucide-react";
import logo from "../assets/TechStoreLogo-removebg-preview.png";
import { toast } from "sonner";
import { updateUser, getAllUsers } from '../utils/myDatabase';

const API_URL = "https://finale-commerceserver.onrender.com";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [serverCode, setServerCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check if user exists first
      const users = getAllUsers();
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!userExists) {
        throw new Error("No account found with this email address");
      }

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
      console.log(data.code);
      
      setIsLoading(false);
      // Show verification modal
      setShowVerificationModal(true);
      toast.info("Verification Code Sent", {
        description: "Please check your email for the verification code",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code");
      toast.error("Failed to send code", {
        description: err instanceof Error ? err.message : "Please try again",
      });
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Compare the verification code from server with user input
      if (serverCode == verificationCode) {
        setShowVerificationModal(false);
        setShowPasswordReset(true);
        toast.success("Code verified!", {
          description: "Please enter your new password",
        });
      } else {
        toast.error("Invalid verification code", {
          description: "Please check the code and try again",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed", {
        description: "Unable to verify your code. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both passwords are identical",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters",
      });
      return;
    }

    const dbData = JSON.parse(localStorage.getItem("myDatabase") || '{"users":[]}');
    const currentUsers = Array.isArray(dbData) ? dbData : (dbData.users || []);
  
    if (!currentUsers || currentUsers.length === 0) {
    toast.error("Database error", { description: "No users found in system." });
    return;
    }
    
    // Find and update the user's password
    const userIndex = currentUsers.findIndex((u: any) => u.email === email);
    const User = currentUsers.find((u: any) => u.email === email);

    console.log(userIndex+" " + User.username + " " + User.id);//can read 0
    if (userIndex !== -1) {
      currentUsers[userIndex].password = newPassword;
      try{
      await updateUser(User.id, { password: newPassword });
      }catch(error){
      console.log(error);
      }
      console.log(newPassword);
      localStorage.setItem("myDatabase", JSON.stringify(currentUsers));
      
      toast.success("Password reset successful!", {
        description: "You can now log in with your new password",
      });
      
      navigate("/login");
    } else {
      toast.error("User not found", {
        description: "Unable to reset password",
      });
    }
  };

  if (showPasswordReset) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl top-1/2 -right-48 animate-pulse delay-1000"></div>
          <div className="absolute w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl -bottom-48 left-1/2 animate-pulse delay-2000"></div>
        </div>

        <div className="w-full max-w-md relative">
          <div className="rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Tech Store" className="h-20 w-20 rounded-[15px]" />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-600">Enter your new password</p>
            </div>

            {/* Password Reset Form */}
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl top-1/2 -right-48 animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl -bottom-48 left-1/2 animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Tech Store" className="h-20 w-20 rounded-[15px]" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive a verification code</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Code...
                </div>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-600">
                We've sent a verification code to <br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 4-Digit Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setVerificationCode(value);
                  }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-medium"
                  placeholder="• • • •"
                  maxLength={4}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all"
                disabled={isVerifying || verificationCode.length !== 4}
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_URL}/register`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({ Email: email })
                    });
                    const data = await res.json();
                    setServerCode(data.message);
                    toast.success("Code resent!", {
                      description: "Please check your email",
                    });
                  } catch (error) {
                    toast.error("Failed to resend code");
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Resend Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
