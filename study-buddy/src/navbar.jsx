import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react';
export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Array of navigation items for DRY code
  const navItems = [
    { path: "/mainapp", label: "Home" },
    { path: "/course-input", label: "Course Input" },
    { path: "/timetable", label: "Timetable" },
    { path: "/syllabus", label: "Syllabus" },
    { path: "/tqsolver", label: "TQ Solver" },
    { path: "/notegenerator", label: "Note Generator" }
  ];

  // Dropdown menu items
  const dropdownItems = [
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
    
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white text-gray-800 shadow-lg" 
          : "bg-transparent text-gray-800 md:text-white"
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <NavLink to="/mainapp" className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6" />
              <span className={`text-xl font-bold ${isScrolled ? "text-blue-600" : "text-blue-500 md:text-white"}`}>
                Study Buddy
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? isScrolled
                        ? "text-blue-600 bg-blue-50" 
                        : "text-white bg-blue-600/20"
                      : isScrolled
                        ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50" 
                        : "text-gray-100 hover:text-white hover:bg-white/20"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    : "text-gray-100 hover:text-white hover:bg-white/20"
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                More
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {dropdownItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                          isActive ? "bg-gray-100 text-blue-600 font-medium" : ""
                        }`
                      }
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sign In / Sign Up Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <NavLink
              to="/login"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isScrolled
                  ? "text-blue-600 hover:bg-blue-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isScrolled
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              Sign Up
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled
                  ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  : "text-gray-800 md:text-white hover:bg-white/10"
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            
            {/* Dropdown items directly in mobile menu */}
            {dropdownItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          
          {/* Mobile sign in/up buttons */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Account</div>
                <div className="text-sm font-medium text-gray-500">Manage your account</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <NavLink
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}