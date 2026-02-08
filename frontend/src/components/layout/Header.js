import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiHeart, FiMessageSquare, FiLogOut, FiHome, FiSearch, FiPlusCircle } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'owner':
        return '/owner/dashboard';
      default:
        return '/tenant/dashboard';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Binôme</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link">
            <FiHome /> Accueil
          </Link>
          <Link to="/search" className="nav-link">
            <FiSearch /> Rechercher
          </Link>
          <Link to="/about" className="nav-link">
            À propos
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              {user.role === 'owner' && (
                <Link to="/owner/listings/create" className="btn btn-primary btn-sm">
                  <FiPlusCircle /> Publier
                </Link>
              )}
              <Link to={`${getDashboardLink()}/favorites`} className="icon-btn" title="Favoris">
                <FiHeart />
              </Link>
              <Link to={`${getDashboardLink()}/messages`} className="icon-btn" title="Messages">
                <FiMessageSquare />
              </Link>
              <div className="user-menu-container">
                <button 
                  className="user-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <FiUser />
                  <span>{user.firstName}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <Link to={getDashboardLink()} className="dropdown-item">
                      Tableau de bord
                    </Link>
                    <Link to={`${getDashboardLink()}/profile`} className="dropdown-item">
                      Mon profil
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <FiLogOut /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn btn-outline">
                Connexion
              </Link>
              <Link to="/auth?mode=register" className="btn btn-primary">
                S'inscrire
              </Link>
            </>
          )}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
