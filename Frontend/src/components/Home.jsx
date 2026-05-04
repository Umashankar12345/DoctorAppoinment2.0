import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import FeaturesRoadmap from './FeaturesRoadmap';
import '../styles/Home.css';

const API_BASE = API_BASE_URL;

const REPLIES = {
    chest: { msg: "Chest pain with breathlessness is a serious symptom. I strongly recommend seeing a Cardiologist immediately. In Bihar, Dr. Priya Sharma at Apollo Hospital Patna is highly rated (4.9★). Shall I book you an urgent appointment?", spec: "Cardiologist" },
    fever: { msg: "High fever in children lasting over 24 hours needs attention. I recommend a Pediatrician. Dr. Ananya Roy at Ruban Memorial Patna is available today. Want me to check slots for you?", spec: "Pediatrician" },
    knee: { msg: "Knee pain with swelling often indicates joint issues or ligament problems. An Orthopedic specialist is best. Based on your location in Bihar, I can find the nearest available orthopedic. Shall I?", spec: "Orthopedic" },
    skin: { msg: "Skin rash and itching can have multiple causes — allergies, infections, or dermatitis. A Dermatologist can diagnose accurately. Dr. Rahul Verma at AIIMS Patna is available tomorrow. Book now?", spec: "Dermatologist" },
    default: { msg: "Thank you for describing your concern. Based on what you've shared, I recommend starting with a General Physician who can evaluate you and refer to a specialist if needed. Would you like me to find one near you in Bihar?", spec: "General Physician" }
};

