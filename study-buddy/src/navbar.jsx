import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav
            className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center fixed top-0 w-full z-10 shadow-md"
            aria-label="Main Navigation"
        >
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
               
                <div className="text-2xl font-bold">Study Buddy</div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-4">
                <NavLink
                    to="/mainapp"
                    className={({ isActive }) =>
                        isActive ? "text-blue-400" : "hover:text-blue-300"
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/course-input"
                    className={({ isActive }) =>
                        isActive ? "text-blue-400" : "hover:text-blue-300"
                    }
                >
                    Course Input
                </NavLink>
                <NavLink
                    to="/timetable"
                    className={({ isActive }) =>
                        isActive ? "text-blue-400" : "hover:text-blue-300"
                    }
                >
                    Timetable
                </NavLink>
                <div className="relative group">
                    <button className="hover:text-blue-300">More</button>
                    <div className="absolute hidden group-hover:block bg-gray-700 text-sm mt-2 rounded shadow-lg">
                        <NavLink
                            to="/about"
                            className="block px-4 py-2 hover:bg-gray-600"
                        >
                            About Us
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="block px-4 py-2 hover:bg-gray-600"
                        >
                            Contact
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Mobile Hamburger Menu */}
            <button
                className="md:hidden text-white focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-14 left-0 w-full bg-gray-800 text-white flex flex-col space-y-2 px-4 py-3 shadow-md md:hidden">
                    <NavLink
                        to="/mainapp"
                        className={({ isActive }) =>
                            isActive ? "text-blue-400" : "hover:text-blue-300"
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/course-input"
                        className={({ isActive }) =>
                            isActive ? "text-blue-400" : "hover:text-blue-300"
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Course Input
                    </NavLink>
                    <NavLink
                        to="/timetable"
                        className={({ isActive }) =>
                            isActive ? "text-blue-400" : "hover:text-blue-300"
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Timetable
                    </NavLink>
                    <NavLink
                    to="/syllabus"
                    className={({ isActive }) =>
                        isActive ? "text-blue-400" : "hover:text-blue-300"
                    }
                    onClick={() => setIsMenuOpen(false)}
                    >
                        Syllabus
                    </NavLink>
                    <NavLink
                        to="/about"
                        className="hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About Us
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className="hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contact
                    </NavLink>
                </div>
            )}
        </nav>
    );
}