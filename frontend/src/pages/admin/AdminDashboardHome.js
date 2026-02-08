import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiList, FiAlertTriangle, FiActivity, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';
import './AdminDashboardHome.css';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    users: { total: 0, tenants: 0, owners: 0 },
    listings: { total: 0, active: 0, pending: 0 },
    bookings: { total: 0, pending: 0 }
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        const data = response.data.data;
        setStats({
          users: data.users,
          listings: data.listings,
          bookings: data.bookings
        });
        setRecentUsers(data.recentActivity?.users || []);
        setRecentListings(data.recentActivity?.listings || []);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-home admin-dashboard">
      <h1>Tableau de bord administrateur</h1>
      <p className="subtitle">Vue d'ensemble de la plateforme Binôme</p>

      <div className="stats-grid admin-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#dc2626' }}>
            <FiUsers />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.users.total}</span>
            <span className="stat-label">Utilisateurs</span>
            <small>{stats.users.tenants} locataires • {stats.users.owners} propriétaires</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
            <FiList />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.listings.total}</span>
            <span className="stat-label">Annonces</span>
            <small>{stats.listings.active} actives • {stats.listings.pending} en attente</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706' }}>
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.listings.pending}</span>
            <span className="stat-label">À modérer</span>
            <small>Annonces en attente de validation</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#059669' }}>
            <FiActivity />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.bookings.total}</span>
            <span className="stat-label">Réservations</span>
            <small>{stats.bookings.pending} en attente</small>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="dashboard-section">
          <h2>
            Derniers utilisateurs
            <Link to="/admin/dashboard/users">Voir tous <FiArrowRight /></Link>
          </h2>
          {loading ? (
            <p>Chargement...</p>
          ) : recentUsers.length > 0 ? (
            <div className="recent-list">
              {recentUsers.map(user => (
                <div key={user._id} className="recent-item">
                  <div className="item-info">
                    <span className="item-name">{user.firstName} {user.lastName}</span>
                    <span className="item-meta">{user.email}</span>
                  </div>
                  <div className="item-details">
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                    <span className="item-date">{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucun utilisateur récent</p>
          )}
        </div>

        <div className="dashboard-section">
          <h2>
            Dernières annonces
            <Link to="/admin/dashboard/listings">Voir toutes <FiArrowRight /></Link>
          </h2>
          {loading ? (
            <p>Chargement...</p>
          ) : recentListings.length > 0 ? (
            <div className="recent-list">
              {recentListings.map(listing => (
                <div key={listing._id} className="recent-item">
                  <div className="item-info">
                    <span className="item-name">{listing.title}</span>
                    <span className="item-meta">
                      par {listing.owner?.firstName} {listing.owner?.lastName}
                    </span>
                  </div>
                  <div className="item-details">
                    <span className={`status-badge ${listing.status}`}>{listing.status}</span>
                    <span className="item-date">{formatDate(listing.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucune annonce récente</p>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <Link to="/admin/dashboard/listings?status=pending" className="action-card">
            <FiList />
            <span>Modérer les annonces</span>
          </Link>
          <Link to="/admin/dashboard/users" className="action-card">
            <FiUsers />
            <span>Gérer les utilisateurs</span>
          </Link>
          <Link to="/admin/dashboard/support" className="action-card">
            <FiAlertTriangle />
            <span>Tickets support</span>
          </Link>
          <Link to="/admin/dashboard/content" className="action-card">
            <FiActivity />
            <span>Gérer le contenu</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
