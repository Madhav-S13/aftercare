import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutProject from './pages/AboutProject';
import HelpGuide from './pages/HelpGuide';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to correct dashboard based on user role
        const redirectPath = user.role === 'patient' ? '/patient'
            : user.role === 'doctor' ? '/doctor'
                : user.role === 'admin' ? '/admin'
                    : '/login';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

// Redirect component for authenticated users
const AuthRedirect = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return children;
    }

    // User is authenticated, redirect to their dashboard
    const redirectPath = user?.role === 'patient' ? '/patient'
        : user?.role === 'doctor' ? '/doctor'
            : user?.role === 'admin' ? '/admin'
                : '/login';

    return <Navigate to={redirectPath} replace />;
};

function AppRoutes() {
    const { loading } = useAuth();

    // Show loading spinner while checking auth status
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    <AuthRedirect>
                        <Landing />
                    </AuthRedirect>
                }
            />
            <Route
                path="/login"
                element={
                    <AuthRedirect>
                        <Login />
                    </AuthRedirect>
                }
            />
            <Route
                path="/signup"
                element={
                    <AuthRedirect>
                        <Signup />
                    </AuthRedirect>
                }
            />
            <Route path="/help" element={<HelpGuide />} />
            <Route path="/about" element={<AboutProject />} />

            {/* Protected Dashboard Routes - Role-specific */}
            <Route
                path="/patient"
                element={
                    <ProtectedRoute allowedRoles={['patient']}>
                        <PatientDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/doctor"
                element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                        <DoctorDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* 404 - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
