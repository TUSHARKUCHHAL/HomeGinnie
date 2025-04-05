import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, Check, X, ChevronRight, Info } from 'lucide-react';

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
      client: "John Doe",
      service: "Plumbing",
      location: "123 Main St",
      date: "April 6, 2025",
      status: "Pending",
      description: "Need help fixing a leaking sink in the kitchen. The issue started two days ago and is getting worse. I've tried tightening the pipes but that didn't work. Please bring appropriate tools for pipe replacement if needed."
    },
    {
      id: 2,
      client: "Sarah Thompson",
      service: "Electrical",
      location: "456 Oak Ave",
      date: "April 7, 2025",
      status: "In Progress",
      description: "Multiple power outlets not working in the living room. Already checked the breaker box but couldn't identify the issue. Need professional help to diagnose and fix the problem before the weekend."
    }
  ]);
  
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 3,
      client: "Mike Johnson",
      service: "Carpentry",
      location: "789 Pine Rd",
      date: "April 8, 2025",
      status: "New",
      description: "Looking for someone to build custom shelves in my home office. The space is approximately 8ft wide and 10ft tall. I need at least 5 shelves with adjustable heights if possible. Would like to discuss material options."
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
  
  // Effect to simulate new incoming requests
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        // 20% chance of new request coming in every 10 seconds (for demo purposes)
        if (Math.random() < 0.2) {
          const newJob = {
            id: Math.floor(Math.random() * 1000) + 10,
            client: `Client ${Math.floor(Math.random() * 100)}`,
            service: ["Plumbing", "Electrical", "Cleaning", "Moving", "Painting"][Math.floor(Math.random() * 5)],
            location: `${Math.floor(Math.random() * 999)} ${["Main St", "Broadway", "Park Ave", "Lake Dr"][Math.floor(Math.random() * 4)]}`,
            date: "April 10, 2025",
            status: "New",
            description: "This is a new service request that requires your attention. Please review the details and respond at your earliest convenience."
          };
          
          setIncomingRequests(prev => [...prev, newJob]);
          setNotificationCount(prev => prev + 1);
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);
  
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
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fadeIn" 
                  style={{animation: 'fadeIn 0.2s ease-out'}}
                >
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
                          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">New job request</p>
                            <p className="text-xs text-gray-500">Mike Johnson needs carpentry service</p>
                            <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">Payment received</p>
                            <p className="text-xs text-gray-500">Sarah Thompson paid $150 for electrical work</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">Job reminder</p>
                            <p className="text-xs text-gray-500">John Doe appointment tomorrow at 10am</p>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Active Requests</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {activeRequests.length} Active
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRequests.map(job => (
              <div 
                key={job.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-xs text-gray-500">{job.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{job.client}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="font-medium mr-2">{job.service}</span>
                    <span>• {job.location}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {job.description.substring(0, 80)}...
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => showJobDetails(job)}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                    
                    <div className="flex space-x-2">
                      <button className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                        <Check className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Incoming Requests Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Incoming Requests</h2>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {incomingRequests.length} New
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomingRequests.map(job => (
              <div 
                key={job.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 animate-slideIn"
                style={{animationDelay: `${(job.id % 3) * 0.1}s`}}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.status}
                    </span>
                    <span className="text-xs text-gray-500">{job.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{job.client}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="font-medium mr-2">{job.service}</span>
                    <span>• {job.location}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {job.description.substring(0, 80)}...
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => showJobDetails(job)}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setIncomingRequests(incomingRequests.filter(item => item.id !== job.id));
                          setActiveRequests([...activeRequests, {...job, status: 'Pending'}]);
                        }}
                        className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setIncomingRequests(incomingRequests.filter(item => item.id !== job.id));
                        }}
                        className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {incomingRequests.length === 0 && (
              <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-10 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <Info className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-1">No incoming requests</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  You don't have any new service requests at the moment. New requests will appear here when customers need your services.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800">Job Request Details</h3>
              <button 
                onClick={closeJobDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
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
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-slate-800">{selectedJob.location}</p>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-md">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-slate-800">{selectedJob.date}</p>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-md">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`text-sm font-medium ${
                    selectedJob.status === 'Pending' ? 'text-yellow-600' : 
                    selectedJob.status === 'In Progress' ? 'text-blue-600' : 
                    selectedJob.status === 'New' ? 'text-green-600' :
                    'text-slate-800'
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
                <h4 className="text-md font-medium text-slate-800 mb-2">Client Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Service needed as soon as possible
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Professional tools and equipment required
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
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
                className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700"
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