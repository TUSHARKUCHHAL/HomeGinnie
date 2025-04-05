              
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Home, Package, Car, Store, Coffee, FileText, Utensils, User, Droplet, Zap, Shield, Brush, MessageSquare, Clock, Map, Users, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const carouselRef = useRef(null);
  const detailsRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const cardsPerView = 3; // Fixed at 3 cards per view
  
  // Services data with expanded descriptions
  const services = [
    {
    id: 1,
    title: "Daily Essentials",
    description: "Groceries, vegetables, and daily necessities delivered to your doorstep within hours. Fresh produce and quality products guaranteed.",
    icon: <ShoppingCart size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Same-day delivery", "Quality guarantee", "Competitive pricing", "Wide product range"],
    longDescription: "Our Daily Essentials service brings you the freshest groceries, vegetables, and household items directly to your doorstep. We partner with local farmers and trusted brands to ensure you receive only the highest quality products. With our efficient delivery network, we can fulfill most orders within hours of placement. Our dedicated shoppers carefully select each item as if they were shopping for themselves.",
    statistics: ["5,000+ daily orders", "98% satisfaction rate", "30+ minute average delivery time"]
    },
    {
    id: 2,
    title: "Appliance Repair",
    description: "Quick and reliable repairs for all your home appliances with certified technicians and genuine spare parts.",
    icon: <Home size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Same-day diagnosis", "90-day repair warranty", "Certified technicians", "Genuine parts"],
    longDescription: "Our Appliance Repair service offers quick solutions to all your appliance problems. Our network of certified technicians specializes in repairing refrigerators, washing machines, dishwashers, ovens, and more. We use only genuine spare parts to ensure durability and optimal performance. All repairs come with a 90-day warranty for your peace of mind. Our technicians arrive at your doorstep with the necessary tools and parts to fix most issues on the first visit.",
    statistics: ["25,000+ repairs completed", "92% first-visit resolution", "4.7/5 customer satisfaction"]
    },
    {
    id: 3,
    title: "Shop Listings",
    description: "List your shop and reach thousands of customers in your area. Boost visibility and increase foot traffic to your physical store.",
    icon: <Store size={32} className="text-slate-800" />,
    tag: "For Shop Owners",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Enhanced visibility", "Customer analytics", "Promotion tools", "Inventory management"],
    longDescription: "Our Shop Listings service helps local businesses increase their online presence and connect with customers in their vicinity. We provide a comprehensive digital storefront where you can showcase your products, services, operating hours, and special promotions. Our platform's advanced algorithms ensure your shop appears in relevant local searches. With integrated analytics tools, you can track customer engagement, popular items, and peak visiting hours to optimize your business strategy.",
    statistics: ["12,000+ registered shops", "35% average increase in foot traffic", "230,000+ monthly active users"]
    },
    {
    id: 4,
    title: "Local Delivery",
    description: "Fast local delivery services for businesses and individuals with real-time tracking and flexible scheduling options.",
    icon: <Car size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Real-time tracking", "Insurance coverage", "Flexible scheduling", "Express options"],
    longDescription: "Our Local Delivery service provides reliable, same-day delivery solutions for both businesses and individuals. Whether you're sending important documents, retail products, or food items, our network of verified delivery partners ensures your packages arrive safely and on time. Recipients can track deliveries in real-time through our mobile app, receiving notifications at every stage of the delivery process. For businesses, we offer API integration with your e-commerce platform for seamless order fulfillment.",
    statistics: ["15,000+ daily deliveries", "99.3% on-time delivery rate", "Average delivery time: 45 minutes"]
    },
    {
    id: 5,
    title: "Milk Delivery",
    description: "Fresh milk, curd, paneer, and dairy products delivered to your doorstep every morning from verified local dairies.",
    icon: <Coffee size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Daily delivery", "Fresh dairy products", "Subscription plans", "Early morning delivery"],
    longDescription: "Our Milk Delivery service ensures you never run out of fresh dairy products. We partner with local dairies and verified suppliers to bring you farm-fresh milk, curd, paneer, and other dairy essentials. Set up a subscription for daily, alternate days, or weekly deliveries at your preferred time. Our delivery associates arrive early morning so you have fresh products ready for breakfast. With our easy-to-use platform, you can modify orders, pause deliveries when traveling, or add special requests.",
    statistics: ["3,000+ daily deliveries", "99% on-time delivery rate", "100% quality assurance"]
    },
    {
    id: 6,
    title: "Newspaper/Magazine Delivery",
    description: "Daily newspapers and magazines delivered to your doorstep on time. Subscribe to multiple publications with a single subscription.",
    icon: <FileText size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Early morning delivery", "Multiple publication options", "Flexible subscription plans", "Monthly billing"],
    longDescription: "Our Newspaper/Magazine Delivery service connects you with verified vendors who ensure your selected publications reach your doorstep before you start your day. Choose from hundreds of newspapers and magazines in multiple languages. Our flexible subscription plans allow you to receive daily, weekly, or monthly publications based on your reading preferences. You can easily manage your subscriptions, temporarily halt delivery when traveling, and settle all payments through a single monthly bill.",
    statistics: ["12,000+ active subscribers", "98.7% on-time delivery", "250+ publications available"]
    },
    {
    id: 7,
    title: "Tiffin/Dabbawala Service",
    description: "Homestyle nutritious meals delivered to your workplace or home daily with customizable menu options and dietary preferences.",
    icon: <Utensils size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Home-cooked meals", "Customizable menu", "Dietary preferences", "Reusable containers"],
    longDescription: "Our Tiffin/Dabbawala Service brings the comfort of home-cooked meals to your workplace or residence. We connect you with verified home chefs and small-scale meal providers who prepare fresh, nutritious food daily. Choose from various cuisines and dietary preferences—vegetarian, vegan, low-carb, high-protein, and more. Our subscription plans offer flexibility to select meals for specific days of the week. The meals are delivered in reusable, eco-friendly containers that are collected during the next delivery, reducing waste and environmental impact.",
    statistics: ["4,500+ active subscribers", "30+ cuisine options", "97% satisfaction rate"]
    },
    {
    id: 8,
    title: "Domestic Help",
    description: "Connect with verified maids, cooks, and cleaners for your household needs with background checks and flexible hiring options.",
    icon: <User size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Background verified staff", "Flexible timing", "Skill-matched professionals", "Replacement guarantee"],
    longDescription: "Our Domestic Help service connects households with verified domestic professionals including maids, cooks, cleaners, and caretakers. All service providers undergo thorough background verification, skill assessment, and training before joining our platform. You can hire help on a daily, weekly, or monthly basis according to your requirements. Our platform handles scheduling, payments, and performance tracking, ensuring a hassle-free experience. If you're not satisfied with the service, we offer a replacement guarantee to find a better match for your needs.",
    statistics: ["5,000+ verified professionals", "4.7/5 average service rating", "95% retention rate"]
    },
    {
    id: 9,
    title: "Grocery Delivery",
    description: "Fresh groceries from local kirana stores and organic farms delivered to your doorstep with personalized shopping experience.",
    icon: <ShoppingCart size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Local store connections", "Organic options", "Same-day delivery", "Personal shopper assistance"],
    longDescription: "Our Grocery Delivery service connects you with nearby kirana stores and organic farms for fresh, locally sourced products. Unlike big supermarkets, we focus on supporting small businesses while giving you access to authentic, quality groceries. Our personal shoppers communicate with you in real-time if substitutions are needed or to help find specific items. Whether you need staples, fresh produce, specialty ingredients, or organic products, we deliver them within hours of ordering. Save your regular shopping lists for quick reordering and set up scheduled deliveries for essentials.",
    statistics: ["2,000+ local store partners", "95% order accuracy", "500+ organic products available"]
    },
    {
    id: 10,
    title: "Water Can Delivery",
    description: "Purified drinking water delivered in 20L cans from Bisleri, Kinley, and local trusted suppliers with subscription options.",
    icon: <Droplet size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Quality certified water", "Multiple brands", "Subscription plans", "Same-day delivery"],
    longDescription: "Our Water Can Delivery service ensures you never run out of safe drinking water. We partner with trusted brands like Bisleri and Kinley, as well as certified local suppliers, to deliver 20L water cans to homes and offices. Set up weekly or monthly subscriptions based on your consumption patterns, with the flexibility to request additional cans during high-usage periods. Our delivery personnel also assist with installation and replacement of empty cans. All suppliers on our platform undergo regular quality checks to ensure the water meets safety standards.",
    statistics: ["8,000+ active subscribers", "99.2% on-time delivery", "100% quality assurance"]
    },
    {
    id: 11,
    title: "Plumbing Services",
    description: "Professional plumbers for leakage repairs, tap installation, motor repairs, and all household plumbing requirements.",
    icon: <Home size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Certified professionals", "Same-day service", "90-day workmanship warranty", "Transparent pricing"],
    longDescription: "Our Plumbing Services connect you with certified plumbers for all your household needs. Whether you're dealing with leaking pipes, clogged drains, tap installations, or motor repairs, our professionals arrive with the necessary tools and parts to fix the issues promptly. All plumbers on our platform have undergone skill verification and background checks for your safety and peace of mind. We offer transparent pricing with no hidden charges, and all work comes with a 90-day warranty. For emergencies, our priority service ensures a plumber reaches you within hours.",
    statistics: ["10,000+ service calls completed", "4.8/5 average rating", "92% first-visit resolution"]
    },
    {
    id: 12,
    title: "Electrical Services",
    description: "Skilled electricians for wiring, switchboard installation, inverter repair, and all electrical work with safety certification.",
    icon: <Zap size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Licensed electricians", "Emergency service", "Safety guaranteed", "Genuine components"],
    longDescription: "Our Electrical Services provide licensed and insured electricians for all your electrical needs. From rewiring and switchboard installations to inverter repairs and fault diagnosis, our professionals handle jobs of all sizes with utmost safety and precision. Each electrician on our platform is certified and regularly evaluated on their technical skills and safety protocols. We use genuine components and provide detailed explanations of the work performed. For electrical emergencies, our priority service ensures quick response times to prevent hazards and restore power.",
    statistics: ["15,000+ successful repairs", "99.9% safety record", "4.9/5 customer rating"]
    },
    {
    id: 13,
    title: "Carpentry Services",
    description: "Expert carpenters for furniture repair, polishing, modular kitchen installation, and custom woodwork solutions.",
    icon: <Home size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Skilled craftsmen", "Quality materials", "Custom designs", "Finishing expertise"],
    longDescription: "Our Carpentry Services connect you with skilled craftsmen for all wood-related work in your home or office. Whether you need furniture repairs, polishing of existing pieces, installation of modular kitchens, or custom woodwork, our carpenters deliver expert solutions. Each professional on our platform has years of experience working with different types of wood and modern materials. We offer consultation services to help you choose the right designs, materials, and finishes for your space. For custom projects, our carpenters provide detailed plans and cost estimates before beginning work.",
    statistics: ["7,500+ projects completed", "4.7/5 average rating", "85% repeat customers"]
    },
    {
    id: 14,
    title: "Pest Control",
    description: "Professional pest management services for cockroaches, termites, rodents, and other household pests with safe treatments.",
    icon: <Shield size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Eco-friendly options", "Certified technicians", "Preventive treatments", "Child and pet safe solutions"],
    longDescription: "Our Pest Control service offers comprehensive solutions for eliminating and preventing household pests. Our certified technicians are trained to handle cockroach infestations, termite treatments, rodent control, bed bugs, and more. We use scientifically proven methods and chemicals that are effective against pests while being safe for humans, pets, and the environment. Each treatment comes with recommendations for preventive measures and follow-up inspections to ensure complete eradication. For ongoing protection, we offer quarterly maintenance plans that keep your home pest-free year-round.",
    statistics: ["20,000+ homes protected", "98% effectiveness rate", "6-month warranty on treatments"]
    },
    {
    id: 15,
    title: "Painting Services",
    description: "Professional wall painting, waterproofing, and finishing solutions with quality paints and skilled painters.",
    icon: <Brush size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Free consultation", "Premium paint options", "Texture finishes", "Waterproofing expertise"],
    longDescription: "Our Painting Services transform your living and working spaces with professional painting solutions. From basic wall painting to decorative textures, waterproofing, and specialized finishes, our skilled painters deliver flawless results. We begin with a free consultation to understand your requirements and recommend suitable paint types, colors, and techniques. Our team handles all the preparation work including surface cleaning, crack filling, and priming to ensure paint longevity. We use premium paints from trusted brands and employ dust-minimizing techniques for a clean painting process.",
    statistics: ["5,000+ projects completed", "4.8/5 customer satisfaction", "3-year average paint durability"]
    },
    {
    id: 16,
    title: "Masonry Services",
    description: "Professional masons for tile repair, brickwork, concrete structures, and other masonry requirements with quality materials.",
    icon: <Home size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Experienced craftsmen", "Quality materials", "Structural expertise", "Detailed estimates"],
    longDescription: "Our Masonry Services provide skilled masons for all types of brick, concrete, and stonework. Whether you need tile repairs, bathroom renovations, garden pathways, or structural modifications, our professionals deliver durable and aesthetically pleasing results. Each mason on our platform has extensive experience working with various materials including ceramic tiles, natural stone, brick, and concrete. We start with a thorough assessment of your requirements, providing detailed cost estimates and timelines before beginning work. All projects come with a workmanship warranty to ensure long-lasting results.",
    statistics: ["3,000+ successful projects", "4.6/5 average rating", "98% structural integrity rating"]
    },
    {
    id: 17,
    title: "Laundry & Ironing",
    description: "Convenient pickup and delivery services for laundry and ironing with eco-friendly cleaning options and garment care.",
    icon: <MessageSquare size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["Door-to-door service", "Express options", "Specialized garment care", "Eco-friendly cleaning"],
    longDescription: "Our Laundry & Ironing service offers hassle-free solutions for your garment care needs. We provide scheduled pickup and delivery of your clothes, ensuring they return clean, pressed, and ready to wear. Our service includes options for regular washing, dry cleaning, starching, and premium ironing based on fabric requirements. We use eco-friendly detergents and modern cleaning techniques that are gentle on clothes while thoroughly removing stains and odors. For busy professionals, our subscription plans offer weekly or bi-weekly service at discounted rates, ensuring you always have clean clothes without the hassle.",
    statistics: ["10,000+ active customers", "48-hour standard turnaround", "99.7% garment safety record"]
    },
    {
    id: 18,
    title: "Car & Bike Wash",
    description: "Professional vehicle cleaning services at your doorstep with eco-friendly products and interior detailing options.",
    icon: <Car size={32} className="text-slate-800" />,
    tag: "Available for Users",
    color: "bg-gradient-to-br from-slate-50 to-slate-100",
    features: ["At-home service", "Water-saving techniques", "Interior detailing", "Subscription plans"],
    longDescription: "Our Car & Bike Wash service brings professional vehicle cleaning to your doorstep. Our trained cleaners use modern equipment and eco-friendly cleaning solutions that give your vehicle a spotless finish while conserving water. Choose from various packages including exterior wash, interior vacuuming, dashboard polishing, and detailed cleaning. For regular maintenance, our subscription plans offer daily, weekly, or monthly services at preferred rates. We arrive with our own water supply and power source, making the service completely self-sufficient and convenient for apartments and homes with limited facilities.",
    statistics: ["15,000+ vehicles serviced monthly", "4.8/5 customer satisfaction", "70% water saved compared to traditional washing"]
    }
    ];

  // Additional service info sections
  const serviceInfo = [
    {
      title: "How It Works",
      icon: <Clock size={40} className="text-slate-800" />,
      description: "Our services are designed to connect users with providers seamlessly. Simply browse, select, and book services through our platform. Our sophisticated matching algorithm ensures you get paired with the right service provider based on proximity, availability, and ratings."
    },
    {
      title: "Service Areas",
      icon: <Map size={40} className="text-slate-800" />,
      description: "HomeGinnie currently operates in 23 major cities across the country, with rapid expansion plans for suburban and rural areas. Our dense network of service providers ensures quick response times even in busy metropolitan areas."
    },
    {
      title: "Quality Assurance",
      icon: <Shield size={40} className="text-slate-800" />,
      description: "All service providers undergo thorough verification and background checks. We monitor performance through customer feedback and maintain strict quality standards. Providers falling below our service benchmarks receive additional training or are removed from our platform."
    },
    {
      title: "Community Impact",
      icon: <Users size={40} className="text-slate-800" />,
      description: "HomeGinnie has created over 25,000 job opportunities within local communities. Our platform supports small businesses and independent professionals, contributing to local economic growth while solving everyday problems for our users."
    },
    {
      title: "Awards & Recognition",
      icon: <Award size={40} className="text-slate-800" />,
      description: "HomeGinnie has been recognized as a leading service marketplace platform, winning multiple industry awards for innovation and customer satisfaction. We've been featured in major business publications and technology conferences."
    }
  ];

  // Check window size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Scroll to details when "Learn more" is clicked
  const handleLearnMore = (service) => {
    setSelectedService(service);
    
    // Scroll to details section after a short delay to allow rendering
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Modified navigation functions for infinite scrolling
  const handlePrev = () => {
    setActiveIndex(prevIndex => {
      if (prevIndex <= 0) {
        return services.length - cardsPerView; // Jump to the end when at the beginning
      }
      return prevIndex - cardsPerView;
    });
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => {
      if (prevIndex >= services.length - cardsPerView) {
        return 0; // Jump to the beginning when at the end
      }
      return prevIndex + cardsPerView;
    });
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

  // Calculate visible cards with circular logic for infinite scrolling
  const getVisibleCards = () => {
    // Create a loop-friendly array by calculating the modulo
    return Array(cardsPerView).fill().map((_, i) => {
      const index = (activeIndex + i) % services.length;
      return services[index];
    });
  };

  // Get current visible cards
  const visibleCards = getVisibleCards();

  // Calculate total number of unique pages for the dots navigation
  const totalPages = services.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-16">
        {/* Header with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Our Services</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover the range of services offered by HomeGinnie for users, shop owners, and service providers
          </p>
        </motion.div>

        {/* Services Carousel - Now with infinite scrolling */}
        <div className="relative mb-16">
          {/* Navigation Arrows with improved styling */}
          <motion.div 
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button 
              onClick={handlePrev}
              className="bg-white rounded-full p-3 shadow-lg text-slate-800 transition-all hover:bg-slate-100"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
          </motion.div>

          <motion.div 
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button 
              onClick={handleNext}
              className="bg-white rounded-full p-3 shadow-lg text-slate-800 transition-all hover:bg-slate-100"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>

          {/* Carousel Container with infinite scrolling */}
          <div 
            ref={carouselRef}
            className="overflow-hidden px-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {visibleCards.map((service) => (
                  <motion.div
                    key={`${activeIndex}-${service.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className={`${service.color} rounded-xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300`}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div className="p-6 h-full flex flex-col min-h-96"> {/* Increased minimum height */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          {service.icon}
                        </div>
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-white"
                        >
                          {service.tag}
                        </motion.span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                      <p className="text-slate-700 mb-6">{service.description}</p>
                      
                      {/* Key features list */}
                      <div className="mb-6 flex-grow">
                        <h4 className="font-medium text-slate-800 mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <motion.button 
                        onClick={() => handleLearnMore(service)}
                        whileHover={{ x: 5 }}
                        className="mt-auto text-slate-800 font-medium flex items-center group bg-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        <span className="group-hover:text-slate-900 transition-colors">Learn more</span>
                        <motion.svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 ml-1 text-slate-800 group-hover:text-slate-900" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                          animate={{ x: 0 }}
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dots Navigation - Updated for infinite scrolling */}
        <div className="flex justify-center mt-8 mb-16">
          {Array.from({ length: totalPages }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full mx-1 transition-all ${
                activeIndex % totalPages === index
                  ? 'bg-slate-800 w-8'
                  : 'bg-slate-300 w-2'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Service Detail Section - Shows when "Learn more" is clicked */}
        {selectedService && (
          <motion.div
            ref={detailsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-20 bg-white rounded-xl shadow-lg p-8 border border-slate-200"
          >
            <div className="flex items-center mb-6">
              <div className={`p-4 rounded-lg mr-4 ${selectedService.color}`}>
                {selectedService.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedService.title}</h2>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-white mt-1">
                  {selectedService.tag}
                </span>
              </div>
            </div>
            
            <div className="prose max-w-none text-slate-700 mb-8">
              <p className="text-lg">{selectedService.longDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {selectedService.statistics.map((stat, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="font-bold text-slate-900 text-lg">{stat}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                onClick={() => setSelectedService(null)}
              >
                Close Details
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* Additional Service Info Sections */}
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-slate-900 mb-10 text-center"
          >
            Why Choose HomeGinnie
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-slate-50 rounded-lg mr-3">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{info.title}</h3>
                </div>
                <p className="text-slate-700">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">HomeGinnie by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">500K+</p>
              <p className="text-slate-300">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">35K+</p>
              <p className="text-slate-300">Service Providers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">23</p>
              <p className="text-slate-300">Cities Covered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">4.8/5</p>
              <p className="text-slate-300">Average Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-slate-900">Sarah Johnson</h4>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-700 italic">"HomeGinnie has been a lifesaver for our busy family. The grocery delivery service is always on time and the quality is consistently great!"</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-slate-900">Michael Chen</h4>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-700 italic">"As a cafe owner, joining HomeGinnie's platform increased my revenue by 40% in just three months. Their tools make managing online orders incredibly simple."</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-slate-900">Jessica Rivera</h4>
                  <div className="flex text-amber-500">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 italic">"The appliance repair service was quick to respond and fixed my refrigerator on the first visit. Very professional and reasonably priced compared to other services I've used."</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Experience HomeGinnie?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and businesses benefiting from our comprehensive service platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-800 text-white font-medium px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Download App
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-slate-800 font-medium px-8 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Register as Provider
            </motion.button>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">How do I register as a service provider?</h3>
              <p className="text-slate-700">
                Registration is simple! Download our app, select "Register as Provider," complete your profile with required documents, and our team will verify your information within 24-48 hours.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">What areas do you currently serve?</h3>
              <p className="text-slate-700">
                We currently operate in 23 major cities and surrounding areas. You can check if we serve your location by entering your zip code in our app or website.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">How do you ensure quality and safety?</h3>
              <p className="text-slate-700">
                All service providers undergo thorough background checks and verification processes. We also continuously monitor performance through customer feedback and maintain strict quality standards.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">What happens if I'm not satisfied with a service?</h3>
              <p className="text-slate-700">
                Customer satisfaction is our priority. If you're not satisfied, you can report it through our app or customer service, and we'll address your concerns promptly, including arranging a redo or refund if necessary.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;