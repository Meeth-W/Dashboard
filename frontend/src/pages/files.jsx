import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/files/");
      setFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewFileName(file.name.split(".").slice(0, -1).join("."));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !newFileName.trim()) return;
    const extension = selectedFile.name.split(".").pop();
    const finalFileName = `${newFileName}.${extension}`;
    const formData = new FormData();
    formData.append("file", selectedFile, finalFileName);

    try {
      await axios.post("http://127.0.0.1:8000/api/v1/files/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchFiles();
      setSelectedFile(null);
      setNewFileName("");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handlePreview = (file) => {
    const url = `http://127.0.0.1:8000/api/v1/files/download/${file}`;
    if (file.endsWith(".pdf")) {
      window.open(url, "_blank");
    } else if (file.endsWith(".mp3") || file.endsWith(".mp4")) {
      setPreviewFile(url);
    } else {
      window.open(url, "_blank");
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/files/delete/${filename}`);
      fetchFiles();
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {sidebarOpen && (
        <motion.div 
          initial={{ x: -300 }} 
          animate={{ x: 0 }} 
          transition={{ duration: 0.5 }} 
          className="w-64 bg-gray-800 p-4 shadow-lg overflow-auto"
        >
          <h2 className="text-xl font-bold mb-4">Your Files</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                <span onClick={() => handlePreview(file)} className="cursor-pointer hover:underline">{file}</span>
                <button onClick={() => setConfirmDelete(file)} className="text-red-400 hover:text-red-300">✖</button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      <div className="flex-1 flex flex-col items-center p-6">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-4 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500">
          {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </button>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <label className="block w-full bg-gray-700 p-2 rounded-md text-center cursor-pointer hover:bg-gray-600">
            Choose File
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
          {selectedFile && (
            <input 
              type="text" 
              value={newFileName} 
              onChange={(e) => setNewFileName(e.target.value)} 
              className="w-full p-2 bg-gray-700 text-white rounded-md mt-2"
            />
          )}
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg mt-4"
          >
            Upload File
          </button>
        </div>
        {previewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="relative w-full h-full flex justify-center items-center">
              <button onClick={() => setPreviewFile(null)} className="absolute top-5 right-5 bg-red-500 px-4 py-2 rounded-full text-white">✖</button>
              {previewFile.endsWith(".mp3") ? (
                <audio controls className="w-1/2">
                  <source src={previewFile} type="audio/mp3" />
                </audio>
              ) : previewFile.endsWith(".mp4") ? (
                <video controls className="w-5/6 h-5/6">
                  <source src={previewFile} type="video/mp4" />
                </video>
              ) : null}
            </div>
          </div>
        )}
        {confirmDelete && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <p>Are you sure you want to delete {confirmDelete}?</p>
              <div className="mt-4">
                <button onClick={() => handleDelete(confirmDelete)} className="bg-red-500 px-4 py-2 rounded-lg text-white mr-2">Delete</button>
                <button onClick={() => setConfirmDelete(null)} className="bg-gray-500 px-4 py-2 rounded-lg text-white">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;