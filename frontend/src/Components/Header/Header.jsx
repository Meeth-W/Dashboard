import React, { useState, useEffect } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") setActiveLink("Home");
    else setActiveLink(path.substring(1).charAt(0).toUpperCase() + path.substring(2));
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsOpen(false);
  };

  return (
    <header className="bg-slate-950 text-white w-full py-4 shadow-md border-b border-gray-700 fixed top-0">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-8">
        <div className="flex items-center">
          <a href="/" onClick={() => handleLinkClick("Home")}>
            <img
              src="https://github.com/Meeth-W.png"
              alt="Profile Picture"
              className="h-12 w-12 mr-4 rounded-full"
            />
          </a>
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
