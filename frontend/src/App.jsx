import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importing components and pages
import Home from './Pages/Home';
import About from './Pages/About';
import ContactUs from './Components/Contact';
import Footer from "./Components/Footer";
import Navbar from './Components/Navbar';
import Services from './Pages/Services';

// Simple User Routes
import LoginPage from './Pages/User/Login';
import SignUpPage from './Pages/User/SignUp';
import ForgotPassword from "./Pages/User/ResetPassword/ForgetPassword";
import ResetPassword from "./Pages/User/ResetPassword/ResetPassword";
import Profile from "./Pages/User/Profile"; 

// Book a Pro Routes
import BookAPro from './Pages/BookAPro/BookAPro';
import HireRequestForm from "./Pages/BookAPro/HireRequestForm";
import RequestResponse from "./Pages/BookAPro/RequestResponse";

// Find a job Routes
import FindJob from './Pages/Dashboard/FindJob/FindJob';

//Sell Product Routes
import SellProduct from './Pages/Dashboard/SellProducts/SellProducts';


// Service Provider Routes
import ServiceProviderSignUp from './Pages/ServiceProvider/ServiceProviderSignUp';
import ServiceProviderLogin from './Pages/ServiceProvider/ServiceProviderLogin';
import ServiceProviderForgetPassword from "./Pages/ServiceProvider/ResetPassword/ForgetPassword";
import ServiceProviderResetPassword from "./Pages/ServiceProvider/ResetPassword/ResetPassword";
import ServiceProviderProfile from "./Pages/ServiceProvider/Profile";

// Shop Owner Routes
import ShopOwnerSignUp from './Pages/Shop/ShopOwnerSignUp'
import ShopOwnerLogin from "./Pages/Shop/ShopOwnerLogin";
import ShopOwnerForgetPassword from "./Pages/Shop/ResetPassword/ForgetPassword";
import ShopOwnerResetPassword from "./Pages/Shop/ResetPassword/ResetPassword";
import ShopProfile from "./Pages/Shop/Profile";


//Admin Routes
import AdminDashboard from './Pages/Dashboard/AdminDashboard/AdminDashboard';
import AdminLogin from './Pages/Admin/Login';



import ConfirmLogout from './Components/ConfirmLogout';
import ProtectedRoute from './Components/ProtectedRoute';


import './App.css';
import BuySmart from "./Pages/Buy smart/BuySmart";


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
          <Route path="/About-Us" element={<About />} />
          <Route path="/Contact-Us" element={<ContactUs />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword/:token" element={<ResetPassword />} />
          <Route path="/ServiceProvider-Forgot-Password" element={<ServiceProviderForgetPassword />} />
          <Route path="/ServiceProvider-ResetPassword/:token" element={<ServiceProviderResetPassword />} />
          <Route path="/ShopOwner-Forgot-Password" element={<ShopOwnerForgetPassword />} />
          <Route path="/ShopOwner-ResetPassword/:token" element={<ShopOwnerResetPassword />} />
          <Route path="/Admin-Login" element={<AdminLogin />} />

          {/* Auth routes - redirect to home if already logged in */}
          <Route
            path="/Login"
            element={isLoggedIn ? <Navigate to="/book-a-pro" replace /> : <LoginPage />}
          />
          <Route
            path="/ServiceProvider-Login"
            element={isLoggedIn ? <Navigate to="/book-a-pro" replace /> : <ServiceProviderLogin />}
          />
          <Route
            path="/SignUp"
            element={isLoggedIn ? <Navigate to="/book-a-pro" replace /> : <SignUpPage />}
          />
          <Route
            path="/ServiceProvider-SignUp"
            element={isLoggedIn ? <Navigate to="/book-a-pro" replace /> : <ServiceProviderSignUp />}
          />
          <Route
            path="/ShopOwner-SignUp"
            element={isLoggedIn ? <Navigate to="/book-a-pro" replace /> : <ShopOwnerSignUp />}
          />
          <Route
            path="/ShopOwner-Login"
            element={isLoggedIn ? <Navigate to="/book-a-pro" replace /> : <ShopOwnerLogin />}
          />

          {/* Protected routes - only accessible when logged in */}
          <Route
            path="/book-a-pro"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["user", "admin"]}
                userRole={userRole}
              >
                <BookAPro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Buy-Smart"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["user", "admin", "shop-owner", "service-provider"]}  
                userRole={userRole}
              >
                <BuySmart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Hire-Request-Form"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["user", "admin"]}
                userRole={userRole}
              >
                <HireRequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Request-Response"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["user", "admin"]}
                userRole={userRole}
              >
                <RequestResponse />
              </ProtectedRoute>
            }
          />



          <Route
            path="/Find-a-Job"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["service-provider", "admin"]}
                userRole={userRole}
              >
                <FindJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sell-Products"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["shop-owner", "admin"]}
                userRole={userRole}
              >
                <SellProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin-Dashboard"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["admin"]}
                userRole={userRole}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Shop/Profile"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["shop-owner", "admin"]}
                userRole={userRole}
              >
                <ShopProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["user", "admin"]}
                userRole={userRole}
              >
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ServiceProvider/Profile"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["service-provider", "admin"]}
                userRole={userRole}
              >
                <ServiceProviderProfile />
              </ProtectedRoute>
            }
          />

          {/* Logout Route - only accessible when logged in */}
          <Route
            path="/logout"
            element={
                <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["user","shop-owner","service-provider", "admin"]}
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