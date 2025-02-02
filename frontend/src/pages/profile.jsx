import React from 'react';

const Profile = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <div className="w-full h-96 bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Hey! I'm Meeth!</h1>
          <p className="mt-4 text-lg text-gray-300">
            Coming soon TM
          </p>
          <div className="mt-6">
            <a href="/contact" className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-500 transition">
              Log In
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;