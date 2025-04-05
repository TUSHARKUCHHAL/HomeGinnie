import React, { useState } from 'react';
import NotificationModal from './NotificationModal';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Notifications</h2>
        <button
          onClick={openModal}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-900 transition-colors"
        >
          <Bell size={18} />
          <span>Send Notification</span>
        </button>
      </div>

      {/* Your other notification content here */}
      
      {/* Notification Modal */}
      <NotificationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default NotificationsPage;