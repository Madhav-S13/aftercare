import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Activity, Users, UserPlus, Shield, BarChart3, LogOut, Menu, X } from 'lucide-react';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, doctorsRes, patientsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/doctors'),
                api.get('/admin/patients')
            ]);

            setStats(statsRes.data.stats);
            setDoctors(doctorsRes.data.data);
            setPatients(patientsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-8 h-8 text-primary-500" />
                            <span className="text-xl font-bold gradient-text">AfterCare</span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <button onClick={() => { setActiveTab('stats'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'stats' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                            <BarChart3 /> <span>Statistics</span>
                        </button>
                        <button onClick={() => { setActiveTab('doctors'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'doctors' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                            <Users /> <span>Doctors</span>
                        </button>
                        <button onClick={() => { setActiveTab('patients'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'patients' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                            <Users /> <span>Patients</span>
                        </button>
                        <button onClick={() => { setActiveTab('assign'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'assign' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                            <UserPlus /> <span>Assign Doctor</span>
                        </button>
                    </nav>

                    <button onClick={() => { logout(); navigate('/login'); }} className="mt-8 w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <LogOut /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">System Management & Analytics</p>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    {/* Statistics */}
                    {activeTab === 'stats' && stats && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">System Statistics</h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-xl shadow-card">
                                    <Users className="w-8 h-8 mb-3 opacity-80" />
                                    <div className="text-3xl font-bold">{stats.users.total}</div>
                                    <div className="text-sm opacity-90">Total Users</div>
                                </div>

                                <div className="bg-gradient-to-br from-success-500 to-success-600 text-white p-6 rounded-xl shadow-card">
                                    <Activity className="w-8 h-8 mb-3 opacity-80" />
                                    <div className="text-3xl font-bold">{stats.users.patients}</div>
                                    <div className="text-sm opacity-90">Patients</div>
                                </div>

                                <div className="bg-gradient-to-br from-warning-500 to-warning-600 text-white p-6 rounded-xl shadow-card">
                                    <Shield className="w-8 h-8 mb-3 opacity-80" />
                                    <div className="text-3xl font-bold">{stats.users.doctors}</div>
                                    <div className="text-sm opacity-90">Doctors</div>
                                </div>

                                <div className="bg-gradient-to-br from-danger-500 to-danger-600 text-white p-6 rounded-xl shadow-card">
                                    <Activity className="w-8 h-8 mb-3 opacity-80" />
                                    <div className="text-3xl font-bold">{stats.alerts.critical}</div>
                                    <div className="text-sm opacity-90">Critical Alerts</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-card">
                                    <h3 className="font-semibold text-lg mb-4">Health Records</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Records:</span>
                                            <span className="font-semibold">{stats.healthRecords.total}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Last Week:</span>
                                            <span className="font-semibold">{stats.healthRecords.lastWeek}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-card">
                                    <h3 className="font-semibold text-lg mb-4">Alerts Overview</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Active Alerts:</span>
                                            <span className="font-semibold">{stats.alerts.active}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Alerts:</span>
                                            <span className="font-semibold">{stats.alerts.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Doctors List */}
                    {activeTab === 'doctors' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Doctors ({doctors.length})</h2>
                            <div className="bg-white rounded-xl shadow-card overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patients</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {doctors.map((doctor) => (
                                            <tr key={doctor._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{doctor.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{doctor.email}</td>
                                                <td className="px-6 py-4 text-sm">{doctor.specialization || 'General'}</td>
                                                <td className="px-6 py-4 text-sm">{doctor.assignedPatients?.length || 0}</td>
                                                <td className="px-6 py-4 text-xs text-gray-500 font-mono">{doctor._id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Patients List */}
                    {activeTab === 'patients' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Patients ({patients.length})</h2>
                            <div className="bg-white rounded-xl shadow-card overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Doctor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {patients.map((patient) => (
                                            <tr key={patient._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{patient.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{patient.email}</td>
                                                <td className="px-6 py-4 text-sm">{patient.phone}</td>
                                                <td className="px-6 py-4 text-sm">{patient.assignedDoctor?.name || 'Not assigned'}</td>
                                                <td className="px-6 py-4 text-xs text-gray-500 font-mono">{patient._id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Assign Doctor */}
                    {activeTab === 'assign' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Assign Doctor to Patient</h2>
                            <div className="bg-white p-8 rounded-xl shadow-card max-w-2xl">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const patientId = formData.get('patientId');
                                    const doctorId = formData.get('doctorId');

                                    if (!patientId || !doctorId) {
                                        alert('Please select both patient and doctor');
                                        return;
                                    }

                                    api.post('/admin/assign-doctor', { patientId, doctorId })
                                        .then(() => {
                                            alert('Doctor assigned successfully!');
                                            fetchData();
                                            e.target.reset();
                                        })
                                        .catch((error) => {
                                            alert('Error: ' + (error.response?.data?.message || error.message));
                                        });
                                }} className="space-y-6">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Patient *
                                        </label>
                                        <select
                                            name="patientId"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">Choose a patient...</option>
                                            {patients.map((patient) => (
                                                <option key={patient._id} value={patient._id}>
                                                    {patient.name} ({patient.email})
                                                    {patient.assignedDoctor && ` - Currently assigned to ${patient.assignedDoctor.name}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Doctor *
                                        </label>
                                        <select
                                            name="doctorId"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">Choose a doctor...</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor._id} value={doctor._id}>
                                                    Dr. {doctor.name} - {doctor.specialization || 'General'}
                                                    ({doctor.assignedPatients?.length || 0} patients)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" className="w-full btn btn-primary py-3 text-lg">
                                        <UserPlus className="w-5 h-5 mr-2 inline" />
                                        Assign Doctor to Patient
                                    </button>
                                </form>

                                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold mb-2 text-blue-900">📌 Note:</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• If a patient already has a doctor, this will reassign them</li>
                                        <li>• Doctors can have multiple patients assigned to them</li>
                                        <li>• Changes take effect immediately</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
