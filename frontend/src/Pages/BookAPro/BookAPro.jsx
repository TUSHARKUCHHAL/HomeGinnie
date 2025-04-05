
// import React, { useState, useEffect } from 'react';
// import { Star, ChevronRight, Home, ShieldCheck, Clock, Users, ChevronDown, MapPin, AlertCircle } from 'lucide-react';
// import SearchAddressBar from './SearchAddressBar';
// import { useNavigate } from "react-router-dom";

// const BookProPage = () => {
//   const [activeAddress, setActiveAddress] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showImagePlaceholder, setShowImagePlaceholder] = useState(false);
//   const [expandedServiceId, setExpandedServiceId] = useState(null);
//   const navigate = useNavigate();
  
//   // Updated addresses state to initialize with empty values
//   const [addresses, setAddresses] = useState({
//     home: "",
//     work: "",
//     other: "",
//     current: ""
//   });

//   // Sample active requests data - in a real app, this would come from an API
//   const [activeRequests, setActiveRequests] = useState([
//     { 
//       id: "plumber-request-1",
//       serviceId: "plumber",
//       name: "Plumber", 
//       rating: 4.8,
//       description: "Fix leaking kitchen sink",
//       status: "hired", // "hired" or "pending"
//       providerName: "John Smith",
//       scheduledDate: "April 7, 2025",
//       scheduledTime: "10:00 AM - 12:00 PM",
//       icon: "droplet"
//     },
//     { 
//       id: "electrician-request-1",
//       serviceId: "electrician",
//       name: "Electrician", 
//       rating: 4.7,
//       description: "Install ceiling fan in living room",
//       status: "pending", // "hired" or "pending"
//       icon: "zap"
//     },
//     { 
//       id: "domestic-help-request-1",
//       serviceId: "domestic-help",
//       name: "Domestic Help", 
//       rating: 4.6,
//       description: "Weekly house cleaning service",
//       status: "hired", // "hired" or "pending"
//       providerName: "Maria Garcia",
//       scheduledDate: "Every Monday",
//       scheduledTime: "9:00 AM - 11:00 AM",
//       icon: "home"
//     }
//   ]);
  
