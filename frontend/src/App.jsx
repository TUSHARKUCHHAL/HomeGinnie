import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Footer from "./Components/Footer";
import Navbar from './Components/Navbar'; 
import LoginPage from './Pages/Login';



const App = () => {
  return (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<LoginPage />} />
          </Routes>
          <Footer />
        </Router>
  );
};

export default App;