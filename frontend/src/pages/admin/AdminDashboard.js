import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiList, FiUsers, FiMessageSquare, 
  FiFileText, FiSettings, FiShield 
} from 'react-icons/fi';
import '../tenant/TenantDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Tableau de bord', exact: true },
    { path: '/admin/dashboard/listings', icon: <FiList />, label: 'Modération Annonces' },
    { path: '/admin/dashboard/users', icon: <FiUsers />, label: 'Gestion Utilisateurs' },
    { path: '/admin/dashboard/support', icon: <FiMessageSquare />, label: 'Support Client' },
    { path: '/admin/dashboard/content', icon: <FiFileText />, label: 'Gestion Contenus' },
    { path: '/admin/dashboard/settings', icon: <FiSettings />, label: 'Paramètres' }
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }}>
            <FiShield />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">Administrateur</span>
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

export default AdminDashboard;
