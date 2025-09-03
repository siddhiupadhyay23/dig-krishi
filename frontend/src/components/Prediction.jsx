import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Prediction.scss';

const Prediction = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('crop-prediction');
  const [predictionForm, setPredictionForm] = useState({
    crop: '',
    area: '',
    season: '',
    soilType: '',
    location: '',
    previousYield: ''
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const crops = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'coconut', label: 'Coconut' },
    { value: 'pepper', label: 'Black Pepper' },
    { value: 'cardamom', label: 'Cardamom' },
    { value: 'rubber', label: 'Rubber' },
    { value: 'banana', label: 'Banana' },
    { value: 'sugarcane', label: 'Sugarcane' }
  ];

  const seasons = [
    { value: 'kharif', label: 'Kharif (Monsoon)' },
    { value: 'rabi', label: 'Rabi (Winter)' },
    { value: 'summer', label: 'Summer' },
    { value: 'perennial', label: 'Perennial' }
  ];

  const soilTypes = [
    { value: 'alluvial', label: 'Alluvial Soil' },
    { value: 'red', label: 'Red Soil' },
    { value: 'laterite', label: 'Laterite Soil' },
    { value: 'coastal', label: 'Coastal Sandy Soil' },
    { value: 'forest', label: 'Forest Soil' }
  ];

  const weatherData = {
    current: {
      location: 'Kochi, Kerala',
      temperature: '29°C',
      condition: 'Partly Cloudy',
      humidity: '78%',
      windSpeed: '12 km/h',
      rainfall: '12mm',
      uvIndex: 'Moderate'
    },
    forecast: [
      { day: 'Today', temp: '29°C', condition: 'Partly Cloudy', icon: '⛅', rain: '20%' },
      { day: 'Tomorrow', temp: '31°C', condition: 'Sunny', icon: '☀️', rain: '5%' },
      { day: 'Wed', temp: '28°C', condition: 'Rainy', icon: '🌧️', rain: '80%' },
      { day: 'Thu', temp: '27°C', condition: 'Cloudy', icon: '☁️', rain: '40%' },
      { day: 'Fri', temp: '30°C', condition: 'Sunny', icon: '☀️', rain: '10%' },
      { day: 'Sat', temp: '29°C', condition: 'Partly Cloudy', icon: '⛅', rain: '30%' },
      { day: 'Sun', temp: '28°C', condition: 'Light Rain', icon: '🌦️', rain: '60%' }
    ],
    alerts: [
      { type: 'warning', message: 'Heavy rainfall expected on Wednesday. Protect crops and ensure proper drainage.', priority: 'high' },
      { type: 'info', message: 'Ideal conditions for rice planting next week with good soil moisture.', priority: 'medium' },
      { type: 'advisory', message: 'Monitor for fungal diseases due to high humidity levels.', priority: 'low' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPredictionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePredictionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockPrediction = {
        crop: predictionForm.crop,
        expectedYield: '3.2 tons/hectare',
        confidence: '89%',
        yieldRange: '2.8 - 3.6 tons/hectare',
        marketPrice: '₹25,000 - ₹30,000 per ton',
        recommendations: [
          'Apply nitrogen-rich fertilizer in the next 2 weeks for optimal growth',
          'Monitor soil moisture levels closely due to upcoming weather changes',
          'Consider organic pest control methods to maintain crop health',
          'Plan harvesting for late October based on current growth patterns'
        ],
        riskFactors: [
          { factor: 'Weather Risk', level: 'Medium', description: 'Possible heavy rains may affect yield' },
          { factor: 'Pest Risk', level: 'Low', description: 'Current season has low pest activity' },
          { factor: 'Market Risk', level: 'Low', description: 'Stable market prices expected' }
        ],
        bestPractices: [
          'Implement drip irrigation to conserve water',
          'Use integrated pest management techniques',
          'Apply bio-fertilizers to improve soil health',
          'Regular field monitoring for early problem detection'
        ]
      };
      
      setPredictionResult(mockPrediction);
      setIsLoading(false);
    }, 2000);
  };

  const tabs = [
    { id: 'crop-prediction', label: 'Crop Prediction', icon: '🌾' },
    { id: 'weather-forecast', label: 'Weather Forecast', icon: '🌤️' },
    { id: 'market-trends', label: 'Market Trends', icon: '📈' }
  ];

  const renderCropPrediction = () => (
    <div className="crop-prediction-section">
      <div className="prediction-form-container">
        <div className="form-header">
          <h2>🌾 AI Crop Yield Prediction</h2>
          <p>Get accurate crop yield predictions based on advanced AI models and real-time data</p>
        </div>

        <form onSubmit={handlePredictionSubmit} className="prediction-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="crop">Select Crop</label>
              <select
                id="crop"
                name="crop"
                value={predictionForm.crop}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose a crop</option>
                {crops.map(crop => (
                  <option key={crop.value} value={crop.value}>{crop.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="area">Cultivation Area (hectares)</label>
              <input
                type="number"
                id="area"
                name="area"
                value={predictionForm.area}
                onChange={handleInputChange}
                placeholder="Enter area in hectares"
                min="0.1"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="season">Season</label>
              <select
                id="season"
                name="season"
                value={predictionForm.season}
                onChange={handleInputChange}
                required
              >
                <option value="">Select season</option>
                {seasons.map(season => (
                  <option key={season.value} value={season.value}>{season.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="soilType">Soil Type</label>
              <select
                id="soilType"
                name="soilType"
                value={predictionForm.soilType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select soil type</option>
                {soilTypes.map(soil => (
                  <option key={soil.value} value={soil.value}>{soil.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={predictionForm.location}
                onChange={handleInputChange}
                placeholder="Enter your location"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="previousYield">Previous Yield (tons/hectare)</label>
              <input
                type="number"
                id="previousYield"
                name="previousYield"
                value={predictionForm.previousYield}
                onChange={handleInputChange}
                placeholder="Enter previous yield (optional)"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <button type="submit" className="predict-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Analyzing Data...
              </>
            ) : (
              <>
                🔮 Generate Prediction
              </>
            )}
          </button>
        </form>

        {predictionResult && (
          <div className="prediction-results">
            <div className="results-header">
              <h3>🎯 Prediction Results for {predictionResult.crop.charAt(0).toUpperCase() + predictionResult.crop.slice(1)}</h3>
            </div>

            <div className="results-grid">
              <div className="result-card primary">
                <div className="result-icon">🌾</div>
                <div className="result-content">
                  <h4>Expected Yield</h4>
                  <p className="result-value">{predictionResult.expectedYield}</p>
                  <span className="confidence">Confidence: {predictionResult.confidence}</span>
                </div>
              </div>

              <div className="result-card">
                <div className="result-icon">📊</div>
                <div className="result-content">
                  <h4>Yield Range</h4>
                  <p className="result-value">{predictionResult.yieldRange}</p>
                </div>
              </div>

              <div className="result-card">
                <div className="result-icon">💰</div>
                <div className="result-content">
                  <h4>Market Price</h4>
                  <p className="result-value">{predictionResult.marketPrice}</p>
                </div>
              </div>
            </div>

            <div className="recommendations-section">
              <h4>📝 AI Recommendations</h4>
              <ul className="recommendations-list">
                {predictionResult.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="risk-analysis">
              <h4>⚠️ Risk Analysis</h4>
              <div className="risk-factors">
                {predictionResult.riskFactors.map((risk, index) => (
                  <div key={index} className={`risk-factor ${risk.level.toLowerCase()}`}>
                    <div className="risk-header">
                      <span className="risk-name">{risk.factor}</span>
                      <span className="risk-level">{risk.level}</span>
                    </div>
                    <p className="risk-description">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderWeatherForecast = () => (
    <div className="weather-section">
      <div className="weather-header">
        <h2>🌤️ Weather Forecast & Agricultural Advisory</h2>
        <p>7-day weather forecast with farming recommendations</p>
      </div>

      <div className="current-weather">
        <h3>Current Weather</h3>
        <div className="current-weather-card">
          <div className="weather-main">
            <div className="weather-icon">🌤️</div>
            <div className="weather-info">
              <h4>{weatherData.current.location}</h4>
              <p className="temperature">{weatherData.current.temperature}</p>
              <p className="condition">{weatherData.current.condition}</p>
            </div>
          </div>
          <div className="weather-details">
            <div className="detail-item">
              <span>Humidity</span>
              <span>{weatherData.current.humidity}</span>
            </div>
            <div className="detail-item">
              <span>Wind Speed</span>
              <span>{weatherData.current.windSpeed}</span>
            </div>
            <div className="detail-item">
              <span>Rainfall</span>
              <span>{weatherData.current.rainfall}</span>
            </div>
            <div className="detail-item">
              <span>UV Index</span>
              <span>{weatherData.current.uvIndex}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="forecast-section">
        <h3>7-Day Forecast</h3>
        <div className="forecast-grid">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="forecast-card">
              <div className="forecast-day">{day.day}</div>
              <div className="forecast-icon">{day.icon}</div>
              <div className="forecast-temp">{day.temp}</div>
              <div className="forecast-condition">{day.condition}</div>
              <div className="forecast-rain">Rain: {day.rain}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-alerts">
        <h3>🚨 Weather Alerts & Advisories</h3>
        <div className="alerts-list">
          {weatherData.alerts.map((alert, index) => (
            <div key={index} className={`alert-card ${alert.type} ${alert.priority}`}>
              <div className="alert-icon">
                {alert.type === 'warning' ? '⚠️' : alert.type === 'info' ? 'ℹ️' : '📢'}
              </div>
              <div className="alert-content">
                <div className="alert-priority">{alert.priority.toUpperCase()}</div>
                <p>{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMarketTrends = () => (
    <div className="market-section">
      <div className="market-header">
        <h2>📈 Market Trends & Price Predictions</h2>
        <p>Real-time market data and price forecasts for agricultural commodities</p>
      </div>

      <div className="market-overview">
        <div className="market-cards">
          <div className="market-card trending-up">
            <h4>Rice</h4>
            <p className="price">₹28,500/ton</p>
            <p className="trend">↗️ +12% this month</p>
          </div>
          <div className="market-card trending-down">
            <h4>Coconut</h4>
            <p className="price">₹15,200/ton</p>
            <p className="trend">↘️ -5% this month</p>
          </div>
          <div className="market-card stable">
            <h4>Black Pepper</h4>
            <p className="price">₹45,000/kg</p>
            <p className="trend">→ Stable</p>
          </div>
          <div className="market-card trending-up">
            <h4>Cardamom</h4>
            <p className="price">₹1,200/kg</p>
            <p className="trend">↗️ +18% this month</p>
          </div>
        </div>
      </div>

      <div className="market-insights">
        <h3>🧠 Market Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Best Time to Sell</h4>
            <p>Based on historical data and current trends, the optimal selling period for rice is expected to be in the next 2-3 weeks.</p>
          </div>
          <div className="insight-card">
            <h4>Demand Forecast</h4>
            <p>High demand expected for organic produce and spices during the upcoming festival season.</p>
          </div>
          <div className="insight-card">
            <h4>Export Opportunities</h4>
            <p>International demand for Kerala spices remains strong, with premium prices for certified organic products.</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="prediction">
      <Navbar />
      
      <div className="prediction-container">
        <div className="prediction-header">
          <div className="header-content">
            <h1>🔮 AI Prediction & Analytics</h1>
            <p>Advanced AI-powered predictions for crop yields, weather forecasting, and market trends</p>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.name || 'Farmer'}</span>
          </div>
        </div>

        <div className="prediction-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="prediction-content">
          {activeTab === 'crop-prediction' && renderCropPrediction()}
          {activeTab === 'weather-forecast' && renderWeatherForecast()}
          {activeTab === 'market-trends' && renderMarketTrends()}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