//   const services = [
//     {
//       category: "Daily Essentials",
//       icon: "package",
//       items: [
//         { 
//           id: "milk-delivery",
//           name: "Milk Delivery", 
//           rating: 4.7, 
//           bookings: 1230, 
//           icon: "milk",
//           description: "Fresh milk delivery at your doorstep every morning. Choose from multiple brands and types of milk.",
//           availableTimes: ["6:00 AM - 8:00 AM", "4:00 PM - 6:00 PM"],
//           experience: "5+ years",
//           verified: true
//         },
//         { 
//           id: "newspaper-delivery",
//           name: "Newspaper/Magazine Delivery", 
//           rating: 4.5, 
//           bookings: 987, 
//           icon: "newspaper",
//           description: "Daily newspaper and magazine delivery service. Local and national publications available.",
//           availableTimes: ["5:30 AM - 7:30 AM"],
//           experience: "3+ years",
//           verified: true
//         },
//         { 
//           id: "tiffin-service",
//           name: "Tiffin/Dabbawala Service", 
//           rating: 4.8, 
//           bookings: 1543, 
//           icon: "utensils",
//           description: "Home-cooked meals delivered to your home or office. Multiple cuisine options available.",
//           availableTimes: ["11:00 AM - 1:00 PM"],
//           experience: "8+ years",
//           verified: true
//         },
//         { 
//           id: "domestic-help",
//           name: "Domestic Help", 
//           rating: 4.6, 
//           bookings: 876, 
//           icon: "home",
//           description: "Professional house cleaning and maintenance services. Daily, weekly or monthly scheduling available.",
//           availableTimes: ["8:00 AM - 6:00 PM"],
//           experience: "7+ years",
//           verified: true
//         },
//         { 
//           id: "grocery-delivery",
//           name: "Grocery Delivery", 
//           rating: 4.4, 
//           bookings: 2150, 
//           icon: "shopping-bag",
//           description: "Get groceries delivered right to your doorstep within hours. Wide range of products available.",
//           availableTimes: ["10:00 AM - 8:00 PM"],
//           experience: "4+ years",
//           verified: true
//         },
//         { 
//           id: "water-delivery",
//           name: "Water Can Delivery", 
//           rating: 4.3, 
//           bookings: 1876, 
//           icon: "droplet",
//           description: "Purified water can delivery service. Regular scheduling options available.",
//           availableTimes: ["9:00 AM - 6:00 PM"],
//           experience: "6+ years",
//           verified: true
//         }
//       ]
//     },
//     {
//       category: "Home Repairs",
//       icon: "tool",
//       items: [
//         { 
//           id: "plumber",
//           name: "Plumber", 
//           rating: 4.6, 
//           bookings: 987, 
//           icon: "droplet",
//           description: "Professional plumbing services for repairs, installations, and maintenance.",
//           availableTimes: ["8:00 AM - 8:00 PM"],
//           experience: "10+ years",
//           verified: true
//         },
//         { 
//           id: "electrician",
//           name: "Electrician", 
//           rating: 4.7, 
//           bookings: 1320, 
//           icon: "zap",
//           description: "Expert electrical services for your home and office. Emergency services available.",
//           availableTimes: ["8:00 AM - 9:00 PM"],
//           experience: "12+ years",
//           verified: true
//         },
//         { 
//           id: "carpenter",
//           name: "Carpenter", 
//           rating: 4.5, 
//           bookings: 765, 
//           icon: "tool",
//           description: "Skilled carpenters for furniture repair, installation and custom woodwork.",
//           availableTimes: ["9:00 AM - 6:00 PM"],
//           experience: "15+ years",
//           verified: true
//         },
//         { 
//           id: "appliance-repair",
//           name: "Appliance Repair", 
//           rating: 4.8, 
//           bookings: 1432, 
//           icon: "settings",
//           description: "Repair services for all major home appliances. Quick diagnostics and same-day service.",
//           availableTimes: ["10:00 AM - 7:00 PM"],
//           experience: "8+ years",
//           verified: true
//         },
//         { 
//           id: "pest-control",
//           name: "Pest Control", 
//           rating: 4.4, 
//           bookings: 654, 
//           icon: "shield",
//           description: "Complete pest management solutions. Safe and effective treatments.",
//           availableTimes: ["8:00 AM - 5:00 PM"],
//           experience: "9+ years",
//           verified: true
//         },
//         { 
//           id: "painter",
//           name: "Painter", 
//           rating: 4.5, 
//           bookings: 432, 
//           icon: "paint-bucket",
//           description: "Professional painting services for interior and exterior walls. Custom color mixing available.",
//           availableTimes: ["9:00 AM - 6:00 PM"],
//           experience: "7+ years",
//           verified: true
//         },
//         { 
//           id: "mason",
//           name: "Mason", 
//           rating: 4.3, 
//           bookings: 321, 
//           icon: "home",
//           description: "Expert mason services for construction and repair work. Quality craftsmanship guaranteed.",
//           availableTimes: ["8:00 AM - 5:00 PM"],
//           experience: "20+ years",
//           verified: true
//         }
//       ]
//     },
//     {
//       category: "Other Services",
//       icon: "more-horizontal",
//       items: [
//         { 
//           id: "laundry",
//           name: "Laundry/Ironing", 
//           rating: 4.7, 
//           bookings: 876, 
//           icon: "shirt",
//           description: "Professional laundry and ironing services. Pick-up and delivery options available.",
//           availableTimes: ["10:00 AM - 7:00 PM"],
//           experience: "5+ years",
//           verified: true
//         },
//         { 
//           id: "car-wash",
//           name: "Car/Bike Wash", 
//           rating: 4.6, 
//           bookings: 765, 
//           icon: "car",
//           description: "Thorough cleaning service for your vehicles. Eco-friendly products used.",
//           availableTimes: ["7:00 AM - 8:00 PM"],
//           experience: "6+ years",
//           verified: true
//         }
//       ]
//     }
//   ];
  
