import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import weatherService from '../services/weatherService';
import { 
  SunIcon, 
  CloudIcon,
  RainIcon,
  PartlyCloudyIcon,
  LightningIcon,
  TomatoIcon, 
  LocationIcon, 
  SeedlingIcon, 
  WindIcon, 
  ThermometerIcon, 
  WaterIcon, 
  SproutIcon, 
  RiceIcon,
  AIIcon,
  SatelliteIcon,
  ProcessingIcon,
  NetworkIcon,
  BellIcon,
  CreditCardIcon,
  GovernmentIcon,
  SchemeIcon,
  AdvisoryIcon,
  RocketIcon,
  HumidityIcon
} from './icons';
import './Dashboard.scss';

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [weatherIconError, setWeatherIconError] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'weather-scheme',
      title: 'Kisan Credit Card',
      description: 'Apply for subsidized loans for crop cultivation during sunny weather',
      icon: <CreditCardIcon size={20} />,
      isNew: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'weather-scheme',
      title: 'PM-KISAN Scheme',
      description: 'Get ₹6000/year direct benefit transfer for small farmers',
      icon: <GovernmentIcon size={20} />,
      isNew: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'new-feature',
      title: 'New: AI Crop Advisor',
      description: 'Get personalized crop recommendations based on weather patterns',
      icon: <AIIcon size={20} />,
      isNew: true,
      priority: 'high'
    },
    {
      id: 4,
      type: 'weather-alert',
      title: 'Weather Advisory',
      description: 'Sunny conditions perfect for harvesting. Plan accordingly.',
      icon: <SunIcon size={20} />,
      isNew: false,
      priority: 'medium'
    }
  ]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  
  // Fetch weather data on component mount
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError(null);
        
        const weather = await weatherService.getCurrentWeather();
        setWeatherData(weather);
        
        // Update notifications with weather-based schemes
        const weatherSchemes = weatherService.getWeatherBasedSchemes(weather);
        const weatherRecommendations = weatherService.getWeatherRecommendations(weather);
        
        // Add weather-based notifications
        const updatedNotifications = [
          ...weatherSchemes.map((scheme, index) => ({
            id: `weather-scheme-${index}`,
            type: 'weather-scheme',
            title: scheme.title,
            description: scheme.description,
            icon: scheme.icon,
            isNew: false,
            priority: scheme.priority
          })),
          ...weatherRecommendations.slice(0, 2).map((rec, index) => ({
            id: `weather-rec-${index}`,
            type: 'weather-alert',
            title: rec.title,
            description: rec.message,
            icon: getWeatherIcon(weather.current.main),
            isNew: false,
            priority: rec.type === 'warning' ? 'high' : 'medium'
          })),
          ...notifications
        ];
        
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setWeatherError(error.message);
      } finally {
        setWeatherLoading(false);
      }
    };
    
    fetchWeatherData();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Show popup if there are new notifications
    const hasNewNotifications = notifications.some(n => n.isNew);
    if (hasNewNotifications) {
      setShowNotificationPopup(true);
      // Auto-hide popup after 5 seconds
      const timer = setTimeout(() => {
        setShowNotificationPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  
  // Helper function to get weather icon component
  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear': return <SunIcon size={20} />;
      case 'clouds': return <CloudIcon size={20} />;
      case 'rain': return <RainIcon size={20} />;
      case 'drizzle': return <PartlyCloudyIcon size={20} />;
      case 'thunderstorm': return <LightningIcon size={20} />;
      case 'snow': return <CloudIcon size={20} />;
      case 'mist':
      case 'fog': return <CloudIcon size={20} />;
      default: return <PartlyCloudyIcon size={20} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isNew: false } : n)
    );
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main">
        {/* Left Section */}
        <div className="left-section">
          {/* Weather and Notifications Row */}
          <div className="top-cards-row">
            {/* Weather Card */}
            <div className="weather-card">
              {weatherLoading ? (
                <div className="weather-loading">
                  <div className="loading-spinner"></div>
                  <span>Loading weather...</span>
                </div>
              ) : weatherError ? (
                <div className="weather-error">
                  <div className="temperature">--°C</div>
                  <div className="weather-status">
                    <span className="weather-text">Weather Unavailable</span>
                  </div>
                  <div className="weather-details">
                    <span>Check connection</span>
                  </div>
                </div>
              ) : weatherData ? (
                <>
                  <div className="temperature">{weatherData.current.temperature}°C</div>
                  <div className="weather-status">
                    {!weatherIconError ? (
                      <img 
                        src={weatherService.getIconUrl(weatherData.current.icon, '1x')} 
                        alt={weatherData.current.description}
                        className="weather-icon"
                        onError={() => setWeatherIconError(true)}
                        onLoad={() => setWeatherIconError(false)}
                      />
                    ) : (
                      <span className="weather-icon-emoji">
                        {getWeatherIcon(weatherData.current.main)}
                      </span>
                    )}
                    <span className="weather-text">{weatherData.current.main}</span>
                  </div>
                  <div className="weather-details">
                    <span>H: {weatherData.daily.tempMax}°C</span>
                    <span>L: {weatherData.daily.tempMin}°C</span>
                  </div>
                  <div className="weather-location">
                    <LocationIcon size={14} /> {weatherData.location.name}
                  </div>
                </>
              ) : (
                <div className="weather-fallback">
                  <div className="temperature">24°C</div>
                  <div className="weather-status">
                    <SunIcon className="weather-icon" size={20} />
                    <span className="weather-text">Sunny</span>
                  </div>
                  <div className="weather-details">
                    <span>H: 28°C</span>
                    <span>L: 22°C</span>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Card */}
            <div className="notifications-card">
              <div className="notifications-header">
                <h3>{t('dashboard.notifications')}</h3>
                <span className="notification-count">{notifications.filter(n => n.isNew).length}</span>
              </div>
              <div className="notifications-list">
                {notifications.slice(0, 3).map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.isNew ? 'new' : ''} ${notification.priority}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-icon">{notification.icon}</div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-desc">{notification.description}</div>
                    </div>
                    {notification.isNew && <div className="new-badge">New</div>}
                  </div>
                ))}
              </div>
              <button className="view-all-notifications">{t('dashboard.viewAllNotifications')}</button>
            </div>
          </div>

          {/* Google Maps Farm View */}
          <div className="farm-map-card">
            <div className="map-header">
              <h3><AIIcon className="crop-icon" size={18} /> AI Crop Health Analysis</h3>
              <div className="location-info">
                <span className="field-code">AI-CHA-01</span>
                <span className="area"><LocationIcon className="area-icon" size={14} /> Coverage: 500m²</span>
                <span className="health-status"><SeedlingIcon className="health-icon" size={14} /> Analysis Active</span>
              </div>
            </div>
            <div className="map-container">
              {/* Google Maps Embed */}
              <div className="google-maps-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15282.225633173935!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0x14f8c3e6b1c0e8a9!2sAI%20Research%20Center%2C%20Bangalore%2C%20Karnataka%2C%20India!5e1!3m2!1sen!2sin!4v1635724000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AI Crop Health Analysis Location"
                ></iframe>
              </div>
              
              {/* Farm Overlay Indicators */}
              <div className="farm-overlays">
                {/* Sensor markers */}
                <div className="sensor-marker sensor-1" title="Soil Moisture Sensor">
                  <div className="marker-dot"></div>
                  <div className="marker-pulse"></div>
                  <span className="marker-label">SM-01</span>
                </div>
                <div className="sensor-marker sensor-2" title="Temperature Sensor">
                  <div className="marker-dot"></div>
                  <div className="marker-pulse"></div>
                  <span className="marker-label">TP-01</span>
                </div>
                <div className="sensor-marker sensor-3" title="Irrigation Controller">
                  <div className="marker-dot irrigation"></div>
                  <div className="marker-pulse irrigation"></div>
                  <span className="marker-label">IC-01</span>
                </div>
                
                {/* Farm zones */}
                <div className="farm-zone analysis-zone" title="AI Analysis Area">
                  <span className="zone-label"><AIIcon size={12} /> Zone A</span>
                </div>
                <div className="farm-zone monitoring-zone" title="Crop Monitoring">
                  <span className="zone-label"><SatelliteIcon size={12} /> Mon-1</span>
                </div>
              </div>
              
              {/* Map controls */}
              <div className="map-controls">
                <button className="map-control-btn satellite" title="Satellite View">
                  <SatelliteIcon size={16} />
                </button>
                <button className="map-control-btn terrain" title="Terrain View">
                  <SeedlingIcon size={16} />
                </button>
                <button className="map-control-btn fullscreen" title="Fullscreen">
                  <NetworkIcon size={16} />
                </button>
              </div>
              
              {/* Map legend */}
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color sensor"></div>
                  <span>IoT Sensors</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color irrigation"></div>
                  <span>Irrigation</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color zones"></div>
                  <span>Crop Zones</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Cards Grid */}
          <div className="env-cards-row">
            <div className="env-card plant-health">
              <SeedlingIcon className="card-icon" size={24} />
              <div className="card-content">
                <div className="card-title">Plant Health</div>
                <div className="card-value">
                  94% <span className="status-badge good">Good</span>
                </div>
                <div className="card-subtitle">Your plants are thriving and showing excellent health</div>
              </div>
              <div className="card-arrow">›</div>
            </div>
            
            <div className="env-card wind">
              <WindIcon className="card-icon" size={24} />
              <div className="card-content">
                <div className="card-title">Wind</div>
                <div className="card-value">
                  {weatherData ? weatherData.current.windSpeed.toFixed(1) : '2'} <span className="unit">m/s</span>
                </div>
                <div className="card-subtitle">
                  {weatherData && weatherData.current.windSpeed > 10 
                    ? 'Strong winds - secure plants and avoid spraying'
                    : 'Good airflow conditions for crops'
                  }
                </div>
              </div>
              <div className="card-arrow">›</div>
            </div>
            
            <div className="env-card temperature">
              <ThermometerIcon className="card-icon" size={24} />
              <div className="card-content">
                <div className="card-title">Temperature</div>
                <div className="card-value">
                  {weatherData ? weatherData.current.temperature : '18'}°C
                </div>
                <div className="card-subtitle">
                  {weatherData ? (
                    weatherData.current.temperature > 35 ? 'Very hot - provide shade for crops' :
                    weatherData.current.temperature > 25 ? 'Ideal temperature for farming' :
                    weatherData.current.temperature > 15 ? 'Good growing conditions' :
                    'Cool weather - monitor cold-sensitive crops'
                  ) : 'Maintain consistent between 15°C and 20°C'}
                </div>
              </div>
              <div className="card-arrow">›</div>
            </div>
          </div>

          {/* Bottom Metrics Row */}
          <div className="bottom-metrics-row">
            <div className="metric-card">
              <ProcessingIcon className="metric-icon" size={24} />
              <div className="metric-content">
                <div className="metric-title">pH Level</div>
                <div className="metric-value">7.6</div>
                <div className="metric-subtitle">Add acidic compost to balance the pH</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
            
            <div className="metric-card">
              <WaterIcon className="metric-icon" size={24} />
              <div className="metric-content">
                <div className="metric-title">Humidity</div>
                <div className="metric-value">{weatherData ? weatherData.current.humidity : '82'}%</div>
                <div className="metric-subtitle">
                  {weatherData ? (
                    weatherData.current.humidity > 80 ? 'High humidity - monitor for fungal diseases' :
                    weatherData.current.humidity > 60 ? 'Good humidity levels for crops' :
                    'Low humidity - increase irrigation if needed'
                  ) : 'Ensure ventilation is sufficient to prevent mold growth'}
                </div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
            
            <div className="metric-card">
              <SproutIcon className="metric-icon" size={24} />
              <div className="metric-content">
                <div className="metric-title">Soil Moisture</div>
                <div className="metric-value">65%</div>
                <div className="metric-subtitle">Keep monitoring to ensure it remains consistent</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {/* Planted Area Header */}
          <div className="planted-area-header">
            <h2>{t('dashboard.plantedArea')}</h2>
            <button className="view-all-btn">{t('dashboard.viewAll')}</button>
          </div>
          <div className="area-subtitle">{t('dashboard.cropsThrivingToday')}</div>

          {/* Crop Metrics */}
          <div className="crop-metrics-card">
            <div className="metric-row">
              <RiceIcon className="metric-icon" size={18} />
              <div className="metric-info">
                <div className="metric-label">{t('dashboard.cropHealthIndex')}</div>
                <div className="metric-value">85/100 (AI)</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
            
            <div className="metric-row">
              <WaterIcon className="metric-icon" size={18} />
              <div className="metric-info">
                <div className="metric-label">{t('dashboard.soilMoisture')}</div>
                <div className="metric-value">65% ({t('dashboard.ideal')})</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
            
            <div className="metric-row">
              <ThermometerIcon className="metric-icon" size={18} />
              <div className="metric-info">
                <div className="metric-label">{t('dashboard.temperature')}</div>
                <div className="metric-value">24°C</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
            
            <div className="metric-row">
              <SunIcon className="metric-icon" size={18} />
              <div className="metric-info">
                <div className="metric-label">{t('dashboard.sunlightExposure')}</div>
                <div className="metric-value">7 {t('dashboard.hrsPerDay')}</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
          </div>

          {/* AI Crop Health Analysis */}
          <div className="ai-analysis-card">
            <div className="ai-header">
              <h3>{t('dashboard.aiCropHealthAnalysis')}</h3>
            </div>
            <div className="ai-content">
              <div className="ai-description">
                {t('dashboard.uploadImageForAnalysis')}
              </div>
              <div className="wheat-image">
                <div className="wheat-background">
                  <RiceIcon className="wheat-pattern" size={32} />
                  <div className="quotes-overlay">
                    <div className="quote-text">
                      "{t('dashboard.aiQuote')}"
                    </div>
                  </div>
                </div>
              </div>
              <button className="ask-ai-btn" onClick={() => navigate('/chatbot')}>
                <AIIcon className="ai-icon" size={18} />
                <span>{t('dashboard.askAI')}</span>
                <span className="ai-arrow">›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="notification-popup">
          <div className="popup-content">
            <div className="popup-header">
              <h4><BellIcon size={18} /> New Notifications!</h4>
              <button 
                className="close-popup"
                onClick={() => setShowNotificationPopup(false)}
              >×</button>
            </div>
            <div className="popup-notifications">
              {notifications.filter(n => n.isNew).map(notification => (
                <div key={notification.id} className="popup-notification-item">
                  <span className="popup-icon">{notification.icon}</span>
                  <div className="popup-text">
                    <div className="popup-title">{notification.title}</div>
                    <div className="popup-desc">{notification.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
