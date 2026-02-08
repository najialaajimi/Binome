import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiUsers, FiShield, FiHeart } from 'react-icons/fi';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>À propos de Binôme</h1>
          <p>La plateforme qui simplifie la recherche de logement pour les étudiants et étrangers en Tunisie</p>
        </div>
      </section>

      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Notre Mission</h2>
              <p>
                Binôme est né d'un constat simple : trouver un logement adapté quand on est étudiant 
                ou étranger en Tunisie peut être un véritable parcours du combattant. Notre mission 
                est de simplifier cette expérience en créant une plateforme sécurisée, transparente 
                et conviviale.
              </p>
              <p>
                Nous mettons en relation des locataires en quête d'un logement adapté à leurs besoins 
                avec des propriétaires sérieux, tout en garantissant une expérience de qualité pour 
                les deux parties.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <FiTarget size={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <h2>Nos Valeurs</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FiShield />
              </div>
              <h3>Sécurité</h3>
              <p>
                Nous vérifions tous les propriétaires et leurs annonces pour garantir 
                la fiabilité des offres sur notre plateforme.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiUsers />
              </div>
              <h3>Communauté</h3>
              <p>
                Nous créons une communauté solidaire où étudiants et étrangers 
                peuvent s'entraider et trouver leur binôme idéal.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiHeart />
              </div>
              <h3>Simplicité</h3>
              <p>
                Notre plateforme est conçue pour être intuitive et facile à utiliser, 
                de la recherche à la réservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Logements</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Utilisateurs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Villes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <h2>Prêt à nous rejoindre ?</h2>
          <p>Commencez votre recherche de logement dès aujourd'hui</p>
          <div className="cta-buttons">
            <Link to="/search" className="btn btn-primary btn-lg">
              Trouver un logement
            </Link>
            <Link to="/auth?mode=register&role=owner" className="btn btn-outline btn-lg">
              Proposer un logement
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
