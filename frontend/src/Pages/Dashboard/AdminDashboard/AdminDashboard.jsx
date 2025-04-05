// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   HomeIcon, 
//   PlusCircleIcon,
//   PhoneIcon,
//   UserMinusIcon,
//   BellIcon,
//   MailIcon,
//   SearchIcon 
// } from 'lucide-react';

// // Main Dashboard Component
// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
  
//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col lg:flex-row gap-6"
//       >
//         {/* Sidebar */}
//         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
//         {/* Main Content */}
//         <motion.div 
//           className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <TabContent activeTab={activeTab} />
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// // Sidebar Component
// const Sidebar = ({ activeTab, setActiveTab }) => {
//   const menuItems = [
//     { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
//     { id: 'addService', icon: PlusCircleIcon, label: 'Services' },
//     { id: 'customerCare', icon: PhoneIcon, label: 'Support' },
//     { id: 'blockUsers', icon: UserMinusIcon, label: 'Users' },
//     { id: 'campaign', icon: BellIcon, label: 'Campaigns' },
//     { id: 'contactInfo', icon: MailIcon, label: 'Contact' },
//   ];

//   return (
//     <motion.div 
//       className="bg-slate-800 rounded-2xl p-4 lg:w-64 flex lg:flex-col justify-between"
//       initial={{ x: -50, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//     >
//       <div className="w-full">
//         <div className="flex items-center justify-center lg:justify-start mb-8 p-2">
//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="text-white font-bold text-xl"
//           >
//             HomeGenie Admin
//           </motion.div>
//         </div>
        
//         <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
//           {menuItems.map((item) => (
//             <MenuItem 
//               key={item.id}
//               item={item} 
//               isActive={activeTab === item.id}
//               onClick={() => setActiveTab(item.id)}
//             />
//           ))}
//         </div>
//       </div>
      
//       <motion.button 
//         className="hidden lg:flex mt-8 w-full items-center justify-center p-3 rounded-xl text-white bg-slate-900 hover:bg-slate-700"
//         whileHover={{ scale: 1.03 }}
//         whileTap={{ scale: 0.97 }}
//       >
//         Logout
//       </motion.button>
//     </motion.div>
//   );
// };

// // Menu Item Component
// const MenuItem = ({ item, isActive, onClick }) => {
//   const Icon = item.icon;
  
//   return (
//     <motion.div
//       className={`relative flex items-center cursor-pointer rounded-xl transition-all p-3 ${
//         isActive ? 'text-white' : 'text-slate-400 hover:text-white'
//       }`}
//       onClick={onClick}
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//     >
//       {isActive && (
//         <motion.div
//           className="absolute inset-0 bg-slate-700 rounded-xl"
//           layoutId="activeTab"
//           initial={{ borderRadius: 12 }}
//           transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//         />
//       )}
//       <div className="flex items-center space-x-3 relative z-10">
//         <Icon size={20} />
//         <span className="hidden lg:block font-medium">{item.label}</span>
//       </div>
//     </motion.div>
//   );
// };

// // Tab Content Component
// const TabContent = ({ activeTab }) => {
//   return (
//     <div className="p-6 h-full">
//       {activeTab === 'dashboard' && <DashboardTab />}
//       {activeTab === 'addService' && <ServicesTab />}
//       {activeTab === 'customerCare' && <SupportTab />}
//       {activeTab === 'blockUsers' && <UsersTab />}
//       {activeTab === 'campaign' && <CampaignsTab />}
//       {activeTab === 'contactInfo' && <ContactTab />}
//     </div>
//   );
// };

// // Dashboard Tab
// const DashboardTab = () => {
//   const statsCards = [
//     { title: "Total Services", value: "8", color: "bg-blue-500" },
//     { title: "Active Users", value: "2,457", color: "bg-green-500" },
//     { title: "Pending Queries", value: "18", color: "bg-purple-500" },
//     { title: "Revenue", value: "$24,500", color: "bg-orange-500" }
//   ];
  
