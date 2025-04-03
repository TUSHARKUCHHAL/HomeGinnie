// src/components/Navbar.jsx
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
    className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md py-3' 
        : 'bg-transparent py-5'
    }`}
  >
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <span className="inline-block w-8 h-8 bg-slate-700 rounded-full text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </span>
            <span className="tracking-tight">HomeGinnie</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Home</a>
          <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Book a Pro</a>
          <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Buy Smart</a>
          <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Services</a>
          <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">About</a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="px-4 py-2 font-medium text-slate-700 hover:text-slate-900 transition-colors">
            Login
          </button>
          <button className="px-4 py-2 font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors">
            Sign Up
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            type="button" 
            className="text-slate-500 hover:text-slate-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-fade-in-down">
          <div className="flex flex-col space-y-4 pt-4">
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Home</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Book a Pro</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Buy Smart</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Services</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">About</a>
            <div className="flex flex-col space-y-2 pt-2">
              <button className="w-full px-4 py-2 font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                Login
              </button>
              <button className="w-full px-4 py-2 font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </nav>
  );
};

export default Navbar;