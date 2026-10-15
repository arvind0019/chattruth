import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Home } from '../pages/Home';
import { Analyze } from '../pages/Analyze';
import { Relationship } from '../pages/Relationship';
import { Friends } from '../pages/Friends';
import { Family } from '../pages/Family';
import { SampleReport } from '../pages/SampleReport';
import { Pricing } from '../pages/Pricing';
import { FAQ } from '../pages/FAQ';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { Contact } from '../pages/Contact';

import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { VerifyEmail } from '../pages/VerifyEmail';

import { Dashboard } from '../pages/Dashboard';
import { ReportDetail } from '../pages/ReportDetail';
import { Settings } from '../pages/Settings';
import { AdminDashboard } from '../pages/AdminDashboard';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-xs text-[#5A6559]">Authenticating session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin Route Guard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-xs text-[#5A6559]">Verifying privileges...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/relationship" element={<Relationship />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/family" element={<Family />} />
      <Route path="/sample-report" element={<SampleReport />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Report Dynamic View (Both Preview and Full) */}
      <Route path="/reports/:id" element={<ReportDetail />} />

      {/* Protected User Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Pages */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Catch-all 404 */}
      <Route
        path="*"
        element={
          <div className="text-center py-24 space-y-4">
            <h1 className="text-4xl font-bold text-[#242923]">404</h1>
            <p className="text-sm text-[#5A6559]">Page not found.</p>
          </div>
        }
      />
    </Routes>
  );
};
