import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, StarIcon, Trash2Icon, MailIcon, UserIcon, PhoneIcon, MessageSquareIcon } from 'lucide-react';

const ContactTab = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Thomas Wilson',
      email: 'thomas@example.com',
      subject: 'Partnership Opportunity',
      message: 'I would like to discuss a potential partnership opportunity with your company...',
      date: '2023-05-20',
      time: '09:45 AM',
      isStarred: true,
      isRead: true
    },
    {
      id: 2,
      sender: 'Amanda Rodriguez',
      email: 'amanda@example.com',
      subject: 'Question about services',
      message: 'Hello, I was looking at your service packages and I have a few questions regarding...',
      date: '2023-05-19',
      time: '02:30 PM',
      isStarred: false,
      isRead: false
    },
    {
      id: 3,
      sender: 'Kevin Chen',
      email: 'kevin@example.com',
      subject: 'Invoice #12345',
      message: 'Please find attached the invoice for the services provided last month...',
      date: '2023-05-18',
      time: '11:20 AM',
      isStarred: false,
      isRead: true
    },
    {
      id: 4,
      sender: 'Sarah Johnson',
      email: 'sarah@example.com',
      subject: 'Feedback on recent project',
      message: 'I wanted to share some feedback regarding our recent project collaboration...',
      date: '2023-05-17',
      time: '04:15 PM',
      isStarred: true,
      isRead: true
    },
    {
      id: 5,
      sender: 'Mark Davis',
      email: 'mark@example.com',
      subject: 'Request for information',
      message: 'I am interested in learning more about your company and the services you offer...',
      date: '2023-05-16',
      time: '10:00 AM',
      isStarred: false,
      isRead: false
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const categories = [
    { id: 'all', label: 'All Messages', icon: <MailIcon size={16} /> },
    { id: 'unread', label: 'Unread', icon: <MessageSquareIcon size={16} /> },
    { id: 'starred', label: 'Starred', icon: <StarIcon size={16} /> }
  ];

  const toggleStar = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  const filteredMessages = messages.filter(msg => {
    if (activeCategory === 'unread') return !msg.isRead;
    if (activeCategory === 'starred') return msg.isStarred;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow flex flex-col md:flex-row" style={{ height: '70vh' }}>
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r border-slate-200 py-6">
        <div className="px-4 mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
            <Send size={16} />
            <span>Compose</span>
          </button>
        </div>
        
        <nav>
          {categories.map(category => (
            <button
              key={category.id}
              className={`flex items-center space-x-3 px-4 py-3 w-full text-left transition-colors ${
                activeCategory === category.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              <span>{category.label}</span>
              {category.id === 'unread' && (
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full ml-auto">
                  {messages.filter(msg => !msg.isRead).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Message List */}
      <div className={`flex-1 ${selectedMessage ? 'hidden md:block' : ''} border-r border-slate-200 overflow-y-auto`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-medium">
            {activeCategory === 'all' ? 'All Messages' : activeCategory === 'unread' ? 'Unread' : 'Starred'}
          </h3>
          <span className="text-slate-500 text-sm">{filteredMessages.length} messages</span>
        </div>
        
        <motion.div
          className="divide-y divide-slate-100"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredMessages.map(message => (
            <motion.div
              key={message.id}
              className={`p-4 cursor-pointer transition-colors ${
                !message.isRead ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
              onClick={() => {
                setSelectedMessage(message);
                markAsRead(message.id);
              }}
              variants={item}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                  {message.sender.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium truncate ${!message.isRead ? 'text-blue-600' : ''}`}>
                      {message.sender}
                    </p>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <span className="text-xs">{message.date}</span>
                      <button 
                        className={`p-1 rounded-full ${message.isStarred ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(message.id);
                        }}
                      >
                        <StarIcon size={16} fill={message.isStarred ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium text-sm truncate">{message.subject}</p>
                  <p className="text-slate-500 text-sm truncate">{message.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Message Content */}
      {selectedMessage ? (
        <div className={`flex-1 p-6 ${selectedMessage ? 'block' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{selectedMessage.subject}</h3>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-slate-100">
                <Trash2Icon size={18} className="text-slate-500" />
              </button>
              <button 
                className={`p-2 rounded-full ${selectedMessage.isStarred ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={() => toggleStar(selectedMessage.id)}
              >
                <StarIcon size={18} fill={selectedMessage.isStarred ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 mr-4">
              {selectedMessage.sender.charAt(0)}
            </div>
            <div>
              <div className="flex items-center">
                <h4 className="font-semibold">{selectedMessage.sender}</h4>
                <span className="text-slate-400 text-sm ml-2">&lt;{selectedMessage.email}&gt;</span>
              </div>
              <p className="text-slate-500 text-sm">
                {selectedMessage.date} at {selectedMessage.time}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <p className="text-slate-600 mb-4">{selectedMessage.message}</p>
            <p className="text-slate-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec ultricies nisl nisl nec nisl. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec ultricies nisl nisl nec nisl.</p>
            <p className="text-slate-600 mt-4">Best regards,<br />{selectedMessage.sender}</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-slate-500">Reply to {selectedMessage.sender}</span>
            </div>
            <textarea 
              className="w-full border border-slate-200 rounded-lg p-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your reply here..."
            ></textarea>
            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                <Send size={16} />
                <span>Send Reply</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="bg-slate-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailIcon size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">Select a message</h3>
            <p className="text-slate-500">Choose a message from the list to view its contents</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactTab;