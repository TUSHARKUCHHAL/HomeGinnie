import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

const AddServiceForm = ({ isOpen, onClose, onServiceAdded, service }) => {
  // Initialize form data
  const [formData, setFormData] = useState({
    serviceCategory: '',
    serviceName: '',
    about: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Set form data when editing a service
  useEffect(() => {
    if (service) {
      setFormData({
        serviceCategory: service.serviceCategory || '',
        serviceName: service.serviceName || '',
        about: service.about || '',
        image: null // Image needs to be re-uploaded if needed
      });
      
      // Set image preview if the service has an image
      if (service.imagePath) {
        // Prepend the base URL if the path doesn't already include it
        const imageUrl = service.imagePath.startsWith('http') 
          ? service.imagePath 
          : `http://localhost:5500/${service.imagePath}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form when adding a new service
      setFormData({
        serviceCategory: '',
        serviceName: '',
        about: '',
        image: null
      });
      setImagePreview(null);
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create form data for multipart/form-data submission
      const formDataForSubmit = new FormData();
      formDataForSubmit.append('serviceCategory', formData.serviceCategory);
      formDataForSubmit.append('serviceName', formData.serviceName);
      formDataForSubmit.append('about', formData.about);
      if (formData.image) {
        formDataForSubmit.append('image', formData.image);
      }
      
      // Determine if we're creating or updating
      const url = service ? `http://localhost:5500/api/services/${service._id}` : 'http://localhost:5500/api/services';
      const method = service ? 'PUT' : 'POST';
      
      // Submit to backend API
      const response = await fetch(url, {
        method: method,
        body: formDataForSubmit,
        // No Content-Type header - browser sets it automatically with boundary for FormData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Failed to ${service ? 'update' : 'create'} service`);
      }
      
      // Call callback function if provided
      if (onServiceAdded && typeof onServiceAdded === 'function') {
        onServiceAdded(result.data);
      }
      
      // Reset form and close modal
      setFormData({
        serviceCategory: '',
        serviceName: '',
        about: '',
        image: null
      });
      setImagePreview(null);
      onClose();
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-500/60 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-fadeIn"
        style={{animation: 'fadeIn 0.3s ease-out'}}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            {/* Service Category */}
            <div>
              <label htmlFor="serviceCategory" className="block text-sm font-medium text-slate-800 mb-1">
                Service Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 transition-all"
                placeholder="E.g. Web Development"
              />
            </div>
            
            {/* Service Name */}
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-slate-800 mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 transition-all"
                placeholder="E.g. Website Redesign"
              />
            </div>
            
            {/* About Service */}
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-slate-800 mb-1">
                About Service <span className="text-red-500">*</span>
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 resize-none transition-all"
                placeholder="Tell us about this service..."
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Service Image
              </label>
              <div className="mt-1 flex items-center justify-center w-full">
                {imagePreview ? (
                  <div className="relative w-full h-32 bg-slate-100 rounded-md overflow-hidden">
                    <img 
                      src={imagePreview}
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-slate-100 transition-colors"
                    >
                      <X size={16} className="text-slate-800" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                        <span className="font-medium text-slate-700">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors flex items-center ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : service ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceForm;