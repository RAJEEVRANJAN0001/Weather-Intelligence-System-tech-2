const WeatherRequest = require('../models/WeatherRequest');
const User = require('../models/User');
const weatherService = require('../services/weatherService');
const youtubeService = require('../services/youtubeService');
const airQualityService = require('../services/airQualityService');
const newsService = require('../services/newsService');
const unsplashService = require('../services/unsplashService');
const wikipediaService = require('../services/wikipediaService');
const poisService = require('../services/poisService');

const resolvers = {
  Query: {
    // User queries
    getUserByUserId: async (_, { userId }) => {
      try {
        const user = await User.findOne({ userId });
        return user;
      } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
      }
    },

    // Weather queries
    getWeatherById: async (_, { id }) => {
      try {
        const weatherRequest = await WeatherRequest.findById(id);
        if (!weatherRequest) {
          throw new Error('Weather request not found');
        }
        return weatherRequest;
      } catch (error) {
        throw new Error(`Error fetching weather request: ${error.message}`);
      }
    },

    getUserWeatherHistory: async (_, { userId, limit = 10 }) => {
      try {
        const requests = await WeatherRequest.find({ userId })
          .sort({ created_at: -1 })
          .limit(limit);

        return requests;
      } catch (error) {
        throw new Error(`Error fetching user weather history: ${error.message}`);
      }
    },

    getAllWeatherRequests: async (_, { city, country, userId, limit = 50, offset = 0 }) => {
      try {
        const query = {};
        if (city) query['resolved_location.city'] = new RegExp(city, 'i');
        if (country) query['resolved_location.country'] = new RegExp(country, 'i');
        if (userId) query.userId = userId;

        const requests = await WeatherRequest.find(query)
          .sort({ created_at: -1 })
          .limit(limit)
          .skip(offset);

        return requests;
      } catch (error) {
        throw new Error(`Error fetching weather requests: ${error.message}`);
      }
    },

    getWeatherRequestsCount: async (_, { city, country }) => {
      try {
        const query = {};
        if (city) query['resolved_location.city'] = new RegExp(city, 'i');
        if (country) query['resolved_location.country'] = new RegExp(country, 'i');

        return await WeatherRequest.countDocuments(query);
      } catch (error) {
        throw new Error(`Error counting weather requests: ${error.message}`);
      }
    }
  },

  Mutation: {
    // User mutations
    createUser: async (_, { input }) => {
      try {
        const { userId, email, name } = input;

        // Check if user already exists
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
          throw new Error('User ID already exists. Please choose a different ID.');
        }

        // Create new user
        const user = new User({
          userId,
          email,
          name
        });

        await user.save();
        return user;
      } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
      }
    },

    updateUserLogin: async (_, { userId }) => {
      try {
        const user = await User.findOneAndUpdate(
          { userId },
          { last_login: new Date() },
          { new: true }
        );

        if (!user) {
          throw new Error('User not found');
        }

        return user;
      } catch (error) {
        throw new Error(`Error updating user login: ${error.message}`);
      }
    },

    // Weather mutations
    createWeatherRequest: async (_, { input }) => {
      try {
        const { location_query, start_date, end_date, userId } = input;

        // Validate dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        if (startDate > endDate) {
          throw new Error('Start date must be before end date');
        }

        // Resolve location
        console.log('Resolving location:', location_query);
        const resolved_location = await weatherService.resolveLocation(location_query);

        // Get weather data
        console.log('Fetching weather data...');
        const weather_summary = await weatherService.getWeatherData(
          resolved_location.lat,
          resolved_location.lon,
          start_date,
          end_date
        );

        // Fetch external metadata in parallel with error handling
        console.log('Fetching external metadata...');
        const [
          youtube_videos,
          air_quality,
          city_history,
          news_articles,
          city_images,
          points_of_interest
        ] = await Promise.allSettled([
          youtubeService.searchVideos(resolved_location.city, resolved_location.country).catch(err => {
            console.error('YouTube service error:', err.message);
            return [];
          }),
          airQualityService.getAirQuality(resolved_location.lat, resolved_location.lon).catch(err => {
            console.error('Air quality service error:', err.message);
            return null;
          }),
          wikipediaService.getCityHistory(resolved_location.city).catch(err => {
            console.error('Wikipedia service error:', err.message);
            return '';
          }),
          newsService.getCityNews(resolved_location.city, resolved_location.country).catch(err => {
            console.error('News service error:', err.message);
            return [];
          }),
          unsplashService.getCityImages(resolved_location.city).catch(err => {
            console.error('Unsplash service error:', err.message);
            return [];
          }),
          poisService.getPOIs(resolved_location.lat, resolved_location.lon).catch(err => {
            console.error('POIs service error:', err.message);
            return [];
          })
        ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : (r.reason || [])));

        // Create map data object
        const map_data = {
          center: [resolved_location.lat, resolved_location.lon],
          zoom: 12,
          marker: {
            lat: resolved_location.lat,
            lon: resolved_location.lon,
            title: `${resolved_location.city}, ${resolved_location.country}`
          }
        };

        // Create weather request
        const weatherRequest = new WeatherRequest({
          location_query,
          resolved_location,
          date_range: {
            start_date: startDate,
            end_date: endDate
          },
          weather_summary,
          external_metadata: {
            youtube_videos,
            map_data,
            air_quality,
            city_history,
            news_articles,
            city_images,
            points_of_interest
          },
          userId
        });

        await weatherRequest.save();

        console.log('Weather request created successfully');
        return weatherRequest;
      } catch (error) {
        console.error('Create weather request error:', error);
        throw new Error(`Failed to create weather request: ${error.message}`);
      }
    },

    updateWeatherRequest: async (_, { id, input }) => {
      try {
        const weatherRequest = await WeatherRequest.findById(id);
        if (!weatherRequest) {
          throw new Error('Weather request not found');
        }

        const { location_query, start_date, end_date } = input;

        // Update fields if provided
        if (location_query) {
          const resolved_location = await weatherService.resolveLocation(location_query);
          weatherRequest.location_query = location_query;
          weatherRequest.resolved_location = resolved_location;
        }

        if (start_date || end_date) {
          const startDate = new Date(start_date || weatherRequest.date_range.start_date);
          const endDate = new Date(end_date || weatherRequest.date_range.end_date);

          if (startDate > endDate) {
            throw new Error('Start date must be before end date');
          }

          weatherRequest.date_range = { start_date: startDate, end_date: endDate };
        }

        // Re-fetch weather data
        const weather_summary = await weatherService.getWeatherData(
          weatherRequest.resolved_location.lat,
          weatherRequest.resolved_location.lon,
          weatherRequest.date_range.start_date.toISOString().split('T')[0],
          weatherRequest.date_range.end_date.toISOString().split('T')[0]
        );

        weatherRequest.weather_summary = weather_summary;
        await weatherRequest.save();

        return weatherRequest;
      } catch (error) {
        throw new Error(`Failed to update weather request: ${error.message}`);
      }
    },

    deleteWeatherRequest: async (_, { id }) => {
      try {
        const result = await WeatherRequest.findByIdAndDelete(id);
        return result !== null;
      } catch (error) {
        throw new Error(`Failed to delete weather request: ${error.message}`);
      }
    }
  }
};

module.exports = resolvers;
