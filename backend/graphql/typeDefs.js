const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Location {
    city: String!
    country: String!
    lat: Float!
    lon: Float!
  }

  type DateRange {
    start_date: String!
    end_date: String!
  }

  type DailyForecast {
    date: String
    temp_max: Float
    temp_min: Float
    conditions: String
    precipitation: Float
  }

  type WeatherSummary {
    temperature: Float
    temp_min: Float
    temp_max: Float
    humidity: Float
    wind_speed: Float
    wind_direction: Float
    conditions: String
    description: String
    precipitation: Float
    cloud_cover: Float
    uv_index: Float
    visibility: Float
    sunrise: String
    sunset: String
    daily_forecast: [DailyForecast]
  }

  type AirQuality {
    aqi: Int
    pm25: Float
    pm10: Float
    o3: Float
    no2: Float
    so2: Float
    co: Float
    quality_level: String
  }

  type YouTubeVideo {
    title: String
    videoId: String
    thumbnail: String
    channel: String
  }

  type NewsArticle {
    title: String
    description: String
    url: String
    source: String
    publishedAt: String
  }

  type CityImage {
    url: String
    photographer: String
    description: String
  }

  type PointOfInterest {
    name: String
    kind: String
    lat: Float
    lon: Float
  }

  type ExternalMetadata {
    youtube_videos: [YouTubeVideo]
    map_data: String
    air_quality: AirQuality
    city_history: String
    news_articles: [NewsArticle]
    city_images: [CityImage]
    points_of_interest: [PointOfInterest]
  }

  type User {
    id: ID!
    userId: String!
    email: String
    name: String
    created_at: String!
    last_login: String!
  }

  type WeatherRequest {
    id: ID!
    userId: String
    location_query: String!
    resolved_location: Location!
    date_range: DateRange!
    weather_summary: WeatherSummary
    external_metadata: ExternalMetadata
    created_at: String!
    updated_at: String!
  }

  input CreateWeatherRequestInput {
    userId: String
    location_query: String!
    start_date: String!
    end_date: String!
  }
  
  input CreateUserInput {
    userId: String!
    email: String
    name: String
  }

  input UpdateWeatherRequestInput {
    location_query: String
    start_date: String
    end_date: String
  }

  type Query {
    # User queries
    getUserByUserId(userId: String!): User
    
    # Weather queries
    getWeatherById(id: ID!): WeatherRequest
    getAllWeatherRequests(
      userId: String
      city: String
      country: String
      limit: Int
      offset: Int
    ): [WeatherRequest]
    getUserWeatherHistory(userId: String!, limit: Int): [WeatherRequest]
    getWeatherRequestsCount(
      userId: String
      city: String
      country: String
    ): Int
  }

  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User
    updateUserLogin(userId: String!): User
    
    # Weather mutations
    createWeatherRequest(input: CreateWeatherRequestInput!): WeatherRequest
    updateWeatherRequest(id: ID!, input: UpdateWeatherRequestInput!): WeatherRequest
    deleteWeatherRequest(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
