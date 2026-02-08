import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiMap } from 'react-icons/fi';
import ListingCard from '../../components/listings/ListingCard';
import SearchBar from '../../components/common/SearchBar';
import listingService from '../../services/listingService';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    propertyType: searchParams.get('propertyType') || '',
    amenities: searchParams.get('amenities') || '',
    minRooms: searchParams.get('minRooms') || '',
    search: searchParams.get('search') || ''
  });

  const amenitiesList = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'tv', label: 'TV' },
    { value: 'aircon', label: 'Climatisation' },
    { value: 'heating', label: 'Chauffage' },
    { value: 'washer', label: 'Machine à laver' },
    { value: 'kitchen', label: 'Cuisine équipée' },
    { value: 'parking', label: 'Parking' },
    { value: 'furnished', label: 'Meublé' }
  ];

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, [searchParams]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const response = await listingService.getListings({
        ...params,
        page: pagination.currentPage,
        limit: 12
      });
      setListings(response.data || []);
      setPagination({
        currentPage: response.currentPage || 1,
        pages: response.pages || 1,
        total: response.total || 0
      });
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    const newParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      amenities: '',
      minRooms: '',
      search: ''
    });
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="container">
          <SearchBar onSearch={handleSearch} compact />
        </div>
      </div>

      <div className="search-content">
        <aside className={`filters-sidebar ${showFilters ? 'active' : ''}`}>
          <div className="filters-header">
            <h3>Filtres</h3>
            <button onClick={clearFilters} className="clear-filters">
              Effacer
            </button>
          </div>

          <div className="filter-group">
            <label>Type de logement</label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <option value="">Tous</option>
              <option value="studio">Studio</option>
              <option value="apartment">Appartement</option>
              <option value="room">Chambre</option>
              <option value="shared-room">Chambre partagée</option>
              <option value="house">Maison</option>
              <option value="residence">Résidence</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Prix (TND/mois)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Nombre de pièces minimum</label>
            <select
              value={filters.minRooms}
              onChange={(e) => handleFilterChange('minRooms', e.target.value)}
            >
              <option value="">Tous</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Équipements</label>
            <div className="amenities-list">
              {amenitiesList.map(amenity => (
                <label key={amenity.value} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity.value)}
                    onChange={(e) => {
                      const current = filters.amenities ? filters.amenities.split(',') : [];
                      const updated = e.target.checked
                        ? [...current, amenity.value]
                        : current.filter(a => a !== amenity.value);
                      handleFilterChange('amenities', updated.filter(Boolean).join(','));
                    }}
                  />
                  {amenity.label}
                </label>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-block" onClick={applyFilters}>
            Appliquer les filtres
          </button>
        </aside>

        <main className="listings-main">
          <div className="listings-header">
            <p className="results-count">
              {loading ? 'Recherche...' : `${pagination.total} logement(s) trouvé(s)`}
            </p>
            <div className="view-controls">
              <button
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> Filtres
              </button>
              <div className="view-modes">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                  title="Vue grille"
                >
                  <FiGrid />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  title="Vue liste"
                >
                  <FiList />
                </button>
                <button
                  className={viewMode === 'map' ? 'active' : ''}
                  onClick={() => setViewMode('map')}
                  title="Vue carte"
                >
                  <FiMap />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Chargement des annonces...</p>
            </div>
          ) : listings.length > 0 ? (
            <>
              <div className={`listings-grid ${viewMode}`}>
                {listings.map(listing => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={pagination.currentPage === page ? 'active' : ''}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <h3>Aucun logement trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
