import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold text-white">Malware Detector</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link to="/upload" className="hover:text-gray-400">Upload File</Link></li>
            <li><Link to="/About" className="hover:text-gray-400">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
