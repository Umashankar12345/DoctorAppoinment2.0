import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE = API_BASE_URL;

// Specialization icons and colors for the grid
const SPEC_META = {
    'General Physician': { icon: '🩺', color: 'from-blue-500 to-blue-600' },
    'Dentist': { icon: '🦷', color: 'from-cyan-500 to-cyan-600' },
    'Dermatologist': { icon: '🧴', color: 'from-pink-500 to-pink-600' },
    'Cardiologist': { icon: '❤️', color: 'from-red-500 to-red-600' },
    'Orthopedic': { icon: '🦴', color: 'from-amber-500 to-amber-600' },
    'Neurologist': { icon: '🧠', color: 'from-purple-500 to-purple-600' },
    'Pediatrician': { icon: '👶', color: 'from-green-500 to-green-600' },
    'Gynecologist': { icon: '🤰', color: 'from-rose-500 to-rose-600' },
    'ENT Specialist': { icon: '👂', color: 'from-indigo-500 to-indigo-600' },
    'Ophthalmologist': { icon: '👁️', color: 'from-teal-500 to-teal-600' },
    'Psychiatrist': { icon: '🧘', color: 'from-violet-500 to-violet-600' },
    'Urologist': { icon: '🏥', color: 'from-sky-500 to-sky-600' },
    'Pulmonologist': { icon: '🫁', color: 'from-emerald-500 to-emerald-600' },
    'Gastroenterologist': { icon: '🫃', color: 'from-orange-500 to-orange-600' },
    'Endocrinologist': { icon: '💉', color: 'from-fuchsia-500 to-fuchsia-600' },
    'Nephrologist': { icon: '🫘', color: 'from-lime-600 to-lime-700' },
    'Oncologist': { icon: '🎗️', color: 'from-yellow-500 to-yellow-600' },
    'Radiologist': { icon: '📡', color: 'from-gray-500 to-gray-600' },
    'Physiotherapist': { icon: '🏋️', color: 'from-cyan-600 to-teal-600' },
    'Ayurveda': { icon: '🌿', color: 'from-green-600 to-emerald-600' },
};

