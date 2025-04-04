import React, { useState } from 'react';

const ProviderSelectionModal = ({ isOpen, onClose }) => {
  const handleProviderTypeSelection = (type) => {
    console.log(`Selected provider type: ${type}`);
    
    // Close the popup
    onClose();
    
    // Navigate to different routes based on provider type
    if (type === 'service') {
      window.location.href = '/ServiceProvider-Login';
    } else if (type === 'shop') {
      window.location.href = '/ShopOwner-Login';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal - now slightly translucent with slate-900 accents */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 max-w-md w-full z-10 m-4 animate-scale-in border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Register as Provider</h2>
        <p className="text-slate-600 mb-6">Please select the type of provider you want to register as:</p>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Service Provider Option - updated with slate-900 */}
          <button
            onClick={() => handleProviderTypeSelection('service')}
            className="bg-white/80 border border-slate-200 rounded-lg p-4 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-900/10 rounded-full p-3 mb-3">
                <svg className="h-6 w-6 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-slate-900">Service Provider</h3>
              <p className="text-xs text-slate-500 mt-1">For individuals or companies offering services</p>
            </div>
          </button>
          
          {/* Shop Owner Option - updated with slate-900 */}
          <button
            onClick={() => handleProviderTypeSelection('shop')}
            className="bg-white/80 border border-slate-200 rounded-lg p-4 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-900/10 rounded-full p-3 mb-3">
                <svg className="h-6 w-6 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-medium text-slate-900">Shop Owner</h3>
              <p className="text-xs text-slate-500 mt-1">For retail businesses selling products</p>
            </div>
          </button>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderSelectionModal;