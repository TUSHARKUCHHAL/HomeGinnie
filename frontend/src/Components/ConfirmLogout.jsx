import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Adjust the path if needed

const ConfirmLogout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const confirmLogoutHandler = () => {
    logout();
    navigate('/');
  };

  const cancelLogoutHandler = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Logout</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button 
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={confirmLogoutHandler}
          >
            Yes, Log Out
          </button>
          <button 
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            onClick={cancelLogoutHandler}
          >
            No, Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogout;