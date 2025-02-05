import React, { useState, useEffect } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [user, setUser] = useState({ username: "", password: "" });
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") setActiveLink("Home");
    else setActiveLink(path.substring(1).charAt(0).toUpperCase() + path.substring(2));

    const storedUsername = sessionStorage.getItem("username");
    const storedPassword = sessionStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUser({ username: storedUsername, password: storedPassword });
      fetch(`http://127.0.0.1:8000/api/v1/get_account?username=${storedUsername}&password=${storedPassword}`)
        .then(res => res.json())
        .then(data => {
          if (data.status) {
            setUserData(data.data);
          }
        });
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
    setUser({ username: "", password: "" });
    setUserData(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-slate-950 text-white w-full py-4 shadow-md border-b border-gray-700 fixed top-0">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-8">
        <div className="flex items-center">
          <button onClick={() => setShowPopup(true)} className="focus:outline-none">
            <img
              src="https://github.com/Meeth-W.png"
              alt="Profile Picture"
              className="h-12 w-12 mr-4 rounded-full cursor-pointer"
            />
          </button>
          {user.username && <span className="text-lg font-medium">{user.username}</span>}
        </div>
        <nav className="hidden md:flex space-x-8">
          {["Home", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={`text-lg font-medium transition-colors duration-300 ${
                activeLink === item ? "text-blue-400" : "text-gray-400 hover:text-blue-400"
              }`}
              onClick={() => handleLinkClick(item)}
            >
              {item}
            </a>
          ))}
        </nav>
        {user.username ? (
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 font-medium">Logout</button>
        ) : (
          <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Login</a>
        )}
        <button onClick={toggleMenu} className="md:hidden text-gray-400 focus:outline-none">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-slate-800 py-4 px-8 space-y-4">
          {["Home", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="block text-gray-400 hover:text-blue-400"
              onClick={() => handleLinkClick(item)}
            >
              {item}
            </a>
          ))}
        </nav>
      )}
      {showPopup && userData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-96 text-white">
            <h2 className="text-xl font-bold mb-2">User Details</h2>
            <p><span className="font-semibold">Name:</span> {userData.name}</p>
            <p><span className="font-semibold">Context:</span> {userData.context}</p>
            <button 
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;