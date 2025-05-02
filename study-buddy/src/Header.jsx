import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center fixed top-0 w-full z-10 shadow-md">
      <NavLink to="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">
        Study Buddy
      </NavLink>
      <nav aria-label="Main navigation" className="flex items-center space-x-4">
        <NavLink
          to="/signup"
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 focus:ring-2 focus:ring-blue-300 transition-colors"
          aria-label="Sign up for Study Buddy"
        >
          Sign Up
        </NavLink>
        <NavLink
          to="/login"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 transition-colors"
          aria-label="Log in to Study Buddy"
        >
          Log In
        </NavLink>
      </nav>
    </header>
  );
}