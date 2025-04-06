import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/HomeGinnie_b.png';
import { AuthContext } from '../App';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Access auth context from App.js
  const { isLoggedIn, userRole, logout } = useContext(AuthContext);

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
      if (window.innerWidth >= 768 && isProfileMenuOpen) {
        setIsProfileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Close mobile menu & profile menu when clicking outside
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerButton = document.getElementById('hamburger-button');
      const profileMenu = document.getElementById('profile-menu');
      const profileButton = document.getElementById('profile-button');
      
      if (isMobileMenuOpen && mobileMenu && hamburgerButton && 
          !mobileMenu.contains(event.target) && 
          !hamburgerButton.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      
      if (isProfileMenuOpen && profileMenu && profileButton && 
          !profileMenu.contains(event.target) && 
          !profileButton.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isProfileMenuOpen]);

  // Close mobile menu when navigating
  const navigateAndCloseMenu = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    navigateAndCloseMenu('/logout');
  };

  // Get role-based dashboard link
  const getDashboardLink = () => {
    switch(userRole) {
      case 'user':
        return '/book-a-pro';
      case 'service-provider':
        return '/Find-a-Job';
      case 'shop-owner':
        return '/Sell-Products';
      case 'admin':
        return '/book-a-pro'; // Fallback to book-a-pro for admin
      default:
        return '/';
    }
  };

  // Get role-based profile link
  const getProfileLink = () => {
    switch(userRole) {
      case 'user':
        return '/profile';
      case 'service-provider':
        return '/ServiceProvider/Profile';
      case 'shop-owner':
        return '/Shop/Profile';
      case 'admin':
        return '/profile'; // Fallback to regular profile for admin
      default:
        return '/profile';
    }
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
            <Link to="/" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Home</Link>
            
            {/* Conditional links based on user role */}
            {isLoggedIn && userRole === 'user' && (
              <Link to="/book-a-pro" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Book a Pro</Link>
            )}
            
            {isLoggedIn && userRole === 'service-provider' && (
              <Link to="/Find-a-Job" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Find Jobs</Link>
            )}
            
            {isLoggedIn && userRole === 'shop-owner' && (
              <Link to="/Sell-Products" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Sell Products</Link>
            )}
            
            {/* Common links for all users */}
            <Link to="/Buy-Smart" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Buy Smart</Link>
            <Link to="/Services" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">Services</Link>
            <Link to="/About-Us" className="font-medium text-slate-700 hover:text-slate-900 transition-colors text-sm lg:text-base">About</Link>
          </div>

          {/* Action Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {isLoggedIn ? (
              <>
                {/* Notification Icon */}
                <div className="relative">
                  <button 
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                    aria-label="Notifications"
                  >
                    <svg className="h-6 w-6 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {/* Notification badge - uncomment and adjust when implementing notification counter */}
                    {/* <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span> */}
                  </button>
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <button 
                    id="profile-button"
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    aria-label="Profile menu"
                    aria-expanded={isProfileMenuOpen}
                  >
                    <svg className="h-6 w-6 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div 
                      id="profile-menu"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden animate-fadeDown origin-top-right"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-slate-800">Signed in as</p>
                        <p className="text-sm text-slate-600 truncate">{userRole}</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          to={getDashboardLink()}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          to={getProfileLink()}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link 
                          to="#"
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                          onClick={handleLogout}
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
              <Link 
                to="/" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              
              {/* Role-based links for mobile */}
              {isLoggedIn && userRole === 'user' && (
                <Link 
                  to="/book-a-pro" 
                  className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Book a Pro
                </Link>
              )}
              
              {isLoggedIn && userRole === 'service-provider' && (
                <Link 
                  to="/Find-a-Job" 
                  className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Find Jobs
                </Link>
              )}
              
              {isLoggedIn && userRole === 'shop-owner' && (
                <Link 
                  to="/Sell-Products" 
                  className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Sell Products
                </Link>
              )}
              
              {/* Common links for all */}
              <Link 
                to="/Buy-Smart" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Buy Smart
              </Link>
              <Link 
                to="/Services" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Services
              </Link>
              <Link 
                to="/About-Us" 
                className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </Link>
              
              {/* Notifications for mobile (only if logged in) */}
              {isLoggedIn && (
                <Link 
                  to="#" 
                  className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </Link>
              )}
              
              {/* Login/Signup or Profile section for mobile */}
              {isLoggedIn ? (
                <div className="border-t border-gray-100 mt-2">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">Signed in as</p>
                    <p className="text-sm text-slate-500 truncate">{userRole}</p>
                  </div>
                  <Link 
                    to={getProfileLink()}
                    className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    My Profile
                  </Link>
                  <Link 
                    to="#"
                    className="flex items-center font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors py-3 px-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <button 
                    className="flex items-center w-full text-left font-medium text-red-500 hover:text-red-700 hover:bg-slate-50 transition-colors py-3 px-4"
                    onClick={handleLogout}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;