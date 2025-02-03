import React, { useState, useEffect } from 'react';
import QuickActions from '../Components/quickActions';
import FeaturesSection from '../Components/featuresSection';

const Home = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <div className="w-full h-96 bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="mt-4 text-lg text-gray-300">
            A Personalised Cloud, AI Assistant & Other tools.<br />
            Created by: <a className="mt-4 inline-block text-blue-400 hover:underline" href="https://github.com/Meeth-W">Ghostyy</a>
          </p>
          <div className="mt-6">
            {username ? (
              <p className="text-lg font-medium text-green-400">Welcome, {username}!</p>
            ) : (
              <a href="/login" className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-500 transition">
                Log In
              </a>
            )}
          </div>
        </div>
      </div>

      <QuickActions />
      <FeaturesSection />
    </div>
  );
};

export default Home;
