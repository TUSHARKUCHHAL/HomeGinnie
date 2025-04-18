import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../../App'; 

// Animation styles remain unchanged
const animationStyles = `
/* First blob animation */
@keyframes blob1 {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  25% {
    transform: translate(40px, -60px) scale(1.2);
  }
  50% {
    transform: translate(-30px, -20px) scale(0.8);
  }
  75% {
    transform: translate(20px, 40px) scale(1.1);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Second blob animation */
@keyframes blob2 {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  20% {
    transform: translate(-50px, 30px) scale(1.15);
  }
  40% {
    transform: translate(35px, 10px) scale(0.9);
  }
  60% {
    transform: translate(-20px, -40px) scale(1.05);
  }
  80% {
    transform: translate(25px, -20px) scale(0.95);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Third blob animation */
@keyframes blob3 {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(60px, 30px) scale(0.85);
  }
  66% {
    transform: translate(-40px, -30px) scale(1.25);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Floating animation for the service provider button */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-blob-1 {
  animation: blob1 8s infinite ease-in-out;
}

.animate-blob-2 {
  animation: blob2 10s infinite ease-in-out;
}

.animate-blob-3 {
  animation: blob3 9s infinite ease-in-out;
}

.animate-float {
  animation: float 3s infinite ease-in-out;
}

.hover\\:text-glow:hover {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2);
  transition: text-shadow 0.3s ease;
}
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [buttonPosition, setButtonPosition] = useState('fixed');
  const [bottomOffset, setBottomOffset] = useState('8');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Function to check for footer visibility and adjust button position
    const handleScroll = () => {
      const footerElement = document.querySelector('footer');
      
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If footer is visible in the viewport
        if (footerRect.top < windowHeight) {
          // Calculate how much of the footer is visible
          const footerVisibleHeight = windowHeight - footerRect.top;
          
          // Adjust the button position to be above the footer
          if (footerVisibleHeight > 0) {
            setButtonPosition('absolute');
            // Calculate position from bottom of login container
            const loginContainer = document.querySelector('.login-container');
            if (loginContainer) {
              const loginContainerRect = loginContainer.getBoundingClientRect();
              setBottomOffset((loginContainerRect.bottom - footerRect.top + 8).toString());
            }
          }
        } else {
          // Reset to fixed position if footer is not visible
          setButtonPosition('fixed');
          setBottomOffset('8');
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/service-providers/login`, {
        email,
        password
      });
      
      const userData = response.data;
      const token = userData.token;
      const role = "service-provider"; 
      
      // Update auth context with rememberMe parameter
      login(token, role, rememberMe);
      
      // Save additional user info based on remember me preference
      if (rememberMe) {
        localStorage.setItem('userInfo', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(userData));
      }
      
      setSuccess('Login successful! Redirecting to dashboard...');
      
      // Redirect to dashboard using React Router
      setTimeout(() => {
        navigate('/service-provider-dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  

  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 overflow-hidden relative login-container">
      {/* Insert the style tag in the JSX */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      <div className="absolute inset-0 overflow-hidden">
        {/* Blobs with individual animations */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob-1"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob-2"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob-3"></div>
      </div>
      
      <div className="w-full max-w-md z-10">
        {/* Login Card containing all elements */}
        <div className="bg-white/95 backdrop-blur-sm mt-28 mb-12 rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Welcome text inside the card */}
          <div className="px-8 pt-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-600">Sign in to your HomeGinnie Service account</p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
                <p className="text-sm">{success}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="/ServiceProvider-Forgot-Password" className="font-medium text-slate-600 hover:text-slate-800">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 disabled:opacity-70 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
            
            {/* Sign Up Link - Inside the card */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <a href="/ServiceProvider-SignUp" className="font-medium text-slate-800 hover:text-slate-700">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;