import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

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
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      await axios.post("http://127.0.0.1:8000/api/v1/files/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchFiles();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/files/download/${filename}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/files/delete/${filename}`);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  if (!username || !password) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-white text-2xl font-bold">You are not logged in!</h2>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">File Upload</h1>
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <input type="file" onChange={handleFileChange} className="block w-full mb-4" />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg"
        >
          Upload File
        </button>
      </div>
      <div className="mt-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-3">Uploaded Files</h2>
        <ul className="bg-slate-800 p-4 rounded-lg shadow-lg">
          {files.length === 0 ? (
            <p className="text-gray-400">No files uploaded yet.</p>
          ) : (
            files.map((file, index) => (
              <li key={index} className="flex justify-between items-center p-2 border-b border-gray-700">
                <span>{file}</span>
                <div>
                  <button
                    onClick={() => handleDownload(file)}
                    className="text-green-400 hover:text-green-300 mx-2"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
