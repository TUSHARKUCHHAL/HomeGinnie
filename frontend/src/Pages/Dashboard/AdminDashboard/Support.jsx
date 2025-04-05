import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareIcon, CheckCircleIcon, XCircleIcon, Clock } from 'lucide-react';

const SupportTab = () => {
  const [tickets, setTickets] = useState([
    { 
      id: 1, 
      customer: 'John Smith', 
      subject: 'Login Issues', 
      message: 'I am unable to login to my account since yesterday.',
      status: 'open',
      priority: 'high',
      created: '2 hours ago'
    },
    { 
      id: 2, 
      customer: 'Sarah Johnson', 
      subject: 'Payment Failed', 
      message: 'My payment transaction is failing repeatedly.',
      status: 'pending',
      priority: 'medium',
      created: '5 hours ago'
    },
    { 
      id: 3, 
      customer: 'Michael Brown', 
      subject: 'Feature Request', 
      message: 'Would like to suggest a new feature for the platform.',
      status: 'closed',
      priority: 'low',
      created: '1 day ago'
    },
    { 
      id: 4, 
      customer: 'Emma Wilson', 
      subject: 'Account Upgrade', 
      message: 'Need help upgrading to premium plan.',
      status: 'open',
      priority: 'medium',
      created: '3 hours ago'
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Tickets' },
    { id: 'open', label: 'Open' },
    { id: 'pending', label: 'Pending' },
    { id: 'closed', label: 'Closed' }
  ];

  const filteredTickets = activeFilter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === activeFilter);

  const statusColor = {
    open: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    closed: 'bg-green-100 text-green-700'
  };

  const priorityColor = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-blue-100 text-blue-700',
    low: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Support Tickets</h3>
          <div className="flex space-x-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              className="border border-slate-100 rounded-lg p-4 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <MessageSquareIcon size={16} className="text-blue-600" />
                    <h4 className="font-medium">{ticket.subject}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[ticket.status]}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{ticket.message}</p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500">
                    <span>From: <span className="font-medium">{ticket.customer}</span></span>
                    <span>{ticket.created}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-green-100 rounded-full transition-colors">
                    <CheckCircleIcon size={16} className="text-green-600" />
                  </button>
                  <button className="p-2 hover:bg-red-100 rounded-full transition-colors">
                    <XCircleIcon size={16} className="text-red-600" />
                  </button>
                  <button className="p-2 hover:bg-blue-100 rounded-full transition-colors">
                    <Clock size={16} className="text-blue-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportTab;