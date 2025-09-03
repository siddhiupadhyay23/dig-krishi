import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Reports.scss';

const Reports = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hello! I\'m your AI farming assistant. How can I help you today?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [cropPrediction, setCropPrediction] = useState(null);
  const [predictionForm, setPredictionForm] = useState({
    crop: '',
    area: '',
    season: '',
    soilType: ''
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'govt-services', label: 'Govt Services & Subsidies', icon: '🏛️' },
    { id: 'prediction', label: 'AI Prediction & Weather', icon: '🤖' },
    { id: 'ai-chat', label: 'AI Assistant', icon: '💬' }
  ];

  const governmentSchemes = [
    { 
      id: 1,
      name: 'PM-KISAN Samman Nidhi',
      description: 'Direct income support to farmers',
      amount: '₹6,000/year',
      eligibility: 'All landholding farmers',
      status: 'Active',
      applied: 12543,
      category: 'scheme'
    },
    { 
      id: 2,
      name: 'Kerala Organic Farming Scheme',
      description: 'Support for organic farming practices',
      amount: '₹25,000/hectare',
      eligibility: 'Farmers with 0.5+ hectare land',
      status: 'Active',
      applied: 8934,
      category: 'scheme'
    },
    { 
      id: 3,
      name: 'Coconut Development Board Support',
      description: 'Coconut cultivation and processing support',
      amount: '₹50,000/hectare',
      eligibility: 'Coconut farmers in Kerala',
      status: 'Active',
      applied: 5621,
      category: 'scheme'
    },
    { 
      id: 4,
      name: 'Fertilizer Subsidy Program',
      description: 'Direct benefit transfer for fertilizer purchases',
      amount: 'Up to 50% off',
      eligibility: 'Farmers with Aadhaar and bank account',
      status: 'Active',
      applied: 25890,
      category: 'subsidy'
    },
    { 
      id: 5,
      name: 'Drip Irrigation Subsidy',
      description: 'Subsidy for micro-irrigation systems',
      amount: '₹75,000/hectare',
      eligibility: 'Farmers with water source availability',
      status: 'Active',
      applied: 7832,
      category: 'subsidy'
    },
    { 
      id: 6,
      name: 'Solar Pump Subsidy',
      description: 'Subsidized solar-powered irrigation pumps',
      amount: '₹1,20,000',
      eligibility: 'Farmers with electricity connection issues',
      status: 'Active',
      applied: 4521,
      category: 'subsidy'
    },
    { 
      id: 7,
      name: 'Seed Subsidy Program',
      description: 'High-quality certified seeds at subsidized rates',
      amount: '₹2,000/acre',
      eligibility: 'Small and marginal farmers',
      status: 'Active',
      applied: 18934,
      category: 'subsidy'
    },
    { 
      id: 8,
      name: 'Farm Equipment Subsidy',
      description: 'Financial assistance for modern farm equipment',
      amount: '₹80,000',
      eligibility: 'Farmers with minimum 1 hectare land',
      status: 'Active',
      applied: 6243,
      category: 'subsidy'
    },
    { 
      id: 9,
      name: 'Crop Insurance Scheme',
      description: 'Comprehensive risk coverage for crop loss',
      amount: 'Up to 90% coverage',
      eligibility: 'Farmers growing notified crops',
      status: 'Active',
      applied: 34521,
      category: 'scheme'
    }
  ];

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newUrl = `/reports?tab=${tabId}`;
    navigate(newUrl, { replace: true });
  };

  const weatherData = {
    current: {
      location: 'Kochi, Kerala',
      temperature: '29°C',
      condition: 'Partly Cloudy',
      humidity: '78%',
      windSpeed: '12 km/h',
      rainfall: '12mm',
      uvIndex: 'Moderate',
      visibility: '10km'
    },
    forecast: [
      { day: 'Today', temp: '29°C', condition: 'Partly Cloudy', icon: '⛅', rain: '20%' },
      { day: 'Tomorrow', temp: '31°C', condition: 'Sunny', icon: '☀️', rain: '5%' },
      { day: 'Wednesday', temp: '28°C', condition: 'Rainy', icon: '🌧️', rain: '80%' },
      { day: 'Thursday', temp: '27°C', condition: 'Cloudy', icon: '☁️', rain: '40%' },
      { day: 'Friday', temp: '30°C', condition: 'Sunny', icon: '☀️', rain: '10%' }
    ],
    alerts: [
      { type: 'warning', message: 'Heavy rainfall expected on Wednesday. Protect crops.', priority: 'high' },
      { type: 'info', message: 'Ideal conditions for rice planting next week.', priority: 'medium' }
    ]
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, 
        { type: 'user', message: chatInput },
        { type: 'bot', message: 'Thank you for your question. Based on your query, I recommend checking the current weather conditions and soil moisture levels for optimal crop growth.' }
      ]);
      setChatInput('');
    }
  };

  const handlePredictionSubmit = (e) => {
    e.preventDefault();
    setCropPrediction({
      crop: predictionForm.crop,
      yield: '2.8 tons/hectare',
      confidence: '87%',
      recommendations: [
        'Apply nitrogen fertilizer in 2 weeks',
        'Monitor for pest activity',
        'Ensure adequate irrigation'
      ]
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="page-header">
              <h1>Agricultural Analytics Dashboard</h1>
              <p>Comprehensive insights into Kerala's agricultural ecosystem</p>
            </div>
            
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">👨‍🌾</div>
                <div className="metric-info">
                  <h3>Registered Farmers</h3>
                  <div className="metric-value">4,209</div>
                  <div className="metric-change">+12% this month</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">🌾</div>
                <div className="metric-info">
                  <h3>Active Farms</h3>
                  <div className="metric-value">1,302</div>
                  <div className="metric-change">+8% this month</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">🏛️</div>
                <div className="metric-info">
                  <h3>Govt Schemes</h3>
                  <div className="metric-value">23</div>
                  <div className="metric-change">Active programs</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">💰</div>
                <div className="metric-info">
                  <h3>Subsidies</h3>
                  <div className="metric-value">₹50Cr</div>
                  <div className="metric-change">Distributed</div>
                </div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <h3>Monthly Registration Trends</h3>
                <div className="simple-chart">
                  <div className="chart-bars">
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
                    <div className="bar" style={{height: '90%'}}></div>
                    <div className="bar" style={{height: '85%'}}></div>
                    <div className="bar" style={{height: '95%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="profile-content">
            <div className="page-header">
              <h1>Profile Management</h1>
              <p>Manage your agricultural profile and farm details</p>
            </div>

            <div className="profile-sections">
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {(user?.fullName?.firstName || 'F')[0].toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h2>{user?.fullName?.firstName} {user?.fullName?.lastName}</h2>
                    <p>Kerala Farmer • Member since 2024</p>
                    <button className="edit-profile-btn">Edit Profile</button>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-section">
                    <h3>Personal Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Email</label>
                        <span>{user?.email}</span>
                      </div>
                      <div className="detail-item">
                        <label>Phone</label>
                        <span>+91 98765 43210</span>
                      </div>
                      <div className="detail-item">
                        <label>District</label>
                        <span>Kochi, Kerala</span>
                      </div>
                      <div className="detail-item">
                        <label>Village</label>
                        <span>Ernakulam</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Farm Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Farm Size</label>
                        <span>2.5 Hectares</span>
                      </div>
                      <div className="detail-item">
                        <label>Primary Crops</label>
                        <span>Rice, Coconut, Spices</span>
                      </div>
                      <div className="detail-item">
                        <label>Farming Experience</label>
                        <span>15 Years</span>
                      </div>
                      <div className="detail-item">
                        <label>Soil Type</label>
                        <span>Alluvial</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai-chat':
        return (
          <div className="ai-chat-content">
            <div className="page-header">
              <h1>💬 AI Agricultural Assistant</h1>
              <p>Get instant expert advice and solutions for your farming questions</p>
            </div>

            <div className="chat-container">
              <div className="chat-messages">
                <div className="chat-message bot">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    Namaste! I'm your AI agricultural assistant specialized in Kerala farming. How can I help you grow better crops today?
                  </div>
                </div>
                
                <div className="chat-message user">
                  <div className="message-avatar">👨‍🌾</div>
                  <div className="message-content">
                    What's the best time to plant rice in Kerala this season?
                  </div>
                </div>
                
                <div className="chat-message bot">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    Perfect timing! For Kerala, the ideal rice planting periods are:<br/>
                    🌧️ <strong>Kharif Season:</strong> June-July (with monsoon)<br/>
                    ☀️ <strong>Rabi Season:</strong> November-December (post-monsoon)<br/>
                    Based on current weather patterns, I recommend planting in the next 2-3 weeks for optimal yield!
                  </div>
                </div>
                
                {chatMessages.slice(1).map((msg, index) => (
                  <div key={index + 3} className={`chat-message ${msg.type}`}>
                    <div className="message-avatar">
                      {msg.type === 'bot' ? '🤖' : '👤'}
                    </div>
                    <div className="message-content">{msg.message}</div>
                  </div>
                ))}
              </div>
              
              <form className="chat-input-form" onSubmit={handleChatSubmit}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me about crops, diseases, weather, fertilizers, market prices..."
                  className="chat-input"
                />
                <button type="submit" className="chat-send">💬 Send</button>
              </form>
            </div>
            
            <div className="chat-suggestions">
              <h3>💡 Popular Questions</h3>
              <div className="suggestions-grid">
                <button className="suggestion-btn" onClick={() => setChatInput('What fertilizer is best for coconut trees?')}>
                  🥥 Coconut Fertilizer
                </button>
                <button className="suggestion-btn" onClick={() => setChatInput('How to prevent pest attacks on vegetables?')}>
                  🐛 Pest Control
                </button>
                <button className="suggestion-btn" onClick={() => setChatInput('Current market price for cardamom?')}>
                  💰 Market Prices
                </button>
                <button className="suggestion-btn" onClick={() => setChatInput('Organic farming techniques for spices?')}>
                  🌿 Organic Farming
                </button>
                <button className="suggestion-btn" onClick={() => setChatInput('Best irrigation schedule for rubber plantation?')}>
                  💧 Irrigation
                </button>
                <button className="suggestion-btn" onClick={() => setChatInput('Soil testing and health improvement?')}>
                  🧪 Soil Health
                </button>
              </div>
            </div>
          </div>
        );

      case 'govt-services':
        return (
          <div className="govt-services-content">
            <div className="page-header">
              <h1>Government Services & Subsidies</h1>
              <p>Comprehensive access to agricultural schemes, subsidies, and government programs</p>
            </div>

            <div className="services-tabs">
              <div className="tab-buttons">
                <button className="tab-btn active">All Programs</button>
                <button className="tab-btn">Schemes</button>
                <button className="tab-btn">Subsidies</button>
              </div>
            </div>

            <div className="services-grid">
              {governmentSchemes.map((scheme) => (
                <div key={scheme.id} className="scheme-card">
                  <div className="scheme-header">
                    <h3>{scheme.name}</h3>
                    <div className="scheme-badges">
                      <span className={`scheme-status ${scheme.status.toLowerCase()}`}>
                        {scheme.status}
                      </span>
                      <span className={`scheme-category ${scheme.category}`}>
                        {scheme.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="scheme-description">{scheme.description}</p>
                  
                  <div className="scheme-details">
                    <div className="scheme-amount">{scheme.amount}</div>
                    <div className="scheme-applied">{scheme.applied.toLocaleString()} farmers applied</div>
                  </div>
                  
                  <div className="scheme-eligibility">
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </div>
                  
                  <button 
                    className="apply-btn"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    🚀 Apply Now
                  </button>
                </div>
              ))}
            </div>

            {selectedScheme && (
              <div className="scheme-modal">
                <div className="modal-content">
                  <h3>Apply for {selectedScheme.name}</h3>
                  <p>Your application for <strong>{selectedScheme.name}</strong> has been submitted successfully. You will receive updates via SMS and email.</p>
                  <div className="modal-actions">
                    <button className="primary-btn" onClick={() => setSelectedScheme(null)}>✅ Got it</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'prediction':
        return (
          <div className="prediction-weather-content">
            <div className="page-header">
              <h1>🤖 AI Prediction & Weather Intelligence</h1>
              <p>Advanced crop predictions powered by AI and real-time weather data</p>
            </div>

            <div className="prediction-weather-layout">
              {/* Weather Section */}
              <div className="weather-section">
                <div className="current-weather">
                  <div className="weather-main">
                    <div className="weather-icon">⛅</div>
                    <div className="weather-info">
                      <h2>{weatherData.current.temperature}</h2>
                      <p>{weatherData.current.condition}</p>
                      <span>{weatherData.current.location}</span>
                    </div>
                  </div>
                  
                  <div className="weather-details">
                    <div className="weather-detail">
                      <span>Humidity</span>
                      <strong>{weatherData.current.humidity}</strong>
                    </div>
                    <div className="weather-detail">
                      <span>Wind Speed</span>
                      <strong>{weatherData.current.windSpeed}</strong>
                    </div>
                    <div className="weather-detail">
                      <span>Rainfall</span>
                      <strong>{weatherData.current.rainfall}</strong>
                    </div>
                    <div className="weather-detail">
                      <span>UV Index</span>
                      <strong>{weatherData.current.uvIndex}</strong>
                    </div>
                  </div>
                </div>

                <div className="weather-forecast">
                  <h3>🌤️ 5-Day Weather Forecast</h3>
                  <div className="forecast-grid">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="forecast-item">
                        <div className="forecast-day">{day.day}</div>
                        <div className="forecast-icon">{day.icon}</div>
                        <div className="forecast-temp">{day.temp}</div>
                        <div className="forecast-rain">☂️ {day.rain}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="weather-alerts">
                  <h3>⚠️ Agricultural Weather Alerts</h3>
                  {weatherData.alerts.map((alert, index) => (
                    <div key={index} className={`weather-alert ${alert.priority}`}>
                      <div className="alert-icon">
                        {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </div>
                      <div className="alert-message">{alert.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Prediction Section */}
              <div className="ai-prediction-section">
                <div className="prediction-card">
                  <h3>🔮 Smart Crop Yield Prediction</h3>
                  <form className="prediction-form" onSubmit={handlePredictionSubmit}>
                    <div className="form-grid">
                      <select 
                        value={predictionForm.crop} 
                        onChange={(e) => setPredictionForm({...predictionForm, crop: e.target.value})}
                      >
                        <option value="">🌾 Select Crop Type</option>
                        <option value="rice">🍚 Rice (Paddy)</option>
                        <option value="coconut">🥥 Coconut</option>
                        <option value="pepper">🌶️ Black Pepper</option>
                        <option value="cardamom">🫚 Cardamom</option>
                        <option value="rubber">🌿 Rubber</option>
                        <option value="banana">🍌 Banana</option>
                        <option value="cashew">🥜 Cashew</option>
                        <option value="ginger">🧄 Ginger</option>
                      </select>
                      
                      <input 
                        type="number" 
                        placeholder="📏 Area (hectares)"
                        value={predictionForm.area}
                        onChange={(e) => setPredictionForm({...predictionForm, area: e.target.value})}
                      />
                      
                      <select 
                        value={predictionForm.season} 
                        onChange={(e) => setPredictionForm({...predictionForm, season: e.target.value})}
                      >
                        <option value="">🗓️ Select Season</option>
                        <option value="kharif">🌧️ Kharif (Monsoon)</option>
                        <option value="rabi">❄️ Rabi (Winter)</option>
                        <option value="summer">☀️ Summer</option>
                      </select>

                      <select 
                        value={predictionForm.soilType} 
                        onChange={(e) => setPredictionForm({...predictionForm, soilType: e.target.value})}
                      >
                        <option value="">🪨 Select Soil Type</option>
                        <option value="laterite">Laterite Soil</option>
                        <option value="alluvial">Alluvial Soil</option>
                        <option value="red">Red Soil</option>
                        <option value="black">Black Cotton Soil</option>
                        <option value="coastal">Coastal Sandy Soil</option>
                      </select>
                      
                      <button type="submit" className="predict-btn">🚀 Generate AI Prediction</button>
                    </div>
                  </form>

                  {cropPrediction && (
                    <div className="prediction-result">
                      <h4>🎯 Prediction Results for {cropPrediction.crop.charAt(0).toUpperCase() + cropPrediction.crop.slice(1)}</h4>
                      <div className="prediction-stats">
                        <div className="prediction-stat">
                          <span>Expected Yield</span>
                          <strong>{cropPrediction.yield}</strong>
                        </div>
                        <div className="prediction-stat">
                          <span>Revenue Estimate</span>
                          <strong>₹{Math.floor(Math.random() * 150000 + 80000).toLocaleString()}</strong>
                        </div>
                        <div className="prediction-stat">
                          <span>AI Confidence</span>
                          <strong>{cropPrediction.confidence}</strong>
                        </div>
                        <div className="prediction-stat">
                          <span>Risk Assessment</span>
                          <strong className="risk-low">Low Risk</strong>
                        </div>
                      </div>
                      
                      <div className="recommendations">
                        <h5>🎯 AI-Powered Recommendations:</h5>
                        <ul>
                          {cropPrediction.recommendations.map((rec, index) => (
                            <li key={index}>✅ {rec}</li>
                          ))}
                          <li>💧 Monitor soil moisture - current weather suggests balanced irrigation</li>
                          <li>📅 Optimal harvest window: Based on weather patterns</li>
                          <li>💰 Best market timing for maximum profit: Peak season pricing</li>
                        </ul>
                      </div>
                      
                      <div className="weather-impact">
                        <h5>🌤️ Weather Impact Analysis:</h5>
                        <div className="impact-factors">
                          <div className="impact-factor positive">
                            <span>✅ Adequate Rainfall</span>
                            <div>Expected rainfall will support crop growth</div>
                          </div>
                          <div className="impact-factor positive">
                            <span>✅ Optimal Temperature</span>
                            <div>Temperature range suitable for selected crop</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="prediction-history">
                  <h3>📊 Previous Predictions</h3>
                  <div className="history-list">
                    <div className="history-item">
                      <div className="history-crop">🍚 Rice</div>
                      <div className="history-details">
                        <div>Predicted: 2.8 tonnes/ha</div>
                        <div>Actual: 2.7 tonnes/ha</div>
                        <div className="accuracy">96% Accuracy</div>
                      </div>
                    </div>
                    <div className="history-item">
                      <div className="history-crop">🥥 Coconut</div>
                      <div className="history-details">
                        <div>Predicted: 12,000 nuts/ha</div>
                        <div>Actual: 11,800 nuts/ha</div>
                        <div className="accuracy">98% Accuracy</div>
                      </div>
                    </div>
                    <div className="history-item">
                      <div className="history-crop">🌶️ Pepper</div>
                      <div className="history-details">
                        <div>Predicted: 850 kg/ha</div>
                        <div>Actual: 820 kg/ha</div>
                        <div className="accuracy">96% Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <div className="reports-container">
      <Navbar />
      <div className="reports-layout">
        {/* Sidebar Navigation */}
        <div className="reports-sidebar">
          <div className="sidebar-header">
            <h2>🌾 Dashboard</h2>
            <p>Kerala Agricultural Portal</p>
          </div>
          
          <nav className="sidebar-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="sidebar-icon">{tab.icon}</span>
                <span className="sidebar-label">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {(user?.fullName?.firstName || 'A')[0].toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.fullName?.firstName || 'Farmer'}</span>
                <span className="user-role">Kerala Agricultural Officer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="reports-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Reports;
