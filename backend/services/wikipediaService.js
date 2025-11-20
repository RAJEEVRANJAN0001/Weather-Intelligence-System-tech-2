const axios = require('axios');

class WikipediaService {
  async getCityHistory(city) {
    try {
      // Search for the city page
      const searchResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: city,
          format: 'json',
          origin: '*'
        },
        headers: {
          'User-Agent': 'WeatherIntelligenceApp/1.0 (Educational Project)',
          'Accept': 'application/json'
        }
      });

      if (searchResponse.data.query.search.length === 0) {
        return 'No historical information available.';
      }

      const pageId = searchResponse.data.query.search[0].pageid;

      // Get extract from the page
      const extractResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          prop: 'extracts',
          pageids: pageId,
          exintro: true,
          explaintext: true,
          format: 'json',
          origin: '*'
        },
        headers: {
          'User-Agent': 'WeatherIntelligenceApp/1.0 (Educational Project)',
          'Accept': 'application/json'
        }
      });

      const page = extractResponse.data.query.pages[pageId];
      return page.extract || 'No historical information available.';
    } catch (error) {
      console.error('Wikipedia API error:', error.message);
      return 'Unable to fetch historical information.';
    }
  }
}

module.exports = new WikipediaService();
