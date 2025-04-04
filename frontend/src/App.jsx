import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Footer from "./Components/Footer";
import Navbar from './Components/Navbar'; 
import LoginPage from './Pages/Login';
import SignUpPage from './Pages/SignUp';
import About from './Pages/About'; 
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Pages/Dashboard';
import './App.css';
import ServiceProviderSignUp from './Pages/ServiceProviderSignUp';

// Create an AuthContext for robust state management
const AuthContext = React.createContext({
  isLoggedIn: false,
  userRole: null,
  login: () => {},
  logout: () => {}
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // Authentication context value
  const authContextValue = {
    isLoggedIn,
    userRole,
    login: handleLogin,
    logout: handleLogout
  };


  return (
    <AuthContext.Provider value={authContextValue}>
        <Router>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} userRole={userRole} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/SignUp" element={<SignUpPage />} />
            <Route path="/ServiceProvider-SignUp" element={<ServiceProviderSignUp />} />
            <Route path="/About" element={<About />} />

            <Route
            path="/dashboard"
            element={
              <ProtectedRoute 
                isLoggedIn={isLoggedIn} 
                allowedRoles={["user", "admin"]} 
                userRole={userRole}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          </Routes>
          <Footer />
        </Router>
      </AuthContext.Provider>

  );
};

export default App;
export { AuthContext };