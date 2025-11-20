const axios = require('axios');

class NewsService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.baseUrl = 'https://newsapi.org/v2';
  }

  async getCityNews(city, country) {
    if (!this.apiKey) {
      console.log('News API key not provided, skipping news fetch');
      return [];
    }

    try {
      const query = `${city} weather OR ${city} climate`;
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 5,
          apiKey: this.apiKey
        }
      });

      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt
      }));
    } catch (error) {
      console.error('News API error:', error.message);
      return [];
    }
  }
}

module.exports = new NewsService();
