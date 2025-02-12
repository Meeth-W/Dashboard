import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Profile from './pages/profile';
import Assistant from './pages/assistant';
import Notes from './pages/notes';
import Login from './pages/login';
import Scraper from './pages/scraper';
import FileUpload from './pages/files';

function App() {
  const [user, setUser] = useState({
    username: sessionStorage.getItem('username') || null,
    password: sessionStorage.getItem('password') || null,
  });

  const handleLogin = (username, password) => {
    setUser({ username, password });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="notes" element={<Notes />} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="scraper" element={<Scraper />} />
          <Route path="files" element={<FileUpload user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
