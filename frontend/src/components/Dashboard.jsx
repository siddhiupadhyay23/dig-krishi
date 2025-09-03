import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from './Navbar';
import { 
  SunIcon, 
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
  NetworkIcon
} from './icons';
import './Dashboard.scss';

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main">
        {/* Left Section */}
        <div className="left-section">
          {/* Weather Card */}
          <div className="weather-card">
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

          {/* Google Maps Farm View */}
          <div className="farm-map-card">
            <div className="map-header">
              <h3><TomatoIcon className="crop-icon" size={18} /> Tomato Garden 01</h3>
              <div className="location-info">
                <span className="field-code">PL-OCK</span>
                <span className="area"><LocationIcon className="area-icon" size={14} /> Area: 200m²</span>
                <span className="health-status"><SeedlingIcon className="health-icon" size={14} /> Healthy</span>
              </div>
            </div>
            <div className="map-container">
              {/* Google Maps Embed */}
              <div className="google-maps-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12094.234546843639!2d-120.4382915!3d36.7783333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8094d1e9b2fccccf%3A0x123456789abcdef!2sAgricultural%20Fields%2C%20CA!5e1!3m2!1sen!2sus!4v1635724000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Farm Location"
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
                <div className="farm-zone tomato-zone" title="Tomato Growing Area">
                  <span className="zone-label"><TomatoIcon size={12} /> Zone A</span>
                </div>
                <div className="farm-zone greenhouse-zone" title="Greenhouse">
                  <span className="zone-label"><SeedlingIcon size={12} /> GH-1</span>
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
                  2 <span className="unit">m/s</span>
                </div>
                <div className="card-subtitle">Make sure there is still adequate airflow</div>
              </div>
              <div className="card-arrow">›</div>
            </div>
            
            <div className="env-card temperature">
              <ThermometerIcon className="card-icon" size={24} />
              <div className="card-content">
                <div className="card-title">Temperature</div>
                <div className="card-value">18°C</div>
                <div className="card-subtitle">Maintain consistent between 15°C and 20°C</div>
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
                <div className="metric-value">82%</div>
                <div className="metric-subtitle">Ensure ventilation is sufficient to prevent mold growth</div>
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
            <h2>Planted area</h2>
            <button className="view-all-btn">View all</button>
          </div>
          <div className="area-subtitle">Your crops are thriving today!</div>

          {/* Crop Metrics */}
          <div className="crop-metrics-card">
            <div className="metric-row">
              <RiceIcon className="metric-icon" size={18} />
              <div className="metric-info">
                <div className="metric-label">Crop Health Index</div>
                <div className="metric-value">85/100 (AI)</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
            
            <div className="metric-row">
              <WaterIcon className="metric-icon" size={18} />
              <div className="metric-info">
                <div className="metric-label">Soil Moisture</div>
                <div className="metric-value">65% (Ideal)</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
            
            <div className="metric-row">
              <ThermometerIcon className="metric-icon" size={18} />
              <div className="metric-info">
                <div className="metric-label">Temperature</div>
                <div className="metric-value">24°C</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
            
            <div className="metric-row">
              <SunIcon className="metric-icon" size={18} />
              <div className="metric-info">
                <div className="metric-label">Sunlight Exposure</div>
                <div className="metric-value">7 hrs/day</div>
              </div>
              <div className="metric-arrow">›</div>
            </div>
          </div>

          {/* AI Crop Health Analysis */}
          <div className="ai-analysis-card">
            <div className="ai-header">
              <h3>AI Crop Health Analysis</h3>
            </div>
            <div className="ai-content">
              <div className="ai-description">
                Upload a high-quality image of your crop for AI analysis.
              </div>
              <div className="ai-example">
                <span className="example-link">See example ›</span>
              </div>
              <div className="wheat-image">
                <div className="wheat-background">
                  <RiceIcon className="wheat-pattern" size={32} />
                </div>
              </div>
              <button className="ask-ai-btn">
                <AIIcon className="ai-icon" size={18} />
                <span>Ask AI</span>
                <span className="ai-arrow">›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
