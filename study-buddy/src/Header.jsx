import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react';
import { Link, Element } from 'react-scroll';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const navLinks = [
    { name: 'Features', section: 'section1' },
    { name: 'How It Works', section: 'section2' },
    { name: 'Resources', section: 'section3' },
  ];

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Simulate logout
    toggleMobileMenu(); // Close mobile menu if open
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
        <NavLink
          to="/"
          className="flex items-center space-x-2 group"
          aria-label="Study Buddy home"
        >
          <div
            className={`p-1 rounded-lg ${
              scrolled ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 text-white'
            } transition-colors`}
          >
            <BookOpen className="w-6 h-6" />
          </div>
          <span
            className={`text-2xl font-bold ${
              scrolled ? 'text-blue-600' : 'text-white'
            } group-hover:text-blue-400 transition-colors`}
          >
            Study<span className="font-extrabold">Buddy</span>
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center space-x-1">
          <div className="flex items-center mr-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.section}
                smooth={true}
                duration={500}
                offset={-60}
                className={`px-3 py-2 rounded-lg mx-1 hover:bg-white/10 cursor-pointer ${
                  scrolled
                    ? 'text-gray-700 hover:text-blue-600'
                    : 'text-white/90 hover:text-white'
                }`}
                activeClass="text-blue-600 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  scrolled
                    ? 'text-blue-600 hover:bg-blue-50'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Log out of Study Buddy"
              >
                Log Out
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </nav>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg focus:outline-none"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
          )}
        </button>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out origin-top ${
          mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.section}
                smooth={true}
                duration={500}
                offset={-60}
                className={`px-3 py-2 rounded-lg ${
                  scrolled ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
                activeClass="text-blue-600 bg-blue-50 font-medium"
                onClick={toggleMobileMenu}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-100">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium text-center text-blue-600 border border-blue-600 hover:bg-blue-50"
                aria-label="Log out of Study Buddy"
              >
                Log Out
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
