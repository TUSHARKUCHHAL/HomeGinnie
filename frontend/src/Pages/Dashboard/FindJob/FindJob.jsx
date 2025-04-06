import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, AlertCircle, Check, Clock, Calendar, MapPin, MessageSquare, 
          Info, User, ChevronRight, X, IndianRupee } from 'lucide-react';

// Set base URL for API calls
const API_URL =  'http://localhost:5500/api';

const ServiceProviderJobPage = () => {
  // State management
  const [activeRequests, setActiveRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [dashboardStats, setDashboardStats] = useState({
    activeJobs: 0,
    newRequests: 0,
    completedJobs: 0,
    totalAssignedJobs: 0,
    completionRate: 0
  });
  // New state for price modal
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [jobPrice, setJobPrice] = useState('');
  const [jobToPrice, setJobToPrice] = useState(null);

  // Auth token from local storage
  const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  // Configure axios with auth headers
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add auth token to every request
  authAxios.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper to map status values between backend and frontend
  const mapStatus = (backendStatus) => {
    const statusMap = {
      'pending': 'New',
      'confirmed': 'Pending',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  // Helper to map frontend status to backend status values
  const mapStatusToBackend = (frontendStatus) => {
    const statusMap = {
      'New': 'pending',
      'Pending': 'confirmed',
      'In Progress': 'in-progress',
      'Completed': 'completed'
    };
    return statusMap[frontendStatus] || frontendStatus;
  };

  // Transform backend job data to frontend format
  const transformJobData = (backendJob) => {
    return {
      id: backendJob._id,
      client: backendJob.name || backendJob.userId || "Customer",
      service: backendJob.serviceType || "Service",
      location: backendJob.address || "Not specified",
      date: formatDate(backendJob.preferredDate),
      status: mapStatus(backendJob.status),
      description: backendJob.serviceDescription || "No description provided",
      additionalInfo: backendJob.additionalInfo || null,
      createdAt: backendJob.createdAt,
      price: backendJob.price ,
      // Add any other fields needed for the UI
    };
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await authAxios.get('/service-providers/dashboard-stats');
      setDashboardStats(response.data.data);
      setCompletedJobs(response.data.data.completedJobs);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    }
  };

  // Fetch active jobs (confirmed and in-progress)
  const fetchActiveRequests = async () => {
    try {
      const response = await authAxios.get('/service-providers/active-jobs');
      const transformedJobs = response.data.data.map(transformJobData);
      setActiveRequests(transformedJobs);
      setError('');
    } catch (err) {
      console.error('Error fetching active jobs:', err);
      setError('Failed to load active jobs');
    }
  };

  // Fetch available/pending requests
  const fetchAvailableRequests = async () => {
    try {
      const response = await authAxios.get('/service-providers/available-requests');
      const transformedJobs = response.data.data.map(transformJobData);
      setIncomingRequests(transformedJobs);
      setError('');
    } catch (err) {
      console.error('Error fetching available requests:', err);
      setError('Failed to load available requests');
    }
  };

  // NEW FUNCTION: Show price modal before accepting a request
  const showPriceInput = (requestId) => {
    const job = incomingRequests.find(req => req.id === requestId);
    if (job) {
      setJobToPrice(job);
      setShowPriceModal(true);
    }
  };

  // NEW FUNCTION: Accept request with price
  const acceptRequestWithPrice = async () => {
    if (!jobToPrice || !jobPrice) return;
    
    try {
      // Validate price input
      const price = parseFloat(jobPrice);
      if (isNaN(price) || price <= 0) {
        setError('Please enter a valid price');
        return;
      }
      
      // Send API request with price
      await authAxios.post(`/service-providers/accept-request/${jobToPrice.id}`, {
        price: price
      });
      
      // Update UI by removing from incoming and adding to active
      const updatedRequest = {...jobToPrice, status: 'Pending', price: price};
      setIncomingRequests(incomingRequests.filter(req => req.id !== jobToPrice.id));
      setActiveRequests([...activeRequests, updatedRequest]);
      
      setSuccessMessage('Request accepted');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Close modals
      setShowPriceModal(false);
      closeJobDetails();
      
      // Reset price form
      setJobPrice('');
      setJobToPrice(null);
      
      // Refresh data
      fetchActiveRequests();
      fetchAvailableRequests();
      fetchDashboardStats();
    } catch (err) {
      console.error('Error accepting request with price:', err);
      setError('Failed to accept request');
      setTimeout(() => setError(''), 3000);
    }
  };


  // Decline a request
  const declineRequest = async (requestId) => {
    try {
      await authAxios.post(`/service-providers/decline-request/${requestId}`);
      
      // Update UI by removing the declined request
      setIncomingRequests(incomingRequests.filter(req => req.id !== requestId));
      
      setSuccessMessage('Request declined');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh data
      fetchAvailableRequests();
    } catch (err) {
      console.error('Error declining request:', err);
      setError('Failed to decline request');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Start a job (update status to in-progress)
  const startJob = async (requestId) => {
    try {
      await authAxios.patch(`/service-providers/update-job-status/${requestId}`, {
        status: 'in-progress'
      });
      
      // Update the job status in UI
      setActiveRequests(activeRequests.map(job => 
        job.id === requestId 
          ? {...job, status: 'In Progress'} 
          : job
      ));
      
      // Update selected job if it's the one being started
      if (selectedJob && selectedJob.id === requestId) {
        setSelectedJob({...selectedJob, status: 'In Progress'});
      }
      
      setSuccessMessage('Job started successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error starting job:', err);
      setError('Failed to start job');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Complete a job
  const completeJob = async (requestId) => {
    try {
      await authAxios.patch(`/service-providers/update-job-status/${requestId}`, {
        status: 'completed'
      });
      
      // Remove the job from active requests
      setActiveRequests(activeRequests.filter(job => job.id !== requestId));
      
      // Close the modal if the completed job is selected
      if (selectedJob && selectedJob.id === requestId) {
        setSelectedJob(null);
      }
      
      setSuccessMessage('Job completed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh dashboard stats
      fetchDashboardStats();
    } catch (err) {
      console.error('Error completing job:', err);
      setError('Failed to complete job');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Show job details in modal
  const showJobDetails = (job) => {
    setSelectedJob(job);
  };

  // Close job details modal
  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  // Send a message on a job
  const sendMessage = async (requestId, message) => {
    try {
      await authAxios.post(`/service-providers/add-message/${requestId}`, {
        message
      });
      setSuccessMessage('Message sent successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Load initial data when component mounts
  useEffect(() => {
    fetchActiveRequests();
    fetchAvailableRequests();
    fetchDashboardStats();
  }, []);

  // Rest of your component render code remains the same
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
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{completedJobs}</h3>
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
                    
                    {job.price && (
                      <div className="mb-3 flex items-center">
                        <span className="flex items-center text-sm font-medium text-slate-800">
                          <IndianRupee className="h-4 w-4 text-green-600 mr-1" />
                          {job.price}
                        </span>
                      </div>
                    )}
                    
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
                  {selectedJob.price && (
                    <div className="bg-gray-50 px-4 py-3 rounded-lg flex items-center space-x-3">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-sm font-medium text-slate-800">₹{selectedJob.price}</p>
                      </div>
                    </div>
                  )}
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
              
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <div className="flex flex-wrap gap-3">
                  {/* Show different action buttons based on job status */}
                  {selectedJob.status === 'New' && (
                    <>
                      <button 
                        onClick={() => showPriceInput(selectedJob.id)}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center"
                      >
                        <IndianRupee className="h-4 w-4 mr-2" />
                        Accept Request
                      </button>
                      <button 
                        onClick={() => declineRequest(selectedJob.id)}
                        className="px-4 py-2 bg-white text-slate-700 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                      </button>
                    </>
                  )}
                  
                  {selectedJob.status === 'Pending' && (
                    <button 
                      onClick={() => startJob(selectedJob.id)}
                      className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start Job
                    </button>
                  )}
                  
                  {selectedJob.status === 'In Progress' && (
                    <button 
                      onClick={() => completeJob(selectedJob.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Complete Job
                    </button>
                  )}
                  
                  <button 
                    onClick={closeJobDetails}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Price Modal */}
        {showPriceModal && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50" 
              style={{animation: 'fadeIn 0.3s ease-out'}}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
                style={{animation: 'scaleIn 0.4s ease-out'}}>
              <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IndianRupee className="h-4 w-4 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Set Job Price</h3>
                </div>
                <button 
                  onClick={() => setShowPriceModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 mb-4">
                  Enter the price you want to quote for this job:
                </p>
                
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={jobPrice}
                      onChange={(e) => setJobPrice(e.target.value)}
                      placeholder="0.00"
                      className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </label>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPriceModal(false)}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={acceptRequestWithPrice}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Accept With Price
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add custom CSS for animations */}
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
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-pulse-subtle {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ServiceProviderJobPage;