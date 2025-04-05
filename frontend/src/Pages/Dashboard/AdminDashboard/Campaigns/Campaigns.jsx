import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUpIcon, SendIcon, Edit3Icon, Trash2Icon, PlusIcon, Bell } from 'lucide-react';
import NotificationModal from './NotificationModal';



const CampaignsTab = () => {
  const [campaigns, setCampaigns] = useState([
    { 
      id: 1, 
      name: 'Summer Sale', 
      status: 'active',
      startDate: '2023-06-01',
      endDate: '2023-06-30',
      budget: '$5,000',
      spent: '$2,345',
      reach: '12.5K',
      conversion: '3.2%'
    },
    { 
      id: 2, 
      name: 'New Product Launch', 
      status: 'scheduled',
      startDate: '2023-07-15',
      endDate: '2023-08-15',
      budget: '$10,000',
      spent: '$0',
      reach: 'N/A',
      conversion: 'N/A'
    },
    { 
      id: 3, 
      name: 'Black Friday', 
      status: 'draft',
      startDate: '2023-11-24',
      endDate: '2023-11-27',
      budget: '$15,000',
      spent: '$0',
      reach: 'N/A',
      conversion: 'N/A'
    },
    { 
      id: 4, 
      name: 'Spring Collection', 
      status: 'completed',
      startDate: '2023-03-01',
      endDate: '2023-04-15',
      budget: '$7,500',
      spent: '$7,500',
      reach: '25.3K',
      conversion: '4.7%'
    },
  ]);
  
  // Add state for notification modal
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-slate-100 text-slate-700';
      case 'completed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Marketing Campaigns</h3>
          <div className='flex space-x-4'>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors gap-2">
              <PlusIcon size={16} />
              <span>Create Campaign</span>
            </button>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors gap-2"
              onClick={() => setIsNotificationModalOpen(true)}
            >
              <Bell size={16} />
              <span>Create Notification</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-600">Active Campaigns</p>
                <h4 className="text-2xl font-bold text-green-700">1</h4>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUpIcon size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600">Scheduled</p>
                <h4 className="text-2xl font-bold text-blue-700">1</h4>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-600">Total Budget</p>
                <h4 className="text-2xl font-bold text-purple-700">$37,500</h4>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <SendIcon size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          className="overflow-x-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Budget</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Spent</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Reach</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Conversion</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(campaign => (
                <motion.tr key={campaign.id} variants={item} className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium">{campaign.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex flex-col">
                      <span>{campaign.startDate}</span>
                      <span className="text-xs text-slate-400">to</span>
                      <span>{campaign.endDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{campaign.budget}</td>
                  <td className="py-3 px-4">{campaign.spent}</td>
                  <td className="py-3 px-4">{campaign.reach}</td>
                  <td className="py-3 px-4">{campaign.conversion}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 hover:bg-blue-100 rounded">
                        <Edit3Icon size={16} className="text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded">
                        <Trash2Icon size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
      
      {/* Notification Modal */}
      <NotificationModal 
        isOpen={isNotificationModalOpen} 
        onClose={() => setIsNotificationModalOpen(false)} 
      />
    </div>
  );
};

export default CampaignsTab;