//   const filteredServices = searchQuery.length > 0
//     ? services.map(category => ({
//         ...category,
//         items: category.items.filter(item => 
//           item.name.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       })).filter(category => category.items.length > 0)
//     : services;

//   // Function to toggle service card expansion
//   const toggleServiceExpansion = (serviceId) => {
//     if (expandedServiceId === serviceId) {
//       setExpandedServiceId(null);
//     } else {
//       setExpandedServiceId(serviceId);
//     }
//   };

//   // Function to navigate to hire request form
//   const handleHireNow = (e, serviceId) => {
//     e.stopPropagation(); // Stop event propagation
//     navigate("/Hire-Request-Form", { state: { serviceId } });
//   };

//   // Function to navigate to find provider for active request
//   const handleFindProvider = (e, requestId) => {
//     e.stopPropagation();
//     navigate("/Request-Response", { state: { requestId } });
//   };

//   // Function to view details of an active request
//   const handleViewRequestDetails = (e, requestId) => {
//     e.stopPropagation();
//     navigate("/Request-Details", { state: { requestId } });
//   };

//   // Function to render service icon or image placeholder
//   const renderServiceIcon = (iconName) => {
//     if (showImagePlaceholder) {
//       return (
//         <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
//           <img src="/api/placeholder/48/48" alt="Service" className="w-8 h-8 rounded-full" />
//         </div>
//       );
//     }
    
//     // Map icon names to Lucide icons
//     const iconMap = {
//       "milk": <ShieldCheck className="w-6 h-6" />,
//       "newspaper": <ShieldCheck className="w-6 h-6" />,
//       "utensils": <ShieldCheck className="w-6 h-6" />,
//       "home": <Home className="w-6 h-6" />,
//       "shopping-bag": <ShieldCheck className="w-6 h-6" />,
//       "droplet": <ShieldCheck className="w-6 h-6" />,
//       "zap": <ShieldCheck className="w-6 h-6" />,
//       "tool": <ShieldCheck className="w-6 h-6" />,
//       "settings": <ShieldCheck className="w-6 h-6" />,
//       "shield": <ShieldCheck className="w-6 h-6" />,
//       "paint-bucket": <ShieldCheck className="w-6 h-6" />,
//       "shirt": <ShieldCheck className="w-6 h-6" />,
//       "car": <ShieldCheck className="w-6 h-6" />
//     };
    
//     return (
//       <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
//         {iconMap[iconName] || <ShieldCheck className="w-6 h-6" />}
//       </div>
//     );
//   };

//   // Check if any address is available to determine if services should be shown
//   const isAddressSelected = activeAddress && addresses[activeAddress];
    
//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Main Content */}
//       <main className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        
//         {/* Search and Address Bar Component */}
//         <SearchAddressBar 
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           activeAddress={activeAddress}
//           setActiveAddress={setActiveAddress}
//           addresses={addresses}
//           setAddresses={setAddresses}
//         />
        
//         {/* Show a prompt if no address is selected */}
//         {!isAddressSelected && (
//           <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
//             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
//               <MapPin className="w-8 h-8 text-slate-500" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-800">Set your location</h3>
//             <p className="text-slate-600 mt-2 max-w-md">
//               Please set your location to browse available services in your area
//             </p>
//           </div>
//         )}
        
//         {/* Services List */}
//         {isAddressSelected && (
//           <div className="mt-6">
//             {/* Active Requests Section - Always at the top */}
//             {activeRequests.length > 0 && (
//               <div className="mb-8">
//                 <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
//                   <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg mr-3">
//                     <AlertCircle className="w-5 h-5" />
//                   </span>
//                   Active Requests
//                 </h2>
                
