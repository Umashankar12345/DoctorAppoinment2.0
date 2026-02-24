import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../styles/Doctors.css';
import Footer from './Footer';

const Doctors = () => {
  const { deptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const departmentName = location.state?.departmentName || 'Department';

  // Mock doctors data (replace with API call)
  const doctors = [
    { id: 1, name: 'Dr. Smith', experience: '15 years', patients: 1200, available: true },
    { id: 2, name: 'Dr. Johnson', experience: '10 years', patients: 800, available: true },
    { id: 3, name: 'Dr. Williams', experience: '20 years', patients: 2000, available: false },
    { id: 4, name: 'Dr. Brown', experience: '8 years', patients: 600, available: true },
  ];

  return (
    <div className="doctors-page">
      <nav className="navbar">
        <h2>Doctor Appointment System</h2>
        <button onClick={() => navigate('/departments')}>Back to Departments</button>
      </nav>

      <div className="doctors-container">
        <h1>{departmentName} Specialists</h1>

        <div className="doctors-list">
          {doctors.map(doc => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-info">
                <h3>{doc.name}</h3>
                <p>Experience: {doc.experience}</p>
                <p>Patients: {doc.patients}+</p>
                <span className={doc.available ? 'available' : 'unavailable'}>
                  {doc.available ? 'Available Today' : 'Not Available'}
                </span>
              </div>
              <button
                className="book-btn"
                disabled={!doc.available}
                onClick={() => navigate(`/appointment/${doc.id}`, {
                  state: { doctorName: doc.name, department: departmentName }
                })}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Doctors;