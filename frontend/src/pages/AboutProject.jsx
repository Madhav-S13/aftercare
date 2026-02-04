import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, Code, Database, Shield, Zap, GitBranch } from 'lucide-react';

const AboutProject = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-8 h-8 text-primary-500" />
                            <span className="text-xl font-bold gradient-text">PatientCare</span>
                        </div>
                        <Link to="/" className="btn btn-outline flex items-center space-x-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back Home</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        About the <span className="gradient-text">Project</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A comprehensive remote patient health monitoring system built with modern technologies
                        and software engineering best practices.
                    </p>
                </div>

                {/* Problem Statement */}
                <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">🎯 Problem Statement</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Post-discharge patient monitoring is critical for preventing hospital readmissions and ensuring
                        continued recovery. Traditional follow-up methods are inefficient, reactive, and lack real-time insights.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        <strong>Our Solution:</strong> A predictive, intelligent, patient-centric platform that enables
                        remote health monitoring with AI-based risk analysis, early warning systems, and seamless doctor-patient
                        communication, ultimately reducing readmissions and improving healthcare outcomes.
                    </p>
                </section>

                {/* Innovation Goal */}
                <section className="bg-gradient-to-r from-primary-500 to-success-500 text-white rounded-2xl shadow-card p-8 mb-8">
                    <h2 className="text-3xl font-bold mb-4">💡 Innovation Goal</h2>
                    <p className="text-xl italic">
                        "Transform traditional remote monitoring into a <strong>predictive</strong>,
                        <strong> intelligent</strong>, and <strong>patient-centric</strong> digital healthcare system."
                    </p>
                </section>

                {/* Tech Stack */}
                <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">🛠️ Technology Stack</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <Code className="w-6 h-6 text-primary-500" />
                                <h3 className="text-xl font-semibold">Frontend</h3>
                            </div>
                            <ul className="space-y-2 text-gray-700">
                                <li>• <strong>React 18</strong> - Modern UI library</li>
                                <li>• <strong>React Router v6</strong> - Client-side routing</li>
                                <li>• <strong>Tailwind CSS</strong> - Utility-first styling</li>
                                <li>• <strong>Chart.js</strong> - Data visualization</li>
                                <li>• <strong>Axios</strong> - HTTP client</li>
                                <li>• <strong>Lucide React</strong> - Icon library</li>
                            </ul>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <Database className="w-6 h-6 text-success-500" />
                                <h3 className="text-xl font-semibold">Backend</h3>
                            </div>
                            <ul className="space-y-2 text-gray-700">
                                <li>• <strong>Node.js</strong> - Runtime environment</li>
                                <li>• <strong>Express.js</strong> - Web framework</li>
                                <li>• <strong>MongoDB</strong> - NoSQL database</li>
                                <li>• <strong>Mongoose</strong> - ODM library</li>
                                <li>• <strong>JWT</strong> - Authentication</li>
                                <li>• <strong>bcrypt</strong> - Password hashing</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Development Model */}
                <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        <GitBranch className="inline w-8 h-8 mr-2 text-primary-500" />
                        Incremental Development Model
                    </h2>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                            <h3 className="font-semibold text-lg mb-2">Phase 1: Foundation (Auth & Setup)</h3>
                            <p className="text-gray-700">Authentication system, database setup, project structure</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                            <h3 className="font-semibold text-lg mb-2">Phase 2: Core Monitoring</h3>
                            <p className="text-gray-700">Health data submission, patient-doctor dashboards</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-success-500">
                            <h3 className="font-semibold text-lg mb-2">Phase 3: AI & Analytics</h3>
                            <p className="text-gray-700">Risk prediction algorithms, health trend visualization</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-success-500">
                            <h3 className="font-semibold text-lg mb-2">Phase 4: Advanced Features</h3>
                            <p className="text-gray-700">Alerts, voice input, emergency SOS, gamification</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-warning-500">
                            <h3 className="font-semibold text-lg mb-2">Phase 5: Admin & Deployment</h3>
                            <p className="text-gray-700">Admin panel, security enhancements, production deployment</p>
                        </div>
                    </div>
                </section>

                {/* Software Engineering Practices */}
                <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        <Shield className="inline w-8 h-8 mr-2 text-success-500" />
                        Software Engineering Best Practices
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Zap className="w-5 h-5 text-primary-500 mt-1" />
                                <div>
                                    <h3 className="font-semibold">MVC Architecture</h3>
                                    <p className="text-sm text-gray-600">Clear separation of Models, Controllers, and Routes</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Zap className="w-5 h-5 text-primary-500 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Modular Design</h3>
                                    <p className="text-sm text-gray-600">Reusable components and utility functions</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Zap className="w-5 h-5 text-primary-500 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Security-First</h3>
                                    <p className="text-sm text-gray-600">JWT authentication, password hashing, role-based access</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Zap className="w-5 h-5 text-success-500 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Error Handling</h3>
                                    <p className="text-sm text-gray-600">Comprehensive validation and error responses</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Zap className="w-5 h-5 text-success-500 mt-1" />
                                <div>
                                    <h3 className="font-semibold">RESTful API Design</h3>
                                    <p className="text-sm text-gray-600">Consistent endpoint structure and HTTP methods</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Zap className="w-5 h-5 text-success-500 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Responsive Design</h3>
                                    <p className="text-sm text-gray-600">Mobile-first approach with Tailwind CSS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">✨ Key Features</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            'AI-Based Health Risk Prediction',
                            'Intelligent Alert & Escalation System',
                            'Voice-Based Health Data Entry',
                            'Advanced Health Analytics & Charts',
                            'Smart Doctor Decision Support',
                            'Emergency SOS System',
                            'Offline Data Capture & Sync',
                            'Gamification for Patient Engagement',
                            'Role-Based Access Control',
                            'Real-time Health Monitoring',
                            'PDF Report Generation',
                            'Comprehensive Admin Panel'
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <div className="bg-gradient-to-r from-primary-500 to-success-500 text-white rounded-2xl shadow-card p-12">
                        <h2 className="text-3xl font-bold mb-4">Ready to Experience It?</h2>
                        <p className="text-xl mb-8">Start monitoring your health with our intelligent platform today.</p>
                        <Link to="/signup" className="btn bg-white text-primary-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                            Get Started Now
                        </Link>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2026 PatientCare. Remote Patient Health Monitoring System.</p>
                    <p className="mt-2">Built with cutting-edge technology for better healthcare outcomes.</p>
                </div>
            </footer>
        </div>
    );
};

export default AboutProject;
