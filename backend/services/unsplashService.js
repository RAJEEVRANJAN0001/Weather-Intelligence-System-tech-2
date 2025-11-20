const axios = require('axios');

class UnsplashService {
  constructor() {
    this.accessKey = process.env.UNSPLASH_ACCESS_KEY;
    this.baseUrl = 'https://api.unsplash.com';
  }

  async getCityImages(city, count = 6) {
    if (!this.accessKey) {
      console.log('Unsplash API key not provided, skipping image fetch');
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search/photos`, {
        params: {
          query: `${city} cityscape`,
          per_page: count,
          orientation: 'landscape'
        },
        headers: {
          Authorization: `Client-ID ${this.accessKey}`
        }
      });

      return response.data.results.map(photo => ({
        url: photo.urls.regular,
        photographer: photo.user.name,
        description: photo.description || photo.alt_description
      }));
    } catch (error) {
      console.error('Unsplash API error:', error.message);
      return [];
    }
  }
}

module.exports = new UnsplashService();
