import React, { useState } from 'react';

const CityCard = ({ selectedCity, selectedState, onUpdate, onNext, onPrevious, loading }) => {
  const [city, setCity] = useState(selectedCity || '');

  // Major cities by state (focusing on Kerala since it's mentioned in requirements)
  const citiesByState = {
    'Kerala': [
      'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 
      'Palakkad', 'Alappuzha', 'Kannur', 'Kasaragod', 'Idukki', 
      'Kottayam', 'Malappuram', 'Pathanamthitta', 'Wayanad'
    ],
    'Tamil Nadu': [
      'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli',
      'Tirunelveli', 'Vellore', 'Erode', 'Thoothukudi', 'Thanjavur'
    ],
    'Karnataka': [
      'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum',
      'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga'
    ],
    'Andhra Pradesh': [
      'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
      'Rajahmundry', 'Tirupati', 'Kakinada', 'Eluru', 'Anantapur'
    ],
    // Add more states as needed
  };

  const availableCities = citiesByState[selectedState] || [];

  const handleNext = () => {
    if (city && city !== 'other') {
      const data = { city };
      onUpdate(data);
      onNext(data); // Pass data to API handler
    }
  };

  return (
    <div className="profile-card">
      <div className="card-header">
        <h2 className="card-title">Select Your City</h2>
        <p className="card-subtitle">
          Choose the city closest to your farm location in {selectedState}
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="city">City *</label>
          {availableCities.length > 0 ? (
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">Select your city</option>
              {availableCities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
              <option value="other">Other (Please specify below)</option>
            </select>
          ) : (
            <input
              type="text"
              id="city"
              placeholder="Enter your city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          )}
        </div>

        {city === 'other' && (
          <div className="form-group">
            <label htmlFor="customCity">Specify Your City *</label>
            <input
              type="text"
              id="customCity"
              placeholder="Enter your city name"
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
        )}

        {city && city !== 'other' && (
          <div style={{
            backgroundColor: 'var(--color-light-green)',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            border: '1px solid var(--color-primary)'
          }}>
            <p style={{ 
              color: 'var(--color-primary)', 
              margin: 0,
              fontSize: '0.9rem'
            }}>
              Selected: <strong>{city}, {selectedState}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button 
          className="btn btn-secondary"
          onClick={onPrevious}
        >
          ← Previous
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!city || city === 'other' || loading}
        >
          {loading ? 'Saving...' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default CityCard;
