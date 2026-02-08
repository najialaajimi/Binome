import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiMapPin, FiCalendar, FiHome, FiHeart, FiShare2, FiMessageSquare, 
  FiChevronLeft, FiChevronRight, FiStar, FiCheck, FiUser
} from 'react-icons/fi';
import listingService from '../../services/listingService';
import { useAuth } from '../../context/AuthContext';
import './ListingDetailPage.css';

const ListingDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingService.getListing(id);
        setListing(response.data);
      } catch (err) {
        setError('Impossible de charger cette annonce');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const nextImage = () => {
    if (listing?.photos?.length) {
      setCurrentImageIndex((prev) => 
        prev === listing.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing?.photos?.length) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.photos.length - 1 : prev - 1
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAmenityLabel = (amenity) => {
    const labels = {
      'wifi': 'WiFi',
      'tv': 'TV',
      'aircon': 'Climatisation',
      'heating': 'Chauffage',
      'washer': 'Machine à laver',
      'dryer': 'Sèche-linge',
      'kitchen': 'Cuisine équipée',
      'parking': 'Parking',
      'elevator': 'Ascenseur',
      'balcony': 'Balcon',
      'garden': 'Jardin',
      'pool': 'Piscine',
      'gym': 'Salle de sport',
      'security': 'Sécurité 24h',
      'furnished': 'Meublé',
      'pets-allowed': 'Animaux acceptés',
      'smoking-allowed': 'Fumeur autorisé',
      'wheelchair-accessible': 'Accessible PMR'
    };
    return labels[amenity] || amenity;
  };

  if (loading) {
    return (
      <div className="listing-detail-page">
        <div className="loading-container">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="listing-detail-page">
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error || 'Annonce non trouvée'}</p>
          <Link to="/search" className="btn btn-primary">
            Retour à la recherche
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-detail-page">
      {/* Image Gallery */}
      <section className="gallery-section">
        <div className="gallery-main">
          {listing.photos?.length > 0 ? (
            <>
              <img 
                src={listing.photos[currentImageIndex]?.url} 
                alt={`${listing.title} - ${currentImageIndex + 1}`} 
              />
              <button className="gallery-nav prev" onClick={prevImage}>
                <FiChevronLeft />
              </button>
              <button className="gallery-nav next" onClick={nextImage}>
                <FiChevronRight />
              </button>
              <div className="gallery-counter">
                {currentImageIndex + 1} / {listing.photos.length}
              </div>
            </>
          ) : (
            <div className="no-image">
              <FiHome />
              <p>Aucune photo disponible</p>
            </div>
          )}
        </div>
        {listing.photos?.length > 1 && (
          <div className="gallery-thumbnails">
            {listing.photos.slice(0, 5).map((photo, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={photo.url} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
            {listing.photos.length > 5 && (
              <button className="thumbnail more">
                +{listing.photos.length - 5}
              </button>
            )}
          </div>
        )}
      </section>

      <div className="listing-content">
        <div className="listing-main">
          {/* Header */}
          <div className="listing-header">
            <div className="listing-badges">
              {listing.verified && <span className="badge verified">Vérifié</span>}
              {listing.featured && <span className="badge featured">En vedette</span>}
              <span className="badge type">{listing.propertyType}</span>
            </div>
            <h1>{listing.title}</h1>
            <p className="listing-location">
              <FiMapPin /> {listing.address?.street}, {listing.address?.city}
            </p>
            <div className="listing-actions">
              <button className="action-btn">
                <FiHeart /> Favoris
              </button>
              <button className="action-btn">
                <FiShare2 /> Partager
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="quick-info">
            <div className="info-item">
              <span className="info-value">{listing.size?.rooms || '-'}</span>
              <span className="info-label">Pièces</span>
            </div>
            <div className="info-item">
              <span className="info-value">{listing.size?.bedrooms || '-'}</span>
              <span className="info-label">Chambres</span>
            </div>
            <div className="info-item">
              <span className="info-value">{listing.size?.bathrooms || '-'}</span>
              <span className="info-label">Salles de bain</span>
            </div>
            <div className="info-item">
              <span className="info-value">{listing.size?.area || '-'}</span>
              <span className="info-label">m²</span>
            </div>
          </div>

          {/* Description */}
          <div className="section">
            <h2>Description</h2>
            <p className="description">{listing.description}</p>
          </div>

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <div className="section">
              <h2>Équipements</h2>
              <div className="amenities-grid">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <FiCheck /> {getAmenityLabel(amenity)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="section">
            <h2>Disponibilité</h2>
            <div className="availability-info">
              <div className="availability-item">
                <FiCalendar />
                <div>
                  <span className="label">Disponible à partir du</span>
                  <span className="value">{formatDate(listing.availability?.startDate)}</span>
                </div>
              </div>
              {listing.availability?.minStay && (
                <div className="availability-item">
                  <FiCalendar />
                  <div>
                    <span className="label">Durée minimum</span>
                    <span className="value">{listing.availability.minStay} mois</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Universities */}
          {listing.nearbyUniversities?.length > 0 && (
            <div className="section">
              <h2>Universités à proximité</h2>
              <div className="nearby-list">
                {listing.nearbyUniversities.map((uni, index) => (
                  <div key={index} className="nearby-item">
                    <span className="name">{uni.name}</span>
                    <span className="distance">{uni.distance} km</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="section">
            <h2>
              Avis 
              {listing.averageRating > 0 && (
                <span className="rating-badge">
                  <FiStar /> {listing.averageRating.toFixed(1)} ({listing.totalReviews} avis)
                </span>
              )}
            </h2>
            {listing.totalReviews > 0 ? (
              <p>Les avis seront affichés ici...</p>
            ) : (
              <p className="no-reviews">Aucun avis pour le moment</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="listing-sidebar">
          <div className="price-card">
            <div className="price">
              <span className="amount">{listing.price?.amount} {listing.price?.currency || 'TND'}</span>
              <span className="period">/{listing.price?.period === 'month' ? 'mois' : listing.price?.period}</span>
            </div>
            {listing.price?.deposit && (
              <p className="deposit">Caution: {listing.price.deposit} TND</p>
            )}
            {listing.price?.utilities?.included && (
              <p className="utilities">Charges incluses</p>
            )}
          </div>

          <div className="owner-card">
            <h3>Propriétaire</h3>
            <div className="owner-info">
              <div className="owner-avatar">
                <FiUser />
              </div>
              <div className="owner-details">
                <span className="owner-name">
                  {listing.owner?.firstName} {listing.owner?.lastName}
                </span>
                <span className="owner-since">
                  Membre depuis {new Date(listing.owner?.createdAt).getFullYear()}
                </span>
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-block"
                onClick={() => setShowContactForm(!showContactForm)}
              >
                <FiMessageSquare /> Contacter le propriétaire
              </button>
              <Link to={`/booking/${listing._id}`} className="btn btn-outline btn-block">
                <FiCalendar /> Demander une visite
              </Link>
            </div>
          ) : (
            <div className="login-prompt">
              <p>Connectez-vous pour contacter le propriétaire</p>
              <Link to="/auth" className="btn btn-primary btn-block">
                Se connecter
              </Link>
            </div>
          )}

          {showContactForm && (
            <div className="contact-form">
              <textarea
                placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                rows={4}
              ></textarea>
              <button className="btn btn-primary btn-block">
                Envoyer le message
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ListingDetailPage;
