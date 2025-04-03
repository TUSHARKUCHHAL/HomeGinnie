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
      
    </div>
  );
};

export default Home;