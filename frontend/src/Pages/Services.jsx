import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Home, Store, Package, Car, Coffee, Utensils } from 'lucide-react';

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);
  
  // Services data
  const services = [
    {
      id: 1,
      title: "Daily Essentials",
      description: "Groceries, vegetables, and daily necessities delivered to your doorstep",
      icon: <ShoppingCart size={32} />,
      tag: "Available for Users",
      color: "bg-cyan-100"
    },
    {
      id: 2,
      title: "Home Cleaning",
      description: "Professional cleaning services for your home and office spaces",
      icon: <Home size={32} />,
      tag: "Available for Users",
      color: "bg-emerald-100"
    },
    {
      id: 3,
      title: "Appliance Repair",
      description: "Quick and reliable repairs for all your home appliances",
      icon: <Home size={32} />,
      tag: "Available for Users",
      color: "bg-amber-100"
    },
    {
      id: 4,
      title: "Shop Listings",
      description: "List your shop and reach thousands of customers in your area",
      icon: <Store size={32} />,
      tag: "For Shop Owners",
      color: "bg-violet-100"
    },
    {
      id: 5,
      title: "Service Registration",
      description: "Register as a service provider and grow your business",
      icon: <Package size={32} />,
      tag: "For Providers",
      color: "bg-rose-100"
    },
    {
      id: 6,
      title: "Local Delivery",
      description: "Fast local delivery services for businesses and individuals",
      icon: <Car size={32} />,
      tag: "Available for Users",
      color: "bg-blue-100"
    },
    {
      id: 7,
      title: "Food & Beverages",
      description: "Order food and drinks from your favorite local restaurants",
      icon: <Utensils size={32} />,
      tag: "Available for Users",
      color: "bg-orange-100"
    },
    {
      id: 8,
      title: "Cafe Connections",
      description: "Connect your cafe to our platform and increase your visibility",
      icon: <Coffee size={32} />,
      tag: "For Shop Owners",
      color: "bg-teal-100"
    }
  ];

  // Check window size and update cards per view
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 640) setCardsPerView(1);
      else if (width < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle navigation
  const handlePrev = () => {
    setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev < services.length - cardsPerView ? prev + 1 : prev));
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover the range of services offered by HomeGinnie for users, shop owners, and service providers
          </p>
        </div>

        {/* Services Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center z-10">
            <button 
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`bg-white rounded-full p-2 shadow-lg text-slate-800 transition-all ${
                activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <button 
              onClick={handleNext}
              disabled={activeIndex >= services.length - cardsPerView}
              className={`bg-white rounded-full p-2 shadow-lg text-slate-800 transition-all ${
                activeIndex >= services.length - cardsPerView ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-${activeIndex * (100 / cardsPerView)}%)`,
                width: `${(services.length / cardsPerView) * 100}%`
              }}
            >
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="px-2"
                  style={{ width: `${100 / services.length * cardsPerView}%` }}
                >
                  <div className={`h-full rounded-xl shadow-md transition-all duration-300 overflow-hidden hover:shadow-lg hover:translate-y-1 ${service.color} border border-slate-200`}>
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          {service.icon}
                        </div>
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-white">
                          {service.tag}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                      <p className="text-slate-700 mb-4 flex-grow">{service.description}</p>
                      <button className="mt-auto text-slate-800 font-medium flex items-center hover:text-slate-600 transition-colors">
                        Learn more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8">
          {Array.from({ length: Math.ceil(services.length / cardsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index * cardsPerView)}
              className={`h-2 w-2 rounded-full mx-1 transition-all ${
                activeIndex >= index * cardsPerView && activeIndex < (index + 1) * cardsPerView
                  ? 'bg-slate-800 w-6'
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl py-10 px-6 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience HomeGinnie?</h2>
          <p className="text-slate-200 mb-8 max-w-2xl mx-auto">
            Whether you're a user looking for services, a shop owner wanting to expand, or a service provider ready to grow - HomeGinnie has something for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-md">
              Get Started
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;