//                 {/* Active Requests Cards Container */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
//                   {activeRequests.map((request) => (
//                     <div key={request.id} className="bg-white rounded-xl shadow overflow-hidden border border-slate-100 hover:shadow-lg transition">
//                       <div className="p-4 flex flex-col h-full">
//                         {/* Header */}
//                         <div className="flex items-start mb-3">
//                           {renderServiceIcon(request.icon)}
//                           <div className="ml-3 flex-1">
//                             <div className="flex justify-between items-center">
//                               <h4 className="text-lg font-medium text-slate-900 truncate">{request.name}</h4>
//                               <div className="flex items-center bg-slate-700/40 text-white px-2 py-1 rounded-md text-xs">
//                                 <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
//                                 <span>{request.rating}</span>
//                               </div>
//                             </div>
//                             <p className="text-slate-600 text-sm mt-1 truncate">{request.description}</p>
//                           </div>
//                         </div>
                        
//                         {/* Status */}
//                         {request.status === "hired" ? (
//                           <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
//                             <div className="flex items-center mb-1">
//                               <ShieldCheck className="w-4 h-4 text-green-600 mr-1" />
//                               <span className="text-green-700 font-medium text-sm">Professional Hired</span>
//                             </div>
//                             <p className="text-xs text-slate-600">
//                               {request.providerName} · {request.scheduledDate} · {request.scheduledTime}
//                             </p>
//                           </div>
//                         ) : (
//                           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
//                             <div className="flex items-center mb-1">
//                               <AlertCircle className="w-4 h-4 text-yellow-600 mr-1" />
//                               <span className="text-yellow-700 font-medium text-sm">Awaiting Professional</span>
//                             </div>
//                             <p className="text-xs text-slate-600">
//                               Find and hire a professional for this service
//                             </p>
//                           </div>
//                         )}

//                         {/* Bottom Action Area */}
//                         <div className="flex justify-between items-center mt-auto">
//                           {request.status === "hired" ? (
//                             <button 
//                               className="bg-zinc-800 hover:bg-zinc-600 text-white font-medium rounded-lg px-5 py-2 transition shadow text-sm w-full"
//                               onClick={(e) => handleViewRequestDetails(e, request.id)}
//                             >
//                               View Details
//                             </button>
//                           ) : (
//                             <button 
//                               className="bg-stone-700 hover:bg-stone-500 text-white font-medium rounded-lg px-5 py-2 transition shadow text-sm w-full"
//                               onClick={(e) => handleFindProvider(e, request.id)}
//                             >
//                               Find Professional
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <h2 className="text-xl font-semibold text-slate-800 mb-4">Available Services</h2>
            
//             {filteredServices.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//                 <p className="text-slate-600">No services found matching your search criteria.</p>
//               </div>
//             ) : (
//               filteredServices.map((category, categoryIndex) => (
//                 <div key={categoryIndex} className="mb-6 sm:mb-8">
//                   <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 flex items-center">
//                     <span className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-slate-800 text-white rounded-lg mr-2 sm:mr-3">
//                       <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
//                     </span>
//                     {category.category}
//                   </h3>
                  
//                   {/* Service Cards Container */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
//                     {category.items.map((service) => {
//                       const isExpanded = expandedServiceId === service.id;
                      
//                       // Apply grid column span when expanded
//                       const cardClasses = isExpanded 
//                         ? "sm:col-span-2 lg:col-span-3 transition-all duration-300" 
//                         : "transition-all duration-300";
                      
