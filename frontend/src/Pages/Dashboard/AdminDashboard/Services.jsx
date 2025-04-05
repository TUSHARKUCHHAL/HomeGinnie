import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, Edit2Icon, Trash2Icon } from 'lucide-react';

const ServicesTab = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Web Development', description: 'Full-stack web development services', status: 'active', price: '$1500' },
    { id: 2, name: 'Mobile App Development', description: 'iOS and Android app development', status: 'active', price: '$2000' },
    { id: 3, name: 'UI/UX Design', description: 'User interface and experience design', status: 'inactive', price: '$800' },
    { id: 4, name: 'SEO Optimization', description: 'Search engine optimization services', status: 'active', price: '$500' },
    { id: 5, name: 'Content Writing', description: 'Blog and website content creation', status: 'inactive', price: '$300' },
  ]);

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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <PlusIcon size={16} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <motion.table 
          className="w-full" 
          variants={container}
          initial="hidden"
          animate="show"
        >
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Description</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Price</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <motion.tr key={service.id} variants={item} className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium">{service.name}</td>
                <td className="py-3 px-4 text-slate-600">{service.description}</td>
                <td className="py-3 px-4">{service.price}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Edit2Icon size={16} className="text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <Trash2Icon size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default ServicesTab;