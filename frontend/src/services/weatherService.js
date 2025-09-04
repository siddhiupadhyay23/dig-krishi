const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Default coordinates (Bangalore, India) - you can change this or make it dynamic
const DEFAULT_COORDS = {
  lat: 12.9716,
  lon: 77.5946
};

export const weatherService = {
  // Get current weather data
  async getCurrentWeather(lat = DEFAULT_COORDS.lat, lon = DEFAULT_COORDS.lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  // Get 5-day forecast
  async getForecast(lat = DEFAULT_COORDS.lat, lon = DEFAULT_COORDS.lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.formatForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  },

  // Get weather by city name
  async getWeatherByCity(cityName) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw error;
    }
  },

  // Format current weather data
  formatWeatherData(data) {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        coords: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        windSpeed: data.wind?.speed || 0,
        windDirection: data.wind?.deg || 0,
        cloudiness: data.clouds.all,
        uvIndex: 0, // Not available in current weather endpoint
        description: data.weather[0].description,
        main: data.weather[0].main,
        icon: data.weather[0].icon
      },
      daily: {
        tempMax: Math.round(data.main.temp_max),
        tempMin: Math.round(data.main.temp_min),
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000)
      },
      lastUpdated: new Date()
    };
  },

  // Format forecast data
  formatForecastData(data) {
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: new Date(item.dt * 1000),
          temps: [],
          weather: item.weather[0],
          humidity: [],
          windSpeed: []
        };
      }
      
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].humidity.push(item.main.humidity);
      dailyForecasts[date].windSpeed.push(item.wind?.speed || 0);
    });

    return Object.values(dailyForecasts).slice(0, 5).map(day => ({
      date: day.date,
      tempMax: Math.round(Math.max(...day.temps)),
      tempMin: Math.round(Math.min(...day.temps)),
      avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      avgWindSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length),
      description: day.weather.description,
      main: day.weather.main,
      icon: day.weather.icon
    }));
  },

  // Get weather icon URL
  getIconUrl(iconCode, size = '2x') {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  },

  // Get weather-based farming recommendations
  getWeatherRecommendations(weatherData) {
    const { current, daily } = weatherData;
    const recommendations = [];

    // Temperature-based recommendations
    if (current.temperature > 35) {
      recommendations.push({
        type: 'warning',
        title: 'High Temperature Alert',
        message: 'Ensure adequate irrigation and shade for crops. Avoid midday farming activities.'
      });
    } else if (current.temperature > 25 && current.temperature <= 35) {
      recommendations.push({
        type: 'success',
        title: 'Ideal Temperature',
        message: 'Perfect conditions for most farming activities and crop growth.'
      });
    }

    // Humidity-based recommendations
    if (current.humidity > 80) {
      recommendations.push({
        type: 'warning',
        title: 'High Humidity',
        message: 'Monitor crops for fungal diseases. Ensure proper ventilation.'
      });
    }

    // Wind-based recommendations
    if (current.windSpeed > 10) {
      recommendations.push({
        type: 'caution',
        title: 'Strong Winds',
        message: 'Secure young plants and avoid spraying activities.'
      });
    }

    // Weather condition-based recommendations
    switch (current.main.toLowerCase()) {
      case 'rain':
        recommendations.push({
          type: 'info',
          title: 'Rainy Weather',
          message: 'Good for natural irrigation. Postpone harvesting and outdoor activities.'
        });
        break;
      case 'clear':
        recommendations.push({
          type: 'success',
          title: 'Clear Skies',
          message: 'Excellent conditions for harvesting, spraying, and fieldwork.'
        });
        break;
      case 'clouds':
        recommendations.push({
          type: 'info',
          title: 'Cloudy Weather',
          message: 'Good conditions for transplanting and reducing plant stress.'
        });
        break;
    }

    return recommendations;
  },

  // Get weather-based government schemes
  getWeatherBasedSchemes(weatherData) {
    const schemes = [];
    const { current } = weatherData;

    // Drought-related schemes
    if (current.humidity < 30 && current.temperature > 30) {
      schemes.push({
        id: 'drought-relief',
        title: 'Drought Relief Package',
        description: 'Financial assistance for farmers affected by drought conditions',
        icon: '🌵',
        priority: 'high',
        weatherCondition: 'drought'
      });
    }

    // Rain-related schemes
    if (current.main.toLowerCase().includes('rain')) {
      schemes.push({
        id: 'crop-insurance',
        title: 'Weather-Based Crop Insurance',
        description: 'Protect your crops against weather-related losses',
        icon: '☔',
        priority: 'high',
        weatherCondition: 'rain'
      });
    }

    // General schemes based on good weather
    if (current.temperature >= 20 && current.temperature <= 30 && current.main.toLowerCase() === 'clear') {
      schemes.push({
        id: 'solar-pump',
        title: 'Solar Pump Subsidy',
        description: 'Perfect sunny weather for solar pump installation',
        icon: '☀️',
        priority: 'medium',
        weatherCondition: 'sunny'
      });
    }

    return schemes;
  }
};

export default weatherService;
