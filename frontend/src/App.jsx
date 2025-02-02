import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Profile from './pages/profile';
import Assistant from './pages/assistant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assistant" element={<Assistant />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
