import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/MyAppointments.css';
import Footer from './Footer';

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
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

        const response = await axios.get('http://localhost:5000/api/appointments/patient-dashboard', config);
        // The new endpoint returns { upcoming, history }
        setAppointments(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  const { upcoming, history } = appointments;

  const renderAppointmentCard = (appt) => (
    <div key={appt._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{appt.doctorName}</h3>
          <p className="text-sm text-indigo-600 font-medium">{appt.department}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
          ${appt.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
            appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
              appt.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                'bg-rose-100 text-rose-700'}`}>
          {appt.status === 'accepted' ? 'Accepted' : appt.status === 'cancelled' ? 'Rejected' : appt.status}
        </span>
      </div>
      <div className="mb-4">
        {appt.status === 'accepted' && (
          <p className="text-xs text-emerald-600 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            This appointment has been accepted by Dr. {appt.doctorName}
          </p>
        )}
        {appt.status === 'cancelled' && (
          <p className="text-xs text-rose-600 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            This appointment was rejected by Dr. {appt.doctorName}
          </p>
        )}
      </div>
      <div className="space-y-2 text-slate-600 text-sm">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {appt.date}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {appt.timeSlot}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Patient Dashboard</h1>
          <p className="mt-2 text-slate-600 text-lg">Track your health appointments and medical history.</p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        <div className="space-y-12">
          {/* Upcoming Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
              Upcoming Appointments
            </h2>
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <p className="text-slate-500 mb-6 italic">No upcoming appointments found.</p>
                <button
                  onClick={() => navigate('/find-doctors')}
                  className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                >
                  Book New Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map(renderAppointmentCard)}
              </div>
            )}
          </section>

          {/* History Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="w-3 h-3 bg-slate-400 rounded-full mr-3"></span>
              Medical History
            </h2>
            {history.length === 0 ? (
              <p className="text-slate-400 italic px-4">No past records to show.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map(renderAppointmentCard)}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAppointments;