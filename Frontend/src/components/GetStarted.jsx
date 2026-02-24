import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const GetStarted = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-12 text-gray-800">How would you like to continue?</h1>

                <div className="flex flex-col md:flex-row justify-center gap-8">
                    {/* Patient Option */}
                    <Link to="/register?role=patient" className="group block w-full md:w-1/3 bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-blue-500">
                        <div className="text-6xl mb-4">👤</div>
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600">I am a Patient</h2>
                        <p className="text-gray-600">Book appointments, find doctors, and manage your health.</p>
                    </Link>

                    {/* Doctor Option */}
                    <Link to="/register?role=doctor" className="group block w-full md:w-1/3 bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-green-500">
                        <div className="text-6xl mb-4">👨‍⚕️</div>
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-green-600">I am a Doctor</h2>
                        <p className="text-gray-600">Manage appointments, view patients, and grow your practice.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
