import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import GetStarted from './components/GetStarted';
import Departments from './components/Departments';
import Doctors from './components/Doctors';
import Appointments from './components/Appointment';
import MyAppointments from './components/MyAppointments';
import DoctorDashboard from './components/DoctorDashboard';
import FindDoctors from './components/FindDoctors';
import About from './components/About';
import Footer from './components/Footer';
import VideoConsult from './components/VideoConsult';
import LabTests from './components/LabTests';
import Surgeries from './components/Surgeries';
import './App.css';


function App() {
  const handleLogin = (user, token) => {
    console.log('User logged in:', user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleRegister = (user, token) => {
    console.log('User registered:', user);
    if (user && token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/register" element={<Register onLogin={handleRegister} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/doctors/:deptId" element={<Doctors />} />
            <Route path="/appointments/:deptId" element={<Appointments />} />
            <Route path="/appointment/:id" element={<Appointments />} />
            <Route path="/patient-dashboard" element={<MyAppointments />} />
            <Route path="/myAppointments" element={<MyAppointments />} />
            <Route path="/find-doctors" element={<FindDoctors />} />
            <Route path="/video-consult" element={<VideoConsult />} />
            <Route path="/lab-tests" element={<LabTests />} />
            <Route path="/surgeries" element={<Surgeries />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
