import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, Edit2Icon, Trash2Icon, Loader2 } from 'lucide-react';
import AddServiceForm from './AddServiceForm';

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentService, setCurrentService] = useState(null);

  // Fetch services from the backend API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5500/api/services');
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const result = await response.json();
        setServices(result.data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  // Function to handle adding a new service
  const handleAddService = () => {
    setCurrentService(null); // Reset current service for add mode
    setIsFormOpen(true);
  };

  // Function to handle editing a service
  const handleEditService = (service) => {
    setCurrentService(service);
    setIsFormOpen(true);
  };

  // Function to handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setCurrentService(null);
  };

  // Function to handle service added or updated
  const handleServiceSaved = (savedService) => {
    if (currentService) {
      // Update existing service in the list
      setServices(services.map(service => 
        service._id === savedService._id ? savedService : service
      ));
    } else {
      // Add new service to the list
      setServices([savedService, ...services]);
    }
  };

  // Function to handle service deletion
  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`http://localhost:5500/api/services/${serviceId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete service');
        }
        
        // Remove the service from the list
        setServices(services.filter(service => service._id !== serviceId));
      } catch (err) {
        console.error('Error deleting service:', err);
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Available Services</h3>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          onClick={handleAddService}
        >
          <PlusIcon size={16} />
          <span>Add Service</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 size={30} className="animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : services.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          No services available. Add your first service!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <motion.table 
            className="w-full" 
            variants={container}
            initial="hidden"
            animate="show"
          >
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Category</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Description</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <motion.tr key={service._id} variants={item} className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium">{service.serviceCategory}</td>
                  <td className="py-3 px-4 font-medium">{service.serviceName}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {service.about.length > 100 ? `${service.about.substring(0, 100)}...` : service.about}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 hover:bg-slate-100 rounded"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit2Icon size={16} className="text-blue-600" />
                      </button>
                      <button 
                        className="p-1 hover:bg-slate-100 rounded"
                        onClick={() => handleDeleteService(service._id)}
                      >
                        <Trash2Icon size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}

      {/* Service form component */}
      <AddServiceForm 
        isOpen={isFormOpen} 
        onClose={handleFormClose} 
        onServiceAdded={handleServiceSaved}
        service={currentService} // Pass the service for editing
      />
    </div>
  );
};

export default ServicesTab;