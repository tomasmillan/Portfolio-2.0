import React, { useState } from "react";
import { Link } from "react-router-dom";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close the menu when a link is clicked
  const closeMenu = () => {
    setIsOpen(false);
  };
  return (
    <nav className="bg-gray-600 shadow-md p-4 relative z-40"> {/* Increased z-index for the main nav */}
      <div className="container mx-auto flex items-center justify-between"> {/* Changed justify-around to justify-between for better logo/toggler spacing */}
        <Link to="/" className="text-white font-semibold text-4xl" onClick={closeMenu}>
          TML Portfolio
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link to="/services" className="text-gray-300 hover:text-white text-2xl">
            Servicios
          </Link>
          <Link to="/portfolio" className="text-gray-300 text-2xl hover:text-white">
            Portfolio
          </Link>
          <Link to="/about" className="text-gray-300 text-2xl hover:text-white">
            Sobre mi
          </Link>
          <Link to="/testimonies" className="text-gray-300 text-2xl hover:text-white">
            Testimonios
          </Link>
          <Link to="/contact" className="text-gray-300 text-2xl hover:text-white">
            Contacto
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none" // Added focus:outline-none for accessibility
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} // Accessibility
          >
            <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24"> {/* Increased size for better tap target */}
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center 
                    transition-opacity duration-300 ease-in-out md:hidden
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        {/* Close button inside the overlay */}
        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 text-white hover:text-gray-300 focus:outline-none"
          aria-label="Cerrar menú"
        >
          <svg className="h-10 w-10 fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.829-4.828 4.829a1 1 0 0 1-1.414-1.414l4.829-4.828-4.828-4.829a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.829z"
            />
          </svg>
        </button>

        {/* Menu Links within the overlay */}
        <div className="flex flex-col space-y-6 text-center">
          <Link
            to="/"
            className="text-gray-200 text-3xl font-bold hover:text-white transition-colors duration-200"
            onClick={closeMenu}
          >
            Inicio
          </Link>
          <Link
            to="/services"
            className="text-gray-200 text-3xl font-bold hover:text-white transition-colors duration-200"
            onClick={closeMenu}
          >
            Servicios
          </Link>
          <Link
            to="/portfolio"
            className="text-gray-200 text-3xl font-bold hover:text-white transition-colors duration-200"
            onClick={closeMenu}
          >
            Portfolio
          </Link>
          <Link
            to="/about"
            className="text-gray-200 text-3xl font-bold hover:text-white transition-colors duration-200"
            onClick={closeMenu}
          >
            Sobre Mi
          </Link>
          <Link
            to="/testimonies"
            className="text-gray-200 text-3xl font-bold hover:text-white transition-colors duration-200"
            onClick={closeMenu}
          >
            Testimonios
          </Link>
          <Link
            to="/contact"
            className="text-gray-200 text-3xl font-bold hover:text-white transition-colors duration-200"
            onClick={closeMenu}
          >
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;