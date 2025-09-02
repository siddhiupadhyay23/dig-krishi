import React, { useState } from 'react';

const CropSelectionCard = ({ selectedCrops, onUpdate, onPrevious, onFinish, loading }) => {
  const [crops, setCrops] = useState(selectedCrops || []);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [customCrop, setCustomCrop] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Kerala native crops
  const keralaCrops = [
    'Rice (Paddy)', 'Coconut', 'Black Pepper', 'Cardamom', 'Rubber',
    'Tea', 'Coffee', 'Areca Nut', 'Cashew', 'Banana', 'Tapioca',
    'Ginger', 'Turmeric', 'Vanilla', 'Nutmeg'
  ];

  const handleAddCrop = () => {
    const cropToAdd = showCustomInput ? customCrop : selectedCrop;
    
    if (cropToAdd && !crops.includes(cropToAdd)) {
      const updatedCrops = [...crops, cropToAdd];
      setCrops(updatedCrops);
      onUpdate({ selectedCrops: updatedCrops });
      
      // Reset inputs
      setSelectedCrop('');
      setCustomCrop('');
      setShowCustomInput(false);
    }
  };

  const handleRemoveCrop = (cropToRemove) => {
    const updatedCrops = crops.filter(crop => crop !== cropToRemove);
    setCrops(updatedCrops);
    onUpdate({ selectedCrops: updatedCrops });
  };

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value === 'other') {
      setShowCustomInput(true);
      setSelectedCrop('');
    } else {
      setShowCustomInput(false);
      setSelectedCrop(value);
    }
  };

  const handleFinish = () => {
    const data = { selectedCrops: crops };
    onUpdate(data);
    onFinish(data); // Pass data to API handler
  };

  return (
    <div className="profile-card">
      <div className="card-header">
        <h2 className="card-title">Select Your Crops</h2>
        <p className="card-subtitle">
          Choose the crops you grow or plan to grow
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="cropSelect">Add Crop</label>
          <select
            id="cropSelect"
            value={selectedCrop}
            onChange={handleDropdownChange}
          >
            <option value="">Select a crop</option>
            {keralaCrops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
            <option value="other">Other (Please specify)</option>
          </select>
        </div>

        {showCustomInput && (
          <div className="form-group">
            <label htmlFor="customCrop">Enter Crop Name</label>
            <input
              type="text"
              id="customCrop"
              placeholder="Enter crop name"
              value={customCrop}
              onChange={(e) => setCustomCrop(e.target.value)}
            />
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleAddCrop}
          disabled={!selectedCrop && !customCrop}
          style={{ marginBottom: '1.5rem', width: '100%' }}
        >
          Add Crop
        </button>

        {/* Selected Crops Display */}
        {crops.length > 0 && (
          <div style={{
            backgroundColor: 'var(--color-light-green)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--color-primary)'
          }}>
            <h4 style={{ 
              color: 'var(--color-primary)', 
              margin: '0 0 1rem 0',
              fontSize: '1rem' 
            }}>
              🌾 Your Selected Crops:
            </h4>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}>
              {crops.map((crop, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-white)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{crop}</span>
                  <button
                    onClick={() => handleRemoveCrop(crop)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-white)',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '1.2rem',
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {crops.length === 0 && (
          <div style={{
            backgroundColor: 'var(--color-light-green)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginTop: '1rem',
            border: '1px solid var(--color-primary)',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: 'var(--color-primary)', 
              margin: 0,
              fontSize: '0.9rem'
            }}>
              Please add at least one crop to continue
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
          className="btn btn-finish"
          onClick={handleFinish}
          disabled={crops.length === 0 || loading}
        >
          {loading ? 'Completing...' : 'Finish Setup 🎉'}
        </button>
      </div>
    </div>
  );
};

export default CropSelectionCard;
