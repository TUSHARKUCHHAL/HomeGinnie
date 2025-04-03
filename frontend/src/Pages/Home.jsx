import { useState, useEffect } from 'react';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('book'); // 'book' or 'buy'

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
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
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

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 text-center mb-6">
                Your Home Services & Shopping <span className="text-slate-700">All in One Place</span>
              </h1>
              
              <p className="text-xl text-slate-600 text-center max-w-3xl mb-12">
                Find verified local service providers and compare prices for everything your home needs.
              </p>
              
              {/* Tabs */}
              <div className="bg-white p-2 rounded-xl shadow-md w-full max-w-4xl mb-8">
                <div className="flex">
                  <button 
                    className={`flex-1 py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                      activeTab === 'book' 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'bg-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                    onClick={() => setActiveTab('book')}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Book a Pro</span>
                    </div>
                  </button>
                  
                  <button 
                    className={`flex-1 py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                      activeTab === 'buy' 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'bg-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                    onClick={() => setActiveTab('buy')}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Buy Smart</span>
                    </div>
                  </button>
                </div>
                
                {/* Search Forms */}
                <div className="mt-4 p-4">
                  {activeTab === 'book' ? (
                    <div className="animate-fade-in">
                      <form className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1">
                          <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                            <option value="" disabled selected>Select Service Type</option>
                            <option value="plumber">Plumber</option>
                            <option value="electrician">Electrician</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="cleaner">Home Cleaner</option>
                            <option value="painter">Painter</option>
                            <option value="ac">AC Repair</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Enter your area or pin code" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                        <button className="bg-slate-800 text-white font-medium py-4 px-8 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                          Find Pros
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <form className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="What are you looking for?" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Enter your area or pin code" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          />
                        </div>
                        <button className="bg-slate-800 text-white font-medium py-4 px-8 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                          Compare Prices
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-slate-600">Verified Professionals</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-600">Same-Day Service</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-slate-600">Secure Payments</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-slate-600">4.8/5 Customer Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section (can add more content here) */}
        
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo and About */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="mr-2 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">HomeGinnie</span>
              </div>
              <p className="text-gray-400 mb-6">
                India's all-in-one hyperlocal services and smart shopping platform designed to make home maintenance and shopping easier.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Plumbing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Electrical</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carpentry</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Painting</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cleaning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AC Repair</a></li>
              </ul>
            </div>
            
            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Shopping</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hardware</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Appliances</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Groceries</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Daily Essentials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Best Deals</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner With Us</a></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="border-t border-slate-800 pt-8 mb-8">
            <div className="max-w-md mx-auto lg:mx-0">
              <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
              <p className="text-gray-400 mb-4">Get the latest updates on new services and exclusive offers.</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-white"
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          {/* Download App Section */}
          <div className="border-t border-slate-800 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Download our app</h3>
                <p className="text-gray-400 mb-4">Get faster service with our mobile app</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-2 rounded-lg flex items-center">
                  <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.25 16.98h-.04l-3.2-5.73 3.16-5.68c.02-.02.03-.05.04-.08.01-.04 0-.08-.02-.12-.03-.04-.07-.06-.12-.06h-2.48c-.11 0-.2.05-.25.14l-2.05 4.07h-.03l-2.11-4.08c-.05-.08-.14-.13-.24-.13h-2.53c-.05 0-.09.02-.12.06-.03.04-.04.08-.03.12.01.03.02.06.04.08l3.23 5.7-3.3 5.77c-.02.02-.03.05-.04.08-.01.04 0 .08.02.12.03.04.07.06.12.06h2.49c.11 0 .2-.05.25-.13l2.17-4.24h.03l2.16 4.24c.05.08.14.13.25.13h2.51c.05 0 .09-.02.12-.06.03-.04.04-.08.03-.12-.01-.03-.02-.06-.04-.08z"/>
                  </svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-base font-medium">App Store</div>
                  </div>
                </a>
                <a href="#" className="bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-2 rounded-lg flex items-center">
                  <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.6 5.82c.88.5 1.58 1.28 2.08 2.19C16.23 9.57 15 12.18 15 15c0 2.82 1.23 5.43 3.68 7-1.5 2.91-4.86 3.95-8.63 3-1.56-.53-2.93-1.23-4.05-2.15 5.39-.74 9-4.6 9-9.46 0-4.93-3.69-8.81-9.16-9.44C7.87 2.82 10.04 2 12 2c1.59 0 3.16.47 4.6 1.82zM3.44 4.78C7.26 6.92 10 10.95 10 15c0 4.05-2.74 8.08-6.56 10.22C2.55 24.43 2 23.27 2 22V8c0-1.27.55-2.43 1.44-3.22z"/>
                  </svg>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-base font-medium">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2025 HomeGinnie. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;