import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { 
      name: 'Resources', 
      path: '#',
      dropdown: true,
      subLinks: [
        { name: 'Study Tips', path: '/resources/study-tips' },
        { name: 'Blog', path: '/blog' },
        { name: 'Success Stories', path: '/success-stories' }
      ]
    }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white text-gray-800 shadow-lg py-2' 
          : 'bg-transparent text-white py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink 
          to="/" 
          className="flex items-center space-x-2 group"
          aria-label="Study Buddy home"
        >
          <div className={`p-1 rounded-lg ${scrolled ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 text-white'} transition-colors`}>
            <BookOpen className="w-6 h-6" />
          </div>
          <span className={`text-2xl font-bold ${
            scrolled ? 'text-blue-600' : 'text-white'
          } group-hover:text-blue-400 transition-colors`}>
            Study<span className="font-extrabold">Buddy</span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {/* Main nav links */}
          <div className="flex items-center mr-4">
            {navLinks.map((link, index) => (
              <div key={index} className="relative group">
                {link.dropdown ? (
                  <button 
                    className={`px-3 py-2 rounded-lg mx-1 flex items-center hover:bg-white/10 ${
                      scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `px-3 py-2 rounded-lg mx-1 hover:bg-white/10 ${
                      scrolled 
                        ? `${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:text-blue-600` 
                        : `${isActive ? 'text-white font-medium' : 'text-white/90'} hover:text-white`
                    }`}
                  >
                    {link.name}
                  </NavLink>
                )}
                
                {/* Dropdown menu */}
                {link.dropdown && (
                  <div className="absolute left-0 mt-1 w-48 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    {link.subLinks.map((subLink, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subLink.path}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {subLink.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center space-x-2">
            <NavLink
              to="/login"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                scrolled 
                  ? 'text-blue-600 hover:bg-blue-50' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Log in to Study Buddy"
            >
              Log In
            </NavLink>
            
            <NavLink
              to="/signup"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
              aria-label="Sign up for Study Buddy"
            >
              Get Started
            </NavLink>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg focus:outline-none"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out origin-top ${
          mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          {/* Mobile nav links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link, index) => (
              <React.Fragment key={index}>
                {link.dropdown ? (
                  <>
                    <div className="px-3 py-2 text-gray-700 font-medium border-b border-gray-100">
                      {link.name}
                    </div>
                    <div className="pl-6 space-y-1 mb-2">
                      {link.subLinks.map((subLink, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subLink.path}
                          className={({ isActive }) => `block px-3 py-2 rounded-lg ${
                            isActive ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          onClick={toggleMobileMenu}
                        >
                          {subLink.name}
                        </NavLink>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `px-3 py-2 rounded-lg ${
                      isActive ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    {link.name}
                  </NavLink>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Mobile CTA buttons */}
          <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-100">
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg font-medium text-center text-blue-600 border border-blue-600 hover:bg-blue-50"
              aria-label="Log in to Study Buddy"
              onClick={toggleMobileMenu}
            >
              Log In
            </NavLink>
            
            <NavLink
              to="/signup"
              className="px-4 py-2 rounded-lg font-medium text-center bg-blue-600 text-white hover:bg-blue-700"
              aria-label="Sign up for Study Buddy"
              onClick={toggleMobileMenu}
            >
              Get Started
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}