import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public pages
import HomePage from './pages/public/HomePage';
import SearchPage from './pages/public/SearchPage';
import ListingDetailPage from './pages/public/ListingDetailPage';
import AuthPage from './pages/public/AuthPage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ContactPage from './pages/public/ContactPage';

// Tenant pages
import TenantDashboard from './pages/tenant/TenantDashboard';
import TenantDashboardHome from './pages/tenant/TenantDashboardHome';

// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerDashboardHome from './pages/owner/OwnerDashboardHome';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';

import './App.css';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout with Header and Footer
const PublicLayout = ({ children }) => (
  <>
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </>
);

// Dashboard Layout (Header only, no footer)
const DashboardLayout = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
      <Route path="/listings/:id" element={<PublicLayout><ListingDetailPage /></PublicLayout>} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

      {/* Tenant Dashboard Routes */}
      <Route
        path="/tenant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['tenant', 'admin']}>
            <DashboardLayout>
              <TenantDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<TenantDashboardHome />} />
        <Route path="profile" element={<div className="page-placeholder">Profil Utilisateur</div>} />
        <Route path="favorites" element={<div className="page-placeholder">Mes Favoris</div>} />
        <Route path="searches" element={<div className="page-placeholder">Mes Recherches</div>} />
        <Route path="messages" element={<div className="page-placeholder">Messages</div>} />
        <Route path="bookings" element={<div className="page-placeholder">Réservations</div>} />
        <Route path="roommate-finder" element={<div className="page-placeholder">Recherche de Binôme</div>} />
        <Route path="settings" element={<div className="page-placeholder">Paramètres</div>} />
      </Route>

      {/* Owner Dashboard Routes */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['owner', 'admin']}>
            <DashboardLayout>
              <OwnerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboardHome />} />
        <Route path="profile" element={<div className="page-placeholder">Profil Propriétaire</div>} />
        <Route path="listings" element={<div className="page-placeholder">Gestion des Annonces</div>} />
        <Route path="requests" element={<div className="page-placeholder">Gestion des Demandes</div>} />
        <Route path="messages" element={<div className="page-placeholder">Messages</div>} />
        <Route path="reviews" element={<div className="page-placeholder">Avis & Notations</div>} />
        <Route path="settings" element={<div className="page-placeholder">Paramètres</div>} />
      </Route>
      <Route
        path="/owner/listings/create"
        element={
          <ProtectedRoute allowedRoles={['owner', 'admin']}>
            <PublicLayout>
              <div className="page-placeholder">Créer une Annonce</div>
            </PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardHome />} />
        <Route path="listings" element={<div className="page-placeholder">Modération Annonces</div>} />
        <Route path="users" element={<div className="page-placeholder">Gestion Utilisateurs</div>} />
        <Route path="support" element={<div className="page-placeholder">Support Client</div>} />
        <Route path="content" element={<div className="page-placeholder">Gestion Contenus</div>} />
        <Route path="settings" element={<div className="page-placeholder">Paramètres Admin</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
