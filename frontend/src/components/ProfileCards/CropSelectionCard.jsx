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
    <div className="profile-card crop-selection-card">
      <div className="card-header">
        <h2 className="card-title">Select Your Crops</h2>
        <p className="card-subtitle">
          Choose the crops you grow or plan to grow
        </p>
      </div>

      <div className="card-content">
        <div className="add-crop-section">
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
            className="add-crop-btn"
            onClick={handleAddCrop}
            disabled={!selectedCrop && !customCrop}
            type="button"
          >
          </button>
        </div>

        {/* Selected Crops Display */}
        {crops.length > 0 && (
          <div className="selected-crops-container">
            <h4 className="crops-title">
              Your Selected Crops:
            </h4>
            <div className="crops-grid">
              {crops.map((crop, index) => (
                <div key={index} className="crop-tag">
                  <span className="crop-name">{crop}</span>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveCrop(crop)}
                    aria-label={`Remove ${crop}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {crops.length === 0 && (
          <div className="empty-state">
            <p>Please add at least one crop to continue</p>
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
