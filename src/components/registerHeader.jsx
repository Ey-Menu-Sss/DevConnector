import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const registerHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('.menu-toggle')) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div>
      <header id="header">
        <Link to="/" className="logo">
          <i className="bx bx-code-alt"></i>
          <h1>DevConnector</h1>
        </Link>
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <i className={isMenuOpen ? "bx bx-x" : "bx bx-menu"}></i>
        </button>
        <div ref={menuRef} className={`pages ${isMenuOpen ? 'menu-open' : ''}`}>
          <Link to="/profiles" className="links" onClick={closeMenu}>
            Developers
          </Link>
          <Link to="/chatbot" className="links" onClick={closeMenu}>
            AI ChatBot
          </Link>
          <Link to="/register" className="links" onClick={closeMenu}>
            Register
          </Link>
          <Link to="/login" className="links" onClick={closeMenu}>
            Login
          </Link>
        </div>
      </header>
    </div>
  );
};

export default registerHeader;
