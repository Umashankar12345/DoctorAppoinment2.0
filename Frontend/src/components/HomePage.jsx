import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Doctor Appointment System</h2>
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="welcome-text">Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-nav">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Book Appointments with Top Doctors</h1>
          <p>Find the best doctors in your area and book appointments instantly</p>
          {!user && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Top Doctors</h3>
            <p>Access to experienced and verified doctors across all specialties</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Book appointments 24/7 with just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Save Time</h3>
            <p>No more waiting in long queues for appointments</p>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <h2>Our Departments</h2>
        <div className="departments-grid">
          <div className="department-card">Cardiology</div>
          <div className="department-card">Neurology</div>
          <div className="department-card">Pediatrics</div>
          <div className="department-card">Orthopedics</div>
          <div className="department-card">Dermatology</div>
          <div className="department-card">Dentistry</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Doctor Appointment System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;