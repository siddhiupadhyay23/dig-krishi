import React, { useState } from 'react';

const StateCard = ({ selectedState, onUpdate, onNext, onPrevious, loading }) => {
  const [state, setState] = useState(selectedState || '');

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const handleNext = () => {
    if (state) {
      const data = { state };
      onUpdate(data);
      onNext(data); // Pass data to API handler
    }
  };

  return (
    <div className="profile-card">
      <div className="card-header">
        <h2 className="card-title">Select Your State</h2>
        <p className="card-subtitle">
          Choose the state where your farm is located
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="state">State *</label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            <option value="">Select your state</option>
            {indianStates.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
        </div>

        {state && (
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
              ✓ Selected: <strong>{state}</strong>
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
          disabled={!state || loading}
        >
          {loading ? 'Saving...' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default StateCard;
