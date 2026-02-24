import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-10 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-blue-400">MedApp</h3>
                        <p className="text-gray-400">
                            Connecting patients with trusted doctors for better healthcare.
                            Book appointments, find specialists, and manage your health journey.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/home" className="text-gray-400 hover:text-white transition">Home</Link></li>
                            <li><Link to="/find-doctors" className="text-gray-400 hover:text-white transition">Find Doctors</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
                        <p className="text-gray-400 mb-2">Email: support@medapp.com</p>
                        <p className="text-gray-400 mb-4">Phone: +91 98765 43210</p>

                        <div className="flex space-x-4">
                            {/* Social Icons Placeholders */}
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition">
                                <span className="text-xl">fb</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-400 transition">
                                <span className="text-xl">tw</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-pink-600 transition">
                                <span className="text-xl">ig</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} MedApp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
