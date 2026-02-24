import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE = 'http://localhost:5000';

function VideoConsult() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpec, setSelectedSpec] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideoDoctors = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/doctors/search?consultationMode=video&limit=50`);
                const doctorList = res.data.doctors || res.data;
                setDoctors(doctorList);
                setFilteredDoctors(doctorList);

                // Extract unique specializations from video doctors
                const specs = [...new Set(doctorList.map(d => d.specialization).filter(Boolean))].sort();
                setSpecializations(specs);
            } catch (err) {
                console.error('Failed to load video doctors', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideoDoctors();
    }, []);

    useEffect(() => {
        if (selectedSpec) {
            setFilteredDoctors(doctors.filter(d => d.specialization === selectedSpec));
        } else {
            setFilteredDoctors(doctors);
        }
    }, [selectedSpec, doctors]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50">

                {/* Hero */}
                <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16 lg:py-20 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left space-y-4 max-w-2xl">
                                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                                    📹 Video Consultation
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                    Consult Top Doctors <br />
                                    <span className="text-purple-200">From Home</span>
                                </h1>
                                <p className="text-lg text-indigo-100 max-w-lg">
                                    Get expert medical advice through secure video calls. No waiting rooms, no travel — instant healthcare at your fingertips.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
                                    <p className="text-3xl font-bold">{filteredDoctors.length}</p>
                                    <p className="text-xs text-indigo-200 mt-1">Video Doctors</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
                                    <p className="text-3xl font-bold">{specializations.length}</p>
                                    <p className="text-xs text-indigo-200 mt-1">Specializations</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
                                    <p className="text-3xl font-bold">24/7</p>
                                    <p className="text-xs text-indigo-200 mt-1">Available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500 rounded-full opacity-20 filter blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-400 rounded-full opacity-20 filter blur-3xl"></div>
                </section>

                {/* Feature Cards */}
                <div className="container mx-auto px-4 -mt-8 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Consultation</h3>
                            <p className="text-gray-500 text-sm">Connect with a doctor within minutes. No waiting rooms, no travel.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Private</h3>
                            <p className="text-gray-500 text-sm">End-to-end encrypted sessions for your privacy and security.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl">📋</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Prescription</h3>
                            <p className="text-gray-500 text-sm">Receive digital prescriptions and health records instantly.</p>
                        </div>
                    </div>
                </div>

                {/* Specialization Filter + Doctor Grid */}
                <section className="container mx-auto px-4 py-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Doctors Available for Video Consult</h2>
                        <p className="text-gray-500">Choose a specialization to find the right doctor</p>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <button
                            onClick={() => setSelectedSpec('')}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${!selectedSpec ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            All ({doctors.length})
                        </button>
                        {specializations.map(spec => {
                            const count = doctors.filter(d => d.specialization === spec).length;
                            return (
                                <button
                                    key={spec}
                                    onClick={() => setSelectedSpec(spec)}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition ${selectedSpec === spec ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {spec} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-500">Loading doctors...</p>
                        </div>
                    )}

                    {/* Doctor Cards */}
                    {!loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDoctors.map((doc) => (
                                <div key={doc._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 group">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <img
                                                src={doc.image || 'https://cdn-icons-png.flaticon.com/512/377/377429.png'}
                                                alt={doc.name}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 group-hover:border-indigo-300 transition"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{doc.name}</h3>
                                                <p className="text-indigo-600 font-semibold text-sm">{doc.specialization}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center text-sm text-yellow-500 font-medium">
                                                        ★ {doc.rating}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">•</span>
                                                    <span className="text-gray-500 text-sm">{doc.experience} yrs</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Pills */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {doc.languages?.slice(0, 3).map((lang, i) => (
                                                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{lang}</span>
                                            ))}
                                            {doc.qualifications && (
                                                <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full">{doc.qualifications}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-400 text-sm">📍</span>
                                                <span className="text-gray-500 text-sm">{doc.district}, {doc.state}</span>
                                            </div>
                                            <span className="text-green-600 font-bold text-lg">₹{doc.fees}</span>
                                        </div>

                                        {/* Consultation Mode Badges */}
                                        <div className="flex gap-2 mb-5">
                                            {doc.consultationModes?.map((mode, i) => (
                                                <span key={i} className={`text-xs font-medium px-3 py-1 rounded-full ${mode === 'video' ? 'bg-indigo-100 text-indigo-700' :
                                                    mode === 'chat' ? 'bg-teal-100 text-teal-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {mode === 'video' ? '📹 Video' : mode === 'chat' ? '💬 Chat' : '🏥 In-Person'}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => navigate(`/appointment/${doc._id}`, {
                                                state: {
                                                    doctorName: doc.name,
                                                    department: doc.specialization,
                                                    doctorId: doc._id,
                                                    doctorPhone: doc.phone
                                                }
                                            })}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Start Video Consult
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredDoctors.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-4">🔍</p>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">No doctors found</h3>
                            <p className="text-gray-500">Try selecting a different specialization</p>
                        </div>
                    )}
                </section>

                {/* How It Works */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { step: '1', title: 'Choose Doctor', desc: 'Browse and select a specialist', icon: '👨‍⚕️' },
                                { step: '2', title: 'Book Slot', desc: 'Pick a convenient date & time', icon: '📅' },
                                { step: '3', title: 'Video Call', desc: 'Join the secure video session', icon: '📹' },
                                { step: '4', title: 'Get Prescription', desc: 'Receive digital prescription', icon: '💊' }
                            ].map((item, idx) => (
                                <div key={idx} className="text-center relative">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                                        {item.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold md:relative md:mx-auto md:-mt-10 md:mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default VideoConsult;
