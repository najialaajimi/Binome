import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiUser, FiList, FiPlusCircle, FiInbox, 
  FiMessageSquare, FiStar, FiSettings 
} from 'react-icons/fi';
import '../tenant/TenantDashboard.css';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/owner/dashboard', icon: <FiHome />, label: 'Tableau de bord', exact: true },
    { path: '/owner/dashboard/profile', icon: <FiUser />, label: 'Mon Profil' },
    { path: '/owner/dashboard/listings', icon: <FiList />, label: 'Mes Annonces' },
    { path: '/owner/listings/create', icon: <FiPlusCircle />, label: 'Nouvelle Annonce' },
    { path: '/owner/dashboard/requests', icon: <FiInbox />, label: 'Demandes' },
    { path: '/owner/dashboard/messages', icon: <FiMessageSquare />, label: 'Messages' },
    { path: '/owner/dashboard/reviews', icon: <FiStar />, label: 'Avis' },
    { path: '/owner/dashboard/settings', icon: <FiSettings />, label: 'Paramètres' }
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <FiUser />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">Propriétaire</span>
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

export default OwnerDashboard;