//   return (
//     <div>
//       <PageTitle title="Dashboard Overview" />
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {statsCards.map((card, index) => (
//           <StatCard key={index} card={card} index={index} />
//         ))}
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <motion.div 
//           className="bg-white rounded-xl shadow p-6 border border-slate-100"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <h3 className="text-lg font-bold mb-4">Recent Customer Queries</h3>
//           <RecentQueriesTable />
//         </motion.div>
        
//         <motion.div 
//           className="bg-white rounded-xl shadow p-6 border border-slate-100"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <h3 className="text-lg font-bold mb-4">Service Performance</h3>
//           <ServiceChart />
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// // Stat Card Component
// const StatCard = ({ card, index }) => {
//   return (
//     <motion.div 
//       className="bg-white rounded-xl border border-slate-100 shadow p-4 relative overflow-hidden"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.1 * index }}
//       whileHover={{ y: -5, transition: { duration: 0.2 } }}
//     >
//       <div className="flex justify-between items-center">
//         <div>
//           <p className="text-sm text-slate-500">{card.title}</p>
//           <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
//         </div>
//         <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-white`}>
//           <span className="text-2xl">+</span>
//         </div>
//       </div>
//       <div className={`absolute bottom-0 left-0 h-1 w-full ${card.color} opacity-60`}></div>
//     </motion.div>
//   );
// };

// // Services Tab
// const ServicesTab = () => {
//   const [showModal, setShowModal] = useState(false);
  
//   return (
//     <div>
//       <PageTitle title="Services Management" />
      
//       <div className="flex flex-wrap gap-3 mb-6">
//         <motion.button
//           className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowModal(true)}
//         >
//           <PlusCircleIcon size={18} />
//           <span>Add Category</span>
//         </motion.button>
        
//         <motion.button
//           className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowModal(true)}
//         >
//           <PlusCircleIcon size={18} />
//           <span>Add Service</span>
//         </motion.button>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ServiceCategoriesTable />
//         <ServicesList />
//       </div>
      
//       {showModal && <AddServiceModal onClose={() => setShowModal(false)} />}
//     </div>
//   );
// };

// // Support Tab
// const SupportTab = () => {
//   const queries = [
//     { id: 1, name: "Alice Cooper", subject: "Service Issue", status: "pending", message: "I had a problem with my recent booking." },
//     { id: 2, name: "David Brown", subject: "Payment Question", status: "responded", message: "My payment was processed twice." },
//     { id: 3, name: "Emma Wilson", subject: "Provider Complaint", status: "pending", message: "The service provider was late." }
//   ];
  
//   return (
//     <div>
//       <PageTitle title="Customer Support" />
      
//       <div className="flex items-center space-x-4 mb-6">
//         <motion.button className="px-3 py-1.5 bg-slate-800 text-white rounded-lg" whileHover={{ scale: 1.05 }}>All</motion.button>
//         <motion.button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg" whileHover={{ scale: 1.05 }}>Pending</motion.button>
//         <motion.button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg" whileHover={{ scale: 1.05 }}>Resolved</motion.button>
//       </div>
      
//       <div className="space-y-4">
//         {queries.map((query) => (
//           <QueryCard key={query.id} query={query} />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Query Card Component
// const QueryCard = ({ query }) => {
//   const [expanded, setExpanded] = useState(false);
  
//   return (
//     <motion.div 
//       className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -3 }}
//     >
//       <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
//         <div className="flex justify-between items-center">
//           <h3 className="font-medium">{query.subject}</h3>
//           <span className={`px-2 py-1 text-xs rounded-full ${
//             query.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
//           }`}>
//             {query.status}
//           </span>
//         </div>
//         <p className="text-sm text-slate-500 mt-1">From: {query.name}</p>
//       </div>
      
//       <motion.div 
//         className="bg-slate-50 p-4 border-t border-slate-100"
//         initial={false}
//         animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
//         style={{ overflow: 'hidden' }}
//       >
//         <p className="text-sm mb-3">{query.message}</p>
        
//         {query.status === 'pending' ? (
//           <div>
//             <textarea className="w-full p-2 text-sm border rounded-lg mb-2" placeholder="Type your response..."></textarea>
//             <motion.button 
//               className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Send Response
//             </motion.button>
//           </div>
//         ) : (
//           <div className="bg-white p-3 rounded-lg border border-slate-200">
//             <p className="text-xs font-medium">Your Response:</p>
//             <p className="text-sm">Thank you for reaching out. We're addressing your concern.</p>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// // Users Tab
// const UsersTab = () => {
//   const users = [
//     { id: 1, name: "John Doe", email: "john@example.com", type: "user", status: "active" },
//     { id: 2, name: "Jane Smith", email: "jane@example.com", type: "provider", status: "active" },
//     { id: 3, name: "Bob Johnson", email: "bob@example.com", type: "shop", status: "blocked" }
//   ];
  
//   return (
//     <div>
//       <PageTitle title="User Management" />
      
//       <div className="mb-6">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search users..."
//             className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
//           />
//           <SearchIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
//         </div>
//       </div>
      
//       <motion.div 
//         className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-slate-50">
//                 <th className="text-left p-4 text-sm font-medium text-slate-500">Name</th>
//                 <th className="text-left p-4 text-sm font-medium text-slate-500">Email</th>
//                 <th className="text-left p-4 text-sm font-medium text-slate-500">Type</th>
//                 <th className="text-left p-4 text-sm font-medium text-slate-500">Status</th>
//                 <th className="text-right p-4 text-sm font-medium text-slate-500">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <UserRow key={user.id} user={user} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // User Row Component
// const UserRow = ({ user }) => {
//   return (
//     <motion.tr 
//       className="border-b border-slate-100 hover:bg-slate-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
//     >
//       <td className="p-4">{user.name}</td>
//       <td className="p-4 text-slate-500">{user.email}</td>
//       <td className="p-4">
//         <span className="capitalize">{user.type}</span>
//       </td>
//       <td className="p-4">
//         <span className={`inline-block px-2 py-1 rounded-full text-xs ${
//           user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//         }`}>
//           {user.status}
//         </span>
//       </td>
//       <td className="p-4 text-right">
//         <motion.button
//           className={`px-3 py-1 rounded-lg text-white text-sm ${
//             user.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
//           }`}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           {user.status === 'active' ? 'Block' : 'Unblock'}
//         </motion.button>
//       </td>
//     </motion.tr>
//   );
// };

// // Campaigns Tab
// const CampaignsTab = () => {
//   const [showModal, setShowModal] = useState(false);
  
//   const campaigns = [
//     { id: 1, title: "Summer Discount", sentTo: "All Users", date: "2025-04-01" },
//     { id: 2, title: "Provider Onboarding", sentTo: "Service Providers", date: "2025-03-28" }
//   ];
  
//   return (
//     <div>
//       <PageTitle title="Campaign Management" />
      
//       <div className="mb-6">
//         <motion.button 
//           className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowModal(true)}
//         >
//           <BellIcon size={18} />
//           <span>Create Campaign</span>
//         </motion.button>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {campaigns.map((campaign, index) => (
//           <CampaignCard key={campaign.id} campaign={campaign} index={index} />
//         ))}
//       </div>
      
//       {showModal && <CreateCampaignModal onClose={() => setShowModal(false)} />}
//     </div>
//   );
// };

// // Campaign Card Component
// const CampaignCard = ({ campaign, index }) => {
//   return (
//     <motion.div 
//       className="bg-white rounded-xl shadow border border-slate-100 p-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.1 * index }}
//       whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//     >
//       <div className="flex justify-between items-start">
//         <h3 className="font-medium">{campaign.title}</h3>
//         <span className="text-xs text-slate-500">{campaign.date}</span>
//       </div>
//       <p className="text-sm text-slate-500 mt-1">Sent to: {campaign.sentTo}</p>
//       <div className="mt-3 flex justify-end">
//         <motion.button 
//           className="text-sm text-slate-600 hover:text-slate-900"
//           whileHover={{ scale: 1.05 }}
//         >
//           View Details
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// // Contact Tab
// const ContactTab = () => {
//   const stats = [
//     { title: "Total Queries", value: "32" },
//     { title: "Pending", value: "8" },
//     { title: "Resolved", value: "24" }
//   ];
  
//   return (
//     <div>
//       <PageTitle title="Contact Queries" />
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         {stats.map((stat, index) => (
//           <motion.div 
//             key={index}
//             className="bg-white rounded-xl shadow p-4 border border-slate-100"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 * index }}
//           >
//             <h3 className="text-sm text-slate-500">{stat.title}</h3>
//             <p className="text-2xl font-bold mt-1">{stat.value}</p>
//           </motion.div>
//         ))}
//       </div>
      
//       <ContactQueriesTable />
//     </div>
//   );
// };

// // Page Title Component
// const PageTitle = ({ title }) => {
//   return (
//     <motion.h2 
//       className="text-2xl font-bold mb-6"
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       {title}
//     </motion.h2>
//   );
// };

// // Recent Queries Table (Simplified)
// const RecentQueriesTable = () => {
//   return (
//     <div className="overflow-hidden rounded-lg border border-slate-100">
//       <table className="min-w-full divide-y divide-slate-100">
//         <thead className="bg-slate-50">
//           <tr>
//             <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Name</th>
//             <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Subject</th>
//             <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Status</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100">
//           <tr>
//             <td className="px-4 py-3 text-sm">Alice Cooper</td>
//             <td className="px-4 py-3 text-sm">Service Issue</td>
//             <td className="px-4 py-3">
//               <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">pending</span>
//             </td>
//           </tr>
//           <tr>
//             <td className="px-4 py-3 text-sm">David Brown</td>
//             <td className="px-4 py-3 text-sm">Payment Question</td>
//             <td className="px-4 py-3">
//               <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">responded</span>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Service Chart (Placeholder)
// const ServiceChart = () => {
//   return (
//     <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center">
//       <p className="text-slate-400">Service performance chart would render here</p>
//     </div>
//   );
// };

// // Service Categories Table (Simplified)
// const ServiceCategoriesTable = () => {
//   return (
//     <motion.div 
//       className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden"
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//     >
//       <h3 className="text-lg font-bold p-4 border-b border-slate-100">Categories</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-slate-100">
//           <thead className="bg-slate-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Name</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Description</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Services</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             <tr>
//               <td className="px-4 py-3 text-sm font-medium">Cleaning</td>
//               <td className="px-4 py-3 text-sm text-slate-500">Home cleaning services</td>
//               <td className="px-4 py-3 text-sm">2</td>
//             </tr>
//             <tr>
//               <td className="px-4 py-3 text-sm font-medium">Plumbing</td>
//               <td className="px-4 py-3 text-sm text-slate-500">Plumbing repair services</td>
//               <td className="px-4 py-3 text-sm">1</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// // Services List (Simplified)
// const ServicesList = () => {
//   return (
//     <motion.div 
//       className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden"
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//     >
//       <h3 className="text-lg font-bold p-4 border-b border-slate-100">Services</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-slate-100">
//           <thead className="bg-slate-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Name</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Category</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Price</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             <tr>
//               <td className="px-4 py-3 text-sm font-medium">Deep Cleaning</td>
//               <td className="px-4 py-3 text-sm text-slate-500">Cleaning</td>
//               <td className="px-4 py-3 text-sm">$80</td>
//             </tr>
//             <tr>
//               <td className="px-4 py-3 text-sm font-medium">Regular Cleaning</td>
//               <td className="px-4 py-3 text-sm text-slate-500">Cleaning</td>
//               <td className="px-4 py-3 text-sm">$50</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// // Contact Queries Table (Simplified)
// const ContactQueriesTable = () => {
//   return (
//     <motion.div 
//       className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-slate-100">
//           <thead className="bg-slate-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Name</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Email</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Subject</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Status</th>
//               <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             <tr>
//               <td className="px-4 py-3 text-sm">Alice Cooper</td>
//               <td className="px-4 py-3 text-sm text-slate-500">alice@example.com</td>
//               <td className="px-4 py-3 text-sm">Service Issue</td>
//               <td className="px-4 py-3">
//                 <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">pending</span>
//               </td>
//               <td className="px-4 py-3 text-right">
//                 <motion.button 
//                   className="text-slate-600 hover:text-slate-900 text-sm"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   View
//                 </motion.button>
//               </td>
//             </tr>
//             <tr>
//               <td className="px-4 py-3 text-sm">David Brown</td>
//               <td className="px-4 py-3 text-sm text-slate-500">david@example.com</td>
//               <td className="px-4 py-3 text-sm">Payment Question</td>
//               <td className="px-4 py-3">
//                 <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">responded</span>
//               </td>
//               <td className="px-4 py-3 text-right">
//                 <motion.button 
//                   className="text-slate-600 hover:text-slate-900 text-sm"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   View
//                 </motion.button>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// // Add Service Modal
// // Add Service Modal
// const AddServiceModal = ({ onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <motion.div 
//         className="bg-white rounded-xl p-6 w-full max-w-md"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//       >
//         <h3 className="text-xl font-bold mb-4">Add New Service</h3>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
//             <input 
//               type="text" 
//               className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
//               placeholder="Enter service name"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
//             <select className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
//               <option>Select category</option>
//               <option>Cleaning</option>
//               <option>Plumbing</option>
//               <option>Electrical</option>
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
//             <input 
//               type="number" 
//               className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
//               placeholder="Enter price"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
//             <textarea 
//               className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
//               placeholder="Enter description"
//               rows={3}
//             ></textarea>
//           </div>
//         </div>
        
//         <div className="mt-6 flex justify-end space-x-3">
//           <motion.button 
//             className="px-4 py-2 border border-slate-300 rounded-lg"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onClose}
//           >
//             Cancel
//           </motion.button>
//           <motion.button 
//             className="px-4 py-2 bg-slate-800 text-white rounded-lg"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Add Service
//           </motion.button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // Create Campaign Modal
// const CreateCampaignModal = ({ onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <motion.div 
//         className="bg-white rounded-xl p-6 w-full max-w-md"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//       >
//         <h3 className="text-xl font-bold mb-4">Create New Campaign</h3>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title</label>
//             <input 
//               type="text" 
//               className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
//               placeholder="Enter campaign title"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
//             <select className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500">
//               <option>All Users</option>
//               <option>Service Providers</option>
//               <option>Shop Owners</option>
//               <option>New Users</option>
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Message</label>
//             <textarea 
//               className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
//               placeholder="Enter campaign message"
//               rows={4}
//             ></textarea>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Date</label>
//             <input 
//               type="date" 
//               className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
//             />
//           </div>
//         </div>
        
//         <div className="mt-6 flex justify-end space-x-3">
//           <motion.button 
//             className="px-4 py-2 border border-slate-300 rounded-lg"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onClose}
//           >
//             Cancel
//           </motion.button>
//           <motion.button 
//             className="px-4 py-2 bg-slate-800 text-white rounded-lg"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Create Campaign
//           </motion.button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

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
import ServicesTab from './Services';
import SupportTab from './Support';
import UsersTab from './Users';
import CampaignsTab from './Campaigns';
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
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-100 p-4">
        <div className="flex items-center space-x-2 mb-8">
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
      <div className="flex-1 overflow-auto p-6">
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
  );
};

export default AdminDashboard;