//                       return (
//                         <div key={service.id} className={cardClasses}>
//                           {/* Base Card - Always Visible */}
//                           <div className={`bg-white rounded-xl shadow overflow-hidden border border-slate-100 hover:shadow-lg transition ${isExpanded ? 'expanded-card' : ''}`}>
//                             <div 
//                               className="p-3 sm:p-4 flex flex-col cursor-pointer h-full"
//                               onClick={() => toggleServiceExpansion(service.id)}
//                             >
//                               {!isExpanded ? (
//                                 // Normal Card View
//                                 <>
//                                   <div className="flex items-start mb-1">
//                                     {renderServiceIcon(service.icon)}
//                                     <div className="ml-3 flex-1">
//                                       <div className="flex justify-between items-center">
//                                         <h4 className="text-base sm:text-lg font-medium text-slate-900 truncate">{service.name}</h4>
//                                         <div className="flex items-center bg-slate-700/40 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
//                                           <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-yellow-400 mr-1" />
//                                           <span>{service.rating}</span>
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center text-slate-500 text-xs sm:text-sm mt-1 h-5">
//                                         <Users className="w-3 h-3 mr-1" />
//                                         <span>{service.bookings}+ bookings</span>
//                                       </div>
//                                     </div>
//                                   </div>

//                                   {/* Bottom Action Area */}
//                                   <div className="flex justify-between items-center mt-3 sm:mt-4 mt-auto">
//                                     <button 
//                                       className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg px-3 sm:px-5 py-1 sm:py-2 transition shadow w-24 sm:w-32 text-xs sm:text-base" 
//                                       onClick={(e) => handleHireNow(e, service.id)}
//                                     >
//                                       Hire Now
//                                     </button>
//                                     <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
//                                       <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
//                                     </div>
//                                   </div>
//                                 </>
//                               ) : (
//                                 // Expanded Horizontal Card View
//                                 <div className="flex flex-col sm:flex-row animate-expandHorizontal">
//                                   {/* Left Side - Image and Basic Info */}
//                                   <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
//                                     <div className="relative w-full h-40 mb-3">
//                                       <img 
//                                         src="/api/placeholder/400/200" 
//                                         alt={service.name} 
//                                         className="w-full h-full object-cover rounded-lg" 
//                                       />
//                                     </div>
//                                     <h4 className="text-lg font-semibold text-slate-900 mb-1">{service.name}</h4>
//                                     <div className="flex items-center mb-2">
//                                       <div className="flex items-center bg-slate-700/40 text-white px-2 py-1 rounded-md text-xs mr-2">
//                                         <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
//                                         <span>{service.rating}</span>
//                                       </div>
//                                       <div className="flex items-center text-slate-500 text-xs">
//                                         <Users className="w-3 h-3 mr-1" />
//                                         <span>{service.bookings}+ bookings</span>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center mb-2">
//                                       <ShieldCheck className="w-3 h-3 text-green-600 mr-1" />
//                                       <span className="text-xs text-slate-600">
//                                         {service.verified ? "Verified Professional" : "Verification Pending"}
//                                       </span>
//                                     </div>
//                                   </div>
                                  
//                                   {/* Middle Section - Details */}
//                                   <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
//                                     <h5 className="text-sm font-semibold text-slate-900 mb-1">About</h5>
//                                     <p className="text-xs text-slate-600 mb-3">{service.description}</p>
                                    
                                   
//                                   </div>
                                  
//                                   {/* Right Section - Actions */}
//                                   <div className="sm:w-1/3 flex flex-col justify-between">
                                    
//                                     {/* Action Buttons */}
//                                     <div className="flex flex-col gap-2 mt-auto">
//                                       <button 
//                                         className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg py-2 transition shadow text-sm w-full"
//                                         onClick={(e) => handleHireNow(e, service.id)}
//                                       >
//                                         Hire Now
//                                       </button>
                                      
//                                       <button 
//                                         className="mt-2 text-slate-500 hover:text-slate-700 text-sm flex items-center justify-center"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           toggleServiceExpansion(service.id);
//                                         }}
//                                       >
//                                         <ChevronDown className="w-4 h-4 mr-1" /> Close Details
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))
//             )}
            
