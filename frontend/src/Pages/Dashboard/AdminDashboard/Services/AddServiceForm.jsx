import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

const AddServiceForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    serviceCategory: '',
    serviceName: '',
    about: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-fadeIn"
        style={{animation: 'fadeIn 0.3s ease-out'}}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">Add New Service</h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Service Category - Now as text input instead of dropdown */}
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
              ) : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceForm;

// Add this to your CSS or global stylesheet
// @keyframes fadeIn {
//   from { opacity: 0; transform: scale(0.95); }
//   to { opacity: 1; transform: scale(1); }
// }