class AirQualityService {
  async getAirQuality(lat, lon) {
    // Return simulated air quality data based on location
    // In a production app, you would integrate with a real AQI API
    
    // Generate reasonable values based on location (simplified simulation)
    const baseAQI = 40 + Math.floor(Math.random() * 30); // 40-70 range
    const pm25 = 8 + Math.floor(Math.random() * 15); // 8-23 range
    
    const aqi = this.calculateAQI(pm25);
    
    return {
      aqi,
      pm25,
      pm10: pm25 * 1.5,
      o3: 30 + Math.floor(Math.random() * 20),
      no2: 20 + Math.floor(Math.random() * 15),
      so2: 5 + Math.floor(Math.random() * 10),
      co: 0.3 + Math.random() * 0.4,
      quality_level: this.getQualityLevel(aqi)
    };
  }

  calculateAQI(pm25) {
    if (pm25 <= 12) return Math.round((50 / 12) * pm25);
    if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
    return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
  }

  getQualityLevel(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }
}

module.exports = new AirQualityService();
