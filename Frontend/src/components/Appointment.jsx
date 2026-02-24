import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/Appointment.css';
import Footer from './Footer';

const Appointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctorName, department, doctorId, doctorPhone } = location.state || {}; // Ensure these are passed from previous screen

  const [appointmentData, setAppointmentData] = useState({
    date: '',
    timeSlot: '', // Changed to match backend schema
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If no doctor/dept passed, redirect or handle error (simplified here)
  if (!doctorName || !department) {
    // return <div>Error: No doctor selected. Please go back.</div>;
    // For testing without navigation flow, you might want inputs. 
    // But assuming flow is strictly from Doctors page.
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const newAppointment = {
        department,
        doctorName,
        doctorId, // Changed from doctor to doctorId
        doctorPhone: doctorPhone,
        date: appointmentData.date,
        timeSlot: appointmentData.timeSlot,
      };

      await axios.post('http://localhost:5000/api/appointments', newAppointment, config);

      setSuccess(true);
      setTimeout(() => {
        navigate('/myAppointments');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      console.error(err);
    }
  };

  return (
    <div className="appointment-page">
      <Navbar />
      <div className="appointment-container">
        <div className="doctor-summary">
          <h3>Booking with: {doctorName}</h3>
          <p>Department: {department}</p>
        </div>

        {success && (
          <div className="success-message">
            Appointment booked successfully! Redirecting...
          </div>
        )}
        {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              value={appointmentData.date}
              onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Preferred Time</label>
            <select
              value={appointmentData.timeSlot}
              onChange={(e) => setAppointmentData({ ...appointmentData, timeSlot: e.target.value })}
              required
            >
              <option value="">Select time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={success}>Confirm Appointment</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Appointment;