import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain, Bell, TrendingUp, Shield, Smartphone, Heart, Users } from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'AI-Based Risk Prediction',
            description: 'Advanced algorithms analyze health trends to predict and prevent complications before they occur.'
        },
        {
            icon: <Bell className="w-8 h-8" />,
            title: 'Intelligent Alerts',
            description: 'Multi-level escalation system ensures timely intervention for abnormal health conditions.'
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Advanced Analytics',
            description: 'Interactive charts and comprehensive reports track your health journey over time.'
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: 'Voice Data Entry',
            description: 'Hands-free health data submission optimized for elderly patients.'
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: 'Emergency SOS',
            description: 'One-click emergency alert shares vitals, location, and contacts instantly.'
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Secure & Private',
            description: 'Bank-level encryption and role-based access control protect your medical data.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-8 h-8 text-primary-500" />
                            <span className="text-xl font-bold gradient-text">AfterCare</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Get Started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        <span className="gradient-text">AfterCare</span>
                    </h1>
                    <p className="text-2xl md:text-3xl font-semibold text-primary-600 mb-6">
                        Continuous Care, Anytime. Anywhere.
                    </p>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Transform traditional remote monitoring into a predictive, intelligent, and patient-centric
                        digital healthcare system. Monitor vitals, predict risks, and ensure timely medical intervention.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg">
                            Start Monitoring
                        </Link>
                        <Link to="/help" className="btn btn-outline px-8 py-3 text-lg">
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary-500">AI-Powered</div>
                        <div className="text-gray-600 mt-2">Risk Analysis</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-success-500">24/7</div>
                        <div className="text-gray-600 mt-2">Monitoring</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-warning-500">Real-time</div>
                        <div className="text-gray-600 mt-2">Alerts</div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Innovative Features</h2>
                        <p className="text-xl text-gray-600">Built for predictive healthcare and patient safety</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="card-hover bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-card border border-gray-100">
                                <div className="text-primary-500 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* User Roles */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Who We Serve</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-card border-t-4 border-primary-500">
                            <Users className="w-12 h-12 text-primary-500 mb-4" />
                            <h3 className="text-2xl font-semibold mb-3">Patients</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>✓ Submit daily health data</li>
                                <li>✓ View health trends</li>
                                <li>✓ Receive AI-driven insights</li>
                                <li>✓ Emergency SOS feature</li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-card border-t-4 border-success-500">
                            <Heart className="w-12 h-12 text-success-500 mb-4" />
                            <h3 className="text-2xl font-semibold mb-3">Doctors</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>✓ Monitor multiple patients</li>
                                <li>✓ Real-time health alerts</li>
                                <li>✓ Decision support tools</li>
                                <li>✓ Download reports</li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-card border-t-4 border-warning-500">
                            <Shield className="w-12 h-12 text-warning-500 mb-4" />
                            <h3 className="text-2xl font-semibold mb-3">Administrators</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>✓ Manage users & roles</li>
                                <li>✓ Assign doctors to patients</li>
                                <li>✓ System analytics</li>
                                <li>✓ Audit logs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-primary-500 to-success-500">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Transform Healthcare?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of patients and doctors using our platform for better health outcomes.
                    </p>
                    <Link to="/signup" className="btn bg-white text-primary-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer 
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2026 AfterCare. Remote Patient Health Monitoring System.</p>
                    <p className="mt-2">Built with ❤️ for better healthcare outcomes.</p>
                </div>
            </footer>
            */} 

        </div>
    );
};

export default Landing;
