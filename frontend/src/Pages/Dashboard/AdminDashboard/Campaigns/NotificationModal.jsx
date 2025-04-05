import React, { useState } from 'react';

import { Bell } from 'lucide-react';

// NotificationModal component
const NotificationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',

    sendTo: 'all',
    scheduledDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle notification submission logic here
    console.log('Notification data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-500/60 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create Notification</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md h-24"
              required
            />
          </div>
          
          
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Send To</label>
            <select
              name="sendTo"
              value={formData.sendTo}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md"
            >
              <option value="all">Users</option>
              <option value="active">Service Provider</option>
              <option value="premium">Shop Owner</option>
              <option value="premium">Everyone</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Scheduled Date (Optional)</label>
            <input
              type="datetime-local"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800"
            >
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;