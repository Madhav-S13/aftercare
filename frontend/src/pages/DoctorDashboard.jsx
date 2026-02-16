import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Activity, Users, Bell, LogOut, Menu, X, FileText } from 'lucide-react';

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('patients');
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHealth, setPatientHealth] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notesModal, setNotesModal] = useState({ open: false, healthDataId: null, existingNotes: '' });
    const [notesInput, setNotesInput] = useState('');

    useEffect(() => {
            fetchData();
    
            const interval = setInterval(() => {
                fetchData();
            }, 10000); // 10 seconds
    
            return () => clearInterval(interval);
        }, []); 

    const fetchData = async () => {
        try {
            const [patientsRes, alertsRes] = await Promise.all([
                api.get('/admin/patients'),
                api.get('/alerts/doctor')
            ]);

            setPatients(patientsRes.data.data);
            setAlerts(alertsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewPatientDetails = async (patientId) => {
        try {
            const response = await api.get(`/health/patient/${patientId}`);
            setPatientHealth(response.data.data);
            setSelectedPatient(patients.find(p => p._id === patientId));
            setActiveTab('patient-details');
        } catch (error) {
            alert('Error loading patient data');
        }
    };

    const openNotesModal = (healthDataId, existingNotes = '') => {
        setNotesModal({ open: true, healthDataId, existingNotes });
        setNotesInput(existingNotes);
    };

    const closeNotesModal = () => {
        setNotesModal({ open: false, healthDataId: null, existingNotes: '' });
        setNotesInput('');
    };

    const submitDoctorNotes = async () => {
        if (!notesInput.trim()) {
            alert('Please enter notes before submitting');
            return;
        }

        try {
            await api.put(`/health/${notesModal.healthDataId}/notes`, { notes: notesInput });
            alert('Notes saved successfully!');
            closeNotesModal();
            viewPatientDetails(selectedPatient._id);
        } catch (error) {
            alert('Error saving notes: ' + (error.response?.data?.message || error.message));
        }
    };

    const acknowledgeAlert = async (alertId) => {
        try {
            await api.put(`/alerts/${alertId}/acknowledge`);
            fetchData();
        } catch (error) {
            alert('Error acknowledging alert');
        }
    };

    const resolveAlert = async (alertId) => {
        try {
            await api.put(`/alerts/${alertId}/resolve`);
            fetchData();
        } catch (error) {
            alert('Error resolving alert');
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return null;

        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return null; // handle invalid dates

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        console.log("hello");

        return age;
    };



    const getPrimaryCondition = (patient) => {
        if (!patient?.medicalHistory?.conditions?.length) {
            return "Not specified";
        }

        return patient.medicalHistory.conditions[0];
    };

    const sendAlertToPatient = async (patientId) => {
        const message = prompt('Enter alert message for the patient:');
        if (!message || !message.trim()) return;

        try {
            await api.post('/alerts/doctor-alert', {
                patientId,
                message: message.trim()
            });
            alert('✅ Alert sent to patient successfully!');
        } catch (error) {
            alert('Error sending alert: ' + (error.response?.data?.message || error.message));
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
                        <button
                            onClick={() => { setActiveTab('patients'); setSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'patients' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Users /> <span>My Patients</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('alerts'); setSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${activeTab === 'alerts' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Bell /> <span>Alerts</span>
                            </div>
                            {alerts.length > 0 && (
                                <span className="bg-danger-500 text-white text-xs px-2 py-1 rounded-full">{alerts.length}</span>
                            )}
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
                            <h1 className="text-2xl font-bold text-gray-900">Dr. {user?.name}</h1>
                            <p className="text-gray-600">{user?.specialization || 'General Physician'}</p>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    {/* Patients List */}
                    {activeTab === 'patients' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">My Patients ({patients.length})</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {patients.map((patient) => (
                                    <div key={patient._id} className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => viewPatientDetails(patient._id)}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg">
                                                {patient.name.charAt(0)}
                                            </div>
                                            {patient.healthStreak > 0 && (
                                                <span className="text-sm bg-warning-50 text-warning-700 px-2 py-1 rounded">
                                                    🔥 {patient.healthStreak} days
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-lg">{patient.name}</h3>
                                        <p className="text-sm text-gray-600">{patient.email}</p>
                                        <p className="text-sm text-gray-600">{patient.phone}</p>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="text-sm text-gray-600">Consistency: {patient.consistencyScore}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Patient Details */}
                    {activeTab === 'patient-details' && selectedPatient && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <button onClick={() => setActiveTab('patients')} className="btn btn-outline">← Back to Patients</button>
                                <button
                                    onClick={() => sendAlertToPatient(selectedPatient._id)}
                                    className="btn bg-warning-500 hover:bg-warning-600 text-white flex items-center space-x-2"
                                >
                                    <Bell className="w-4 h-4" />
                                    <span>Send Alert to Patient</span>
                                </button>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-card mb-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    {selectedPatient.name}
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Age</p>
                                        <p className="font-semibold text-lg">
                                            {calculateAge(selectedPatient?.dateOfBirth) ?? '--'} years
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-semibold text-lg">
                                            {selectedPatient.phone}
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-500">Condition</p>
                                        <p className="font-semibold text-lg">
                                            {getPrimaryCondition(selectedPatient)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4">Health Records</h3>
                            <div className="space-y-4">
                                {patientHealth.map((record) => (
                                    <div key={record._id} className="bg-white p-6 rounded-xl shadow-card">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="text-sm text-gray-600">{new Date(record.recordedAt).toLocaleString()}</div>
                                                <div className="mt-2 grid grid-cols-4 gap-4">
                                                    <div>
                                                        <div className="text-xs text-gray-500">Blood Pressure</div>
                                                        <div className="font-semibold">{record.bloodPressure.systolic}/{record.bloodPressure.diastolic}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Heart Rate</div>
                                                        <div className="font-semibold">{record.heartRate} bpm</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">SpO₂</div>
                                                        <div className="font-semibold">{record.spO2}%</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Temperature</div>
                                                        <div className="font-semibold">{record.temperature}°F</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${record.riskLevel === 'critical' ? 'bg-danger-50 text-danger-700 border border-danger-500' :
                                                record.riskLevel === 'warning' ? 'bg-warning-50 text-warning-700 border border-warning-500' :
                                                    'bg-success-50 text-success-700 border border-success-500'
                                                }`}>
                                                Risk: {record.riskLevel}
                                            </span>
                                        </div>

                                        {record.symptoms && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded">
                                                <div className="text-xs font-medium text-gray-700 mb-1">Symptoms:</div>
                                                <div className="text-sm">{record.symptoms}</div>
                                            </div>
                                        )}

                                        {record.doctorNotes && (
                                            <div className="mt-4 p-3 bg-primary-50 rounded">
                                                <div className="text-xs font-medium text-primary-700 mb-1">Doctor's Notes:</div>
                                                <div className="text-sm">{record.doctorNotes}</div>
                                            </div>
                                        )}

                                        <button onClick={() => openNotesModal(record._id, record.doctorNotes)} className="mt-4 btn btn-outline btn-sm">
                                            <FileText className="w-4 h-4 mr-2" />
                                            {record.doctorNotes ? 'Update Notes' : 'Add Notes'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Alerts */}
                    {activeTab === 'alerts' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
                            {alerts.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl shadow-card text-center text-gray-600">
                                    No active alerts at the moment.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {alerts.map((alert) => (
                                        <div key={alert._id} className={`p-6 rounded-xl border-l-4 ${alert.severity === 'critical' ? 'bg-danger-50 border-danger-500' :
                                            alert.severity === 'high' ? 'bg-warning-50 border-warning-500' :
                                                'bg-primary-50 border-primary-500'
                                            }`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${alert.severity === 'critical' ? 'bg-danger-500 text-white' :
                                                            alert.severity === 'high' ? 'bg-warning-500 text-white' :
                                                                'bg-primary-500 text-white'
                                                            }`}>
                                                            {alert.severity}
                                                        </span>
                                                        <h3 className="font-semibold text-lg">{alert.title}</h3>
                                                    </div>
                                                    <p className="text-gray-700 mb-2">{alert.message}</p>
                                                    <p className="text-sm text-gray-600">Patient: {alert.patient?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    {alert.status === 'active' && (
                                                        <>
                                                            <button onClick={() => acknowledgeAlert(alert._id)} className="btn btn-outline text-sm">
                                                                Acknowledge
                                                            </button>
                                                            <button onClick={() => resolveAlert(alert._id)} className="btn btn-success text-sm">
                                                                Resolve
                                                            </button>
                                                        </>
                                                    )}
                                                    {alert.status === 'acknowledged' && (
                                                        <button onClick={() => resolveAlert(alert._id)} className="btn btn-success text-sm">
                                                            Resolve
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Notes Modal */}
            {notesModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
                        <h2 className="text-2xl font-bold mb-4">
                            {notesModal.existingNotes ? 'Update' : 'Add'} Doctor Notes
                        </h2>

                        <textarea
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px]"
                            placeholder="Enter your medical notes, observations, recommendations..."
                            autoFocus
                        />

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={closeNotesModal}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitDoctorNotes}
                                className="btn btn-primary"
                            >
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
