import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service-providers/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccess("Password reset link has been sent to your email");
      setEmail("");
    } catch (error) {
      setError(error.message || "An error occurred while sending the reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="floating-shape bg-slate-300/80 blur-3xl w-96 h-96 rounded-full absolute -top-20 -left-20 animate-float-slow"></div>
        <div className="floating-shape bg-slate-400/30 blur-3xl w-96 h-96 rounded-full absolute top-1/4 right-10 animate-float-medium"></div>
        <div className="floating-shape bg-slate-200/70 blur-3xl w-80 h-80 rounded-full absolute bottom-10 left-1/4 animate-float-fast"></div>
        <div className="floating-shape bg-slate-600/20 blur-3xl w-64 h-64 rounded-full absolute -bottom-10 -right-10 animate-float-slow"></div>
        
        {/* Additional animated elements */}
        <div className="particle bg-slate-300/30 w-2 h-2 rounded-full absolute top-1/4 left-1/3 animate-particle-1"></div>
        <div className="particle bg-slate-300/30 w-3 h-3 rounded-full absolute top-1/2 left-2/3 animate-particle-2"></div>
        <div className="particle bg-slate-300/30 w-2 h-2 rounded-full absolute bottom-1/4 left-1/4 animate-particle-3"></div>
        <div className="particle bg-slate-300/30 w-4 h-4 rounded-full absolute bottom-1/3 right-1/4 animate-particle-4"></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-gray-100/90 z-0"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 backdrop-blur-sm overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:translate-y-[-4px]">
          {/* Card Header with Visual Element */}
          <div className="relative h-16 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
            <div className="absolute inset-0 flex justify-center">
              <div className="w-full h-40 bg-gradient-to-b from-slate-200/30 to-transparent rounded-full transform translate-y-20 scale-[2]"></div>
            </div>
            <div className="absolute top-0 right-0 p-3">
              <div className="h-2 w-2 rounded-full bg-slate-300 inline-block mr-1"></div>
              <div className="h-2 w-2 rounded-full bg-slate-400 inline-block mr-1"></div>
              <div className="h-2 w-2 rounded-full bg-slate-500 inline-block"></div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                <svg className="h-8 w-8 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Reset Password</h2>
              <p className="text-gray-500 text-center text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={isLoading}
                    required
                    className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                    aria-describedby={error ? "error-message" : undefined}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-slate-200/20 via-slate-100/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3 animate-fade-in" role="alert" id="error-message">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3 animate-fade-in" role="alert">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-green-600">{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full relative overflow-hidden group bg-slate-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300"
              >
                <div className="absolute inset-0 w-3/12 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shine"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </span>
              </button>

              <div className="text-center pt-2">
                <a 
                  href="/login" 
                  className="text-slate-600 hover:text-slate-800 text-sm inline-flex items-center transition-colors duration-300"
                >
                  <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Return to login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5px, -5px) rotate(1deg); }
          50% { transform: translate(0, 10px) rotate(0deg); }
          75% { transform: translate(-5px, -5px) rotate(-1deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-10px, 10px) rotate(-1deg); }
          50% { transform: translate(0, -15px) rotate(0deg); }
          75% { transform: translate(10px, 5px) rotate(1deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, 15px) rotate(1deg); }
          50% { transform: translate(0, -10px) rotate(0deg); }
          75% { transform: translate(-15px, 10px) rotate(-1deg); }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(500%) skewX(-20deg); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(100px, -50px); opacity: 0.7; }
        }
        
        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(-70px, 70px); opacity: 0.2; }
        }
        
        @keyframes particle-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          33% { transform: translate(50px, 50px); opacity: 0.6; }
          66% { transform: translate(80px, -30px); opacity: 0.2; }
        }
        
        @keyframes particle-4 {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          25% { transform: translate(-30px, -50px); opacity: 0.5; }
          75% { transform: translate(-60px, 30px); opacity: 0.7; }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 12s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 10s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 8s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-particle-1 {
          animation: particle-1 15s ease-in-out infinite;
        }
        
        .animate-particle-2 {
          animation: particle-2 18s ease-in-out infinite;
        }
        
        .animate-particle-3 {
          animation: particle-3 20s ease-in-out infinite;
        }
        
        .animate-particle-4 {
          animation: particle-4 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;