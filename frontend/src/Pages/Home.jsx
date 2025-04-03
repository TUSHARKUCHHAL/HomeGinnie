import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    
    // Add Poppins font to document
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Apply font to body
    document.body.style.fontFamily = "'Poppins', sans-serif";
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(link);
    };
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col font-[Poppins]">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              <motion.h1 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 text-center mb-6"
              >
                Your Home Services & Shopping <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">All in One Place</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl text-slate-600 text-center max-w-3xl mb-12"
              >
                Find verified local service providers and compare prices for everything your home needs.
              </motion.p>
              
              {/* Tabs */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white p-2 rounded-xl shadow-lg w-full max-w-4xl mb-8 hover:shadow-xl transition-shadow duration-300"
              >
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
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="animate-fade-in"
                    >
                      <form className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1 group">
                          <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all focus:ring-2 focus:ring-slate-500 focus:border-slate-500 group-hover:border-slate-400">
                            <option value="" disabled selected>Select Service Type</option>
                            <option value="plumber">Plumber</option>
                            <option value="electrician">Electrician</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="cleaner">Home Cleaner</option>
                            <option value="painter">Painter</option>
                            <option value="ac">AC Repair</option>
                          </select>
                        </div>
                        <div className="flex-1 group">
                          <input 
                            type="text" 
                            placeholder="Enter your area or pin code" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all focus:ring-2 focus:ring-slate-500 focus:border-slate-500 group-hover:border-slate-400"
                          />
                        </div>
                        <button className="bg-slate-800 text-white font-medium py-4 px-8 rounded-lg hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 hover:shadow-md transform hover:-translate-y-1">
                          Find Pros
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="animate-fade-in"
                    >
                      <form className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1 group">
                          <input 
                            type="text" 
                            placeholder="What are you looking for?" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all focus:ring-2 focus:ring-slate-500 focus:border-slate-500 group-hover:border-slate-400"
                          />
                        </div>
                        <div className="flex-1 group">
                          <input 
                            type="text" 
                            placeholder="Enter your area or pin code" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all focus:ring-2 focus:ring-slate-500 focus:border-slate-500 group-hover:border-slate-400"
                          />
                        </div>
                        <button className="bg-slate-800 text-white font-medium py-4 px-8 rounded-lg hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 hover:shadow-md transform hover:-translate-y-1">
                          Compare Prices
                        </button>
                      </form>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12"
              >
                {[
                  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Verified Professionals" },
                  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "Same-Day Service" },
                  { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", text: "Secure Payments" },
                  { icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", text: "4.8/5 Customer Rating" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={itemFadeIn}
                    className="flex items-center bg-white p-3 px-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="text-slate-600">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Featured Categories */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="w-full max-w-6xl mt-8"
              >
                <h2 className="text-2xl font-semibold text-slate-800 text-center mb-8">Popular Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", name: "Plumbing" },
                    { icon: "M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z", name: "Electrical" },
                    { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", name: "Cleaning" },
                    { icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", name: "Painting" },
                    { icon: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z", name: "AC Repair" },
                    { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", name: "Carpentry" }
                  ].map((category, index) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={index} 
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="bg-slate-100 p-3 rounded-full mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                        </svg>
                      </div>
                      <p className="font-medium text-slate-700 text-center">{category.name}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-6xl mt-16"
              >
                <h2 className="text-2xl font-semibold text-slate-800 text-center mb-10">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { step: "1", title: "Book a Service", description: "Choose the service you need and select your preferred time slot.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
                    { step: "2", title: "Get Matched", description: "We'll connect you with verified professionals in your area.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
                    { step: "3", title: "Job Done", description: "Enjoy professional service with our satisfaction guarantee.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="bg-white rounded-lg shadow-md p-6 relative"
                    >
                      <div className="absolute -top-5 left-6 bg-slate-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div className="mt-4">
                        <div className="bg-slate-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">{item.title}</h3>
                        <p className="text-slate-600">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;