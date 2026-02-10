import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Activity, Heart, Thermometer, Wind, LogOut, Plus, Mic, AlertTriangle,
    TrendingUp, Award, Flame, Target, Bell, Menu, X
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PatientDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // State
    const [healthData, setHealthData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [voiceMode, setVoiceMode] = useState(false);
    const [formData, setFormData] = useState({
        bloodPressure: { systolic: '', diastolic: '' },
        heartRate: '',
        spO2: '',
        temperature: '',
        symptoms: '',
        notes: ''
    });
    const [latestRisk, setLatestRisk] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [healthRes, alertsRes] = await Promise.all([
                api.get('/health/history?limit=30'),
                api.get('/alerts?status=active')
            ]);

            setHealthData(healthRes.data.data);
            setAlerts(alertsRes.data.data);

            if (healthRes.data.data.length > 0) {
                const latest = healthRes.data.data[0];
                setLatestRisk({
                    score: latest.riskScore,
                    level: latest.riskLevel
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/health', {
                ...formData,
                submittedVia: voiceMode ? 'voice' : 'manual'
            });

            setFormData({
                bloodPressure: { systolic: '', diastolic: '' },
                heartRate: '',
                spO2: '',
                temperature: '',
                symptoms: '',
                notes: ''
            });
            setShowForm(false);
            fetchData();

            // Show risk analysis
            if (response.data.riskAnalysis) {
                setLatestRisk({
                    score: response.data.riskAnalysis.riskScore,
                    level: response.data.riskAnalysis.riskLevel
                });
            }

            alert('✅ Health data submitted successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Please check your internet connection';
            alert('❌ Error: ' + errorMsg);
        }
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice input not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setVoiceMode(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log('Voice input:', transcript);

            // Simple parsing (can be enhanced)
            const bpMatch = transcript.match(/blood pressure (\d+) over (\d+)/);
            const hrMatch = transcript.match(/heart rate (\d+)/);
            const spO2Match = transcript.match(/oxygen (\d+)/);
            const tempMatch = transcript.match(/temperature (\d+(?:\.\d+)?)/);

            if (bpMatch) {
                setFormData(prev => ({
                    ...prev,
                    bloodPressure: { systolic: bpMatch[1], diastolic: bpMatch[2] }
                }));
            }
            if (hrMatch) {
                setFormData(prev => ({ ...prev, heartRate: hrMatch[1] }));
            }
            if (spO2Match) {
                setFormData(prev => ({ ...prev, spO2: spO2Match[1] }));
            }
            if (tempMatch) {
                setFormData(prev => ({ ...prev, temperature: tempMatch[1] }));
            }

            setVoiceMode(false);
        };

        recognition.onerror = () => {
            setVoiceMode(false);
            alert('Voice recognition error. Please try again.');
        };

        recognition.start();
    };

    const triggerSOS = async () => {
        if (!window.confirm('⚠️ Emergency Alert\n\nThis will immediately notify your doctor and emergency contacts.\n\nProceed?')) {
            return;
        }

        console.log('SOS button clicked - sending request...');

        try {
            const response = await api.post('/emergency', {
                location: {
                    latitude: 0,
                    longitude: 0,
                    address: 'Patient Location'
                },
                notes: 'Emergency assistance requested'
            });

            console.log('SOS Response:', response.data);
            alert('🚨 Emergency Alert Sent!\n\nYour doctor has been notified.');
            fetchData();
        } catch (error) {
            console.error('SOS Error:', error);
            console.error('Error response:', error.response);

            const errorMsg = error.response?.data?.message || error.message || 'Connection failed';
            alert('❌ Error: ' + errorMsg + '\n\nPlease call emergency services directly.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Chart data
    const chartData = {
        labels: healthData.slice(0, 10).reverse().map((_, i) => `Day ${i + 1}`),
        datasets: [
            {
                label: 'Systolic BP',
                data: healthData.slice(0, 10).reverse().map(d => d.bloodPressure.systolic),
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Heart Rate',
                data: healthData.slice(0, 10).reverse().map(d => d.heartRate),
                borderColor: '#f5222d',
                backgroundColor: 'rgba(245, 34, 45, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Health Trends (Last 10 Days)' }
        },
        scales: {
            y: { beginAtZero: false }
        }
    };

    // Risk meter color
    const getRiskColor = (level) => {
        if (level === 'critical') return 'text-danger-500 bg-danger-50 border-danger-500';
        if (level === 'warning') return 'text-warning-500 bg-warning-50 border-warning-500';
        return 'text-success-500 bg-success-50 border-success-500';
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
                        {[
                            { id: 'overview', icon: <Activity />, label: 'Overview' },
                            { id: 'history', icon: <TrendingUp />, label: 'Health History' },
                            { id: 'alerts', icon: <Bell />, label: 'Alerts', badge: alerts.length },
                            { id: 'gamification', icon: <Award />, label: 'My Progress' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                {item.badge > 0 && (
                                    <span className="bg-danger-500 text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <button onClick={handleLogout} className="mt-8 w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <LogOut /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Header */}
                <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
                                <p className="text-primary-100 mt-1">Track your health journey</p>
                            </div>
                        </div>
                        <button onClick={triggerSOS} className="bg-danger-500 hover:bg-danger-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg transition-transform hover:scale-105">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Emergency SOS</span>
                        </button>
                    </div>
                </header>

                <main className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="grid md:grid-cols-4 gap-6">
                                {latestRisk && (
                                    <div className={`p-6 rounded-xl border-2 ${getRiskColor(latestRisk.level)}`}>
                                        <div className="text-2xl font-bold">Risk: {latestRisk.score}/100</div>
                                        <div className="text-sm mt-1 capitalize">{latestRisk.level} Level</div>
                                    </div>
                                )}

                                <div className="bg-white p-6 rounded-xl shadow-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <Heart className="w-8 h-8 text-danger-500" />
                                    </div>
                                    <div className="text-2xl font-bold">{healthData[0]?.heartRate || '--'} bpm</div>
                                    <div className="text-sm text-gray-600">Heart Rate</div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-card">
                                    <Wind className="w-8 h-8 text-primary-500 mb-2" />
                                    <div className="text-2xl font-bold">{healthData[0]?.spO2 || '--'}%</div>
                                    <div className="text-sm text-gray-600">SpO₂</div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-card">
                                    <Thermometer className="w-8 h-8 text-warning-500 mb-2" />
                                    <div className="text-2xl font-bold">{healthData[0]?.temperature || '--'}°F</div>
                                    <div className="text-sm text-gray-600">Temperature</div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-card">
                                <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
                                {healthData.length > 0 ? (
                                    <Line data={chartData} options={chartOptions} />
                                ) : (
                                    <p className="text-gray-600 text-center py-8">No health data available. Submit your first reading!</p>
                                )}
                            </div>

                            {/* Submit Data Button */}
                            <div className="flex space-x-4">
                                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center space-x-2">
                                    <Plus /> <span>Submit Health Data</span>
                                </button>
                                <button onClick={handleVoiceInput} className="btn btn-outline flex items-center space-x-2" disabled={voiceMode}>
                                    <Mic /> <span>{voiceMode ? 'Listening...' : 'Voice Input'}</span>
                                </button>
                            </div>

                            {/* Health Data Form */}
                            {showForm && (
                                <div className="bg-white p-6 rounded-xl shadow-card">
                                    <h3 className="text-xl font-semibold mb-4">Submit Health Data</h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Blood Pressure (Systolic)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="input"
                                                    placeholder="120"
                                                    value={formData.bloodPressure.systolic}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        bloodPressure: { ...formData.bloodPressure, systolic: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Blood Pressure (Diastolic)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="input"
                                                    placeholder="80"
                                                    value={formData.bloodPressure.diastolic}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        bloodPressure: { ...formData.bloodPressure, diastolic: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Heart Rate (bpm)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="input"
                                                    placeholder="75"
                                                    value={formData.heartRate}
                                                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">SpO₂ (%)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="input"
                                                    placeholder="98"
                                                    value={formData.spO2}
                                                    onChange={(e) => setFormData({ ...formData, spO2: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Temperature (°F)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    required
                                                    className="input"
                                                    placeholder="98.6"
                                                    value={formData.temperature}
                                                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Symptoms (optional)</label>
                                            <textarea
                                                className="input"
                                                rows="3"
                                                placeholder="Any symptoms you're experiencing..."
                                                value={formData.symptoms}
                                                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex space-x-4">
                                            <button type="submit" className="btn btn-primary">Submit Data</button>
                                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Health History</h2>
                            {healthData.map((record) => (
                                <div key={record._id} className="bg-white p-6 rounded-xl shadow-card">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="text-sm text-gray-600">{new Date(record.recordedAt).toLocaleString()}</div>
                                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500">Blood Pressure</div>
                                                    <div className="font-semibold text-lg">{record.bloodPressure.systolic}/{record.bloodPressure.diastolic}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Heart Rate</div>
                                                    <div className="font-semibold text-lg">{record.heartRate} bpm</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">SpO₂</div>
                                                    <div className="font-semibold text-lg">{record.spO2}%</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Temperature</div>
                                                    <div className="font-semibold text-lg">{record.temperature}°F</div>
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
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="text-xs font-medium text-gray-700 mb-1">Your Symptoms:</div>
                                            <div className="text-sm text-gray-800">{record.symptoms}</div>
                                        </div>
                                    )}

                                    {record.doctorNotes && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Activity className="w-4 h-4 text-blue-700" />
                                                <div className="text-sm font-semibold text-blue-900">Doctor's Feedback</div>
                                            </div>
                                            <div className="text-sm text-blue-800">{record.doctorNotes}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Alerts Tab */}
                    {activeTab === 'alerts' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Active Alerts</h2>
                            {alerts.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl shadow-card text-center text-gray-600">
                                    No active alerts. You're doing great! 🎉
                                </div>
                            ) : (
                                alerts.map((alert) => (
                                    <div key={alert._id} className={`p-6 rounded-xl border-l-4 ${alert.severity === 'critical' ? 'bg-danger-50 border-danger-500' :
                                        alert.severity === 'high' ? 'bg-warning-50 border-warning-500' :
                                            'bg-primary-50 border-primary-500'
                                        }`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">{alert.title}</h3>
                                                <p className="mt-2 text-gray-700">{alert.message}</p>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {new Date(alert.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${alert.severity === 'critical' ? 'bg-danger-500 text-white' :
                                                alert.severity === 'high' ? 'bg-warning-500 text-white' :
                                                    'bg-primary-500 text-white'
                                                }`}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Gamification Tab */}
                    {activeTab === 'gamification' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Your Progress</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-card text-center">
                                    <Flame className="w-12 h-12 text-warning-500 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-gray-900">{user?.healthStreak || 0}</div>
                                    <div className="text-gray-600 mt-1">Day Streak</div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-card text-center">
                                    <Target className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-gray-900">{user?.consistencyScore || 0}%</div>
                                    <div className="text-gray-600 mt-1">Consistency Score</div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-card text-center">
                                    <Award className="w-12 h-12 text-success-500 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-gray-900">{user?.badges?.length || 0}</div>
                                    <div className="text-gray-600 mt-1">Badges Earned</div>
                                </div>
                            </div>

                            {user?.badges && user.badges.length > 0 && (
                                <div className="bg-white p-6 rounded-xl shadow-card">
                                    <h3 className="font-semibold text-lg mb-4">Your Badges</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {user.badges.map((badge, idx) => (
                                            <div key={idx} className="text-center p-4 bg-gradient-to-br from-primary-50 to-success-50 rounded-lg">
                                                <div className="text-4xl mb-2">{badge.icon}</div>
                                                <div className="font-medium">{badge.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-primary-500 to-success-500 text-white p-6 rounded-xl">
                                <p className="text-lg">
                                    {user?.healthStreak >= 7
                                        ? '🎉 Amazing! Keep up your health tracking streak!'
                                        : '💪 Submit health data daily to build your streak!'}
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PatientDashboard;
