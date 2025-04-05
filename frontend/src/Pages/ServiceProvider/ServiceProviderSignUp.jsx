import React, { useState, useEffect, useContext } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone, FaToolbox, FaStar, FaMapMarkerAlt, FaRegIdCard, FaExclamationCircle } from 'react-icons/fa';
import { IoBusinessSharp } from 'react-icons/io5';
import axios from 'axios';
import { AuthContext } from '../../App';

// Animation styles - keep consistent with the existing theme
const animationStyles = `
/* First blob animation */
@keyframes blob1 {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  25% {
    transform: translate(40px, -60px) scale(1.2);
  }
  50% {
    transform: translate(-30px, -20px) scale(0.8);
  }
  75% {
    transform: translate(20px, 40px) scale(1.1);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Second blob animation */
@keyframes blob2 {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  20% {
    transform: translate(-50px, 30px) scale(1.15);
  }
  40% {
    transform: translate(35px, 10px) scale(0.9);
  }
  60% {
    transform: translate(-20px, -40px) scale(1.05);
  }
  80% {
    transform: translate(25px, -20px) scale(0.95);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Third blob animation */
@keyframes blob3 {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(60px, 30px) scale(0.85);
  }
  66% {
    transform: translate(-40px, -30px) scale(1.25);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Floating animation for buttons */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Progress bar animation */
@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

/* Heading scale up animation */
@keyframes scaleUp {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-blob-1 {
  animation: blob1 8s infinite ease-in-out;
}

.animate-blob-2 {
  animation: blob2 10s infinite ease-in-out;
}

.animate-blob-3 {
  animation: blob3 9s infinite ease-in-out;
}

.animate-float {
  animation: float 3s infinite ease-in-out;
}

.animate-scale-up {
  animation: scaleUp 0.5s ease-out forwards;
}

.hover\\:text-glow:hover {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2);
  transition: text-shadow 0.3s ease;
}

.progress-animation {
  animation: progress 0.5s ease-out;
}

/* Service category badge hover effect */
.service-badge {
  transition: all 0.3s ease;
}

.service-badge:hover, .service-badge.selected {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-badge.selected {
  background-color: #1e293b;
  color: white;
}

/* Multi-step form fading effect */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

// Available service categories
const serviceCategories = [
  "Plumbing", "Electrical", "Carpentry", "Painting", 
  "Cleaning", "Landscaping", "Roofing", "HVAC", 
  "Interior Design", "Flooring", "Pest Control", "Security",
  "Solar Installation", "Smart Home", "Furniture Assembly"
];

const ServiceProviderSignUp = () => {
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    alternateNumber: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    selectedServices: [],
    yearsOfExperience: 0,
    experienceDescription: '',
    about: '',
    agreeTerms: false,
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPosition, setButtonPosition] = useState('fixed');
  const [bottomOffset, setBottomOffset] = useState('8');
  const { login } = useContext(AuthContext);
  // Track form completion percentage
  const completionPercentage = (currentStep / totalSteps) * 100;
  
  useEffect(() => {
    // Function to check for footer visibility and adjust button position
    const handleScroll = () => {
      const footerElement = document.querySelector('footer');
      
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If footer is visible in the viewport
        if (footerRect.top < windowHeight) {
          // Calculate how much of the footer is visible
          const footerVisibleHeight = windowHeight - footerRect.top;
          
          // Adjust the button position to be above the footer
          if (footerVisibleHeight > 0) {
            setButtonPosition('absolute');
            // Calculate position from bottom of signup container
            const signupContainer = document.querySelector('.signup-container');
            if (signupContainer) {
              const signupContainerRect = signupContainer.getBoundingClientRect();
              setBottomOffset((signupContainerRect.bottom - footerRect.top + 8).toString());
            }
          }
        } else {
          // Reset to fixed position if footer is not visible
          setButtonPosition('fixed');
          setBottomOffset('8');
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  // Phone number validation (simple version)
  const phoneRegex = /^\d{10}$/;

  
  // Postal code validation
  const postalCodeRegex = /^[0-9]{6}$/;

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox differently
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };
  
  // Handle service selection
  const toggleService = (service) => {
    if (formData.selectedServices.includes(service)) {
      setFormData({
        ...formData,
        selectedServices: formData.selectedServices.filter(s => s !== service)
      });
    } else {
      setFormData({
        ...formData,
        selectedServices: [...formData.selectedServices, service]
      });
    }
    
    // Clear error when services are selected
    if (errors.selectedServices) {
      setErrors({
        ...errors,
        selectedServices: ''
      });
    }
  };

  // Validate current step fields
  const validateStep = (step) => {
    const newErrors = {};

    switch(step) {
      case 1:
        // Validate personal information
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        
        if (!formData.phoneNumber.trim()) {
          newErrors.phoneNumber = "Phone number is required";
        } else if (!phoneRegex.test(formData.phoneNumber)) {
          newErrors.phoneNumber = "Please enter a valid phone number";
        }
        
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
          newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
        }
        
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;

      case 2:
        // Validate address information
        if (!formData.street.trim()) newErrors.street = "Street address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        
        if (!formData.postalCode.trim()) {
          newErrors.postalCode = "Postal code is required";
        } else if (!postalCodeRegex.test(formData.postalCode)) {
          newErrors.postalCode = "Please enter a valid 6-digit postal code";
        }
        break;

      case 3:
        // Validate services & experience
        if (formData.selectedServices.length === 0) {
          newErrors.selectedServices = "Please select at least one service";
        }
        
        if (formData.yearsOfExperience === '' || isNaN(formData.yearsOfExperience)) {
          newErrors.yearsOfExperience = "Please enter your years of experience";
        }
        break;

      case 4:
        // Validate terms agreement
        if (!formData.agreeTerms) {
          newErrors.agreeTerms = "You must agree to the terms and conditions";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Move to next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      // Scroll to top when moving to next step
      window.scrollTo(0, 0);
    }
  };

  // Move to previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    // Scroll to top when moving to previous step
    window.scrollTo(0, 0);
  };

 // Handle final submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateStep(currentStep)) {
    setIsLoading(true);
    
    try {
      // Prepare data for submission
      const providerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber,
        alternateNumber: formData.alternateNumber,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        },
        services: formData.selectedServices,
        yearsOfExperience: formData.yearsOfExperience,
        experienceDescription: formData.experienceDescription,
        about: formData.about
      };
      
      // Send API request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/service-providers/register`, 
        providerData
      );
      
      // Use AuthContext login function 
      // Assuming you're using a context similar to the example
      login(
        response.data.token, 
        response.data.role || 'service-provider', 
        true // Pass true for rememberMe
      );
      
      // Redirect to service provider dashboard
      window.location.href = '/service-provider-dashboard';
      
    } catch (error) {
      console.error(
        'Registration error:', 
        error.response?.data?.message || error.message
      );
      
      // Update the errors state with the error message
      setErrors({
        ...errors,
        submitError: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }
};

  // Render form based on current step
const renderFormStep = () => {
  switch(currentStep) {
    case 1:
      return (
        <div className="fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6 mt-4 animate-scale-up">Personal Information</h2>
          
          {/* Name Fields - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaUser className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <FaExclamationCircle className="mr-1" /> {errors.firstName}
                </div>
              )}
            </div>
            
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaUser className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <FaExclamationCircle className="mr-1" /> {errors.lastName}
                </div>
              )}
            </div>
          </div>
          
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaEnvelope className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.email}
              </div>
            )}
          </div>
          
          {/* Phone Fields - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Primary Phone */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaPhone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                  placeholder="+91 9876543210"
                />
              </div>
              {errors.phoneNumber && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <FaExclamationCircle className="mr-1" /> {errors.phoneNumber}
                </div>
              )}
            </div>
            
            {/* Alternate Phone */}
            <div>
              <label htmlFor="alternateNumber" className="block text-sm font-medium text-slate-700 mb-1">
                Alternate Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaPhone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="alternateNumber"
                  name="alternateNumber"
                  type="tel"
                  value={formData.alternateNumber}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </div>
          
          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaLock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 block w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500 z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password ? (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.password}
              </div>
            ) : (
              <p className="mt-1 text-xs text-slate-500">
                Must be at least 8 characters long with a mix of uppercase, lowercase, numbers, and symbols
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaLock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 block w-full rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500 z-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>
      );
      
    case 2:
      return (
        <div className="fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6 mt-4 animate-scale-up">Address Information</h2>
          
          {/* Street Address */}
          <div className="mb-4">
            <label htmlFor="street" className="block text-sm font-medium text-slate-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaMapMarkerAlt className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="street"
                name="street"
                type="text"
                required
                value={formData.street}
                onChange={handleChange}
                className={`pl-10 block w-full rounded-lg border ${errors.street ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                placeholder="123 Main Street, Apartment 4B"
              />
            </div>
            {errors.street && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.street}
              </div>
            )}
          </div>
          
          {/* City and State - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <IoBusinessSharp className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-lg border ${errors.city ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                  placeholder="Mumbai"
                />
              </div>
              {errors.city && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <FaExclamationCircle className="mr-1" /> {errors.city}
                </div>
              )}
            </div>
            
            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaRegIdCard className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-lg border ${errors.state ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                  placeholder="Maharashtra"
                />
              </div>
              {errors.state && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <FaExclamationCircle className="mr-1" /> {errors.state}
                </div>
              )}
            </div>
          </div>
          
          {/* Postal Code */}
          <div className="mb-4">
            <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaMapMarkerAlt className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                required
                value={formData.postalCode}
                onChange={handleChange}
                className={`pl-10 block w-full rounded-lg border ${errors.postalCode ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                placeholder="400001"
              />
            </div>
            {errors.postalCode && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.postalCode}
              </div>
            )}
          </div>
          
          <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-700 mb-2">Service Coverage Area</h3>
            <p className="text-sm text-slate-500">
              This address will be used to determine your service coverage area. You'll be able to specify your exact service radius later.
            </p>
          </div>
        </div>
      );
      
    case 3:
      return (
        <div className="fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6 mt-4 animate-scale-up">Services & Experience</h2>
          
          {/* Service Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Services You Provide <span className="text-red-500">*</span>
            </label>
            
            {errors.selectedServices && (
              <div className="flex items-center mb-3 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.selectedServices}
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceCategories.map((service) => (
                <div
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`service-badge flex items-center px-3 py-2 rounded-lg border cursor-pointer ${
                    formData.selectedServices.includes(service)
                      ? 'selected bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <FaToolbox className="mr-2 h-4 w-4" />
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Years of Experience */}
          <div className="mb-4">
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-slate-700 mb-1">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaStar className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                required
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className={`pl-10 block w-full rounded-lg border ${errors.yearsOfExperience ? 'border-red-500' : 'border-slate-300'} bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
                placeholder="5"
              />
            </div>
            {errors.yearsOfExperience && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.yearsOfExperience}
              </div>
            )}
          </div>
          
          {/* Experience Description */}
          <div className="mb-4">
            <label htmlFor="experienceDescription" className="block text-sm font-medium text-slate-700 mb-1">
              Experience Description (Optional)
            </label>
            <textarea
              id="experienceDescription"
              name="experienceDescription"
              rows="3"
              required
              value={formData.experienceDescription}
              onChange={handleChange}
              className={`block w-full rounded-lg border ${errors.experienceDescription ? 'border-red-500' : 'border-slate-300'} bg-white py-3 px-4 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
              placeholder="Describe your experience, qualifications, certifications, and specializations..."
            />
            {errors.experienceDescription && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.experienceDescription}
              </div>
            )}
          </div>
          
          {/* About Me */}
          <div className="mb-4">
            <label htmlFor="about" className="block text-sm font-medium text-slate-700 mb-1">
              About Me
            </label>
            <textarea
              id="about"
              name="about"
              rows="4"
              required
              value={formData.about}
              onChange={handleChange}
              className={`block w-full rounded-lg border ${errors.about ? 'border-red-500' : 'border-slate-300'} bg-white py-3 px-4 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm`}
              placeholder="Tell potential customers about yourself, your approach to work, and what makes your service special..."
            />
            {errors.about && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.about}
              </div>
            )}
          </div>
          
          <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-700 mb-2">Customer Visibility</h3>
            <p className="text-sm text-slate-500">
              This information will be visible to potential customers browsing the platform. Make sure to highlight your expertise and unique qualities.
            </p>
          </div>
        </div>
      );
      
    case 4:
      return (
        <div className="fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6 mt-4 animate-scale-up">Review & Submit</h2>
          
          {/* Summary */}
          <div className="mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Personal */}
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-800 mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div>
                  <span className="text-slate-500">Name:</span>{' '}
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>{' '}
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>{' '}
                  <span className="font-medium">{formData.phoneNumber}</span>
                </div>
                {formData.alternateNumber && (
                  <div>
                    <span className="text-slate-500">Alternate Phone:</span>{' '}
                    <span className="font-medium">{formData.alternateNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Address */}
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-800 mb-3">Address</h3>
              <div className="grid grid-cols-1 gap-y-2 text-sm">
                <div>
                  <span className="text-slate-500">Street:</span>{' '}
                  <span className="font-medium">{formData.street}</span>
                </div>
                <div>
                  <span className="text-slate-500">City, State, Postal Code:</span>{' '}
                  <span className="font-medium">
                    {formData.city}, {formData.state} {formData.postalCode}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Services */}
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-800 mb-3">Services</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.selectedServices.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                  >
                    <FaToolbox className="mr-1 h-3 w-3" /> {service}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Years of Experience:</span>{' '}
                <span className="font-medium">{formData.yearsOfExperience}</span>
              </div>
            </div>
            
            {/* About */}
            <div className="p-4">
              <h3 className="text-lg font-medium text-slate-800 mb-3">About & Experience</h3>
              <div className="text-sm mb-3">
                <span className="block text-slate-500 mb-1">Experience:</span>
                <p className="text-slate-700">{formData.experienceDescription}</p>
              </div>
              <div className="text-sm">
                <span className="block text-slate-500 mb-1">About Me:</span>
                <p className="text-slate-700">{formData.about}</p>
              </div>
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="font-medium text-slate-700">
                  I agree to the terms and conditions <span className="text-red-500">*</span>
                </label>
                <p className="text-slate-500">
                  By checking this box, you agree to our{' '}
                  <a href="#" className="text-slate-700 underline hover:text-slate-900">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-slate-700 underline hover:text-slate-900">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
            {errors.agreeTerms && (
              <div className="flex items-center mt-1 ml-7 text-red-500 text-xs">
                <FaExclamationCircle className="mr-1" /> {errors.agreeTerms}
              </div>
            )}
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

  return (
    <div className="signup-container bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply opacity-20 animate-blob-1"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply opacity-20 animate-blob-2"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply opacity-20 animate-blob-3"></div>
      </div>
      
      <div className="mt-20 mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 animate-scale-up">
            Join as a Service Provider
          </h1>
          <p className="mt-3 text-slate-600">
            Create your professional profile and start connecting with customers in your area
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-slate-600 h-2.5 rounded-full progress-animation"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            {renderFormStep()}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Back
                </button>
              )}
              
              <div className="flex-grow"></div>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Complete Sign Up'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Switch to user signup */}
        <div className="text-center">
          <p className="text-slate-600">
            Looking to sign up as a user instead?{' '}
            <a
              type="button"
              href="/SignUp"
              className="text-slate-800 font-medium hover:text-glow underline hover:text-slate-900"
            >
              User Sign Up
            </a>
          </p>
        </div>
      </div>
      
      {/* Fixed Continue Button on Mobile - Shows only for step < totalSteps */}
      {currentStep < totalSteps && (
        <div 
          className={`sm:hidden ${buttonPosition} left-0 right-0 bottom-${bottomOffset} px-4 py-3 bg-white shadow-lg border-t border-slate-200`}
        >
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full px-6 py-3 bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 animate-float"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderSignUp;