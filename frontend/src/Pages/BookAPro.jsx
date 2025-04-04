import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Star, ChevronRight, Home, Briefcase, MapPinned, ShieldCheck, Clock, Users, ChevronDown, X, Navigation } from 'lucide-react';

const BookProPage = () => {
  const [activeAddress, setActiveAddress] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImagePlaceholder, setShowImagePlaceholder] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [addressBarFocused, setAddressBarFocused] = useState(false);
  
  const addressInputRef = useRef(null);
  
  // Close address dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setAddressBarFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addressInputRef]);
  
  const addresses = {
    home: "123 Main Street, Apartment 4B, Mumbai",
    work: "Tech Park Building, Floor 5, Bangalore",
    other: "Parents' House, Villa 27, Chennai"
  };
  
  const services = [
    {
      category: "Daily Essentials",
      icon: "package",
      items: [
        { 
          id: "milk-delivery",
          name: "Milk Delivery", 
          rating: 4.7, 
          bookings: 1230, 
          icon: "milk",
          description: "Fresh milk delivery at your doorstep every morning. Choose from multiple brands and types of milk.",
          availableTimes: ["6:00 AM - 8:00 AM", "4:00 PM - 6:00 PM"],
          experience: "5+ years",
          verified: true
        },
        { 
          id: "newspaper-delivery",
          name: "Newspaper/Magazine Delivery", 
          rating: 4.5, 
          bookings: 987, 
          icon: "newspaper",
          description: "Daily newspaper and magazine delivery service. Local and national publications available.",
          availableTimes: ["5:30 AM - 7:30 AM"],
          experience: "3+ years",
          verified: true
        },
        { 
          id: "tiffin-service",
          name: "Tiffin/Dabbawala Service", 
          rating: 4.8, 
          bookings: 1543, 
          icon: "utensils",
          description: "Home-cooked meals delivered to your home or office. Multiple cuisine options available.",
          availableTimes: ["11:00 AM - 1:00 PM"],
          experience: "8+ years",
          verified: true
        },
        { 
          id: "domestic-help",
          name: "Domestic Help", 
          rating: 4.6, 
          bookings: 876, 
          icon: "home",
          description: "Professional house cleaning and maintenance services. Daily, weekly or monthly scheduling available.",
          availableTimes: ["8:00 AM - 6:00 PM"],
          experience: "7+ years",
          verified: true
        },
        { 
          id: "grocery-delivery",
          name: "Grocery Delivery", 
          rating: 4.4, 
          bookings: 2150, 
          icon: "shopping-bag",
          description: "Get groceries delivered right to your doorstep within hours. Wide range of products available.",
          availableTimes: ["10:00 AM - 8:00 PM"],
          experience: "4+ years",
          verified: true
        },
        { 
          id: "water-delivery",
          name: "Water Can Delivery", 
          rating: 4.3, 
          bookings: 1876, 
          icon: "droplet",
          description: "Purified water can delivery service. Regular scheduling options available.",
          availableTimes: ["9:00 AM - 6:00 PM"],
          experience: "6+ years",
          verified: true
        }
      ]
    },
    {
      category: "Home Repairs",
      icon: "tool",
      items: [
        { 
          id: "plumber",
          name: "Plumber", 
          rating: 4.6, 
          bookings: 987, 
          icon: "droplet",
          description: "Professional plumbing services for repairs, installations, and maintenance.",
          availableTimes: ["8:00 AM - 8:00 PM"],
          experience: "10+ years",
          verified: true
        },
        { 
          id: "electrician",
          name: "Electrician", 
          rating: 4.7, 
          bookings: 1320, 
          icon: "zap",
          description: "Expert electrical services for your home and office. Emergency services available.",
          availableTimes: ["8:00 AM - 9:00 PM"],
          experience: "12+ years",
          verified: true
        },
        { 
          id: "carpenter",
          name: "Carpenter", 
          rating: 4.5, 
          bookings: 765, 
          icon: "tool",
          description: "Skilled carpenters for furniture repair, installation and custom woodwork.",
          availableTimes: ["9:00 AM - 6:00 PM"],
          experience: "15+ years",
          verified: true
        },
        { 
          id: "appliance-repair",
          name: "Appliance Repair", 
          rating: 4.8, 
          bookings: 1432, 
          icon: "settings",
          description: "Repair services for all major home appliances. Quick diagnostics and same-day service.",
          availableTimes: ["10:00 AM - 7:00 PM"],
          experience: "8+ years",
          verified: true
        },
        { 
          id: "pest-control",
          name: "Pest Control", 
          rating: 4.4, 
          bookings: 654, 
          icon: "shield",
          description: "Complete pest management solutions. Safe and effective treatments.",
          availableTimes: ["8:00 AM - 5:00 PM"],
          experience: "9+ years",
          verified: true
        },
        { 
          id: "painter",
          name: "Painter", 
          rating: 4.5, 
          bookings: 432, 
          icon: "paint-bucket",
          description: "Professional painting services for interior and exterior walls. Custom color mixing available.",
          availableTimes: ["9:00 AM - 6:00 PM"],
          experience: "7+ years",
          verified: true
        },
        { 
          id: "mason",
          name: "Mason", 
          rating: 4.3, 
          bookings: 321, 
          icon: "home",
          description: "Expert mason services for construction and repair work. Quality craftsmanship guaranteed.",
          availableTimes: ["8:00 AM - 5:00 PM"],
          experience: "20+ years",
          verified: true
        }
      ]
    },
    {
      category: "Other Services",
      icon: "more-horizontal",
      items: [
        { 
          id: "laundry",
          name: "Laundry/Ironing", 
          rating: 4.7, 
          bookings: 876, 
          icon: "shirt",
          description: "Professional laundry and ironing services. Pick-up and delivery options available.",
          availableTimes: ["10:00 AM - 7:00 PM"],
          experience: "5+ years",
          verified: true
        },
        { 
          id: "car-wash",
          name: "Car/Bike Wash", 
          rating: 4.6, 
          bookings: 765, 
          icon: "car",
          description: "Thorough cleaning service for your vehicles. Eco-friendly products used.",
          availableTimes: ["7:00 AM - 8:00 PM"],
          experience: "6+ years",
          verified: true
        }
      ]
    }
  ];
  
  const filteredServices = searchQuery.length > 0
    ? services.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0)
    : services;

  // Function to toggle service card expansion
  const toggleServiceExpansion = (serviceId) => {
    if (expandedServiceId === serviceId) {
      setExpandedServiceId(null);
    } else {
      setExpandedServiceId(serviceId);
    }
  };

  // Function to render service icon or image placeholder
  const renderServiceIcon = (iconName) => {
    if (showImagePlaceholder) {
      return (
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <img src="/api/placeholder/48/48" alt="Service" className="w-8 h-8 rounded-full" />
        </div>
      );
    }
    
    // Map icon names to Lucide icons
    const iconMap = {
      "milk": <ShieldCheck className="w-6 h-6" />,
      "newspaper": <ShieldCheck className="w-6 h-6" />,
      "utensils": <ShieldCheck className="w-6 h-6" />,
      "home": <Home className="w-6 h-6" />,
      "shopping-bag": <ShieldCheck className="w-6 h-6" />,
      "droplet": <ShieldCheck className="w-6 h-6" />,
      "zap": <ShieldCheck className="w-6 h-6" />,
      "tool": <ShieldCheck className="w-6 h-6" />,
      "settings": <ShieldCheck className="w-6 h-6" />,
      "shield": <ShieldCheck className="w-6 h-6" />,
      "paint-bucket": <ShieldCheck className="w-6 h-6" />,
      "shirt": <ShieldCheck className="w-6 h-6" />,
      "car": <ShieldCheck className="w-6 h-6" />
    };
    
    return (
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
        {iconMap[iconName] || <ShieldCheck className="w-6 h-6" />}
      </div>
    );
  };
    
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        
        
        {/* Redesigned Search and Address Bar - Translucent with no background container */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 mt-16 w-160 ml-auto">
          {/* Translucent Search Bar */}
          <div className="md:w-4/8 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-slate-900" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/90 focus:bg-white"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Redesigned Address Bar with Dropdown */}
          <div className="md:w-3/5 relative" ref={addressInputRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              className={`w-full pl-10 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/90 focus:bg-white ${addressBarFocused ? 'border-slate-500' : 'border'}`}
              value={addresses[activeAddress]}
              readOnly
              onClick={() => setAddressBarFocused(true)}
              onFocus={() => setAddressBarFocused(true)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${addressBarFocused ? 'transform rotate-180' : ''}`} />
            </div>
            
            {/* Address Dropdown Menu */}
            {addressBarFocused && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-20 animate-slideDown">
                <div className="p-3">
                  <button 
                    className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'home' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}
                    onClick={() => {
                      setActiveAddress('home');
                      setAddressBarFocused(false);
                    }}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">Home</div>
                      <div className="text-xs opacity-80 truncate">{addresses.home}</div>
                    </div>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'work' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}
                    onClick={() => {
                      setActiveAddress('work');
                      setAddressBarFocused(false);
                    }}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">Work</div>
                      <div className="text-xs opacity-80 truncate">{addresses.work}</div>
                    </div>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-3 py-2 mb-3 rounded-lg transition ${activeAddress === 'other' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}
                    onClick={() => {
                      setActiveAddress('other');
                      setAddressBarFocused(false);
                    }}
                  >
                    <MapPinned className="w-4 h-4 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">Other</div>
                      <div className="text-xs opacity-80 truncate">{addresses.other}</div>
                    </div>
                  </button>
                  
                  <div className="border-t border-slate-200 pt-3">
                    <button className="w-full flex items-center px-3 py-2 rounded-lg transition hover:bg-slate-100 text-slate-600">
                      <Navigation className="w-4 h-4 mr-2" />
                      <div className="text-sm">Use current location</div>
                    </button>
                    <button className="w-full flex items-center px-3 py-2 rounded-lg transition hover:bg-slate-100 text-slate-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <div className="text-sm">Add new address</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Services List - With Horizontal Expandable Cards */}
        {filteredServices.map((category, index) => (
          <div key={index} className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-slate-800 text-white rounded-lg mr-2 sm:mr-3">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              {category.category}
            </h3>
            
            {/* Service Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {category.items.map((service) => {
                const isExpanded = expandedServiceId === service.id;
                
                // Apply grid column span when expanded
                const cardClasses = isExpanded 
                  ? "sm:col-span-2 lg:col-span-3 transition-all duration-300" 
                  : "transition-all duration-300";
                
                return (
                  <div key={service.id} className={cardClasses}>
                    {/* Base Card - Always Visible */}
                    <div className={`bg-white rounded-xl shadow overflow-hidden border border-slate-100 hover:shadow-lg transition ${isExpanded ? 'expanded-card' : ''}`}>
                      <div 
                        className="p-3 sm:p-4 flex flex-col cursor-pointer h-full"
                        onClick={() => toggleServiceExpansion(service.id)}
                      >
                        {!isExpanded ? (
                          // Normal Card View
                          <>
                            <div className="flex items-start mb-1">
                              {renderServiceIcon(service.icon)}
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-base sm:text-lg font-medium text-slate-900 truncate">{service.name}</h4>
                                  <div className="flex items-center bg-slate-700/40 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-yellow-400 mr-1" />
                                    <span>{service.rating}</span>
                                  </div>
                                </div>
                                <div className="flex items-center text-slate-500 text-xs sm:text-sm mt-1 h-5">
                                  <Users className="w-3 h-3 mr-1" />
                                  <span>{service.bookings}+ bookings</span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Action Area */}
                            <div className="flex justify-between items-center mt-3 sm:mt-4 mt-auto">
                              <button className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg px-3 sm:px-5 py-1 sm:py-2 transition shadow w-24 sm:w-32 text-xs sm:text-base">
                                Hire Now
                              </button>
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                              </div>
                            </div>
                          </>
                        ) : (
                          // Expanded Horizontal Card View
                          <div className="flex flex-col sm:flex-row animate-expandHorizontal">
                            {/* Left Side - Image and Basic Info */}
                            <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
                              <div className="relative w-full h-40 mb-3">
                                <img 
                                  src="/api/placeholder/400/200" 
                                  alt={service.name} 
                                  className="w-full h-full object-cover rounded-lg" 
                                />
                              </div>
                              <h4 className="text-lg font-semibold text-slate-900 mb-1">{service.name}</h4>
                              <div className="flex items-center mb-2">
                                <div className="flex items-center bg-slate-700/40 text-white px-2 py-1 rounded-md text-xs mr-2">
                                  <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
                                  <span>{service.rating}</span>
                                </div>
                                <div className="flex items-center text-slate-500 text-xs">
                                  <Users className="w-3 h-3 mr-1" />
                                  <span>{service.bookings}+ bookings</span>
                                </div>
                              </div>
                              <div className="flex items-center mb-2">
                                <ShieldCheck className="w-3 h-3 text-green-600 mr-1" />
                                <span className="text-xs text-slate-600">
                                  {service.verified ? "Verified Professional" : "Verification Pending"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Middle Section - Details */}
                            <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
                              <h5 className="text-sm font-semibold text-slate-900 mb-1">About</h5>
                              <p className="text-xs text-slate-600 mb-3">{service.description}</p>
                              
                              <h5 className="text-sm font-semibold text-slate-900 mb-1">Experience</h5>
                              <p className="text-xs text-slate-600 mb-3">{service.experience}</p>
                              
                              <h5 className="text-sm font-semibold text-slate-900 mb-1">Available Times</h5>
                              {service.availableTimes.map((time, idx) => (
                                <div key={idx} className="flex items-center mb-1 last:mb-0">
                                  <Clock className="w-3 h-3 text-slate-600 mr-1" />
                                  <span className="text-xs text-slate-600">{time}</span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Right Section - Actions */}
                            <div className="sm:w-1/3 flex flex-col justify-between">
                              <div>
                                <h5 className="text-sm font-semibold text-slate-900 mb-2">Service Options</h5>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                  <div className="bg-slate-100 p-2 rounded-lg text-xs text-center">One-time</div>
                                  <div className="bg-slate-100 p-2 rounded-lg text-xs text-center">Recurring</div>
                                  <div className="bg-slate-100 p-2 rounded-lg text-xs text-center">Emergency</div>
                                  <div className="bg-slate-100 p-2 rounded-lg text-xs text-center">Bundle</div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 mt-auto">
                                <button className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg py-2 transition shadow text-sm w-full">
                                  Hire Now
                                </button>
                                <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg py-2 transition shadow text-sm w-full">
                                  Contact
                                </button>
                                <button 
                                  className="mt-2 text-slate-500 hover:text-slate-700 text-sm flex items-center justify-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleServiceExpansion(service.id);
                                  }}
                                >
                                  <ChevronDown className="w-4 h-4 mr-1" /> Close Details
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Advertisement Panel */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6 mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="sm:w-2/3 mb-4 sm:mb-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Get 25% off on your first booking!</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-3">Use code FIRSTPRO25 when you book any service through our app. Valid for new users only.</p>
              <button className="bg-white text-slate-800 hover:bg-slate-100 font-semibold rounded-lg px-5 py-2 transition shadow-md text-sm sm:text-base">
                Download App Now
              </button>
            </div>
            <div className="sm:w-1/3 flex justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
                <img src="/api/placeholder/160/160" alt="App Promotion" className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Add global CSS for animations */}
      <style jsx global>{`
        @keyframes popIn {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expandHorizontal {
          from {
            opacity: 0.7;
            transform: scaleX(0.97);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-popIn {
          animation: popIn 0.2s ease-out forwards;
        }
        
        .animate-expandHorizontal {
          animation: expandHorizontal 0.3s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
        
        .expanded-card {
          transition: all 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookProPage;