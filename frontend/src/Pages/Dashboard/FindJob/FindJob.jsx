import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, Star, User, MapPin, DollarSign, Briefcase, Shield, Calendar } from 'lucide-react';

const ServiceProviderJobPage = () => {
  // State for active/inactive status
  const [isActive, setIsActive] = useState(true);
  
  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  
  // State for notifications count
  const [notificationCount, setNotificationCount] = useState(3);
  
  // State for job request popup
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Sample data for job requests
  const [activeRequests, setActiveRequests] = useState([
    {
      id: 1,
      client: "John Smith",
      service: "Plumber",
      description: "Fix leaking kitchen sink",
      date: "April 7, 2025",
      time: "10:00 AM - 12:00 PM",
      rating: 4.8,
      status: "Professional Hired"
    },
    {
      id: 2,
      client: "Anonymous",
      service: "Electrician",
      description: "Install ceiling fan in living room",
      date: "April 8, 2025",
      time: "1:00 PM - 3:00 PM",
      rating: 4.7,
      status: "Awaiting Professional"
    },
    {
      id: 3,
      client: "Maria Garcia",
      service: "Domestic Help",
      description: "Weekly house cleaning service",
      date: "Every Monday",
      time: "9:00 AM - 11:00 AM",
      rating: 4.6,
      status: "Professional Hired"
    }
  ]);
  
  const [availableServices, setAvailableServices] = useState([
    {
      id: 1,
      service: "Milk Delivery",
      bookings: "1230+",
      rating: 4.7
    },
    {
      id: 2,
      service: "Newspaper/Magazine Delivery",
      bookings: "987+",
      rating: 4.5
    },
    {
      id: 3,
      service: "Tiffin/Dabbawala Service",
      bookings: "1543+",
      rating: 4.8
    }
  ]);
  
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "Miguel Rodriguez",
      service: "Carpentry",
      price: "$95/hr",
      experience: "10 years",
      distance: "4.5 miles away",
      lastActive: "5 min ago",
      rating: 4.9,
      verified: true
    },
    {
      id: 2,
      name: "Alex Carpenter",
      service: "Electrical Work",
      price: "$85/hr",
      experience: "7 years",
      distance: "3.2 miles away",
      lastActive: "10 min ago",
      rating: 4.8,
      verified: true
    },
    {
      id: 3,
      name: "Sarah Johnson",
      service: "Plumbing",
      price: "$75/hr",
      experience: "5 years",
      distance: "1.8 miles away",
      lastActive: "15 min ago",
      rating: 4.6,
      verified: true
    }
  ]);
  
  // Function to toggle active status
  const toggleActiveStatus = () => {
    setIsActive(!isActive);
  };
  
  // Function to show job details
  const showJobDetails = (job) => {
    setSelectedJob(job);
  };
  
  // Function to close job details popup
  const closeJobDetails = () => {
    setSelectedJob(null);
  };
  
  // Effect to simulate new incoming requests (disabled for now to match reference design)
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Service Provider Dashboard</h1>
          
          <div className="flex items-center space-x-6">
            {/* Active/Inactive Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-800">Service Status:</span>
              <button 
                onClick={toggleActiveStatus} 
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span 
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isActive ? 'translate-x-9' : 'translate-x-1'}`}
                />
                <span className={`absolute text-xs font-bold ${isActive ? 'left-2 text-white' : 'right-2 text-slate-600'}`}>
                  {isActive ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="relative p-2 text-slate-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fadeIn">
                  <div className="py-2 divide-y divide-gray-100">
                    <div className="px-4 py-3 flex justify-between items-center">
                      <h2 className="text-lg font-medium text-slate-800">Notifications</h2>
                      <button 
                        onClick={() => setNotificationCount(0)} 
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-500 p-2 rounded-full mr-3">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">New job request</p>
                            <p className="text-xs text-gray-500">John Smith needs plumbing service</p>
                            <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="bg-green-100 text-green-500 p-2 rounded-full mr-3">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">Payment received</p>
                            <p className="text-xs text-gray-500">Maria Garcia paid $120 for cleaning</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="bg-yellow-100 text-yellow-500 p-2 rounded-full mr-3">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">Job reminder</p>
                            <p className="text-xs text-gray-500">John Smith appointment tomorrow at 10am</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2">
                      <button className="text-sm text-blue-500 hover:text-blue-700 w-full text-center">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Requests Section */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-lg mr-3">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Active Requests</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRequests.map(job => (
              <div 
                key={job.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <Shield className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{job.service}</h3>
                        <p className="text-sm text-gray-500">{job.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{job.rating}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center mb-4 px-3 py-2 rounded-md ${job.status === "Professional Hired" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                    {job.status === "Professional Hired" ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <Clock className="h-4 w-4 mr-2" />
                    )}
                    <span className="text-sm font-medium">{job.status}</span>
                  </div>
                  
                  {job.status === "Professional Hired" ? (
                    <div className="text-sm text-gray-600 mb-4">
                      {job.client} • {job.date} • {job.time}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 mb-4">
                      Find and hire a professional for this service
                    </div>
                  )}
                  
                  <button 
                    onClick={() => showJobDetails(job)}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded transition-colors duration-200"
                  >
                    {job.status === "Professional Hired" ? "View Details" : "Find Professional"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Available Services Section */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <div className="bg-slate-800 p-3 rounded-lg mr-3">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Available Services</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableServices.map(service => (
              <div 
                key={service.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <Shield className="h-5 w-5 text-slate-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">{service.service}</h3>
                    </div>
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{service.rating}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{service.bookings} bookings</span>
                  </div>
                  
                  <button 
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded transition-colors duration-200 flex items-center justify-center"
                  >
                    <span>Hire Now</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Available Service Providers Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Available Service Providers</h2>
            <p className="text-gray-600 mt-1">We've found 3 providers for your request at <span className="flex items-center inline-flex"><MapPin className="h-4 w-4 mr-1 text-gray-500" /> your location</span></p>
          </div>
          
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-slate-800">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-8 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Top Rated</option>
                  <option>Closest</option>
                  <option>Lowest Price</option>
                  <option>Most Experience</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Auto-refreshing results</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map(provider => (
              <div 
                key={provider.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <User className="h-8 w-8" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-slate-800 mr-2">{provider.name}</h3>
                          {provider.verified && (
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">Verified</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{provider.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{provider.rating}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <div className="flex items-center text-slate-800">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="font-medium">{provider.price}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Experience</p>
                      <div className="flex items-center text-slate-800">
                        <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="font-medium">{provider.experience}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{provider.distance}</span>
                    </div>
                    <span className="text-green-500">{provider.lastActive}</span>
                  </div>
                  
                  <button 
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded transition-colors duration-200"
                  >
                    Contact Provider
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">Job Request Details</h3>
              <button 
                onClick={closeJobDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-gray-50 px-4 py-2 rounded-md">
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="text-sm font-medium text-slate-800">{selectedJob.client}</p>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-md">
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="text-sm font-medium text-slate-800">{selectedJob.service}</p>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-md">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-slate-800">{selectedJob.date}</p>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-md">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-slate-800">{selectedJob.time}</p>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-md">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`text-sm font-medium ${
                    selectedJob.status === "Professional Hired" ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {selectedJob.status}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-md font-medium text-slate-800 mb-2">Job Description</h4>
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h4 className="text-md font-medium text-slate-800 mb-2">Service Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    Service needed as described in details
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    Professional tools and equipment required
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    Experience with similar jobs preferred
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-slate-800 mb-2">Schedule Availability</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">April 6</p>
                    <p className="text-sm font-medium text-blue-700">9AM - 11AM</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">April 7</p>
                    <p className="text-sm font-medium text-blue-700">1PM - 3PM</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">April 8</p>
                    <p className="text-sm font-medium text-blue-700">10AM - 12PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
              <button 
                onClick={closeJobDetails}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 rounded-md text-white text-sm font-medium"
              >
                Accept Job
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ServiceProviderJobPage;