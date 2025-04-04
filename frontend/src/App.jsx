import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Home from './Pages/Home';
import Footer from "./Components/Footer";
import Navbar from './Components/Navbar';
import LoginPage from './Pages/Login';
import SignUpPage from './Pages/SignUp';
import ServiceProviderSignUp from './Pages/ServiceProviderSignUp';
import ShopOwnerSignUp from './Pages/ShopOwnerSignUp';
import ConfirmLogout from './Components/ConfirmLogout';
import About from './Pages/About';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Pages/Dashboard';
import ServiceProviderDashboard from './Pages/ServiceProviderDashboard';
import ShopsDashboard from './Pages/ShopsDashboard';

// Create an AuthContext for robust state management
const AuthContext = React.createContext({
  isLoggedIn: false,
  userRole: null,
  login: () => { },
  logout: () => { }
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (token, role, rememberMe = false) => {
    if (rememberMe) {
      // Store in localStorage for persistent login
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    } else {
      // Store in sessionStorage for session-only login
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
    }

    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    // Clear both storage types to ensure complete logout
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("role");
    sessionStorage.removeItem("role");
    localStorage.removeItem("rememberMe");

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
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />

          {/* Auth routes - redirect to home if already logged in */}
          <Route
            path="/Login"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/SignUp"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUpPage />}
          />
          <Route
            path="/ServiceProvider-SignUp"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <ServiceProviderSignUp />}
          />
          <Route
            path="/ShopOwner-SignUp"
            element={isLoggedIn ? <Navigate to="/" replace /> : <ShopOwnerSignUp />}
          />

          {/* Protected routes - only accessible when logged in */}
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
          <Route
            path="/service-provider-dashboard"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["service-provider", "admin"]}
                userRole={userRole}
              >
                <ServiceProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shops-dashboard"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["shop-owner", "admin"]}
                userRole={userRole}
              >
                <ShopsDashboard />
              </ProtectedRoute>
            }
          />

          {/* Logout Route - only accessible when logged in */}
          <Route
            path="/logout"
            element={
                <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["user", "admin"]}
                userRole={userRole}
                 >
                 <ConfirmLogout />
                 </ProtectedRoute>
              
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
export { AuthContext };