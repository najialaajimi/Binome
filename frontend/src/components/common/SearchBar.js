import React from 'react';
import './SearchBar.css';
import { FiSearch, FiMapPin, FiDollarSign, FiHome } from 'react-icons/fi';

const SearchBar = ({ onSearch, compact = false }) => {
  const [searchParams, setSearchParams] = React.useState({
    search: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const cities = [
    'Tunis', 'Sousse', 'Sfax', 'Monastir', 'Hammamet',
    'Nabeul', 'Bizerte', 'Gabès', 'Ariana', 'Ben Arous'
  ];

  const propertyTypes = [
    { value: 'studio', label: 'Studio' },
    { value: 'apartment', label: 'Appartement' },
    { value: 'room', label: 'Chambre' },
    { value: 'shared-room', label: 'Chambre partagée' },
    { value: 'house', label: 'Maison' },
    { value: 'residence', label: 'Résidence' }
  ];

  return (
    <form className={`search-bar ${compact ? 'compact' : ''}`} onSubmit={handleSubmit}>
      <div className="search-field search-main">
        <FiSearch className="search-icon" />
        <input
          type="text"
          name="search"
          placeholder="Rechercher un logement..."
          value={searchParams.search}
          onChange={handleChange}
        />
      </div>

      <div className="search-field">
        <FiMapPin className="search-icon" />
        <select name="city" value={searchParams.city} onChange={handleChange}>
          <option value="">Ville</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <FiHome className="search-icon" />
        <select name="propertyType" value={searchParams.propertyType} onChange={handleChange}>
          <option value="">Type</option>
          {propertyTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="search-field price-range">
        <FiDollarSign className="search-icon" />
        <input
          type="number"
          name="minPrice"
          placeholder="Min"
          value={searchParams.minPrice}
          onChange={handleChange}
        />
        <span className="price-separator">-</span>
        <input
          type="number"
          name="maxPrice"
          placeholder="Max"
          value={searchParams.maxPrice}
          onChange={handleChange}
        />
        <span className="price-currency">TND</span>
      </div>

      <button type="submit" className="search-btn">
        <FiSearch />
        <span>Rechercher</span>
      </button>
    </form>
  );
};

export default SearchBar;
