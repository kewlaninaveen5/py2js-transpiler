import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import Docs from './Docs';

function App() {

  return (    
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/docs" element={<Docs />} />

    </Routes>
  </Router>);

}

export default App;
