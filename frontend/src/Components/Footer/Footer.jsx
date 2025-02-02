import React from 'react';
import { FaLinkedin, FaInstagram, FaDiscord, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400 w-full py-8">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">
        <div className="flex items-center mb-4 md:mb-0">
          <img src="https://github.com/Meeth-W.png" alt="Profile Picture" className="h-12 w-12 mr-4 rounded-full" />
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="flex space-x-4">
          <a href="mailto:info@website.com" className='w-10 opacity-80 hover:opacity-100'>
            <FaEnvelope className="h-6 w-6 text-gray-400" />
          </a>
          <a href="https://linkedin.com" className='w-10 opacity-80 hover:opacity-100'>
            <FaLinkedin className="h-6 w-6 text-gray-400" />
          </a>
          <a href="https://instagram.com" className='w-10 opacity-80 hover:opacity-100'>
            <FaInstagram className="h-6 w-6 text-gray-400" />
          </a>
          <a href="https://discord.com" className='w-10 opacity-80 hover:opacity-100'>
            <FaDiscord className="h-6 w-6 text-gray-400" />
          </a>
        </div>
      </div>
      <div className="mt-8 text-center px-8">
        <hr className="border-gray-700 mb-4" />
        <p>© 2025 Meeth's Dashboard</p>
      </div>
    </footer>
  );
}

export default Footer;