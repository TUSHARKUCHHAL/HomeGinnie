import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "With over 15 years of experience in home services, Alex founded the company with a vision to revolutionize how people find and book home services.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Sarah Miller",
      role: "Chief Operations Officer",
      bio: "Sarah ensures that every service provider on our platform meets our strict quality standards and that customers receive exceptional service every time.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Michael Chen",
      role: "Head of Technology",
      bio: "Michael leads our development team in creating innovative solutions that make finding and booking home services as seamless as possible.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Priya Patel",
      role: "Customer Experience Director",
      bio: "Priya and her team work tirelessly to ensure that every customer interaction with our platform exceeds expectations.",
      avatar: "/api/placeholder/100/100"
    }
  ];

  const testimonials = [
    {
      name: "Emma Wilson",
      location: "New York",
      quote: "Finding reliable plumbers used to be such a hassle. Now, I can book vetted professionals in minutes. The service has been consistently excellent!",
      rating: 5,
      avatar: "/api/placeholder/64/64"
    },
    {
      name: "David Lee",
      location: "Chicago",
      quote: "I've used this platform for everything from electrical repairs to house cleaning. The price comparison feature has saved me hundreds of dollars.",
      rating: 5,
      avatar: "/api/placeholder/64/64"
    },
    {
      name: "Jennifer Moore",
      location: "Los Angeles",
      quote: "As a busy parent, I don't have time to research service providers. This platform has been a lifesaver – quick booking and always reliable professionals.",
      rating: 4,
      avatar: "/api/placeholder/64/64"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-[Poppins]">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col items-center mb-12"
            >
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-full px-6 py-2 mb-6 inline-flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-slate-700 font-medium">Trusted by 500,000+ homeowners</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 text-center mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">Our Mission</span>
              </h1>
              
              <p className="text-xl text-slate-600 text-center max-w-3xl mb-8">
                Connecting homes with trusted professionals and smart shopping solutions since 2020.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center justify-center space-x-4"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img src={`/api/placeholder/40/40`} alt="Team member" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-slate-600">Join our growing team</span>
              </motion.div>
            </motion.div>

            {/* Video Introduction */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg p-8 mb-16 max-w-4xl mx-auto overflow-hidden"
            >
              <div className="aspect-video bg-slate-200 rounded-lg mb-6 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/api/placeholder/800/450" alt="About video thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <button className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-800" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <h2 className="text-3xl font-semibold text-slate-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Founded in 2020, our platform was born from a simple yet powerful idea: to create a seamless connection between homeowners and quality service providers while offering competitive pricing on home products.
                </p>
                <p>
                  What started as a small team with big dreams has grown into a nationwide network of verified professionals and trusted retailers. We've helped over 500,000 homeowners find solutions for their homes, from emergency repairs to complete renovations.
                </p>
                <div className="border-l-4 border-slate-800 pl-4 py-2 my-6 bg-slate-50 rounded-r">
                  <p className="italic text-slate-700">
                    "Our mission is to transform how homeowners manage, maintain, and enhance their living spaces through technology and exceptional service."
                  </p>
                  <p className="text-slate-500 mt-2">— Alex Johnson, Founder & CEO</p>
                </div>
                <p>
                  Our commitment remains the same as day one: to provide exceptional service, transparent pricing, and a stress-free experience for every customer.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center bg-slate-100 p-2 px-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-700">24/7 Support</span>
                </div>
                <div className="flex items-center bg-slate-100 p-2 px-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-700">Best Price Guarantee</span>
                </div>
                <div className="flex items-center bg-slate-100 p-2 px-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-700">Same-Day Appointments</span>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16"
            >
              {[
                { number: "500K+", label: "Happy Customers", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { number: "10K+", label: "Verified Professionals", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                { number: "100+", label: "Cities Covered", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { number: "4.8/5", label: "Customer Rating", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-slate-100 p-3 w-14 h-14 rounded-full mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.number}</h3>
                  <p className="text-slate-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonials */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-16 bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto"
            >
              <h2 className="text-3xl font-semibold text-slate-800 text-center mb-10">What Our Customers Say</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="bg-slate-50 p-6 rounded-lg relative"
                  >
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-slate-800 text-white flex items-center justify-center rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 italic mb-4">{testimonial.quote}</p>
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                          <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                          <p className="text-sm text-slate-500">{testimonial.location}</p>
                        </div>
                      </div>
                      <div className="flex mt-2 md:mt-0">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Our Values */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-16 max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-center mb-10">
                <div className="h-px bg-slate-300 w-12"></div>
                <h2 className="text-3xl font-semibold text-slate-800 px-4">Our Values</h2>
                <div className="h-px bg-slate-300 w-12"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Trust & Reliability", description: "We thoroughly vet every service provider on our platform to ensure the highest standards of professionalism and quality.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                  { title: "Customer Satisfaction", description: "Your happiness is our priority. We're not satisfied until you're delighted with the service you've received.", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { title: "Innovation", description: "We continuously improve our platform to make finding and booking home services as seamless and stress-free as possible.", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
                ].map((value, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md p-6 relative border-t-4 border-slate-800"
                  >
                    <div className="absolute -top-8 left-6 bg-slate-800 text-white w-16 h-16 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                      </svg>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">{value.title}</h3>
                      <p className="text-slate-600">{value.description}</p>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <a href="#" className="inline-flex items-center text-slate-800 font-medium hover:text-slate-600">
                          <span>Learn more</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Meet Our Team */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-16 max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-center mb-10">
                <div className="h-px bg-slate-300 w-12"></div>
                <h2 className="text-3xl font-semibold text-slate-800 px-4">Meet Our Team</h2>
                <div className="h-px bg-slate-300 w-12"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden group"
                    whileHover={{ y: -10 }}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex justify-center space-x-3">
                          <a href="#" className="bg-white rounded-full p-2 hover:bg-slate-100 transition-colors">
                            <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                            </svg>
                          </a>
                          <a href="#" className="bg-white rounded-full p-2 hover:bg-slate-100 transition-colors">
                            <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                          </a>
                          <a href="#" className="bg-white rounded-full p-2 hover:bg-slate-100 transition-colors">
                            <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                            </svg>
                          </a>
                          <a href="#" className="bg-white rounded-full p-2 hover:bg-slate-100 transition-colors">
                            <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-slate-800">{member.name}</h3>
                      <p className="text-slate-500 text-sm mb-3">{member.role}</p>
                      <p className="text-slate-600 text-sm">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-10">
                <a href="/careers" className="inline-flex items-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                  <span>Join Our Team</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-16 max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-semibold text-slate-800 text-center mb-10">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {[
                  { question: "How do you verify service providers?", 
                    answer: "Each service provider undergoes a rigorous vetting process including background checks, license verification, insurance coverage review, and customer reviews analysis. We only onboard providers who meet our strict quality and reliability standards." },
                  { question: "What if I'm not satisfied with the service?", 
                    answer: "Your satisfaction is guaranteed. If you're not completely happy with the service provided, contact us within 48 hours and we'll work to resolve the issue or offer a full refund." },
                  { question: "How quickly can I get service?", 
                    answer: "For most services, we offer same-day or next-day appointments. Emergency services like plumbing or electrical issues often have providers available within 1-2 hours of booking." },
                  { question: "Do you serve my area?", 
                    answer: "We currently operate in over 100 cities across the United States. You can check if your area is covered by entering your zip code on our homepage or contacting our customer support team." }
                ].map((faq, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="border-b border-slate-200 pb-6 last:border-0"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-start">
                      <span className="bg-slate-100 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                        <span>{index + 1}</span>
                      </span>
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 pl-9">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 bg-slate-50 p-6 rounded-lg">
                <p className="text-center text-slate-700">
                  Have more questions? Contact our customer support team.
                </p>
                <div className="flex justify-center mt-4">
                  <a href="/contact" className="inline-flex items-center text-slate-800 hover:text-slate-600 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>Contact Support</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl overflow-hidden shadow-xl mb-16 max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="p-8 lg:p-12 col-span-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your home experience?</h2>
                  <p className="text-slate-300 mb-8 text-lg">Join over 500,000 homeowners who trust us with their home service and product needs.</p>
                  <div className="flex flex-wrap gap-4">
                    <a href="/get-started" className="bg-white text-slate-800 hover:bg-slate-100 font-medium px-6 py-3 rounded-lg transition-colors duration-300 inline-flex items-center">
                      <span>Get Started</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                    <a href="/contact" className="border border-white text-white hover:bg-white hover:text-slate-800 font-medium px-6 py-3 rounded-lg transition-colors duration-300">
                      Contact Sales
                    </a>
                  </div>
                  <div className="mt-8 flex items-center">
                    <div className="flex -space-x-2 mr-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-700 overflow-hidden">
                          <img src={`/api/placeholder/32/32`} alt="Customer" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-slate-300">Trusted by homeowners across the nation</div>
                  </div>
                </div>
                <div className="col-span-2 hidden lg:block relative">
                  <div className="absolute inset-0 bg-slate-900 opacity-20"></div>
                  <img src="/api/placeholder/600/400" alt="Happy home owner" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;