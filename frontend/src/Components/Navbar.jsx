// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/HomeGinnie_b.png'; // Adjust the path to your logo image

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/SignUp');
  };

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
            <div className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
              
                <img src={Logo} alt="Logo" className="h-12 w-12 -mt-1" />
              
              <span className="tracking-tight">HomeGinnie</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Home</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Book a Pro</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Buy Smart</a>
            <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Services</a>
            <a href="About" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">About</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="px-4 py-2 font-medium text-slate-700 hover:text-slate-900 transition-colors"
              onClick={handleLoginClick}
            >
              Login
            </button>
            <button className="px-4 py-2 font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
            onClick={handleSignUpClick}
            >
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
              <a href="/" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Home</a>
              <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Book a Pro</a>
              <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Buy Smart</a>
              <a href="#" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">Services</a>
              <a href="/About" className="font-medium text-slate-700 hover:text-slate-900 transition-colors">About</a>
              <div className="flex flex-col space-y-2 pt-2">
                <button 
                  className="w-full px-4 py-2 font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
                <button className="w-full px-4 py-2 font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
                onClick={handleSignUpClick}
                >
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