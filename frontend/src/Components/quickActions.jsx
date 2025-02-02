import React from 'react';
import { useState } from 'react';
import { ArrowUpTrayIcon, CpuChipIcon, FolderIcon } from '@heroicons/react/24/solid';

function QuickActions() {
  const [storageUsed, setStorageUsed] = useState(34); // Example storage usage percentage

  return (
    <div className="max-w-screen-lg mx-auto mt-10 p-6 bg-slate-800 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Files */}
        <div className="flex flex-col items-center bg-slate-700 p-4 rounded-lg shadow-md hover:bg-slate-600 transition duration-300 cursor-pointer">
          <ArrowUpTrayIcon className="w-12 h-12 text-blue-400" />
          <p className="mt-2 text-lg">Upload Files</p>
        </div>

        {/* Storage Status */}
        <div className="flex flex-col items-center bg-slate-700 p-4 rounded-lg shadow-md hover:bg-slate-600 transition duration-300">
          <FolderIcon className="w-12 h-12 text-green-400" />
          <p className="mt-2 text-lg">Storage Used</p>
          <p className="text-sm text-gray-300">{storageUsed}% of total capacity</p>
          <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
            <div className="bg-green-400 h-2 rounded-full" style={{ width: `${storageUsed}%` }}></div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="flex flex-col items-center bg-slate-700 p-4 rounded-lg shadow-md hover:bg-slate-600 transition duration-300 cursor-pointer">
          <CpuChipIcon className="w-12 h-12 text-purple-400" />
          <p className="mt-2 text-lg">AI Assistant</p>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
