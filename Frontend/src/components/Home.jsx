import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Home.css';

const API_BASE = API_BASE_URL;

const Home = () => {
    const navigate = useNavigate();
    const [searchSpec, setSearchSpec] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [topDoctors, setTopDoctors] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE}/api/doctors/top?limit=4`)
            .then(res => setTopDoctors(Array.isArray(res.data) ? res.data : (res.data.doctors || [])))
            .catch(err => {
                console.error('Failed to load top doctors', err);
                setTopDoctors([]);
            });

        axios.get(`${API_BASE}/api/doctors/stats`)
            .then(res => setStats(res.data))
            .catch(err => console.error('Failed to load stats', err));
    }, []);

    const handleSearch = () => {
        navigate(`/find-doctors?specialization=${searchSpec}&district=${searchLocation}`);
    };

    return (
        <div className="home-page bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            {/* 1. Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 lg:py-28 overflow-hidden">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="text-center md:text-left space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Your Health, <br />
                            <span className="text-blue-200">Our Priority</span>
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-lg mx-auto md:mx-0">
                            Book appointments with top-rated doctors in your city.
                            Secure, fast, and convenient healthcare at your fingertips.
                        </p>

                        {/* Search Bar */}
                        <div className="bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center max-w-2xl mx-auto md:mx-0">
                            <div className="flex-1 w-full md:w-auto px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Specialization (e.g. Cardiologist)"
                                    className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                                    value={searchSpec}
                                    onChange={(e) => setSearchSpec(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 w-full md:w-auto px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Location (e.g. Bangalore)"
                                    className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-semibold w-full md:w-auto mt-2 md:mt-0"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:block relative">
                        <img
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
                            alt="Doctor"
                            className="w-full max-w-md mx-auto rounded-3xl shadow-2xl border-4 border-white/20 transform hover:scale-105 transition duration-500"
                            style={{ objectFit: 'cover' }}
                        />
                        <div className="absolute top-10 right-0 bg-white p-4 rounded-xl shadow-xl animate-bounce">
                            <div className="flex items-center space-x-2">
                                <span className="text-yellow-400 text-xl">⭐</span>
                                <div>
                                    <p className="font-bold text-gray-800">4.9/5</p>
                                    <p className="text-xs text-gray-500">Patient Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500 rounded-full opacity-20 filter blur-3xl"></div>
            </section>

            {/* 2. Stats Section */}
            <section className="bg-white py-12 shadow-sm relative z-20 -mt-8 mx-4 md:mx-auto md:max-w-5xl rounded-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-blue-600">{stats ? stats.totalDoctors : '50'}+</h3>
                        <p className="text-gray-500 font-medium">Verified Doctors</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-blue-600">{stats ? stats.byState?.length : '18'}+</h3>
                        <p className="text-gray-500 font-medium">States Covered</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-blue-600">{stats ? stats.bySpecialization?.length : '20'}+</h3>
                        <p className="text-gray-500 font-medium">Specializations</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-blue-600">98%</h3>
                        <p className="text-gray-500 font-medium">Patient Satisfaction</p>
                    </div>
                </div>
            </section>

            {/* 3. Featured Doctors — Real Data */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Top Rated Doctors</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Handpicked specialists with the highest patient ratings and extensive experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(topDoctors || []).map((doc, idx) => (
                        <div key={doc._id || idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 group">
                            <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden flex items-center justify-center">
                                <img
                                    src={doc.image || 'https://cdn-icons-png.flaticon.com/512/377/377429.png'}
                                    alt={doc.name}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    ✓ Verified
                                </div>
                                {doc.consultationModes?.includes('video') && (
                                    <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        📹 Video
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{doc.name}</h3>
                                        <p className="text-blue-600 font-medium text-sm">{doc.specialization}</p>
                                    </div>
                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                                        <span className="text-yellow-400 mr-1">★</span>
                                        <span className="font-bold text-gray-700 text-sm">{doc.rating}</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-1">{doc.experience} yrs exp. • {doc.qualifications || ''}</p>
                                <p className="text-gray-400 text-xs mb-1">📍 {doc.district}, {doc.state}</p>
                                {doc.fees && <p className="text-green-600 font-bold text-sm mb-3">₹{doc.fees} consultation</p>}
                                <button
                                    onClick={() => navigate(`/appointment/${doc._id}`, {
                                        state: {
                                            doctorName: doc.name,
                                            department: doc.specialization,
                                            doctorId: doc._id,
                                            doctorPhone: doc.phone
                                        }
                                    })}
                                    className="w-full bg-blue-50 text-blue-600 py-2.5 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/find-doctors" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                        View All Doctors
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* 4. Departments Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Specialized Departments</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { name: 'Cardiology', icon: '❤️', spec: 'Cardiologist' },
                            { name: 'Dermatology', icon: '🧴', spec: 'Dermatologist' },
                            { name: 'Orthopedic', icon: '🦴', spec: 'Orthopedic' },
                            { name: 'Neurology', icon: '🧠', spec: 'Neurologist' },
                            { name: 'Pediatrics', icon: '👶', spec: 'Pediatrician' },
                            { name: 'Gynecology', icon: '🤰', spec: 'Gynecologist' }
                        ].map((dept, idx) => (
                            <div key={idx} className="bg-gray-50 p-6 rounded-2xl text-center hover:bg-blue-600 hover:text-white transition duration-300 group cursor-pointer" onClick={() => navigate(`/find-doctors?specialization=${dept.spec}`)}>
                                <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">
                                    {dept.icon}
                                </div>
                                <h3 className="font-semibold">{dept.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Video Consult Promo */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-white space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                                📹 New Feature
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Video Consultation</h2>
                            <p className="text-indigo-100 text-lg max-w-lg">
                                Consult with top doctors from the comfort of your home. Secure, private, and instant video calls with verified specialists.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-sm text-indigo-100">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Instant Connection
                                </div>
                                <div className="flex items-center gap-2 text-sm text-indigo-100">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Digital Prescription
                                </div>
                                <div className="flex items-center gap-2 text-sm text-indigo-100">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    End-to-End Encrypted
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/video-consult')}
                            className="bg-white text-indigo-700 px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition transform duration-200 flex items-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Start Video Consult
                        </button>
                    </div>
                </div>
            </section>

            {/* 6. Testimonials */}
            <section className="py-20 container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">What Our Patients Say</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Rahul Sharma", text: "Very smooth booking experience. The doctor was very professional." },
                        { name: "Priya Patel", text: "I found a great dermatologist in my area within minutes. Highly recommended!" },
                        { name: "Amit Singh", text: "The geolocation feature is amazing, found a clinic just 2km away." }
                    ].map((review, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    {review.name[0]}
                                </div>
                                <span className="font-bold text-gray-800">{review.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
