import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-600 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-around">
        <Link to="/" className="text-white font-semibold text-4xl">
        TML Portfolio
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link to="/services" className="text-gray-300 hover:text-white text-2xl">
            Servicios
          </Link>
          <Link to="/portfolio" className="text-gray-300 text-2xl hover:text-white">
            Portfolio
          </Link>
          <Link to="/about" className="text-gray-300  text-2xl hover:text-white">
            Sobre mi
          </Link>
          <Link to="/testimonies" className="text-gray-300 text-2xl hover:text-white">
            Testimonios
          </Link>
          <Link to="/contact" className="text-gray-300  text-2xl hover:text-white">
            Contacto
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.829-4.828 4.829a1 1 0 0 1-1.414-1.414l4.829-4.828-4.828-4.829a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.829z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2">
          <Link
            to="/"
            className="block py-2 px-4 text-gray-300 hover:text-white"
          >
            Inicio
          </Link>
          <Link
            to="/blog"
            className="block py-2 px-4 text-gray-300 hover:text-white"
          >
            Blog
          </Link>
          <Link
            to="/podcast"
            className="block py-2 px-4 text-gray-300 hover:text-white"
          >
            Podcast
          </Link>
          <Link
            to="/portfolio"
            className="block py-2 px-4 text-gray-300 hover:text-white"
          >
            Portfolio
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
