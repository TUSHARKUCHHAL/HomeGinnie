import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, UserIcon, MoreHorizontal, UserPlusIcon } from 'lucide-react';

const UsersTab = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'Administrator',
      status: 'active',
      joined: 'Jan 15, 2023',
      avatar: '/api/placeholder/40/40'
    },
    { 
      id: 2, 
      name: 'Emily Smith', 
      email: 'emily@example.com', 
      role: 'Editor',
      status: 'active',
      joined: 'Mar 22, 2023',
      avatar: '/api/placeholder/40/40'
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      role: 'User',
      status: 'inactive',
      joined: 'May 5, 2023',
      avatar: '/api/placeholder/40/40'
    },
    { 
      id: 4, 
      name: 'Lisa Chen', 
      email: 'lisa@example.com', 
      role: 'Editor',
      status: 'active',
      joined: 'Feb 12, 2023',
      avatar: '/api/placeholder/40/40'
    },
    { 
      id: 5, 
      name: 'Michael Brown', 
      email: 'michael@example.com', 
      role: 'User',
      status: 'pending',
      joined: 'Apr 18, 2023',
      avatar: '/api/placeholder/40/40'
    },
  ]);

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

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">User Management</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <UserPlusIcon size={16} />
            <span>Add User</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full py-2 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 flex items-center space-x-2 hover:bg-slate-50 transition-colors">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <select className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors">
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
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
                <th className="text-left py-3 px-4 font-medium text-slate-500">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Role</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <motion.tr key={user.id} variants={item} className="border-b border-slate-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.joined}</td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-slate-100 rounded-full">
                      <MoreHorizontal size={16} className="text-slate-500" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default UsersTab;