import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHome, FiShield, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';
import SearchBar from '../../components/common/SearchBar';
import ListingCard from '../../components/listings/ListingCard';
import listingService from '../../services/listingService';
import './HomePage.css';

const HomePage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await listingService.getFeaturedListings();
        setFeaturedListings(response.data || []);
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  const handleSearch = (params) => {
    const searchQuery = new URLSearchParams(params).toString();
    navigate(`/search?${searchQuery}`);
  };

  const features = [
    {
      icon: <FiSearch />,
      title: 'Recherche intelligente',
      description: 'Trouvez votre logement idéal grâce à nos filtres avancés et notre carte interactive.'
    },
    {
      icon: <FiShield />,
      title: 'Sécurité garantie',
      description: 'Tous les propriétaires et logements sont vérifiés pour votre tranquillité.'
    },
    {
      icon: <FiUsers />,
      title: 'Communauté active',
      description: 'Rejoignez des milliers d\'étudiants et trouvez votre binôme idéal.'
    },
    {
      icon: <FiHome />,
      title: 'Logements adaptés',
      description: 'Des logements spécialement sélectionnés pour les étudiants et étrangers.'
    }
  ];

  const testimonials = [
    {
      name: 'Sara M.',
      role: 'Étudiante en médecine',
      text: 'Grâce à Binôme, j\'ai trouvé un appartement proche de ma faculté en moins d\'une semaine !',
      rating: 5
    },
    {
      name: 'Ahmed K.',
      role: 'Étudiant étranger',
      text: 'La plateforme m\'a permis de trouver un logement avant même mon arrivée en Tunisie.',
      rating: 5
    },
    {
      name: 'Fatma B.',
      role: 'Propriétaire',
      text: 'En tant que propriétaire, je trouve facilement des locataires sérieux et vérifiés.',
      rating: 5
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Trouvez votre logement étudiant en Tunisie</h1>
          <p>La plateforme de référence pour les étudiants et les étrangers à la recherche d'un logement adapté à leurs besoins.</p>
          <div className="hero-cta">
            <Link to="/search" className="btn btn-primary btn-lg">
              <FiSearch /> Trouver un logement
            </Link>
            <Link to="/auth?mode=register&role=owner" className="btn btn-outline btn-lg">
              <FiHome /> Proposer un logement
            </Link>
          </div>
        </div>
        <div className="hero-search">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Pourquoi choisir Binôme ?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="listings-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Logements recommandés</h2>
            <Link to="/search" className="section-link">
              Voir tout <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : featuredListings.length > 0 ? (
            <div className="listings-grid">
              {featuredListings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="no-listings">
              <p>Aucun logement disponible pour le moment.</p>
              <Link to="/auth?mode=register&role=owner" className="btn btn-primary">
                Soyez le premier à publier
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Ce que disent nos utilisateurs</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="star" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Prêt à trouver votre logement ?</h2>
          <p>Rejoignez des milliers d'étudiants qui ont trouvé leur logement grâce à Binôme.</p>
          <div className="cta-buttons">
            <Link to="/auth?mode=register" className="btn btn-primary btn-lg">
              Créer un compte
            </Link>
            <Link to="/how-it-works" className="btn btn-outline-light btn-lg">
              Comment ça marche
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