//             {/* Advertisement Panel */}
//             <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6 mb-8 text-white">
//               <div className="flex flex-col sm:flex-row items-center">
//                 <div className="sm:w-2/3 mb-4 sm:mb-0">
//                   <h3 className="text-xl sm:text-2xl font-bold mb-2">Get 25% off on your first booking!</h3>
//                   <p className="text-slate-300 text-sm sm:text-base mb-3">Use code FIRSTPRO25 when you book any service through our app. Valid for new users only.</p>
//                   <button className="bg-white text-slate-800 hover:bg-slate-100 font-semibold rounded-lg px-5 py-2 transition shadow-md text-sm sm:text-base">
//                     Download App Now
//                   </button>
//                 </div>
//                 <div className="sm:w-1/3 flex justify-center">
//                   <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
//                     <img src="/api/placeholder/160/160" alt="App Promotion" className="rounded-lg" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
      
//       {/* Add global CSS for animations */}
//       <style jsx global>{`
//         @keyframes popIn {
//           from { 
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to { 
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes expandHorizontal {
//           from {
//             opacity: 0.7;
//             transform: scaleX(0.97);
//           }
//           to {
//             opacity: 1;
//             transform: scaleX(1);
//           }
//         }
        
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-8px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-popIn {
//           animation: popIn 0.2s ease-out forwards;
//         }
        
//         .animate-expandHorizontal {
//           animation: expandHorizontal 0.3s ease-out forwards;
//         }
        
//         .animate-slideDown {
//           animation: slideDown 0.2s ease-out forwards;
//         }
        
//         .expanded-card {
//           transition: all 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BookProPage;

import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, Home, ShieldCheck, Clock, Users, ChevronDown, MapPin, AlertCircle } from 'lucide-react';
import SearchAddressBar from './SearchAddressBar';
import { useNavigate } from "react-router-dom";

const BookProPage = () => {
  const [activeAddress, setActiveAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImagePlaceholder, setShowImagePlaceholder] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const navigate = useNavigate();
  
  // Updated addresses state to initialize with empty values
  const [addresses, setAddresses] = useState({
    home: "",
    work: "",
    other: "",
    current: ""
  });

  // Sample active requests data - in a real app, this would come from an API
  const [activeRequests, setActiveRequests] = useState([
    { 
      id: "plumber-request-1",
      serviceId: "plumber",
      name: "Plumber", 
      rating: 4.8,
      description: "Fix leaking kitchen sink",
      status: "hired", // "hired" or "pending"
      providerName: "John Smith",
      scheduledDate: "April 7, 2025",
      scheduledTime: "10:00 AM - 12:00 PM",
      icon: "droplet"
    },
    { 
      id: "electrician-request-1",
      serviceId: "electrician",
      name: "Electrician", 
      rating: 4.7,
      description: "Install ceiling fan in living room",
      status: "pending", // "hired" or "pending"
      icon: "zap"
    },
    { 
      id: "domestic-help-request-1",
      serviceId: "domestic-help",
      name: "Domestic Help", 
      rating: 4.6,
      description: "Weekly house cleaning service",
      status: "hired", // "hired" or "pending"
      providerName: "Maria Garcia",
      scheduledDate: "Every Monday",
      scheduledTime: "9:00 AM - 11:00 AM",
      icon: "home"
    }
  ]);
  
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

  // Function to navigate to hire request form
  const handleHireNow = (e, serviceId) => {
    e.stopPropagation(); // Stop event propagation
    navigate("/Hire-Request-Form", { state: { serviceId } });
  };

  // Function to navigate to find provider for active request
  const handleFindProvider = (e, requestId) => {
    e.stopPropagation();
    navigate("/Request-Response", { state: { requestId } });
  };

  // Function to view details of an active request
  const handleViewRequestDetails = (e, requestId) => {
    e.stopPropagation();
    navigate("/Request-Details", { state: { requestId } });
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

  // Check if any address is available to determine if services should be shown
  const isAddressSelected = activeAddress && addresses[activeAddress];
    
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        
        {/* Search and Address Bar Component */}
        <SearchAddressBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeAddress={activeAddress}
          setActiveAddress={setActiveAddress}
          addresses={addresses}
          setAddresses={setAddresses}
        />
        
        {/* Show a prompt if no address is selected */}
        {!isAddressSelected && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Set your location</h3>
            <p className="text-slate-600 mt-2 max-w-md">
              Please set your location to browse available services in your area
            </p>
          </div>
        )}
        
        {/* Services List */}
        {isAddressSelected && (
          <div className="mt-6">
            {/* Active Requests Section - Always at the top */}
            {activeRequests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg mr-3">
                    <AlertCircle className="w-5 h-5" />
                  </span>
                  Active Requests
                </h2>
                
                {/* Active Requests Cards Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {activeRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-xl shadow overflow-hidden border border-slate-100 hover:shadow-lg transition">
                      <div className="p-4 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start mb-3">
                          {renderServiceIcon(request.icon)}
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-medium text-slate-900 truncate">{request.name}</h4>
                              <div className="flex items-center bg-slate-700/40 text-white px-2 py-1 rounded-md text-xs">
                                <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
                                <span>{request.rating}</span>
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm mt-1 truncate">{request.description}</p>
                          </div>
                        </div>
                        
                        {/* Status */}
                        {request.status === "hired" ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center mb-1">
                              <ShieldCheck className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-green-700 font-medium text-sm">Professional Hired</span>
                            </div>
                            <p className="text-xs text-slate-600">
                              {request.providerName} · {request.scheduledDate} · {request.scheduledTime}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center mb-1">
                              <AlertCircle className="w-4 h-4 text-yellow-600 mr-1" />
                              <span className="text-yellow-700 font-medium text-sm">Awaiting Professional</span>
                            </div>
                            <p className="text-xs text-slate-600">
                              Find and hire a professional for this service
                            </p>
                          </div>
                        )}

                        {/* Bottom Action Area */}
                        <div className="flex justify-between items-center mt-auto">
                          {request.status === "hired" ? (
                            <button 
                              className="bg-zinc-800 hover:bg-zinc-600 text-white font-medium rounded-lg px-5 py-2 transition shadow text-sm w-full"
                              onClick={(e) => handleViewRequestDetails(e, request.id)}
                            >
                              View Details
                            </button>
                          ) : (
                            <button 
                              className="bg-stone-700 hover:bg-stone-500 text-white font-medium rounded-lg px-5 py-2 transition shadow text-sm w-full"
                              onClick={(e) => handleFindProvider(e, request.id)}
                            >
                              Find Professional
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-xl font-semibold text-slate-800 mb-4">Available Services</h2>
            
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-slate-600">No services found matching your search criteria.</p>
              </div>
            ) : (
              filteredServices.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6 sm:mb-8">
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
                                    <button 
                                      className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg px-3 sm:px-5 py-1 sm:py-2 transition shadow w-24 sm:w-32 text-xs sm:text-base" 
                                      onClick={(e) => handleHireNow(e, service.id)}
                                    >
                                      Hire Now
                                    </button>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
                                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                // Updated Expanded Card View with About section moved to right column
                                <div className="animate-expandHorizontal">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Left - Image Only */}
                                    <div className="flex-shrink-0">
                                      <div className="relative w-full h-40 mb-3">
                                        <img 
                                          src="/api/placeholder/400/200" 
                                          alt={service.name} 
                                          className="w-full h-full object-cover rounded-lg" 
                                        />
                                      </div>
                                    </div>
                                    
                                    {/* Right - All Text Content */}
                                    <div className="flex flex-col">
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
                                      
                                      {/* About section moved here */}
                                      <h5 className="text-sm font-semibold text-slate-900 mb-1 mt-2">About</h5>
                                      <p className="text-xs text-slate-600 mb-3">{service.description}</p>
                                      
                                      {/* Action buttons */}
                                      <div className="flex flex-col gap-2 mt-auto">
                                        <button 
                                          className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg py-2 transition shadow text-sm w-full"
                                          onClick={(e) => handleHireNow(e, service.id)}
                                        >
                                          Hire Now
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
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
            
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
          </div>
        )}
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