import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">About MedApp</h1>

                    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-600 mb-3">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed">
                                MedApp is dedicated to making healthcare accessible to everyone. We connect patients
                                with verified, top-rated doctors across India, enabling seamless appointment booking
                                from the comfort of your home.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-blue-600 mb-3">What We Offer</h2>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">✓</span>
                                    <span>Search doctors by specialization, location, and name</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">✓</span>
                                    <span>Book appointments instantly with available time slots</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">✓</span>
                                    <span>Location-based search to find doctors near you</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">✓</span>
                                    <span>Live doctor data powered by our own Healthcare Directory API</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">✓</span>
                                    <span>Secure authentication and appointment management</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-blue-600 mb-3">Technology</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Built with the MERN Stack — MongoDB, Express.js, React.js, and Node.js.
                                Features Tailwind CSS for a modern, responsive design with geospatial
                                search capabilities.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                            {['MongoDB', 'Express.js', 'React.js', 'Node.js'].map((tech, idx) => (
                                <div key={idx} className="bg-blue-50 text-blue-700 font-semibold text-center py-3 rounded-xl">
                                    {tech}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default About;
