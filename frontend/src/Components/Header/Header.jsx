import React, { useState, useEffect } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [user, setUser] = useState({ username: "", password: "" });

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") setActiveLink("Home");
    else setActiveLink(path.substring(1).charAt(0).toUpperCase() + path.substring(2));

    const storedUsername = sessionStorage.getItem("username");
    const storedPassword = sessionStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUser({ username: storedUsername, password: storedPassword });
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
  };

  const displayUserInfo = () => {
    if (user.username) {
      alert(`Logged in as: ${user.username}\nPassword: ${user.password}`);
    } else {
      alert("No user is currently logged in.");
    }
  };

  return (
    <header className="bg-slate-950 text-white w-full py-4 shadow-md border-b border-gray-700 fixed top-0">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-8">
        <div className="flex items-center">
          <button onClick={displayUserInfo} className="focus:outline-none">
            <img
              src="https://github.com/Meeth-W.png"
              alt="Profile Picture"
              className="h-12 w-12 mr-4 rounded-full cursor-pointer"
            />
          </button>
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
    </header>
  );
}

export default Header;
