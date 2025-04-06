import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, Check, X, ChevronRight, Info, Calendar, MapPin, FileText, Clock, User, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const ServiceProviderJobPage = () => {
  // State for active/inactive status
  const [isActive, setIsActive] = useState(true);
  
  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  
  // State for notifications count
  const [notificationCount, setNotificationCount] = useState(3);
  
  // State for job request popup
  const [selectedJob, setSelectedJob] = useState(null);
  
  // State for API-related states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // API base URL - centralized for consistency
  const API_BASE_URL = 'http://localhost:5500/api/service-providers';
  
  // Sample data for job requests - will be replaced with API data
  const [activeRequests, setActiveRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  
  // Function to get auth token
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };
  
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
  
  // Format date helper function
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Fetch active requests from API
  const fetchActiveRequests = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("You need to login first");
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/active-requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform API data to match UI format
      const formattedActiveRequests = response.data.data.map(item => ({
        id: item._id,
        client: item.name,
        service: item.serviceType,
        location: item.address,
        date: formatDate(item.preferredDate),
        status: item.status === "ACCEPTED" ? "Pending" : 
               item.status === "IN_PROGRESS" ? "In Progress" : item.status,
        description: item.serviceDescription,
        additionalInfo: item.additionalInfo
      }));
      
      setActiveRequests(formattedActiveRequests);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch active requests");
      console.error("Error fetching active requests:", err);
      
      // Fallback to sample data if API fails
      if (activeRequests.length === 0) {
        setActiveRequests([
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
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch available (incoming) requests from API
  const fetchAvailableRequests = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("You need to login first");
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/available-requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform API data to match UI format
      const formattedIncomingRequests = response.data.data.map(item => ({
        id: item._id,
        client: item.name,
        service: item.serviceType,
        location: item.address,
        date: formatDate(item.preferredDate),
        status: "New",
        description: item.serviceDescription,
        additionalInfo: item.additionalInfo
      }));
      
      setIncomingRequests(formattedIncomingRequests);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch available requests");
      console.error("Error fetching available requests:", err);
      
      // Fallback to sample data if API fails
      if (incomingRequests.length === 0) {
        setIncomingRequests([
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
      }
    }
  };
  
  // Accept request function
  const acceptRequest = async (requestId) => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("You need to login first");
        return;
      }
      
      await axios.post(`${API_BASE_URL}/accept-request/${requestId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Find the request that was accepted
      const acceptedRequest = incomingRequests.find(request => request.id === requestId);
      
      if (acceptedRequest) {
        // Remove from incoming requests
        setIncomingRequests(incomingRequests.filter(request => request.id !== requestId));
        
        // Add to active requests with updated status
        setActiveRequests([...activeRequests, { ...acceptedRequest, status: 'Pending' }]);
      }
      
      setSuccessMessage("Request accepted successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept request");
      console.error("Error accepting request:", err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  
  // Decline request function
  const declineRequest = async (requestId) => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("You need to login first");
        return;
      }
      
      await axios.post(`${API_BASE_URL}/decline-request/${requestId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the declined request from the list
      setIncomingRequests(incomingRequests.filter(request => request.id !== requestId));
      
      setSuccessMessage("Request declined");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to decline request");
      console.error("Error declining request:", err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  
  // Start job function
  const startJob = async (jobId) => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("You need to login first");
        return;
      }
      
      await axios.post(`${API_BASE_URL}/start-job/${jobId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the job status in active requests
      setActiveRequests(
        activeRequests.map(job => 
          job.id === jobId ? { ...job, status: 'In Progress' } : job
        )
      );
      
      setSuccessMessage("Job started successfully!");
      closeJobDetails();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start job");
      console.error("Error starting job:", err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  
  // Complete job function
  const completeJob = async (jobId) => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("You need to login first");
        return;
      }
      
      await axios.post(`${API_BASE_URL}/complete-job/${jobId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from active requests
      setActiveRequests(activeRequests.filter(job => job.id !== jobId));
      
      setSuccessMessage("Job completed successfully!");
      closeJobDetails();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete job");
      console.error("Error completing job:", err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchActiveRequests(), fetchAvailableRequests()]);
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  // Effect to simulate new incoming requests - only if no token is available (demo mode)
  useEffect(() => {
    if (isActive && !getToken()) {
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
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="w-full">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Controls */}
          <div className="flex justify-between items-center mb-8 mt-20">
            <div className="flex items-center space-x-6">
              {/* Success and error messages */}
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 animate-fade-in">
                  {successMessage}
                </div>
              )}
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fade-in">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Status summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeRequests.length}</h3>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-slate-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-slate-700">
                <span className="font-medium">↑ 12% </span>
                <span className="ml-1 text-gray-500">from last week</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">New Requests</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{incomingRequests.length}</h3>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-slate-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-slate-700">
                <span className="font-medium">↑ 8% </span>
                <span className="ml-1 text-gray-500">from last week</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">24</h3>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Check className="h-6 w-6 text-slate-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-slate-700">
                <span className="font-medium">↑ 16% </span>
                <span className="ml-1 text-gray-500">from last week</span>
              </div>
            </div>
          </div>
          
          {/* Active Requests Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-slate-900">Active Requests</h2>
                <span className="bg-gray-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {activeRequests.length} Active
                </span>
              </div>
              <button 
                onClick={fetchActiveRequests}
                className="text-sm font-medium text-slate-800 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                Refresh Jobs
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRequests.map((job, index) => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  style={{animationDelay: `${index * 0.1}s`, animation: 'fadeInUp 0.5s ease-out'}}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'Pending' ? 'bg-gray-100 text-slate-600' : 
                        job.status === 'In Progress' ? 'bg-gray-100 text-slate-800' : 
                        'bg-gray-100 text-slate-600'
                      }`}>
                        {job.status}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" /> 
                        {job.date}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{job.client}</h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="bg-gray-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium mr-2">
                        {job.service}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" /> 
                        {job.location}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {job.description.substring(0, 100)}...
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => showJobDetails(job)}
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 bg-gray-100 text-slate-600 rounded-full hover:bg-slate-900 hover:text-white transition-colors">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {activeRequests.length === 0 && (
                <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Info className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No active jobs</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    You don't have any active jobs at the moment. Check the Incoming Requests section for new job opportunities.
                  </p>
                </div>
              )}
            </div>
          </section>
          
          {/* Incoming Requests Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-slate-900">Incoming Requests</h2>
                <span className="bg-gray-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse-subtle">
                  {incomingRequests.length} New
                </span>
              </div>
              
              <button 
                onClick={fetchAvailableRequests}
                className="text-sm font-medium text-slate-800 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <User className="h-4 w-4 mr-2" />
                Refresh Requests
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {incomingRequests.map((job, index) => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 border-slate-900 border-t border-r border-b border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  style={{animationDelay: `${index * 0.15}s`, animation: 'bounceIn 0.6s ease-out'}}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-slate-700">
                        {job.status}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" /> 
                        {job.date}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{job.client}</h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="bg-gray-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium mr-2">
                        {job.service}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" /> 
                        {job.location}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {job.description.substring(0, 100)}...
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => showJobDetails(job)}
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {incomingRequests.length === 0 && (
                <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Info className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No incoming requests</h3>
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
          <div className="fixed inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50" 
              style={{animation: 'fadeIn 0.3s ease-out'}}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all"
                style={{animation: 'scaleIn 0.4s ease-out'}}>
              <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Job Request Details</h3>
                </div>
                <button 
                  onClick={closeJobDetails}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center space-x-3">
                    <User className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-gray-500">Client</p>
                      <p className="text-sm font-medium text-slate-900">{selectedJob.client}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-gray-500">Service</p>
                      <p className="text-sm font-medium text-slate-900">{selectedJob.service}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-slate-900">{selectedJob.location}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium text-slate-900">{selectedJob.date}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center space-x-3">
                    <Info className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm font-medium text-slate-800">
                        {selectedJob.status}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium text-slate-800 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-slate-600" />
                    Job Description
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{selectedJob.description}</p>
                  </div>
                </div>
                
                {selectedJob.additionalInfo && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-slate-800 mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2 text-slate-600" />
                      Additional Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">{selectedJob.additionalInfo}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                {selectedJob.status === "New" ? (
                  <>
                    <button 
                      onClick={() => {
                        acceptRequest(selectedJob.id);
                        closeJobDetails();
                      }}
                      className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept Request
                    </button>
                    
                    <button 
                      onClick={() => {
                        declineRequest(selectedJob.id);
                        closeJobDetails();
                      }}
                      className="px-4 py-2 bg-white text-slate-800 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </button>
                  </>
                ) : selectedJob.status === "Pending" ? (
                  <>
                    <button 
                      onClick={() => startJob(selectedJob.id)}
                      className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start Job
                    </button>
                    
                    <button 
                      onClick={closeJobDetails}
                      className="px-4 py-2 bg-white text-slate-800 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </>
                ) : selectedJob.status === "In Progress" ? (
                  <>
                    <button 
                      onClick={() => completeJob(selectedJob.id)}
                      className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Complete Job
                    </button>
                    
                    <button 
                      onClick={closeJobDetails}
                      className="px-4 py-2 bg-white text-slate-800 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={closeJobDetails}
                    className="px-4 py-2 bg-white text-slate-800 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          70% {
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-pulse-subtle {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            background-color: #f3f4f6;
          }
          50% {
            background-color: #e5e7eb;
          }
          100% {
            background-color: #f3f4f6;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceProviderJobPage;