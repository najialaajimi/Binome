import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiList, FiEye, FiMessageSquare, FiDollarSign, FiPlusCircle, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import listingService from '../../services/listingService';
import bookingService from '../../services/bookingService';
import './OwnerDashboardHome.css';

const OwnerDashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    totalViews: 0,
    pendingRequests: 0,
    activeListings: 0
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch owner's listings
      const listingsRes = await listingService.getMyListings();
      const listingsData = listingsRes.data || [];
      setListings(listingsData.slice(0, 5));

      // Calculate stats
      const totalViews = listingsData.reduce((acc, l) => acc + (l.views || 0), 0);
      const activeCount = listingsData.filter(l => l.status === 'active').length;

      setStats({
        totalListings: listingsRes.count || listingsData.length,
        totalViews,
        activeListings: activeCount,
        pendingRequests: 0
      });

      // Fetch pending requests
      try {
        const requestsRes = await bookingService.getBookingRequests('pending');
        setStats(prev => ({
          ...prev,
          pendingRequests: requestsRes.count || 0
        }));
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'draft': 'Brouillon',
      'pending': 'En attente',
      'active': 'Active',
      'rented': 'Louée',
      'inactive': 'Inactive',
      'suspended': 'Suspendue'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      'draft': 'draft',
      'pending': 'pending',
      'active': 'active',
      'rented': 'rented',
      'inactive': 'inactive',
      'suspended': 'suspended'
    };
    return classes[status] || '';
  };

  return (
    <div className="dashboard-home owner-dashboard">
      <h1>Tableau de bord propriétaire</h1>
      <p className="subtitle">Bienvenue, {user?.firstName} ! Gérez vos annonces et demandes.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
            <FiList />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalListings}</span>
            <span className="stat-label">Annonces</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#059669' }}>
            <FiEye />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalViews}</span>
            <span className="stat-label">Vues totales</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#d97706' }}>
            <FiMessageSquare />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pendingRequests}</span>
            <span className="stat-label">Demandes en attente</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', color: '#4f46e5' }}>
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.activeListings}</span>
            <span className="stat-label">Annonces actives</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>
          Mes annonces récentes
          <Link to="/owner/dashboard/listings">Voir toutes <FiArrowRight /></Link>
        </h2>
        {loading ? (
          <p>Chargement...</p>
        ) : listings.length > 0 ? (
          <div className="listings-table">
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Ville</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Vues</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing._id}>
                    <td className="listing-title">
                      <Link to={`/listings/${listing._id}`}>{listing.title}</Link>
                    </td>
                    <td>{listing.address?.city}</td>
                    <td>{listing.price?.amount} TND</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(listing.status)}`}>
                        {getStatusLabel(listing.status)}
                      </span>
                    </td>
                    <td>{listing.views || 0}</td>
                    <td>
                      <Link to={`/owner/listings/${listing._id}/edit`} className="table-action">
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FiList />
            <p>Vous n'avez pas encore d'annonces</p>
            <Link to="/owner/listings/create" className="btn btn-primary">
              <FiPlusCircle /> Créer une annonce
            </Link>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <Link to="/owner/listings/create" className="action-card">
            <FiPlusCircle />
            <span>Créer une annonce</span>
          </Link>
          <Link to="/owner/dashboard/requests" className="action-card">
            <FiMessageSquare />
            <span>Voir les demandes</span>
          </Link>
          <Link to="/owner/dashboard/messages" className="action-card">
            <FiMessageSquare />
            <span>Mes messages</span>
          </Link>
          <Link to="/owner/dashboard/reviews" className="action-card">
            <FiList />
            <span>Gérer les avis</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardHome;
