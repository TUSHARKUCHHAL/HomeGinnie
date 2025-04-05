// export default AdminDashboard;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  PlusCircleIcon,
  PhoneIcon,
  UserMinusIcon,
  BellIcon,
  MailIcon
} from 'lucide-react';
// Import tab components
import ServicesTab from './Services/Services';
import SupportTab from './Support';
import UsersTab from './Users';
import CampaignsTab from './Campaigns/Campaigns';
import ContactTab from './Contact';

// Page Title Component
const PageTitle = ({ title }) => {
  return (
    <motion.h2 
      className="text-2xl font-bold mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title}
    </motion.h2>
  );
};

// Stat Card Component
const StatCard = ({ card, index }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl border border-slate-100 shadow p-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">{card.title}</p>
          <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
          {card.change && (
            <p className={`text-xs mt-1 ${card.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {card.change > 0 ? '+' : ''}{card.change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${card.iconBg}`}>
          {card.icon}
        </div>
      </div>
    </motion.div>
  );
};

// Tab Nav Button Component
const TabButton = ({ label, icon, active, onClick }) => {
  return (
    <button
      className={`flex items-center space-x-2 py-3 px-4 rounded-lg transition-all w-full mb-2 
        ${active ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  
  // Sample data for stats
  const stats = [
    {
      title: 'Total Users',
      value: '5,423',
      change: 12.5,
      icon: <UserMinusIcon size={20} className="text-blue-500" />,
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Active Campaigns',
      value: '23',
      change: -2.7,
      icon: <BellIcon size={20} className="text-purple-500" />,
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Open Support Tickets',
      value: '42',
      change: 8.3,
      icon: <PhoneIcon size={20} className="text-green-500" />,
      iconBg: 'bg-green-100'
    },
    {
      title: 'New Messages',
      value: '153',
      change: 4.1,
      icon: <MailIcon size={20} className="text-orange-500" />,
      iconBg: 'bg-orange-100'
    }
  ];

  // Tab navigation configuration
  const tabs = [
    { id: 'services', label: 'Services', icon: <HomeIcon size={18} /> },
    { id: 'support', label: 'Support', icon: <PhoneIcon size={18} /> },
    { id: 'users', label: 'Users', icon: <UserMinusIcon size={18} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <BellIcon size={18} /> },
    { id: 'contact', label: 'Contact', icon: <MailIcon size={18} /> }
  ];

  // Map tabs to components
  const tabComponents = {
    services: <ServicesTab />,
    support: <SupportTab />,
    users: <UsersTab />,
    campaigns: <CampaignsTab />,
    contact: <ContactTab />
  };

  // Get title based on active tab
  const getPageTitle = () => {
    const tab = tabs.find(tab => tab.id === activeTab);
    return tab ? tab.label : '';
  };

  return (
    <div>
      <div className='bg-white drop-shadow-md  w-full h-20'></div>
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-100 p-4">
        <div className="flex items-center space-x-2 mb-8 mt-4">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <PlusCircleIcon size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        {/* Tab Navigation */}
        <nav className="mb-8">
          {tabs.map(tab => (
            <TabButton 
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>
      
      {/* Main Content */}
      
      <div className="flex-1 overflow-auto p-6 mt-1">
        <PageTitle title={getPageTitle()} />
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((card, index) => (
            <StatCard key={index} card={card} index={index} />
          ))}
        </div>
        
        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tabComponents[activeTab]}
        </motion.div>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;