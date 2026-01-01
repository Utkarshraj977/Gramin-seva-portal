import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function UserHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // Desktop Link Styles (Same as Admin - Light text for dark background)
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
    // THEME: Same Dark Forest Green (bg-emerald-900)
    <header className="bg-emerald-900 shadow-md sticky top-0 z-50 w-full border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <span className="text-2xl bg-emerald-800 p-1.5 rounded-lg shadow-inner">🌿</span>
            <span className="text-xl font-bold text-white tracking-wide">
              Gramin<span className="text-emerald-400">Seva</span>
            </span>
          </div>

          {/* DESKTOP NAV - Updated for User Roles */}
          <nav className="hidden md:flex space-x-4 items-center">
            <NavLink to="/home/user" end className={getLinkClass}>Home</NavLink>
            <NavLink to="/services/user" className={getLinkClass}>Services</NavLink>
            
            {/* CHANGED LINKS */}
            <NavLink to="/doctor/user" className={getLinkClass}>Patient</NavLink>
            <NavLink to="/education/user" className={getLinkClass}>Student</NavLink>
            <NavLink to="/complaint/user" className={getLinkClass}>Complaint User</NavLink>
            
            <NavLink to="/cyber/user" className={getLinkClass}>Cyber User</NavLink>
            <NavLink to="/traveller/user" className={getLinkClass}>Traveller User</NavLink>
          </nav>

          {/* MOBILE TOGGLE (HAMBURGER) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
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

      {/* MOBILE MENU - Updated for User Roles */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 bg-emerald-900 shadow-xl border-t border-emerald-800">
          <NavLink onClick={() => setIsOpen(false)} to="/home/user" end className={getMobileLinkClass}>Home</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/services/user" className={getMobileLinkClass}>Services</NavLink>
          
          {/* CHANGED LINKS IN MOBILE MENU */}
          <NavLink onClick={() => setIsOpen(false)} to="/doctor/user" className={getMobileLinkClass}>Patient</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/education/user" className={getMobileLinkClass}>Student</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/complaint/user" className={getMobileLinkClass}>Complaint User</NavLink>
          
          <NavLink onClick={() => setIsOpen(false)} to="/cyber/user" className={getMobileLinkClass}>Cyber User</NavLink>
          <NavLink onClick={() => setIsOpen(false)} to="/traveller/user" className={getMobileLinkClass}>Traveller User</NavLink>
          
          {/* <div className="border-t border-emerald-800 my-2 pt-2">
            <NavLink onClick={() => setIsOpen(false)} to="/profile" className={getMobileLinkClass}>Profile</NavLink>
            <NavLink 
              onClick={() => setIsOpen(false)} 
              to="/login" 
              className="block w-full text-center mt-4 px-4 py-3 rounded-lg bg-emerald-500 text-white font-bold shadow-md hover:bg-emerald-400 transition-colors"
            >
              Login
            </NavLink>
          </div> */}
        </div>
      </div>
    </header>
  );
}