import React, { useState } from 'react';

const LandSizeCard = ({ landSize, landUnit, onUpdate, onNext, onPrevious, onSkipToHome, loading }) => {
  const [size, setSize] = useState(landSize || '');
  const [unit, setUnit] = useState(landUnit || 'acres');

  const landUnits = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'bigha', label: 'Bigha' },
    { value: 'guntha', label: 'Guntha' },
    { value: 'cent', label: 'Cent' }
  ];

  const handleNext = () => {
    const data = { landSize: size, landUnit: unit };
    onUpdate(data);
    onNext(data); // Pass data to API handler
  };

  const handleSkip = () => {
    onSkipToHome();
  };

  const hasEnteredData = size && parseFloat(size) > 0;

  return (
    <div className="profile-card">
      <div className="card-header">
        <h2 className="card-title">Land Size Information</h2>
        <p className="card-subtitle">
          Tell us about your farming land (Optional - you can skip this)
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="landSize">Total Land Size (Optional)</label>
          <div className="input-group">
            <input
              type="number"
              id="landSize"
              placeholder="Enter land size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              min="0"
              step="0.1"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              {landUnits.map((unitOption) => (
                <option key={unitOption.value} value={unitOption.value}>
                  {unitOption.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasEnteredData && (
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
              ✓ Land Size: <strong>{size} {unit}</strong>
            </p>
          </div>
        )}

        <div style={{
          backgroundColor: 'var(--color-light-green)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '1.5rem',
          border: '1px solid var(--color-primary)'
        }}>
          <h4 style={{ 
            color: 'var(--color-primary)', 
            margin: '0 0 0.5rem 0',
            fontSize: '1rem' 
          }}>
            💡 Why do we ask for land size?
          </h4>
          <p style={{ 
            color: 'var(--color-black)', 
            margin: 0,
            fontSize: '0.9rem',
            lineHeight: '1.5' 
          }}>
            This helps us provide more accurate recommendations for fertilizers, 
            seeds, and crop planning. You can always update this information later.
          </p>
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="btn btn-secondary"
          onClick={onPrevious}
        >
          ← Previous
        </button>
        <div className="btn-group">
          {!hasEnteredData && (
            <button 
              className="btn btn-skip"
              onClick={handleSkip}
            >
              Skip & Continue
            </button>
          )}
          {hasEnteredData && (
            <button 
              className="btn btn-primary"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandSizeCard;
