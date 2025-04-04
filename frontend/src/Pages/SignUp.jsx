import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';

// Create different animations for each blob and add floating animation for the button
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

/* Animation for modal */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out forwards;
}

/* Blur transition for background */
.background-blur {
  transition: filter 0.3s ease;
}

.background-blur.active {
  filter: blur(8px);
}
`;

const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPosition, setButtonPosition] = useState('fixed');
  const [bottomOffset, setBottomOffset] = useState('8');
  
  // State for provider selection popup
  const [showProviderPopup, setShowProviderPopup] = useState(false);
  
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
            // Calculate position from bottom of signup container
            const signupContainer = document.querySelector('.signup-container');
            if (signupContainer) {
              const signupContainerRect = signupContainer.getBoundingClientRect();
              setBottomOffset((signupContainerRect.bottom - footerRect.top + 8).toString());
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
    
    // Manage body scroll when popup is shown
    if (showProviderPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [showProviderPopup]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Sign up attempt with:', { fullName, email, password, agreeTerms });
      setIsLoading(false);
      // Add your actual registration logic here
    }, 1000);
  };

  const handleServiceProviderSignUp = () => {
    // Show the provider selection popup
    setShowProviderPopup(true);
  };
  
  const handleProviderTypeSelection = (type) => {
    console.log(`Selected provider type: ${type}`);
    // Close the popup
    setShowProviderPopup(false);
    
    // Navigate to different routes based on provider type
    if (type === 'service') {
      window.location.href = '/ServiceProvider-SignUp';
    } else if (type === 'shop') {
      window.location.href = '/ShopOwner-SignUp';
    }
  };
  
  const closeProviderPopup = () => {
    setShowProviderPopup(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 overflow-hidden relative signup-container">
      {/* Insert the style tag in the JSX */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Background content with conditional blur effect */}
      <div className={`absolute inset-0 overflow-hidden background-blur ${showProviderPopup ? 'active' : ''}`}>
        {/* Blobs with individual animations */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob-1"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob-2"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob-3"></div>
      </div>
      
      {/* Service Provider Button - Position dynamically changes */}
      <div 
        style={{ 
          position: buttonPosition, 
          bottom: `${bottomOffset}px`, 
          right: '32px',
          zIndex: 10
        }}
        className={`service-provider-button ${showProviderPopup ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}
      >
        <button
          onClick={handleServiceProviderSignUp}
          className="bg-slate-900 text-white font-medium py-3 px-4 rounded-full shadow-lg transition-colors animate-float flex items-center hover:text-glow"
        >
          <span>Continue as Provider</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      
      {/* Provider Selection Popup */}
      {showProviderPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeProviderPopup}
          ></div>
          
          {/* Modal - now slightly translucent with slate-900 accents */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 max-w-md w-full z-10 m-4 animate-scale-in border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Register as Provider</h2>
            <p className="text-slate-600 mb-6">Please select the type of provider you want to register as:</p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Service Provider Option - updated with slate-900 */}
              <button
                onClick={() => handleProviderTypeSelection('service')}
                className="bg-white/80 border border-slate-200 rounded-lg p-4 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-slate-900/10 rounded-full p-3 mb-3">
                    <svg className="h-6 w-6 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-slate-900">Service Provider</h3>
                  <p className="text-xs text-slate-500 mt-1">For individuals or companies offering services</p>
                </div>
              </button>
              
              {/* Shop Owner Option - updated with slate-900 */}
              <button
                onClick={() => handleProviderTypeSelection('shop')}
                className="bg-white/80 border border-slate-200 rounded-lg p-4 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-slate-900/10 rounded-full p-3 mb-3">
                    <svg className="h-6 w-6 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-slate-900">Shop Owner</h3>
                  <p className="text-xs text-slate-500 mt-1">For retail businesses selling products</p>
                </div>
              </button>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeProviderPopup}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`w-full max-w-md z-10 transition-all duration-300 ${showProviderPopup ? 'filter blur-sm scale-98 opacity-60 pointer-events-none' : ''}`}>
        {/* Sign Up Card containing all elements */}
        <div className="bg-white/95 backdrop-blur-sm mt-28 mb-12 rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Welcome text inside the card */}
          <div className="px-8 pt-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800">Create Your Account</h1>
            <p className="mt-2 text-sm text-slate-600">Join HomeGinnie today</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
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

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-slate-600">
                    I agree to the{' '}
                    <a href="#" className="font-medium text-slate-800 hover:text-slate-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-medium text-slate-800 hover:text-slate-700">
                      Privacy Policy
                    </a>
                  </label>
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500">Or Sign Up with</span>
                </div>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-slate-200 bg-white py-2 px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-slate-200 bg-white py-2 px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                Twitter
              </button>
            </div>
            
            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <a href="/Login" className="font-medium text-slate-800 hover:text-slate-700">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;