import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Desktop Link Styles (Light text for dark background)
  const getLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md ${
      isActive
        ? "bg-emerald-800 text-white shadow-sm"
        : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
    }`;

  // Mobile Link Styles
  const getMobileLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? "bg-emerald-800 text-white border-l-4 border-emerald-400"
        : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
    }`;

  return (
    // CHANGED: bg-white -> bg-emerald-900 (Dark Forest Green)
    <header className="bg-emerald-900 shadow-md sticky top-0 z-50 w-full border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            {/* Logo Icon Background changed to match theme */}
            <span className="text-2xl bg-emerald-800 p-1.5 rounded-lg shadow-inner">🌿</span>
            <span className="text-xl font-bold text-white tracking-wide">
              Gramin<span className="text-emerald-400">Seva</span>
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex space-x-4 items-center">
            <NavLink to="/home" end className={getLinkClass}>Home</NavLink>
            <NavLink to="/services" className={getLinkClass}>Services</NavLink>
            <NavLink to="/doctor" className={getLinkClass}>Doctor</NavLink>
            <NavLink to="/education" className={getLinkClass}>Education</NavLink>
            <NavLink to="/complaint" className={getLinkClass}>Complaint</NavLink>
            <NavLink to="/cyber" className={getLinkClass}>Cyber</NavLink>
            <NavLink to="/traveller" className={getLinkClass}>Traveller</NavLink>
          </nav>

          {/* MOBILE TOGGLE (HAMBURGER) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              // Button text color changed to white
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-400"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        {/* Mobile menu background matches header */}
        <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 bg-emerald-900 shadow-xl border-t border-emerald-800">
          <NavLink onClick={() => setIsOpen(false)} to="/home" end className={getMobileLinkClass}>Home</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/services" className={getMobileLinkClass}>Services</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/doctor" className={getMobileLinkClass}>Doctor</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/education" className={getMobileLinkClass}>Education</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/complaint" className={getMobileLinkClass}>Complaint</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/cyber" className={getMobileLinkClass}>Cyber</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/traveller" className={getMobileLinkClass}>Traveller</NavLink>
          
          <div className="border-t border-emerald-800 my-2 pt-2">
            <NavLink onClick={() => setIsOpen(false)} to="/profile" className={getMobileLinkClass}>Profile</NavLink>
            <NavLink 
              onClick={() => setIsOpen(false)} 
              to="/login" 
              className="block w-full text-center mt-4 px-4 py-3 rounded-lg bg-emerald-500 text-white font-bold shadow-md hover:bg-emerald-400 transition-colors"
            >
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}