const FindDoctors = () => {
    const navigate = useNavigate();
    const locationHook = useLocation();

    const queryParams = new URLSearchParams(locationHook.search);
    const initialSpec = queryParams.get('specialization') || '';
    const initialDist = queryParams.get('district') || '';

    // ─── State ──────────────────────────────────────────────────
    const [doctors, setDoctors] = useState([]);
    const [topDoctors, setTopDoctors] = useState([]);
    const [nearbyDoctors, setNearbyDoctors] = useState([]);
    const [availableSpecs, setAvailableSpecs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nearbyLoading, setNearbyLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    // Filters
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState(initialDist);
    const [selectedSpec, setSelectedSpec] = useState(initialSpec);
    const [doctorName, setDoctorName] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDoctorsCount, setTotalDoctorsCount] = useState(0);

    // ─── Load States ────────────────────────────────────────────
    useEffect(() => {
        axios.get(`${API_BASE}/api/locations/states`)
            .then(res => setStates(res.data))
            .catch(err => console.error('Failed to load states', err));
    }, []);

    // ─── Load Districts when State changes ──────────────────────
    useEffect(() => {
        if (selectedState) {
            axios.get(`${API_BASE}/api/locations/districts?state=${selectedState}`)
                .then(res => setDistricts(res.data))
                .catch(err => console.error('Failed to load districts', err));
        } else {
            setDistricts([]);
            setSelectedDistrict('');
        }
    }, [selectedState]);

    // ─── Load Specializations when State/District changes ───────
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedState) params.append('state', selectedState);
        if (selectedDistrict) params.append('district', selectedDistrict);

        axios.get(`${API_BASE}/api/doctors/specializations?${params.toString()}`)
            .then(res => setSpecializations(res.data))
            .catch(err => console.error('Failed to load specializations', err));
    }, [selectedState, selectedDistrict]);

    // ─── Load Top Doctors on mount ──────────────────────────────
    useEffect(() => {
        axios.get(`${API_BASE}/api/doctors/top?limit=20`)
            .then(res => setTopDoctors(res.data))
            .catch(err => console.error('Failed to load top doctors', err));
    }, []);

    // ─── Load all available specializations for grid ────────────
    useEffect(() => {
        axios.get(`${API_BASE}/api/doctors/specializations`)
            .then(res => setAvailableSpecs(res.data))
            .catch(err => console.error('Failed to load specs', err));
    }, []);

    // ─── Fetch Nearby Doctors on mount ──────────────────────────
    useEffect(() => {
        if (navigator.geolocation) {
            setNearbyLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const res = await axios.get(`${API_BASE}/api/doctors/nearby?lat=${latitude}&lng=${longitude}&distance=100000`);
                        if (Array.isArray(res.data)) {
                            setNearbyDoctors(res.data.slice(0, 10));
                        } else {
                            console.warn('Nearby doctors response is not an array:', res.data);
                            setNearbyDoctors([]);
                        }
                    } catch (err) {
                        console.error('Nearby doctors fetch failed', err);
                    } finally {
                        setNearbyLoading(false);
                    }
                },
                () => setNearbyLoading(false)
            );
        }
    }, []);

    // ─── Initial search if query params present ─────────────────
    useEffect(() => {
        if (initialSpec || initialDist) {
            handleSearch();
        }
    }, []);

    // ─── Search ─────────────────────────────────────────────────
    const handleSearch = async (specOverride) => {
        setLoading(true);
        setError('');
        setHasSearched(true);
        try {
            const params = new URLSearchParams();
            if (selectedState) params.append('state', selectedState);
            if (selectedDistrict) params.append('district', selectedDistrict);
            const spec = specOverride || selectedSpec;
            if (spec) params.append('specialization', spec);
            if (doctorName) params.append('name', doctorName);

            // Add pagination
            const currentPage = specOverride ? 1 : page; // Reset to page 1 if search criteria changed via spec click
            params.append('page', currentPage);
            params.append('limit', 12);

            const res = await axios.get(`${API_BASE}/api/doctors/search?${params.toString()}`);

            // The API now returns { doctors, page, pages, total }
            if (res.data && res.data.doctors) {
                setDoctors(res.data.doctors);
                setTotalPages(res.data.pages || 1);
                setTotalDoctorsCount(res.data.total || 0);
                if (specOverride) setPage(1);
            } else if (Array.isArray(res.data)) {
                setDoctors(res.data);
            } else {
                setDoctors([]);
            }
        } catch (err) {
            setError('Failed to fetch doctors.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ─── Specialization Card Click ──────────────────────────────
    const handleSpecClick = (specName) => {
        setSelectedSpec(specName);
        handleSearch(specName);
    };

    // ─── Use Current Location ───────────────────────────────────
    const getLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            setHasSearched(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const res = await axios.get(`${API_BASE}/api/doctors/nearby?lat=${latitude}&lng=${longitude}&distance=100000`);
                        const doctorsList = Array.isArray(res.data) ? res.data : [];
                        setDoctors(doctorsList);
                        setNearbyDoctors(doctorsList.slice(0, 10));
                    } catch (err) {
                        setError('Failed to find nearby doctors.');
                    } finally {
                        setLoading(false);
                    }
                },
                () => {
                    setLoading(false);
                    setError('Location access denied.');
                }
            );
        } else {
            setError('Geolocation not supported.');
        }
    };

    // ─── Doctor Card Component ──────────────────────────────────
    const DoctorCard = ({ doc, showBadge }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="flex p-5">
                <img
                    src={doc.image || 'https://cdn-icons-png.flaticon.com/512/377/377429.png'}
                    alt={doc.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 flex-shrink-0"
                />
                <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 truncate">{doc.name}</h3>
                        {showBadge && doc.rating >= 4.7 && (
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0">⭐ Top</span>
                        )}
                    </div>
                    <p className="text-blue-600 font-medium text-sm">{doc.specialization}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{doc.experience} yrs exp.</span>
                        <span className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="font-bold text-gray-700 ml-0.5">{doc.rating || 0}</span>
                        </span>
                    </div>
                    {doc.fees && (
                        <p className="text-green-600 font-bold text-sm mt-1">₹{doc.fees} consultation</p>
                    )}
                </div>
            </div>

            <div className="px-5 pb-3">
                <p className="text-gray-600 text-sm line-clamp-2">{doc.about || 'No bio available.'}</p>
                <p className="text-gray-400 text-xs mt-2">📍 {doc.district}, {doc.state}</p>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                {doc.phone && (
                    <a
                        href={`tel:${doc.phone}`}
                        className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-center text-sm flex items-center justify-center gap-1.5"
                    >
                        📞 Call Now
                    </a>
                )}
                <button
                    onClick={() => navigate(`/appointment/${doc._id}`, {
                        state: {
                            doctorName: doc.name,
                            department: doc.specialization,
                            doctorId: doc._id,
                            doctorPhone: doc.phone
                        }
                    })}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
                >
                    📅 Book Appointment
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                {/* ─── Header ────────────────────────────────────── */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Find Your Specialist</h1>
                    <p className="text-gray-500 mt-2">Search from {topDoctors.length}+ verified doctors across India</p>
                </div>

                {/* ─── SEARCH PANEL ─────────────────────────────── */}
                <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* State */}
                        <select
                            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                            value={selectedState}
                            onChange={(e) => {
                                setSelectedState(e.target.value);
                                setSelectedDistrict('');
                                setSelectedSpec('');
                            }}
                        >
                            <option value="">🏛️ Select State</option>
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {/* District */}
                        <select
                            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                            value={selectedDistrict}
                            onChange={(e) => {
                                setSelectedDistrict(e.target.value);
                                setSelectedSpec('');
                            }}
                            disabled={!selectedState}
                        >
                            <option value="">📍 Select District</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        {/* Specialization */}
                        <select
                            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                            value={selectedSpec}
                            onChange={(e) => setSelectedSpec(e.target.value)}
                        >
                            <option value="">🩺 Specialization</option>
                            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {/* Doctor Name */}
                        <input
                            type="text"
                            placeholder="🔍 Doctor Name"
                            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={doctorName}
                            onChange={(e) => setDoctorName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />

                        {/* Search */}
                        <button
                            onClick={() => handleSearch()}
                            className="bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300 p-3 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <span className="text-gray-400 text-sm">or</span>
                        <button onClick={getLocation} className="ml-3 text-blue-600 font-medium hover:underline text-sm">
                            📍 Use Current Location
                        </button>
                    </div>
                </div>

                {/* ─── SPECIALIZATION GRID ──────────────────────── */}
                {availableSpecs.length > 0 && (
                    <section className="mb-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Browse by Specialization</h2>
                            <p className="text-gray-500 text-sm mt-1">Click any specialization to find doctors</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {availableSpecs.map((spec, idx) => {
                                const meta = SPEC_META[spec] || { icon: '👨‍⚕️', color: 'from-blue-400 to-blue-500' };
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSpecClick(spec)}
                                        className={`group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-transparent transition-all duration-300 text-left overflow-hidden ${selectedSpec === spec ? 'ring-2 ring-blue-500 border-transparent shadow-lg' : ''
                                            }`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                                        <div className="relative z-10">
                                            <div className="text-3xl mb-3">{meta.icon}</div>
                                            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors leading-tight">{spec}</h3>
                                        </div>
                                        {selectedSpec === spec && (
                                            <div className="absolute top-2 right-2">
                                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ─── TOP 20 DOCTORS ──────────────────────────── */}
                {topDoctors.length > 0 && (
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Top Doctors</h2>
                                <p className="text-gray-500 text-sm mt-1">Highest rated doctors across India</p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full">⭐ Top Rated</span>
                        </div>
                        <div className="overflow-x-auto pb-4 -mx-4 px-4">
                            <div className="flex space-x-5" style={{ minWidth: 'max-content' }}>
                                {topDoctors.map((doc, idx) => (
                                    <div key={doc._id || idx} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 w-80 flex-shrink-0 overflow-hidden group">
                                        <div className="p-5">
                                            <div className="flex items-start space-x-4">
                                                <img
                                                    src={doc.image || 'https://cdn-icons-png.flaticon.com/512/377/377429.png'}
                                                    alt={doc.name}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-bold text-gray-800 truncate">{doc.name}</h3>
                                                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">#{idx + 1}</span>
                                                    </div>
                                                    <p className="text-blue-600 font-medium text-sm">{doc.specialization}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                        <span>{doc.experience} yrs</span>
                                                        <span>•</span>
                                                        <span className="flex items-center"><span className="text-yellow-400">★</span> {doc.rating}</span>
                                                        <span>•</span>
                                                        <span>📍 {doc.district}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                                <div>
                                                    <span className="text-gray-400 text-xs">Consultation</span>
                                                    <p className="text-green-600 font-bold">₹{doc.fees || 500}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {doc.phone && (
                                                        <a
                                                            href={`tel:${doc.phone}`}
                                                            className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition"
                                                        >
                                                            📞
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => navigate(`/appointment/${doc._id}`, {
                                                            state: { doctorName: doc.name, department: doc.specialization, doctorId: doc._id, doctorPhone: doc.phone }
                                                        })}
                                                        className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        Book
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── NEARBY DOCTORS ──────────────────────────── */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Doctors Near You</h2>
                            <p className="text-gray-500 text-sm mt-1">Based on your current location</p>
                        </div>
                        <button onClick={getLocation} className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition">
                            <span>📍</span><span>Refresh</span>
                        </button>
                    </div>

                    {nearbyLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                            <span className="text-gray-500">Finding doctors near you...</span>
                        </div>
                    )}

                    {!nearbyLoading && nearbyDoctors.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {nearbyDoctors.map((doc, idx) => (
                                <DoctorCard key={doc._id || idx} doc={doc} />
                            ))}
                        </div>
                    )}

                    {!nearbyLoading && nearbyDoctors.length === 0 && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-3">📍</div>
                            <p className="text-gray-600 font-medium">Enable location access to find doctors near you</p>
                            <button onClick={getLocation} className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
                                Allow Location Access
                            </button>
                        </div>
                    )}
                </section>

                {/* ─── Loading & Error ──────────────────────────── */}
                {loading && <p className="text-center text-gray-500 py-4">Loading doctors...</p>}
                {error && <p className="text-center text-red-500 py-4">{error}</p>}

                {/* ─── SEARCH RESULTS ──────────────────────────── */}
                {hasSearched && !loading && (
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Search Results
                                    <span className="text-gray-400 text-lg font-normal ml-2">({doctors.length} found)</span>
                                </h2>
                                {selectedSpec && <p className="text-blue-600 text-sm mt-1">Filtering: {selectedSpec}</p>}
                            </div>
                            {doctors.length > 0 && (
                                <button
                                    onClick={() => {
                                        setHasSearched(false);
                                        setDoctors([]);
                                        setSelectedSpec('');
                                        setDoctorName('');
                                    }}
                                    className="text-sm text-gray-500 hover:text-red-500 transition"
                                >
                                    ✕ Clear Results
                                </button>
                            )}
                        </div>

                        {doctors.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {doctors.map((doc, idx) => (
                                        <DoctorCard key={doc._id || idx} doc={doc} showBadge />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-12 space-x-2">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
                                        >
                                            Prev
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg font-bold transition ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(page + 1)}
                                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                                <div className="text-5xl mb-4">🔍</div>
                                <p className="text-gray-500 text-lg">No doctors found matching your criteria</p>
                                <p className="text-gray-400 text-sm mt-2">Try different filters or browse specializations above</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Add effect to trigger search when page changes */}
                {(() => {
                    useEffect(() => {
                        if (hasSearched) handleSearch();
                    }, [page]);
                })()}

            </div>

            <Footer />
        </div>
    );
};

export default FindDoctors;
