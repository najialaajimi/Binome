import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">Binôme</h3>
          <p className="footer-desc">
            La plateforme de référence pour trouver votre logement étudiant en Tunisie. 
            Simplifiez votre recherche de logement.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/search">Rechercher</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/how-it-works">Comment ça marche</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Ressources</h4>
          <ul className="footer-links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/terms">Conditions d'utilisation</Link></li>
            <li><Link to="/privacy">Politique de confidentialité</Link></li>
            <li><Link to="/partners">Partenaires</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>
              <FiMapPin />
              <span>Tunis, Tunisie</span>
            </li>
            <li>
              <FiMail />
              <a href="mailto:contact@binome.tn">contact@binome.tn</a>
            </li>
            <li>
              <FiPhone />
              <a href="tel:+21671000000">+216 71 000 000</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Binôme. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
