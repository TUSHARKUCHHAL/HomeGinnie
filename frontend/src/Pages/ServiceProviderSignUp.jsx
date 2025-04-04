import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone, FaToolbox, FaStar, FaMapMarkerAlt, FaRegIdCard } from 'react-icons/fa';
import { IoBusinessSharp } from 'react-icons/io5';

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
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPosition, setButtonPosition] = useState('fixed');
  const [bottomOffset, setBottomOffset] = useState('8');
  
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox differently
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
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
  };

  // Move to next step
  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  // Move to previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle final submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Provider sign up attempt with:', formData);
      setIsLoading(false);
      // Add your actual registration logic here
    }, 1500);
  };

  // Switch to user signup
  const handleUserSignUp = () => {
    console.log('Switch to regular user signup');
    // Redirect to user signup page
  };

  // Render form based on current step
  const renderFormStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="fade-in">
            <h2 className="text-xl font-semibold text-slate-800 mb-5">Personal Information</h2>
            
            {/* Name Fields - Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="John"
                  />
                </div>
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>
            
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            {/* Phone Fields - Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Primary Phone */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              
              {/* Alternate Phone */}
              <div>
                <label htmlFor="alternateNumber" className="block text-sm font-medium text-slate-700 mb-1">
                  Alternate Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Must be at least 8 characters long with a mix of letters, numbers, and symbols
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="fade-in">
            <h2 className="text-xl font-semibold text-slate-800 mb-5">Address Information</h2>
            
            {/* Street Address */}
            <div className="mb-4">
              <label htmlFor="street" className="block text-sm font-medium text-slate-700 mb-1">
                Street Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="street"
                  name="street"
                  type="text"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                  placeholder="123 Main Street, Apartment 4B"
                />
              </div>
            </div>
            
            {/* City and State - Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoBusinessSharp className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="Mumbai"
                  />
                </div>
              </div>
              
              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">
                  State
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaRegIdCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>
            </div>
            
            {/* Postal Code */}
            <div className="mb-4">
              <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">
                Postal Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                  placeholder="400001"
                />
              </div>
            </div>
            
            <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-600 text-sm">
                Your address information will only be shared with clients when you accept their service request. 
                This helps clients know if you are available in their area.
              </p>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="fade-in">
            <h2 className="text-xl font-semibold text-slate-800 mb-5">Services & Experience</h2>
            
            {/* Service Categories */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Select Services You Provide <span className="text-slate-500 text-xs">(Select all that apply)</span>
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceCategories.map((service) => (
                  <div 
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`
                      service-badge cursor-pointer border rounded-lg p-3 text-center text-sm
                      ${formData.selectedServices.includes(service) 
                        ? 'selected' 
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                      }
                    `}
                  >
                    <FaToolbox className="inline-block mr-2 mb-1" />
                    {service}
                  </div>
                ))}
              </div>
              
              {formData.selectedServices.length === 0 && (
                <p className="text-xs text-orange-500 mt-2">
                  Please select at least one service
                </p>
              )}
            </div>
            
            {/* Years of Experience */}
            <div className="mb-4">
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-slate-700 mb-1">
                Years of Experience
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="pl-10 block w-full rounded-lg border border-slate-300 bg-white py-3 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Experience Description */}
            <div className="mb-4">
              <label htmlFor="experienceDescription" className="block text-sm font-medium text-slate-700 mb-1">
                Describe Your Experience
              </label>
              <textarea
                id="experienceDescription"
                name="experienceDescription"
                rows="3"
                value={formData.experienceDescription}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                placeholder="Share details about your skills, certifications, and notable projects..."
              ></textarea>
            </div>
            
            {/* About */}
            <div className="mb-4">
              <label htmlFor="about" className="block text-sm font-medium text-slate-700 mb-1">
                About Yourself
              </label>
              <textarea
                id="about"
                name="about"
                rows="3"
                value={formData.about}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-300 bg-white py-3 px-4 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                placeholder="Tell potential clients about yourself, your work ethic, and why they should choose you..."
              ></textarea>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="fade-in">
            <h2 className="text-xl font-semibold text-slate-800 mb-5">Review & Submit</h2>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-5 border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">Personal Information</h3>
              <p className="text-slate-600 text-sm mb-1">
                <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
              </p>
              <p className="text-slate-600 text-sm mb-1">
                <span className="font-medium">Email:</span> {formData.email}
              </p>
              <p className="text-slate-600 text-sm">
                <span className="font-medium">Phone:</span> {formData.phoneNumber}
                {formData.alternateNumber && `, ${formData.alternateNumber} (alternate)`}
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-5 border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">Address</h3>
              <p className="text-slate-600 text-sm">
                {formData.street}, {formData.city}, {formData.state} - {formData.postalCode}
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-5 border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">Services & Experience</h3>
              
              <div className="mb-2">
                <p className="text-slate-600 text-sm font-medium">Selected Services:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.selectedServices.map(service => (
                    <span key={service} className="inline-block bg-slate-200 rounded-full px-3 py-1 text-xs font-medium text-slate-700">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-slate-600 text-sm mb-1">
                <span className="font-medium">Experience:</span> {formData.yearsOfExperience} years
              </p>
              
              {formData.experienceDescription && (
                <div className="mb-2">
                  <p className="text-slate-600 text-sm font-medium">Experience Details:</p>
                  <p className="text-slate-600 text-xs">{formData.experienceDescription}</p>
                </div>
              )}
              
              {formData.about && (
                <div>
                  <p className="text-slate-600 text-sm font-medium">About:</p>
                  <p className="text-slate-600 text-xs">{formData.about}</p>
                </div>
              )}
            </div>
            
            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-slate-600">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-slate-800 hover:text-slate-700">
                    Terms of Service
                  </a>,{' '}
                  <a href="#" className="font-medium text-slate-800 hover:text-slate-700">
                    Provider Guidelines
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-slate-800 hover:text-slate-700">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600">
                By clicking "Create Provider Account", you agree to verify your identity and credentials within 7 days. 
                Your profile will be reviewed by our team before being made visible to potential clients.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="signup-container min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-1"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-2"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-3"></div>
      
      {/* CSS Animations */}
      <style>{animationStyles}</style>
      
      <div className="max-w-2xl mx-auto">
        {/* Form Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Become a Service Provider</h1>
          <p className="text-slate-600 max-w-md mx-auto">
            Join our network of skilled professionals and start growing your business today.
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {Math.round(completionPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-slate-600 h-2.5 rounded-full progress-animation"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 mb-10 relative z-10">
          <form onSubmit={handleSubmit}>
            {renderFormStep()}
            
            {/* Form Navigation */}
            <div className="mt-8 flex justify-between items-center">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Previous
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUserSignUp}
                  className="py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Switch to User Sign Up
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 animate-float ${
                    (currentStep === 3 && formData.selectedServices.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={currentStep === 3 && formData.selectedServices.length === 0}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.agreeTerms || isLoading}
                  className={`py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${
                    (!formData.agreeTerms || isLoading) ? 'opacity-50 cursor-not-allowed' : 'animate-float'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Create Provider Account'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Help Info */}
        <div className="text-center text-sm text-slate-600 mt-6">
          <p>Already have an account? <a href="#" className="font-medium text-slate-700 hover:text-slate-900 hover:text-glow">Sign in</a></p>
          <p className="mt-2">Need help? <a href="#" className="font-medium text-slate-700 hover:text-slate-900 hover:text-glow">Contact support</a></p>
        </div>
      </div>
      
      {/* Floating help button */}
      <div className={`${buttonPosition} right-4 bottom-${bottomOffset} z-50`}>
        <button
          type="button"
          className="bg-slate-700 text-white rounded-full p-3 shadow-lg hover:bg-slate-800 transition-all duration-300 hover:shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServiceProviderSignUp;