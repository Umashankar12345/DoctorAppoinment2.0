import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Departments.css';

const Departments = () => {
  const navigate = useNavigate();

  const departments = [
    { id: 1, name: 'Cardiology', icon: '❤️', description: 'Heart specialists' },
    { id: 2, name: 'Neurology', icon: '🧠', description: 'Brain and nervous system' },
    { id: 3, name: 'Pediatrics', icon: '👶', description: 'Child healthcare' },
    { id: 4, name: 'Orthopedics', icon: '🦴', description: 'Bone and joint care' },
    { id: 5, name: 'Dermatology', icon: '🧴', description: 'Skin specialists' },
    { id: 6, name: 'Dentistry', icon: '🦷', description: 'Dental care' },
    { id: 7, name: 'Ophthalmology', icon: '👁️', description: 'Eye specialists' },
    { id: 8, name: 'Gynecology', icon: '👩', description: "Women's health" },
  ];

  const handleDepartmentClick = (deptId, deptName) => {
    navigate(`/doctors/${deptId}`, { state: { departmentName: deptName } });
  };

  return (
    <div className="departments-page">
      <nav className="navbar">
        <h2>Doctor Appointment System</h2>
        <div className="nav-links">
          <button onClick={() => navigate('/home')}>Home</button>
          <button onClick={() => navigate('/my-appointments')}>My Appointments</button>
          <button onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>Logout</button>
        </div>
      </nav>

      <div className="departments-container">
        <h1>Choose a Department</h1>
        <div className="departments-grid">
          {departments.map(dept => (
            <div 
              key={dept.id} 
              className="department-card"
              onClick={() => handleDepartmentClick(dept.id, dept.name)}
            >
              <div className="dept-icon">{dept.icon}</div>
              <h3>{dept.name}</h3>
              <p>{dept.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Departments;