const Home = () => {
    const navigate = useNavigate();
    const [searchSpec, setSearchSpec] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [topDoctors, setTopDoctors] = useState([]);
    const [stats, setStats] = useState(null);

    // AI Chat State
    const [chatMessages, setChatMessages] = useState([
        { text: "Namaste! I'm your Bihar Healthcare AI assistant. Tell me your symptoms and I'll recommend the right specialist for you. What's bothering you today?", type: 'ai' }
    ]);
    const [symptomInput, setSymptomInput] = useState('');
    const chatRef = useRef(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ name: '', spec: '' });
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedVisit, setSelectedVisit] = useState('In-clinic');

    // Toast State
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

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

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const displayToast = (msg) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const doSearch = () => {
        if (searchSpec || searchLocation) {
            displayToast('🔍 Searching for ' + (searchSpec || 'doctors') + (searchLocation ? ' in ' + searchLocation : '') + '...');
            setTimeout(() => {
                navigate(`/find-doctors?specialization=${searchSpec}&district=${searchLocation}`);
            }, 1000);
        }
    };

    const quickSearch = (spec) => {
        setSearchSpec(spec);
        displayToast('🔍 Showing ' + spec + 's near you...');
        setTimeout(() => {
            navigate(`/find-doctors?specialization=${spec}`);
        }, 1000);
    };

    const sendAI = () => {
        const text = symptomInput.trim();
        if (!text) return;
        setChatMessages(prev => [...prev, { text, type: 'user' }]);
        setSymptomInput('');

        setTimeout(() => {
            const lower = text.toLowerCase();
            let reply = REPLIES.default;
            if (lower.includes('chest') || lower.includes('breath') || lower.includes('heart')) reply = REPLIES.chest;
            else if (lower.includes('fever') || lower.includes('child') || lower.includes('baby')) reply = REPLIES.fever;
            else if (lower.includes('knee') || lower.includes('joint') || lower.includes('bone')) reply = REPLIES.knee;
            else if (lower.includes('skin') || lower.includes('rash') || lower.includes('itch')) reply = REPLIES.skin;
            
            setChatMessages(prev => [...prev, { text: reply.msg, type: 'ai' }]);
        }, 900);
    };

    const quickMsg = (text) => {
        setSymptomInput(text);
        // Delay sending slightly so state updates
        setTimeout(() => {
            const btn = document.getElementById('ai-send-btn');
            if(btn) btn.click();
        }, 50);
    };

    const openBooking = (name, spec) => {
        setModalData({ name, spec });
        setIsModalOpen(true);
    };

    const confirmBooking = () => {
        setIsModalOpen(false);
        displayToast('✅ Appointment confirmed! Check your upcoming appointments.');
    };

    return (
        <div className="home-page">
            {/* TOAST */}
            <div className={`toast ${showToast ? 'show' : ''}`} id="toast">
                <span className="toast-icon">✅</span>
                <span id="toast-text">{toastMsg}</span>
            </div>

            {/* BOOKING MODAL */}
            <div className={`booking-modal-wrap ${isModalOpen ? 'active' : ''}`} onClick={(e) => e.target.className.includes('booking-modal-wrap') && setIsModalOpen(false)}>
                <div className="booking-modal">
                    <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕ Close</button>
                    <div className="modal-title">Book with {modalData.name}</div>
                    <div className="modal-sub">{modalData.spec} - Select your preferred visit type and time slot</div>
                    
                    <div className="modal-step">Visit type</div>
                    <div className="visit-options">
                        {['In-clinic', 'Video call', 'Home visit'].map(type => (
                            <div 
                                key={type}
                                className={`visit-opt ${selectedVisit === type ? 'selected' : ''}`} 
                                onClick={() => setSelectedVisit(type)}
                            >
                                <span className="visit-opt-icon">{type === 'In-clinic' ? '🏥' : type === 'Video call' ? '📹' : '🏠'}</span>
                                {type}
                            </div>
                        ))}
                    </div>
                    
                    <div className="modal-step">
                        Available slots <span style={{background:'#EDE9FE', color:'#7C3AED', fontSize:'10px', padding:'2px 8px', borderRadius:'10px', marginLeft:'4px'}}>purple = AI suggested</span>
                    </div>
                    <div className="slot-grid">
                        <button className="slot booked">9:00 AM</button>
                        <button className={`slot ai-rec ${selectedSlot === '9:30 AM' ? 'selected' : ''}`} onClick={() => setSelectedSlot('9:30 AM')}>9:30 AM</button>
                        <button className={`slot ${selectedSlot === '10:00 AM' ? 'selected' : ''}`} onClick={() => setSelectedSlot('10:00 AM')}>10:00 AM</button>
                        <button className="slot booked">10:30 AM</button>
                        <button className={`slot ${selectedSlot === '11:00 AM' ? 'selected' : ''}`} onClick={() => setSelectedSlot('11:00 AM')}>11:00 AM</button>
                        <button className={`slot ${selectedSlot === '11:30 AM' ? 'selected' : ''}`} onClick={() => setSelectedSlot('11:30 AM')}>11:30 AM</button>
                        <button className="slot booked">2:00 PM</button>
                        <button className={`slot ${selectedSlot === '3:00 PM' ? 'selected' : ''}`} onClick={() => setSelectedSlot('3:00 PM')}>3:00 PM</button>
                    </div>
                    <button className="modal-confirm" onClick={confirmBooking}>Confirm Appointment</button>
                </div>
            </div>

            {/* NAVBAR */}
            <nav>
                <div className="nav-brand">Bihar Healthcare</div>
                <div className="nav-links">
                    <button className="nav-link active" onClick={() => navigate('/find-doctors')}>Find Doctors</button>
                    <button className="nav-link" onClick={() => navigate('/video-consult')}>Video Consult</button>
                    <button className="nav-link" onClick={() => navigate('/lab-tests')}>Lab Tests</button>
                    <button className="nav-link" onClick={() => navigate('/surgeries')}>Surgeries</button>
                    <button className="nav-link">For Corporates <span className="new-badge">NEW</span></button>
                    <button className="nav-link">For Providers</button>
                    <button className="nav-link" onClick={() => navigate('/about')}>Security & Help</button>
                </div>
                <div className="nav-right">
                    <div className="notif-btn" onClick={() => displayToast('🔔 You have 3 new notifications')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <div className="notif-dot"></div>
                    </div>
                    <div className="user-btn" onClick={() => navigate('/patient-dashboard')}>
                        <div className="user-avatar">U</div>
                        Hello, User ▾
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <div className="hero">
                <div className="hero-left">
                    <div className="hero-eyebrow">
                        <div className="hero-eyebrow-dot"></div> AI-Powered Healthcare Platform
                    </div>
                    <h1>Your Health,<br /><span>Our Priority</span></h1>
                    <p className="hero-sub">Book appointments with top-rated doctors in your city. Secure, fast, and convenient healthcare at your fingertips.</p>
                    
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Specialization (e.g. Cardiologist)" 
                            value={searchSpec}
                            onChange={(e) => setSearchSpec(e.target.value)}
                        />
                        <div className="search-divider"></div>
                        <input 
                            type="text" 
                            placeholder="Location (e.g. Patna, Bihar)" 
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                        <button className="search-btn" onClick={doSearch}>Search</button>
                    </div>
                    
                    <div className="hero-tags">
                        <div className="hero-tag" onClick={() => quickSearch('Cardiologist')}>❤️ Cardiologist</div>
                        <div className="hero-tag" onClick={() => quickSearch('Neurologist')}>🧠 Neurologist</div>
                        <div className="hero-tag" onClick={() => quickSearch('Dermatologist')}>🩺 Dermatologist</div>
                        <div className="hero-tag" onClick={() => quickSearch('Pediatrician')}>👶 Pediatrician</div>
                    </div>
                </div>
                <div className="hero-right">
                    <div className="ai-card">🤖 AI Assistant Active</div>
                    <div className="hero-img-wrap">
                        <div className="hero-img-placeholder">
                            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" /></svg>
                        </div>
                    </div>
                    <div className="rating-card">
                        <span className="rating-star">⭐</span>
                        <div>
                            <div className="rating-num">4.9/5</div>
                            <div className="rating-label">Patient Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS ROW */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#DBEAFE' }}>🩺</div>
                    <div>
                        <div className="stat-num">{stats ? stats.totalDoctors : '1,200'}+</div>
                        <div className="stat-label">Verified Doctors</div>
                        <div className="stat-growth">↑ 12% this month</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#D1FAE5' }}>📅</div>
                    <div>
                        <div className="stat-num">48,000+</div>
                        <div className="stat-label">Appointments Booked</div>
                        <div className="stat-growth">↑ 8% this week</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#EDE9FE' }}>🤖</div>
                    <div>
                        <div className="stat-num">95%</div>
                        <div className="stat-label">AI Match Accuracy</div>
                        <div className="stat-growth">Powered by Claude AI</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#FEF3C7' }}>⭐</div>
                    <div>
                        <div className="stat-num">4.9/5</div>
                        <div className="stat-label">Patient Satisfaction</div>
                        <div className="stat-growth">Based on 12K reviews</div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content-area">
                <div>
                    {/* AI ASSISTANT */}
                    <div className="ai-panel">
                        <div className="ai-panel-header">
                            <div className="ai-icon">🤖</div>
                            <div>
                                <div className="ai-header-title">AI Health Assistant</div>
                                <div className="ai-header-sub">Describe your symptoms — I'll find the right doctor</div>
                            </div>
                            <div className="ai-badge-live">LIVE AI</div>
                        </div>
                        <div className="ai-chat" ref={chatRef}>
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={msg.type === 'ai' ? 'ai-msg' : 'user-msg'}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        <div className="suggestion-row">
                            <div className="sug-pill" onClick={() => quickMsg('I have chest pain and breathlessness')}>Chest pain</div>
                            <div className="sug-pill" onClick={() => quickMsg('My child has high fever since 2 days')}>Child fever</div>
                            <div className="sug-pill" onClick={() => quickMsg('I have severe knee pain and swelling')}>Knee pain</div>
                            <div className="sug-pill" onClick={() => quickMsg('I have skin rash and itching')}>Skin rash</div>
                        </div>
                        <div className="ai-input-area">
                            <input 
                                type="text" 
                                placeholder="Type your symptoms here..." 
                                value={symptomInput}
                                onChange={(e) => setSymptomInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendAI()}
                            />
                            <button id="ai-send-btn" className="ai-send" onClick={sendAI}>Ask AI →</button>
                        </div>
                    </div>

                    {/* IMPROVE BANNER */}
                    <div className="improve-banner">
                        <div className="improve-icon">✨</div>
                        <div>
                            <div className="improve-title">New: AI Pre-appointment Prep</div>
                            <div className="improve-sub">Let AI prepare you before your visit — what to carry, what to ask, what to expect from your doctor.</div>
                        </div>
                        <button className="improve-btn" onClick={() => displayToast('✨ AI Prep feature launched!')}>Try Now</button>
                    </div>

                    {/* SPECIALTIES */}
                    <div className="section-title">Browse by specialty <span className="see-all" onClick={() => navigate('/departments')}>See all →</span></div>
                    <div className="specialty-grid">
                        <div className="spec-card" onClick={() => openBooking('General Physician', 'General Physician')}>
                            <div className="spec-emoji">🏥</div>
                            <div className="spec-name">General Physician</div>
                            <div className="spec-count">340 doctors</div>
                        </div>
                        <div className="spec-card ai-rec" onClick={() => openBooking('Cardiologist', 'Cardiologist')}>
                            <div className="spec-emoji">❤️</div>
                            <div className="spec-name">Cardiologist</div>
                            <div className="spec-count">82 doctors</div>
                            <div className="spec-ai-tag">AI Recommended</div>
                        </div>
                        <div className="spec-card" onClick={() => openBooking('Neurologist', 'Neurologist')}>
                            <div className="spec-emoji">🧠</div>
                            <div className="spec-name">Neurologist</div>
                            <div className="spec-count">54 doctors</div>
                        </div>
                        <div className="spec-card" onClick={() => openBooking('Dermatologist', 'Dermatologist')}>
                            <div className="spec-emoji">🩹</div>
                            <div className="spec-name">Dermatologist</div>
                            <div className="spec-count">97 doctors</div>
                        </div>
                        <div className="spec-card" onClick={() => openBooking('Orthopedic', 'Orthopedic')}>
                            <div className="spec-emoji">🦴</div>
                            <div className="spec-name">Orthopedic</div>
                            <div className="spec-count">63 doctors</div>
                        </div>
                        <div className="spec-card" onClick={() => openBooking('Pediatrician', 'Pediatrician')}>
                            <div className="spec-emoji">👶</div>
                            <div className="spec-name">Pediatrician</div>
                            <div className="spec-count">78 doctors</div>
                        </div>
                        <div className="spec-card" onClick={() => openBooking('Psychiatrist', 'Psychiatrist')}>
                            <div className="spec-emoji">💭</div>
                            <div className="spec-name">Psychiatrist</div>
                            <div className="spec-count">41 doctors</div>
                        </div>
                        <div className="spec-card" onClick={() => openBooking('Ophthalmologist', 'Ophthalmologist')}>
                            <div className="spec-emoji">👁️</div>
                            <div className="spec-name">Ophthalmologist</div>
                            <div className="spec-count">55 doctors</div>
                        </div>
                    </div>

                    {/* TOP DOCTORS */}
                    <div className="section-title">Top-rated doctors near you <span className="see-all" onClick={() => navigate('/find-doctors')}>See all →</span></div>
                    <div className="doctors-grid">
                        {topDoctors && topDoctors.length > 0 ? (
                            topDoctors.map((doc, idx) => (
                                <div className="doc-card" key={idx}>
                                    <div className="doc-top">
                                        <div className="doc-avatar" style={{ backgroundImage: `url(${doc.image || ''})`, backgroundColor: '#DBEAFE', color: '#1E3A8A' }}>
                                            {!doc.image && doc.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="doc-name">{doc.name}</div>
                                            <div className="doc-spec">{doc.specialization}</div>
                                            <div className="doc-loc">📍 {doc.district || 'Patna'}, {doc.state || 'Bihar'}</div>
                                            <div className="doc-stars">★★★★★ {doc.rating || '4.9'} · {Math.floor(Math.random() * 500 + 100)} reviews</div>
                                        </div>
                                    </div>
                                    <div className="doc-stats">
                                        <div className="doc-stat"><span className="doc-stat-num">{doc.experience || 10}yr</span>Experience</div>
                                        <div className="doc-stat"><span className="doc-stat-num">{(Math.random() * 2 + 1).toFixed(1)}k+</span>Patients</div>
                                        <div className="doc-stat"><span className="doc-stat-num">Today</span>Available</div>
                                    </div>
                                    <button className="book-btn" onClick={() => navigate(`/appointment/${doc._id}`, {
                                        state: { doctorName: doc.name, department: doc.specialization, doctorId: doc._id, doctorPhone: doc.phone }
                                    })}>Book Appointment</button>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="doc-card">
                                    <div className="doc-top">
                                        <div className="doc-avatar" style={{ background: '#DBEAFE', color: '#1E3A8A' }}>PS</div>
                                        <div>
                                            <div className="doc-name">Dr. Priya Sharma</div>
                                            <div className="doc-spec">Cardiologist</div>
                                            <div className="doc-loc">📍 Apollo Hospital, Patna</div>
                                            <div className="doc-stars">★★★★★ 4.9 · 320 reviews</div>
                                        </div>
                                    </div>
                                    <div className="doc-stats">
                                        <div className="doc-stat"><span className="doc-stat-num">12yr</span>Experience</div>
                                        <div className="doc-stat"><span className="doc-stat-num">2,100+</span>Patients</div>
                                        <div className="doc-stat"><span className="doc-stat-num">Today</span>Available</div>
                                    </div>
                                    <button className="book-btn" onClick={() => openBooking('Dr. Priya Sharma', 'Cardiologist · Apollo Hospital')}>Book Appointment</button>
                                </div>
                                <div className="doc-card">
                                    <div className="doc-top">
                                        <div className="doc-avatar" style={{ background: '#D1FAE5', color: '#065F46' }}>RV</div>
                                        <div>
                                            <div className="doc-name">Dr. Rahul Verma</div>
                                            <div className="doc-spec">Dermatologist</div>
                                            <div className="doc-loc">📍 AIIMS, Patna</div>
                                            <div className="doc-stars">★★★★★ 4.8 · 215 reviews</div>
                                        </div>
                                    </div>
                                    <div className="doc-stats">
                                        <div className="doc-stat"><span className="doc-stat-num">8yr</span>Experience</div>
                                        <div className="doc-stat"><span className="doc-stat-num">1,500+</span>Patients</div>
                                        <div className="doc-stat"><span className="doc-stat-num">Tomorrow</span>Available</div>
                                    </div>
                                    <button className="book-btn" onClick={() => openBooking('Dr. Rahul Verma', 'Dermatologist · AIIMS Patna')}>Book Appointment</button>
                                </div>
                                <div className="doc-card">
                                    <div className="doc-top">
                                        <div className="doc-avatar" style={{ background: '#EDE9FE', color: '#5B21B6' }}>MI</div>
                                        <div>
                                            <div className="doc-name">Dr. Meena Iyer</div>
                                            <div className="doc-spec">Neurologist</div>
                                            <div className="doc-loc">📍 Patna Medical College</div>
                                            <div className="doc-stars">★★★★★ 5.0 · 489 reviews</div>
                                        </div>
                                    </div>
                                    <div className="doc-stats">
                                        <div className="doc-stat"><span className="doc-stat-num">15yr</span>Experience</div>
                                        <div className="doc-stat"><span className="doc-stat-num">3,200+</span>Patients</div>
                                        <div className="doc-stat"><span className="doc-stat-num">Today</span>Available</div>
                                    </div>
                                    <button className="book-btn" onClick={() => openBooking('Dr. Meena Iyer', 'Neurologist · Patna Medical College')}>Book Appointment</button>
                                </div>
                                <div className="doc-card">
                                    <div className="doc-top">
                                        <div className="doc-avatar" style={{ background: '#FEF3C7', color: '#92400E' }}>AR</div>
                                        <div>
                                            <div className="doc-name">Dr. Ananya Roy</div>
                                            <div className="doc-spec">Pediatrician</div>
                                            <div className="doc-loc">📍 Ruban Memorial, Patna</div>
                                            <div className="doc-stars">★★★★★ 4.9 · 307 reviews</div>
                                        </div>
                                    </div>
                                    <div className="doc-stats">
                                        <div className="doc-stat"><span className="doc-stat-num">11yr</span>Experience</div>
                                        <div className="doc-stat"><span className="doc-stat-num">1,800+</span>Patients</div>
                                        <div className="doc-stat"><span className="doc-stat-num">Today</span>Available</div>
                                    </div>
                                    <button className="book-btn" onClick={() => openBooking('Dr. Ananya Roy', 'Pediatrician · Ruban Memorial')}>Book Appointment</button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* FEATURE CARDS */}
                    <div className="section-title">Why patients love Bihar Healthcare</div>
                    <div className="features-strip">
                        <div className="feat-card">
                            <div className="feat-icon-wrap" style={{ background: '#EDE9FE' }}>🤖</div>
                            <div className="feat-title">AI Symptom Checker</div>
                            <div className="feat-desc">Describe symptoms in plain Hindi or English — our AI identifies the right specialist instantly.</div>
                            <span className="feat-badge" style={{ background: '#EDE9FE', color: '#5B21B6' }}>Powered by Claude AI</span>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon-wrap" style={{ background: '#DBEAFE' }}>📹</div>
                            <div className="feat-title">3 Visit Modes</div>
                            <div className="feat-desc">In-clinic, Video Call, or Home Visit — choose what works for you, all in one booking flow.</div>
                            <span className="feat-badge" style={{ background: '#DBEAFE', color: '#1E3A8A' }}>Flexible</span>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon-wrap" style={{ background: '#D1FAE5' }}>📋</div>
                            <div className="feat-title">AI Visit Summary</div>
                            <div className="feat-desc">After your appointment, AI generates a structured summary — prescriptions, advice, follow-ups.</div>
                            <span className="feat-badge" style={{ background: '#D1FAE5', color: '#065F46' }}>Auto-generated</span>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="sidebar">
                    {/* Health Score */}
                    <div className="health-score">
                        <div className="hs-title">Your AI Health Score</div>
                        <div className="hs-score">76</div>
                        <div className="hs-label">Good — last updated today</div>
                        <div className="hs-bar-wrap"><div className="hs-bar"></div></div>
                        <div className="hs-factors">
                            <div className="hs-factor">
                                <div className="hs-factor-label">Activity</div>
                                <div className="hs-factor-mini"><div className="hs-factor-fill" style={{ width: '80%', background: '#4ADE80' }}></div></div>
                                <div className="hs-factor-val">80%</div>
                            </div>
                            <div className="hs-factor">
                                <div className="hs-factor-label">Sleep</div>
                                <div className="hs-factor-mini"><div className="hs-factor-fill" style={{ width: '65%', background: '#FBBF24' }}></div></div>
                                <div className="hs-factor-val">65%</div>
                            </div>
                            <div className="hs-factor">
                                <div className="hs-factor-label">Check-ups</div>
                                <div className="hs-factor-mini"><div className="hs-factor-fill" style={{ width: '70%', background: '#60A5FA' }}></div></div>
                                <div className="hs-factor-val">70%</div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="sidebar-card">
                        <div className="sidebar-card-title">Upcoming appointments</div>
                        <div className="appt-item">
                            <div className="appt-date-box"><div className="appt-day">MON</div><div className="appt-num">5</div></div>
                            <div>
                                <div className="appt-doc">Dr. Priya Sharma</div>
                                <div className="appt-type">Cardiologist · 10:30 AM · In-clinic</div>
                                <span className="appt-status status-confirmed">Confirmed</span>
                            </div>
                        </div>
                        <div className="appt-item">
                            <div className="appt-date-box"><div className="appt-day">WED</div><div className="appt-num">7</div></div>
                            <div>
                                <div className="appt-doc">Dr. Rahul Verma</div>
                                <div className="appt-type">Dermatologist · 3:00 PM · Video Call</div>
                                <span className="appt-status status-pending">Pending</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="sidebar-card">
                        <div className="sidebar-card-title">Quick actions</div>
                        <div className="quick-actions">
                            <div className="quick-btn" onClick={() => { displayToast('🧪 Lab test booking opening...'); setTimeout(() => navigate('/lab-tests'), 1000); }}>
                                <div className="quick-btn-icon">🧪</div>
                                <div className="quick-btn-label">Book Lab Test</div>
                            </div>
                            <div className="quick-btn" onClick={() => { displayToast('📹 Video consult starting...'); setTimeout(() => navigate('/video-consult'), 1000); }}>
                                <div className="quick-btn-icon">📹</div>
                                <div className="quick-btn-label">Video Consult</div>
                            </div>
                            <div className="quick-btn" onClick={() => displayToast('💊 Prescription records opening...')}>
                                <div className="quick-btn-icon">💊</div>
                                <div className="quick-btn-label">Prescriptions</div>
                            </div>
                            <div className="quick-btn" onClick={() => displayToast('📁 Medical records opening...')}>
                                <div className="quick-btn-icon">📁</div>
                                <div className="quick-btn-label">My Records</div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="sidebar-card">
                        <div className="sidebar-card-title">Recent notifications</div>
                        <div className="notif-item">
                            <div className="notif-dot2" style={{ background: '#2563EB' }}></div>
                            <div>
                                <div className="notif-text">Your appointment with Dr. Priya Sharma is confirmed for Monday 10:30 AM.</div>
                                <div className="notif-time">2 hours ago</div>
                            </div>
                        </div>
                        <div className="notif-item">
                            <div className="notif-dot2" style={{ background: '#8B5CF6' }}></div>
                            <div>
                                <div className="notif-text">AI generated your visit summary from last week's dermatology appointment.</div>
                                <div className="notif-time">1 day ago</div>
                            </div>
                        </div>
                        <div className="notif-item">
                            <div className="notif-dot2" style={{ background: '#10B981' }}></div>
                            <div>
                                <div className="notif-text">Lab test results from AIIMS Patna are now available.</div>
                                <div className="notif-time">2 days ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PLATFORM CAPABILITIES ROADMAP */}
            <FeaturesRoadmap />

            {/* FOOTER */}
            <div className="footer-strip">
                <div>
                    <div className="footer-brand">Bihar Healthcare</div>
                    <div className="footer-sub">© 2026 · AI-Powered · Built for Bihar</div>
                </div>
                <div className="footer-links">
                    <div className="footer-link" onClick={() => navigate('/about')}>Privacy Policy</div>
                    <div className="footer-link" onClick={() => navigate('/about')}>Terms of Use</div>
                    <div className="footer-link" onClick={() => navigate('/about')}>Contact Support</div>
                    <div className="footer-link">For Doctors</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
