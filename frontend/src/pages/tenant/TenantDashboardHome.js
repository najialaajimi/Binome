import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiSearch, FiCalendar, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import listingService from '../../services/listingService';
import bookingService from '../../services/bookingService';
import messageService from '../../services/messageService';
import ListingCard from '../../components/listings/ListingCard';
import './TenantDashboardHome.css';

const TenantDashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    favorites: 0,
    bookings: 0,
    unreadMessages: 0
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch favorites count from user object
        setStats(prev => ({
          ...prev,
          favorites: user?.favorites?.length || 0
        }));

        // Fetch bookings
        try {
          const bookingsRes = await bookingService.getMyBookings();
          setStats(prev => ({
            ...prev,
            bookings: bookingsRes.count || 0
          }));
        } catch (err) {
          console.error('Error fetching bookings:', err);
        }

        // Fetch unread messages
        try {
          const messagesRes = await messageService.getUnreadCount();
          setStats(prev => ({
            ...prev,
            unreadMessages: messagesRes.unreadCount || 0
          }));
        } catch (err) {
          console.error('Error fetching messages:', err);
        }

        // Fetch recommendations
        try {
          const listingsRes = await listingService.getFeaturedListings();
          setRecommendations(listingsRes.data?.slice(0, 3) || []);
        } catch (err) {
          console.error('Error fetching recommendations:', err);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="dashboard-home">
      <h1>Bienvenue, {user?.firstName} !</h1>
      <p className="subtitle">Voici un aperçu de votre espace locataire</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiHeart />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.favorites}</span>
            <span className="stat-label">Favoris</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.bookings}</span>
            <span className="stat-label">Réservations</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiMessageSquare />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.unreadMessages}</span>
            <span className="stat-label">Messages non lus</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>
          Recommandations pour vous
          <Link to="/search">Voir plus <FiArrowRight /></Link>
        </h2>
        {loading ? (
          <p>Chargement...</p>
        ) : recommendations.length > 0 ? (
          <div className="recommendations-grid">
            {recommendations.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiSearch />
            <p>Commencez votre recherche pour voir des recommandations</p>
            <Link to="/search" className="btn btn-primary">
              Rechercher un logement
            </Link>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <Link to="/search" className="action-card">
            <FiSearch />
            <span>Rechercher un logement</span>
          </Link>
          <Link to="/tenant/dashboard/favorites" className="action-card">
            <FiHeart />
            <span>Voir mes favoris</span>
          </Link>
          <Link to="/tenant/dashboard/messages" className="action-card">
            <FiMessageSquare />
            <span>Mes messages</span>
          </Link>
          <Link to="/tenant/dashboard/roommate-finder" className="action-card">
            <FiSearch />
            <span>Trouver un binôme</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboardHome;
