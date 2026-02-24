import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeSecondaryDropdown, setActiveSecondaryDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const secondaryDropdownRef = useRef(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== "undefined") {
                const parsedUser = JSON.parse(storedUser);
                // Standardize role to lowercase for consistency
                if (parsedUser.role) parsedUser.role = parsedUser.role.toLowerCase();
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Invalid user data in localStorage");
            setUser(null);
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (secondaryDropdownRef.current && !secondaryDropdownRef.current.contains(event.target)) {
                setActiveSecondaryDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const toggleSecondaryDropdown = (name) => {
        setActiveSecondaryDropdown(prev => prev === name ? null : name);
    };

    return (
        <div className="sticky top-0 z-50">
            {/* Primary Navbar */}
            <nav className="bg-white/90 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">

                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Bihar Healthcare
                                </span>
                            </Link>

                            {/* Desktop Nav Links */}
                            {/* <div className="hidden md:ml-10 md:flex md:space-x-8">
                                <Link to="/find-doctors" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium transition">
                                    Find Doctors
                                </Link>
                                <Link to="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium transition">
                                    About
                                </Link>
                            </div> */}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                                    >
                                        <span className="font-medium text-blue-600">
                                            Hello, {user.name || 'User'}
                                        </span>
                                        <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 animate-fade-in-down">
                                            {user.role === 'doctor' && (
                                                <Link
                                                    to="/doctor-dashboard"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                            )}
                                            {user.role === 'patient' && (
                                                <Link
                                                    to="/myAppointments"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    My Appointments
                                                </Link>
                                            )}
                                            <button
                                                onClick={onLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-200">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Secondary Navigation Bar */}
            <div className="bg-white border-t border-gray-200 shadow-sm hidden md:block" ref={secondaryDropdownRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-12">
                        {/* Left Side Links */}
                        <div className="flex items-center space-x-8">
                            <Link
                                to="/find-doctors"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            >
                                Find Doctors
                            </Link>
                            <Link
                                to="/video-consult"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            >
                                Video Consult
                            </Link>
                            <Link
                                to="/lab-tests"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            >
                                Lab Tests
                            </Link>
                            <Link
                                to="/surgeries"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            >
                                Surgeries
                            </Link>
                        </div>

                        {/* Right Side Dropdowns */}
                        <div className="flex items-center space-x-6">
                            {/* For Corporates with NEW badge */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleSecondaryDropdown('corporates')}
                                    className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                                >
                                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                        NEW
                                    </span>
                                    <span>For Corporates</span>
                                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeSecondaryDropdown === 'corporates' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeSecondaryDropdown === 'corporates' && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-2 ring-1 ring-black/5 z-50">
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Health & Wellness Plans
                                        </a>
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Corporate Health Checkup
                                        </a>
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Employee Assistance
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* For Providers */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleSecondaryDropdown('providers')}
                                    className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                                >
                                    <span>For Providers</span>
                                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeSecondaryDropdown === 'providers' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeSecondaryDropdown === 'providers' && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-2 ring-1 ring-black/5 z-50">
                                        {user?.role === 'doctor' && (
                                            <Link
                                                to="/doctor-dashboard"
                                                className="block px-4 py-2.5 text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                                                onClick={() => setActiveSecondaryDropdown(null)}
                                            >
                                                Doctor Dashboard
                                            </Link>
                                        )}
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Healthcare Profile
                                        </a>
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Healthcare Reach
                                        </a>
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Healthcare Drive
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Security & Help */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleSecondaryDropdown('security')}
                                    className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                                >
                                    <span>Security & help</span>
                                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeSecondaryDropdown === 'security' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeSecondaryDropdown === 'security' && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-2 ring-1 ring-black/5 z-50">
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Data Privacy
                                        </a>
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Help Center
                                        </a>
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Terms & Conditions
                                        </a>
                                        <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            Contact Us
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;