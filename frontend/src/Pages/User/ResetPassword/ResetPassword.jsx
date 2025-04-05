
// export default ResetPassword;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter";
    if (!hasNumbers) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5500/api/users/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess("Password reset successful! Redirecting to login...");
    } catch (error) {
      setError(error.message || "An error occurred while resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden">
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob-1 absolute w-96 h-96 rounded-full bg-slate-200/90 blur-3xl animate-blob"></div>
        <div className="blob-2 absolute w-96 h-96 rounded-full bg-slate-300/70 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="blob-3 absolute w-96 h-96 rounded-full bg-slate-500/40 blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-md relative mt-20 z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-md border border-slate-200 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
            <p className="text-slate-800">Please enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="newPassword" className="text-sm font-medium text-slate-800 block pl-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-describedby="password-requirements"
                  className="w-full px-4 py-2 bg-white border border-slate-300 focus:border-slate-800 focus:ring focus:ring-slate-800/20 rounded-md text-slate-900 transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-800 block pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-300 focus:border-slate-800 focus:ring focus:ring-slate-800/20 rounded-md text-slate-900 transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div id="password-requirements" className="bg-slate-100 rounded-md border border-slate-200 p-4">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Password Requirements</h3>
              <ul className="space-y-1 pl-1">
                <li className={`text-xs flex items-center space-x-2 ${newPassword.length >= 8 ? "text-slate-900" : "text-slate-500"} transition-colors`}>
                  <span>{newPassword.length >= 8 ? "●" : "○"}</span>
                  <span>At least 8 characters</span>
                </li>
                <li className={`text-xs flex items-center space-x-2 ${/[A-Z]/.test(newPassword) ? "text-slate-900" : "text-slate-500"} transition-colors`}>
                  <span>{/[A-Z]/.test(newPassword) ? "●" : "○"}</span>
                  <span>One uppercase letter</span>
                </li>
                <li className={`text-xs flex items-center space-x-2 ${/[a-z]/.test(newPassword) ? "text-slate-900" : "text-slate-500"} transition-colors`}>
                  <span>{/[a-z]/.test(newPassword) ? "●" : "○"}</span>
                  <span>One lowercase letter</span>
                </li>
                <li className={`text-xs flex items-center space-x-2 ${/\d/.test(newPassword) ? "text-slate-900" : "text-slate-500"} transition-colors`}>
                  <span>{/\d/.test(newPassword) ? "●" : "○"}</span>
                  <span>One number</span>
                </li>
                <li className={`text-xs flex items-center space-x-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-slate-900" : "text-slate-500"} transition-colors`}>
                  <span>{/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "●" : "○"}</span>
                  <span>One special character</span>
                </li>
              </ul>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 rounded-md bg-slate-100 border border-slate-300 text-slate-900 text-sm" role="alert">
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 p-3 rounded-md bg-slate-100 border border-slate-300 text-slate-900 text-sm" role="alert">
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-md transition disabled:bg-slate-300 disabled:text-slate-500"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-center pt-2">
              <a href="/login" className="text-slate-600 hover:text-slate-800 text-sm inline-flex items-center transition-colors ">
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to login
              </a>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .blob-1 {
          top: 10%;
          left: 10%;
        }
        .blob-2 {
          top: 50%;
          right: 10%;
        }
        .blob-3 {
          bottom: 10%;
          left: 30%;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;