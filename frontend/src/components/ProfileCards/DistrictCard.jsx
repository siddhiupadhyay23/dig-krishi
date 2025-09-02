import React, { useState } from 'react';

const DistrictCard = ({ selectedDistrict, selectedState, onUpdate, onNext, onPrevious, loading }) => {
  const [district, setDistrict] = useState(selectedDistrict || '');

  // Districts by state (focusing on Kerala and adding Assam since user selected it)
  const districtsByState = {
    'Kerala': [
      'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
      'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
      'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
    ],
    'Assam': [
      'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo',
      'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao',
      'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup',
      'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar',
      'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
      'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ],
    'Tamil Nadu': [
      'Ariyalur', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
      'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
      'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
      'Ramanathapuram', 'Salem', 'Sivaganga', 'Thanjavur', 'Theni', 'Thoothukudi',
      'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai',
      'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
    ],
    'Karnataka': [
      'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
      'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga',
      'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
      'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur',
      'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
    ],
    // Add more states as needed
  };

  const availableDistricts = districtsByState[selectedState] || [];

  const handleNext = () => {
    if (district && district !== 'other') {
      const data = { district };
      onUpdate(data);
      onNext(data); // Pass data to API handler
    }
  };

  return (
    <div className="profile-card">
      <div className="card-header">
        <h2 className="card-title">Select Your District</h2>
        <p className="card-subtitle">
          Choose the district where your farm is located in {selectedState}
        </p>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label htmlFor="district">District *</label>
          {availableDistricts.length > 0 ? (
            <select
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            >
              <option value="">Select your district</option>
              {availableDistricts.map((districtName) => (
                <option key={districtName} value={districtName}>
                  {districtName}
                </option>
              ))}
              <option value="other">Other (Please specify below)</option>
            </select>
          ) : (
            <input
              type="text"
              id="district"
              placeholder="Enter your district name"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          )}
        </div>

        {district === 'other' && (
          <div className="form-group">
            <label htmlFor="customDistrict">Specify Your District *</label>
            <input
              type="text"
              id="customDistrict"
              placeholder="Enter your district name"
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>
        )}

        {district && district !== 'other' && (
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
              ✓ Selected: <strong>{district} District, {selectedState}</strong>
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
          disabled={!district || district === 'other' || loading}
        >
          {loading ? 'Saving...' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default DistrictCard;
