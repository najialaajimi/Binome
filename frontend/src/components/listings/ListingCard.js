import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiHome, FiHeart, FiStar } from 'react-icons/fi';
import './ListingCard.css';

const ListingCard = ({ listing, onFavorite }) => {
  const mainPhoto = listing.photos?.find(p => p.isMain) || listing.photos?.[0];
  
  return (
    <div className="listing-card">
      <Link to={`/listings/${listing._id}`} className="listing-card-link">
        <div className="listing-card-image">
          {mainPhoto ? (
            <img src={mainPhoto.url} alt={listing.title} />
          ) : (
            <div className="listing-card-placeholder">
              <FiHome />
            </div>
          )}
          {listing.featured && <span className="listing-badge featured">En vedette</span>}
          {listing.verified && <span className="listing-badge verified">Vérifié</span>}
        </div>
        
        <div className="listing-card-content">
          <div className="listing-card-header">
            <h3 className="listing-card-title">{listing.title}</h3>
            <span className="listing-card-price">
              {listing.price?.amount} {listing.price?.currency || 'TND'}
              <small>/{listing.price?.period === 'month' ? 'mois' : listing.price?.period}</small>
            </span>
          </div>
          
          <p className="listing-card-location">
            <FiMapPin />
            {listing.address?.city}, {listing.address?.street}
          </p>
          
          <div className="listing-card-details">
            <span className="listing-card-type">{listing.propertyType}</span>
            {listing.size?.rooms && <span>{listing.size.rooms} pièces</span>}
            {listing.size?.area && <span>{listing.size.area} m²</span>}
          </div>
          
          {listing.averageRating > 0 && (
            <div className="listing-card-rating">
              <FiStar className="star-icon" />
              <span>{listing.averageRating.toFixed(1)}</span>
              <small>({listing.totalReviews} avis)</small>
            </div>
          )}
        </div>
      </Link>
      
      {onFavorite && (
        <button 
          className="listing-card-favorite"
          onClick={(e) => {
            e.preventDefault();
            onFavorite(listing._id);
          }}
          aria-label="Ajouter aux favoris"
        >
          <FiHeart />
        </button>
      )}
    </div>
  );
};

export default ListingCard;
