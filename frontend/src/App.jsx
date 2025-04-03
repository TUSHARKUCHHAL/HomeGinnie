import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Footer from "./Components/Footer";
import Navbar from './Components/Navbar';
import About from './Pages/About'; 



const App = () => {
  return (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
          </Routes>
          <Footer />
        </Router>
  );
};

export default App;