const axios = require('axios');

class WeatherService {
  constructor() {
    this.visualCrossingKey = process.env.VISUAL_CROSSING_API_KEY;
    this.openMeteoBase = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1';
  }

  // Resolve location to coordinates
  async resolveLocation(query) {
    try {
      // Try geocoding with OpenStreetMap Nominatim
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'WeatherIntelligenceSystem/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return {
          city: location.display_name.split(',')[0],
          country: location.display_name.split(',').pop().trim(),
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon)
        };
      }

      throw new Error('Location not found');
    } catch (error) {
      console.error('Location resolution error:', error.message);
      throw new Error('Unable to resolve location');
    }
  }

  // Get weather data using Visual Crossing
  async getWeatherDataVisualCrossing(lat, lon, startDate, endDate) {
    try {
      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${startDate}/${endDate}`,
        {
          params: {
            unitGroup: 'metric',
            key: this.visualCrossingKey,
            include: 'days,current'
          }
        }
      );

      const data = response.data;
      const current = data.currentConditions || data.days[0];

      return {
        temperature: current.temp,
        temp_min: data.days[0].tempmin,
        temp_max: data.days[0].tempmax,
        humidity: current.humidity,
        wind_speed: current.windspeed,
        wind_direction: current.winddir,
        conditions: current.conditions,
        description: current.description || current.conditions,
        precipitation: current.precip || 0,
        cloud_cover: current.cloudcover,
        uv_index: current.uvindex,
        visibility: current.visibility,
        sunrise: data.days[0].sunrise,
        sunset: data.days[0].sunset,
        daily_forecast: data.days.slice(0, 10).map(day => ({
          date: day.datetime,
          temp_max: day.tempmax,
          temp_min: day.tempmin,
          conditions: day.conditions,
          precipitation: day.precip || 0
        }))
      };
    } catch (error) {
      console.error('Visual Crossing API error:', error.message);
      throw error;
    }
  }

  // Get weather data using Open-Meteo (fallback)
  async getWeatherDataOpenMeteo(lat, lon, startDate, endDate) {
    try {
      const response = await axios.get(`${this.openMeteoBase}/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: startDate,
          end_date: endDate,
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',
          current_weather: true,
          timezone: 'auto'
        }
      });

      const data = response.data;
      const current = data.current_weather;

      return {
        temperature: current.temperature,
        temp_min: data.daily.temperature_2m_min[0],
        temp_max: data.daily.temperature_2m_max[0],
        humidity: 65, // Open-Meteo free tier doesn't provide humidity
        wind_speed: current.windspeed,
        wind_direction: current.winddirection,
        conditions: this.getWeatherDescription(current.weathercode),
        description: this.getWeatherDescription(current.weathercode),
        precipitation: data.daily.precipitation_sum[0],
        cloud_cover: 0,
        uv_index: 0,
        visibility: 10,
        sunrise: '06:00',
        sunset: '18:00',
        daily_forecast: data.daily.time.slice(0, 10).map((date, idx) => ({
          date: date,
          temp_max: data.daily.temperature_2m_max[idx],
          temp_min: data.daily.temperature_2m_min[idx],
          conditions: 'Clear',
          precipitation: data.daily.precipitation_sum[idx]
        }))
      };
    } catch (error) {
      console.error('Open-Meteo API error:', error.message);
      throw error;
    }
  }

  // Get weather with fallback
  async getWeatherData(lat, lon, startDate, endDate) {
    try {
      if (this.visualCrossingKey) {
        return await this.getWeatherDataVisualCrossing(lat, lon, startDate, endDate);
      } else {
        return await this.getWeatherDataOpenMeteo(lat, lon, startDate, endDate);
      }
    } catch (error) {
      // Fallback to Open-Meteo if Visual Crossing fails
      console.log('Falling back to Open-Meteo...');
      return await this.getWeatherDataOpenMeteo(lat, lon, startDate, endDate);
    }
  }

  getWeatherDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm'
    };
    return descriptions[code] || 'Unknown';
  }
}

module.exports = new WeatherService();
