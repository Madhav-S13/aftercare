import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, AlertTriangle, Phone, Users, Award, ArrowLeft, CheckCircle } from 'lucide-react';

const HelpGuide = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <Activity className="w-8 h-8 text-primary-500" />
                            <span className="text-xl font-bold gradient-text">PatientCare</span>
                        </Link>
                        <Link to="/" className="btn btn-outline flex items-center space-x-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-4">Help & Guide</h1>
                    <p className="text-xl text-primary-100">Learn how to use PatientCare and essential first aid tips</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Quick Start Guide */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">📚 How to Use PatientCare</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* For Patients */}
                        <div className="bg-white p-8 rounded-xl shadow-card">
                            <Heart className="w-12 h-12 text-primary-500 mb-4" />
                            <h3 className="text-2xl font-bold mb-4">For Patients</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">1️⃣ Sign Up & Login</h4>
                                    <p className="text-gray-600 text-sm">Create your account with email and basic health information. Your doctor will be assigned by the admin.</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">2️⃣ Submit Daily Health Data</h4>
                                    <p className="text-gray-600 text-sm">
                                        • Click "Submit Health Data" button<br />
                                        • Enter: Blood Pressure, Heart Rate, SpO₂, Temperature<br />
                                        • Add symptoms if any<br />
                                        • Use Voice Input for hands-free entry
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">3️⃣ View Your Health Trends</h4>
                                    <p className="text-gray-600 text-sm">Check the charts to see your health progress over time. Green = Normal, Yellow = Warning, Red = Critical.</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">4️⃣ Read Doctor's Feedback</h4>
                                    <p className="text-gray-600 text-sm">In "Health History", doctor notes appear in blue boxes with medical advice.</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">🚨 Emergency SOS</h4>
                                    <p className="text-gray-600 text-sm">Click the red "Emergency SOS" button to instantly alert your doctor and emergency contacts.</p>
                                </div>
                            </div>
                        </div>

                        {/* For Doctors */}
                        <div className="bg-white p-8 rounded-xl shadow-card">
                            <Users className="w-12 h-12 text-success-500 mb-4" />
                            <h3 className="text-2xl font-bold mb-4">For Doctors</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">1️⃣ Login to Dashboard</h4>
                                    <p className="text-gray-600 text-sm">Access your doctor account to see assigned patients.</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">2️⃣ Monitor Patients</h4>
                                    <p className="text-gray-600 text-sm">
                                        • View all your patients in cards<br />
                                        • Click on any patient to see detailed records<br />
                                        • Check health trends and risk levels
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">3️⃣ Add Medical Notes</h4>
                                    <p className="text-gray-600 text-sm">Click "Add Notes" on any health record. A modal will open - type your professional advice, observations, or recommendations.</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">4️⃣ Respond to Alerts</h4>
                                    <p className="text-gray-600 text-sm">Check "Alerts" tab for critical patient conditions. Acknowledge or resolve alerts after reviewing.</p>
                                </div>
                            </div>
                        </div>

                        {/* For Admins */}
                        <div className="bg-white p-8 rounded-xl shadow-card">
                            <Award className="w-12 h-12 text-warning-500 mb-4" />
                            <h3 className="text-2xl font-bold mb-4">For Admins</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">1️⃣ View Statistics</h4>
                                    <p className="text-gray-600 text-sm">Dashboard shows total users, patients, doctors, and system health.</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">2️⃣ Manage Users</h4>
                                    <p className="text-gray-600 text-sm">
                                        • "Doctors" tab: View all registered doctors<br />
                                        • "Patients" tab: View all registered patients<br />
                                        • See who is assigned to whom
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-2">3️⃣ Assign Doctors to Patients</h4>
                                    <p className="text-gray-600 text-sm">
                                        • Go to "Assign Doctor" tab<br />
                                        • Select patient from dropdown<br />
                                        • Select doctor from dropdown<br />
                                        • Click "Assign" - done!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* First Aid Tips */}
                <section className="mb-16">
                    <div className="bg-gradient-to-r from-danger-500 to-danger-600 text-white p-8 rounded-xl mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <AlertTriangle className="w-12 h-12" />
                            <h2 className="text-3xl font-bold">🚑 Essential First Aid Tips</h2>
                        </div>
                        <p className="text-danger-100">Important: These are basic guidelines. Always call emergency services (911) for serious situations.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* High Blood Pressure */}
                        <div className="bg-white p-6 rounded-xl shadow-card border-l-4 border-danger-500">
                            <h3 className="text-xl font-bold mb-3 text-danger-700">⚠️ High Blood Pressure (Over 180/120)</h3>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-semibold">Immediate Actions:</p>
                                <ul className="list-disc ml-6 space-y-1 text-sm">
                                    <li>Sit down and rest immediately</li>
                                    <li>Take slow, deep breaths</li>
                                    <li>Do NOT lie down flat</li>
                                    <li>If on blood pressure medication, take as prescribed</li>
                                    <li>Call doctor if reading stays high after 5 minutes</li>
                                    <li>Call 911 if experiencing chest pain, headache, or vision changes</li>
                                </ul>
                            </div>
                        </div>

                        {/* Low Blood Pressure */}
                        <div className="bg-white p-6 rounded-xl shadow-card border-l-4 border-warning-500">
                            <h3 className="text-xl font-bold mb-3 text-warning-700">⚠️ Low Blood Pressure (Below 90/60)</h3>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-semibold">Immediate Actions:</p>
                                <ul className="list-disc ml-6 space-y-1 text-sm">
                                    <li>Lie down and elevate your legs</li>
                                    <li>Drink water or fluids</li>
                                    <li>Eat a small snack with salt</li>
                                    <li>Avoid sudden movements</li>
                                    <li>Call for help if feeling dizzy or faint</li>
                                </ul>
                            </div>
                        </div>

                        {/* Fast Heart Rate */}
                        <div className="bg-white p-6 rounded-xl shadow-card border-l-4 border-danger-500">
                            <h3 className="text-xl font-bold mb-3 text-danger-700">💓 Rapid Heart Rate (Over 100 bpm at rest)</h3>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-semibold">Immediate Actions:</p>
                                <ul className="list-disc ml-6 space-y-1 text-sm">
                                    <li>Sit down and relax</li>
                                    <li>Take slow, deep breaths</li>
                                    <li>Try the Valsalva maneuver (bear down gently)</li>
                                    <li>Drink cold water</li>
                                    <li>Call doctor if heart rate doesn't slow down</li>
                                    <li>Call 911 if chest pain, shortness of breath, or dizziness occurs</li>
                                </ul>
                            </div>
                        </div>

                        {/* Low Oxygen */}
                        <div className="bg-white p-6 rounded-xl shadow-card border-l-4 border-danger-500">
                            <h3 className="text-xl font-bold mb-3 text-danger-700">🫁 Low Oxygen (SpO₂ Below 90%)</h3>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-semibold">Immediate Actions:</p>
                                <ul className="list-disc ml-6 space-y-1 text-sm">
                                    <li>Sit upright, don't lie down</li>
                                    <li>Open windows for fresh air</li>
                                    <li>Loosen tight clothing</li>
                                    <li>Practice pursed-lip breathing</li>
                                    <li>Use oxygen if prescribed</li>
                                    <li>Call 911 immediately if below 88% or having trouble breathing</li>
                                </ul>
                            </div>
                        </div>

                        {/* Fever */}
                        <div className="bg-white p-6 rounded-xl shadow-card border-l-4 border-warning-500">
                            <h3 className="text-xl font-bold mb-3 text-warning-700">🌡️ High Fever (Over 103°F / 39.4°C)</h3>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-semibold">Immediate Actions:</p>
                                <ul className="list-disc ml-6 space-y-1 text-sm">
                                    <li>Drink plenty of water</li>
                                    <li>Take acetaminophen or ibuprofen</li>
                                    <li>Apply cool (not cold) compresses to forehead</li>
                                    <li>Stay in cool, comfortable environment</li>
                                    <li>Call doctor if fever persists over 24 hours</li>
                                    <li>Seek immediate care if fever is 104°F+ or with severe symptoms</li>
                                </ul>
                            </div>
                        </div>

                        {/* Chest Pain */}
                        <div className="bg-white p-6 rounded-xl shadow-card border-l-4 border-danger-500">
                            <h3 className="text-xl font-bold mb-3 text-danger-700">⚠️ Chest Pain</h3>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-semibold">Immediate Actions:</p>
                                <ul className="list-disc ml-6 space-y-1 text-sm">
                                    <li><strong>Call 911 immediately - DO NOT WAIT</strong></li>
                                    <li>Sit down and stay calm</li>
                                    <li>Chew aspirin if not allergic (ask 911 operator)</li>
                                    <li>Loosen tight clothing</li>
                                    <li>Do not drive yourself to hospital</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Best Practices */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">✅ Health Monitoring Best Practices</h2>

                    <div className="bg-white p-8 rounded-xl shadow-card">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-primary-600">📅 When to Measure</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="w-5 h-5 text-success-500 mt-0.5" />
                                        <span>Same time every day for consistency</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="w-5 h-5 text-success-500 mt-0.5" />
                                        <span>Before medications if possible</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="w-5 h-5 text-success-500 mt-0.5" />
                                        <span>Rest for 5 minutes before measuring BP</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="w-5 h-5 text-success-500 mt-0.5" />
                                        <span>Avoid caffeine 30 minutes before</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-primary-600">📊 Normal Ranges</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="p-3 bg-success-50 rounded-lg">
                                        <p className="font-semibold text-success-700">Blood Pressure</p>
                                        <p className="text-gray-700">Normal: Below 120/80</p>
                                    </div>
                                    <div className="p-3 bg-success-50 rounded-lg">
                                        <p className="font-semibold text-success-700">Heart Rate</p>
                                        <p className="text-gray-700">Normal: 60-100 bpm</p>
                                    </div>
                                    <div className="p-3 bg-success-50 rounded-lg">
                                        <p className="font-semibold text-success-700">SpO₂ (Oxygen)</p>
                                        <p className="text-gray-700">Normal: 95-100%</p>
                                    </div>
                                    <div className="p-3 bg-success-50 rounded-lg">
                                        <p className="font-semibold text-success-700">Temperature</p>
                                        <p className="text-gray-700">Normal: 97-99°F (36-37°C)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Emergency Contacts */}
                <section>
                    <div className="bg-gradient-to-r from-danger-500 to-danger-600 text-white p-8 rounded-xl text-center">
                        <Phone className="w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-4">Emergency Contacts</h2>
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-white/10 p-4 rounded-lg">
                                <p className="text-2xl font-bold mb-2">🚑 Emergency</p>
                                <p className="text-4xl font-bold">911</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <p className="text-2xl font-bold mb-2">☎️ Poison Control</p>
                                <p className="text-2xl font-bold">1-800-222-1222</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <p className="text-2xl font-bold mb-2">🏥 Use PatientCare SOS</p>
                                <p className="text-lg">Alert your doctor instantly</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>© 2026 PatientCare. Your health, our priority.</p>
                    <p className="mt-2 text-sm">This guide provides general information. Always consult healthcare professionals for medical advice.</p>
                </div>
            </footer>
        </div>
    );
};

export default HelpGuide;
