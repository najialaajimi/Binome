import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiUser, FiHeart, FiSearch, FiMessageSquare, 
  FiCalendar, FiUsers, FiSettings 
} from 'react-icons/fi';
import './TenantDashboard.css';

const TenantDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/tenant/dashboard', icon: <FiHome />, label: 'Tableau de bord', exact: true },
    { path: '/tenant/dashboard/profile', icon: <FiUser />, label: 'Mon Profil' },
    { path: '/tenant/dashboard/favorites', icon: <FiHeart />, label: 'Favoris' },
    { path: '/tenant/dashboard/searches', icon: <FiSearch />, label: 'Mes Recherches' },
    { path: '/tenant/dashboard/messages', icon: <FiMessageSquare />, label: 'Messages' },
    { path: '/tenant/dashboard/bookings', icon: <FiCalendar />, label: 'Réservations' },
    { path: '/tenant/dashboard/roommate-finder', icon: <FiUsers />, label: 'Trouver un binôme' },
    { path: '/tenant/dashboard/settings', icon: <FiSettings />, label: 'Paramètres' }
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            <FiUser />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">Locataire</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default TenantDashboard;
