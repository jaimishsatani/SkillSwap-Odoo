import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import SwapRequests from './pages/SwapRequests';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-20 z-0"
          style={{
            backgroundImage: "url('/bg.png')",
            filter: 'blur(2px)',
          }}
        ></div>

        {/* Navbar always on top */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Main content with frosted glass */}
        <main className="relative z-10 flex-1 flex flex-col px-4 md:px-8 py-6">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-7xl mx-auto flex-1 flex flex-col p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<Explore />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/swap-requests"
                element={
                  <ProtectedRoute>
                    <SwapRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        {/* Footer always on bottom */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
