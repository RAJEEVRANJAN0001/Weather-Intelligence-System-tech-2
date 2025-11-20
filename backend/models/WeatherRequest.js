const mongoose = require('mongoose');

const weatherRequestSchema = new mongoose.Schema({
  location_query: {
    type: String,
    required: true,
    trim: true
  },
  resolved_location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  date_range: {
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
  },
  weather_summary: {
    temperature: { type: Number },
    temp_min: { type: Number },
    temp_max: { type: Number },
    humidity: { type: Number },
    wind_speed: { type: Number },
    wind_direction: { type: Number },
    conditions: { type: String },
    description: { type: String },
    precipitation: { type: Number },
    cloud_cover: { type: Number },
    uv_index: { type: Number },
    visibility: { type: Number },
    sunrise: { type: String },
    sunset: { type: String },
    daily_forecast: [{
      date: String,
      temp_max: Number,
      temp_min: Number,
      conditions: String,
      precipitation: Number
    }]
  },
  external_metadata: {
    youtube_videos: [{
      title: String,
      videoId: String,
      thumbnail: String,
      channel: String
    }],
    map_data: {
      type: mongoose.Schema.Types.Mixed
    },
    air_quality: {
      aqi: Number,
      pm25: Number,
      pm10: Number,
      o3: Number,
      no2: Number,
      so2: Number,
      co: Number,
      quality_level: String
    },
    city_history: { type: String },
    news_articles: [{
      title: String,
      description: String,
      url: String,
      source: String,
      publishedAt: String
    }],
    city_images: [{
      url: String,
      photographer: String,
      description: String
    }],
    points_of_interest: [{
      name: String,
      kind: String,
      lat: Number,
      lon: Number
    }]
  },
  userId: {
    type: String,
    trim: true,
    index: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for faster queries
weatherRequestSchema.index({ 'resolved_location.city': 1 });
weatherRequestSchema.index({ userId: 1 });
weatherRequestSchema.index({ created_at: -1 });

module.exports = mongoose.model('WeatherRequest', weatherRequestSchema);
