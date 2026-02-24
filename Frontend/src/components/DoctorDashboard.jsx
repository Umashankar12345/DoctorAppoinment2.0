import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { Calendar, Clock, User, Activity, Mail, Phone } from 'lucide-react';

function DoctorDashboard() {
    const [dashboardData, setDashboardData] = useState({
        schedule: [],
        pending: [],
        allAppointments: [],
        stats: {
            total: 0,
            pending: 0,
            confirmed: 0,
            completed: 0
        },
        doctor: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorDashboard();
    }, []);

    const fetchDoctorDashboard = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user || user.role !== 'doctor') {
                navigate('/login');
                return;
            }

            console.log('Fetching doctor dashboard...');

            const response = await axios.get('http://localhost:5000/api/doctors/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Doctor Dashboard API Response:', response.data);

            if (response.data) {
                setDashboardData({
                    schedule: response.data.schedule || [],
                    pending: response.data.pending || [],
                    allAppointments: response.data.allAppointments || [],
                    stats: response.data.stats || {
                        total: 0,
                        pending: 0,
                        confirmed: 0,
                        completed: 0
                    },
                    doctor: response.data.doctor || {}
                });
            }

        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError('Failed to load dashboard. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.put(`http://localhost:5000/api/appointments/status-update/${id}`, { status }, config);
            fetchDoctorDashboard();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-lg animate-pulse">Loading dashboard...</div>
        </div>
    );

    if (error) return (
        <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        </div>
    );

    const { schedule, pending, allAppointments, stats, doctor } = dashboardData;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Doctor Dashboard</h1>
                    <p className="mt-2 text-slate-600 text-lg">Manage your daily schedule and appointment requests.</p>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Patients</p>
                            <User className="text-blue-500 w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</p>
                        <p className="text-xs text-slate-400 mt-1">Everyone linked to you</p>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Pending Approval</p>
                            <Clock className="text-amber-500 w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold text-amber-700 mt-2">{stats.pending}</p>
                        <p className="text-xs text-amber-600/60 mt-1">Waiting for action</p>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">Confirmed</p>
                            <Activity className="text-emerald-500 w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold text-emerald-700 mt-2">{stats.confirmed}</p>
                        <p className="text-xs text-emerald-600/60 mt-1">Ready for consultation</p>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider">Department</p>
                            <Calendar className="text-indigo-500 w-5 h-5" />
                        </div>
                        <p className="text-xl font-bold text-indigo-700 mt-2 truncate">
                            {doctor.specialization || 'General'}
                        </p>
                        <p className="text-xs text-indigo-600/60 mt-1">Your specialization</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Daily Schedule */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                    <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
                                    Today's Schedule
                                </h2>
                            </div>
                            <div className="p-0">
                                {schedule.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-slate-400">
                                        <p className="text-lg">No accepted appointments for today.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {schedule.map((appt) => (
                                            <div key={appt._id} className="px-6 py-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                        {appt.patientName?.[0] || 'P'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800">{appt.patientName}</h3>
                                                        <div className="flex items-center text-slate-500 text-sm mt-1">
                                                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded mr-3 font-medium">
                                                                {appt.timeSlot}
                                                            </span>
                                                            {appt.patientId?.age && <span className="mr-3 font-medium">Age: {appt.patientId.age}</span>}
                                                            {appt.patientId?.phone && <span className="font-medium">📞 {appt.patientId.phone}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, 'completed')}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                                                >
                                                    Mark Completed
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* All Appointments Table */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                    <span className="w-2 h-6 bg-slate-400 rounded-full mr-3"></span>
                                    All Patient Appointments
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Patient</th>
                                            <th className="px-6 py-4">Date & Time</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {allAppointments.map((appt) => (
                                            <tr key={appt._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-800">{appt.patientName}</div>
                                                    <div className="text-xs text-slate-500">{appt.department}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-700">{appt.date}</div>
                                                    <div className="text-xs text-indigo-600">{appt.timeSlot}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter
                                                        ${appt.status === 'accepted' || appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                            appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                appt.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                                                                    'bg-rose-100 text-rose-700'}`}>
                                                        {appt.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {allAppointments.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-10 text-center text-slate-400">
                                                    <div className="flex flex-col items-center">
                                                        <Calendar className="w-12 h-12 mb-2 opacity-20" />
                                                        <p>No appointments found in history.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Pending Requests */}
                    <div className="space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-amber-50/30">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                    <span className="w-2 h-6 bg-amber-400 rounded-full mr-3"></span>
                                    Pending Box
                                    <span className="ml-3 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                                        {pending.length}
                                    </span>
                                </h2>
                            </div>
                            <div className="p-0">
                                {pending.length === 0 ? (
                                    <div className="px-6 py-10 text-center text-slate-400 italic">
                                        No new requests.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {pending.map((appt) => (
                                            <div key={appt._id} className="p-5 hover:bg-slate-50 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">{appt.patientName}</h3>
                                                        <p className="text-sm text-slate-500 mt-1">{appt.date} • {appt.timeSlot}</p>
                                                        <div className="flex items-center space-x-3 mt-1 text-xs text-slate-500">
                                                            {appt.patientId?.age && <span>Age: {appt.patientId.age}</span>}
                                                            {appt.patientId?.phone && <span>📞 {appt.patientId.phone}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 mt-4">
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt._id, 'accepted')}
                                                        className="w-full py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-bold transition-colors border border-emerald-100"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                                                        className="w-full py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-sm font-bold transition-colors border border-rose-100"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Debug Info Section */}
                        <section className="bg-slate-800 text-slate-300 rounded-2xl p-6 shadow-inner">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Debug Console</h3>
                            <div className="space-y-2 text-[10px] font-mono">
                                <div className="flex justify-between">
                                    <span>API Status:</span>
                                    <span className="text-emerald-400">Connected</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Appointments Hooked:</span>
                                    <span>{dashboardData.allAppointments.length}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <p className="text-slate-500 mb-1">Raw Response:</p>
                                    <div className="bg-slate-900 p-2 rounded max-h-32 overflow-auto">
                                        {JSON.stringify(stats, null, 2)}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;
