import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Footer from "./Components/Footer";
import Navbar from './Components/Navbar'; 



const App = () => {
  return (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            
          </Routes>
          <Footer />
        </Router>
  );
};

export default App;