import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth <= 550);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth <= 550);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-emerald-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-wide">GraminVikas</span>
          <span className="text-xs bg-amber-600 px-2 py-1 rounded-full">Portal</span>
        </div>

        {/* Desktop Navigation */}
        {!isOpen && (
          <nav className="flex space-x-6 font-medium">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/service">Services</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        )}

        {/* Mobile Navigation */}
        {isOpen && <HamburgerMenu />}
      </div>
    </header>
  );
};

export default Header;