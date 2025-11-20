const axios = require('axios');

class YouTubeService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  async searchVideos(city, country, maxResults = 6) {
    if (!this.apiKey) {
      console.log('YouTube API key not provided, skipping video search');
      return [];
    }

    try {
      const query = `${city} ${country} travel guide walking tour`;
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: maxResults,
          key: this.apiKey,
          order: 'relevance',
          videoDuration: 'medium',
          videoEmbeddable: 'true'
        }
      });

      if (!response.data.items || response.data.items.length === 0) {
        console.log('No YouTube videos found for query:', query);
        return [];
      }

      return response.data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channel: item.snippet.channelTitle
      }));
    } catch (error) {
      console.error('YouTube API error:', error.response?.data || error.message);
      return [];
    }
  }
}

module.exports = new YouTubeService();
