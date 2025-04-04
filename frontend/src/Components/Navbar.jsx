import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/HomeGinnie_b.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Close mobile menu on resize to desktop width
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerButton = document.getElementById('hamburger-button');
      
      if (isMobileMenuOpen && mobileMenu && hamburgerButton && 
          !mobileMenu.contains(event.target) && 
          !hamburgerButton.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when navigating
  const navigateAndCloseMenu = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2 sm:py-3' 
          : 'bg-transparent py-3 sm:py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center space-x-2 sm:space-x-3">
              <img src={Logo} alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12 -mt-1" />
              <span className="tracking-tight">HomeGinnie</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <a href="/" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Home</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Book a Pro</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Buy Smart</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Services</a>
            <a href="About" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">About</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <button 
              className="px-3 py-1.5 lg:px-4 lg:py-2 font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base"
              onClick={() => navigateAndCloseMenu('/login')}
            >
              Login
            </button>
            <button 
              className="px-3 py-1.5 lg:px-4 lg:py-2 font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors text-sm lg:text-base"
              onClick={() => navigateAndCloseMenu('/SignUp')}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              id="hamburger-button"
              type="button" 
              className={`p-2 rounded-md text-slate-500 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors ${isMobileMenuOpen ? 'bg-slate-100' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {!isMobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden mt-3 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden animate-fadeDown"
          >
            <div className="flex flex-col py-2">
              <a 
                href="/" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                onClick={(e) => {
                  e.preventDefault();
                  navigateAndCloseMenu('/');
                }}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </a>
              <a 
                href="#" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Book a Pro
              </a>
              <a 
                href="#" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Buy Smart
              </a>
              <a 
                href="#" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Services
              </a>
              <a 
                href="/About" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                onClick={(e) => {
                  e.preventDefault();
                  navigateAndCloseMenu('/About');
                }}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </a>
              <div className="px-4 py-3 mt-1 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="w-full px-4 py-2.5 font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                    onClick={() => navigateAndCloseMenu('/login')}
                  >
                    Login
                  </button>
                  <button 
                    className="w-full px-4 py-2.5 font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
                    onClick={() => navigateAndCloseMenu('/SignUp')}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;