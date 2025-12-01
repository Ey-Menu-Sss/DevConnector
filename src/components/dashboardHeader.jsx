import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const dashboardHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [myProfilePath, setMyProfilePath] = useState("/my-profile");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".menu-toggle")
      ) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // keep static route to personal profile management page
    setMyProfilePath("/my-profile");
  }, []);

  return (
    <div>
      <header id="header">
        <Link to="/" className="logo">
          <i className="bx bx-code-alt"></i>
          <h1>DevConnector</h1>
        </Link>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className={isMenuOpen ? "bx bx-x" : "bx bx-menu"}></i>
        </button>
        <div ref={menuRef} className={`pages ${isMenuOpen ? "menu-open" : ""}`}>
          <Link to="/dashboard" className="links" onClick={closeMenu}>
            <i className="bx bx-message-rounded-dots"></i>
            Chat
          </Link>
          <Link to="/profiles" className="links" onClick={closeMenu}>
            <i class="bx bx-code-alt"></i>
            Developers
          </Link>
          <Link to="/posts" className="links" onClick={closeMenu}>
            <i class="bx bx-news"></i>
            Posts
          </Link>
          <Link to="/chatbot" className="links" onClick={closeMenu}>
            <i className="bx bx-bot"></i>
            AI ChatBot
          </Link>
          <Link to="/my-profile" className="links" onClick={closeMenu}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "2px solid currentColor",
                display: "inline-block",
              }}
            />
            <span>Profile</span>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default dashboardHeader;
