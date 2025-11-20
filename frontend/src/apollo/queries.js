import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
  query GetUserByUserId($userId: String!) {
    getUserByUserId(userId: $userId) {
      id
      userId
      email
      name
      created_at
      last_login
    }
  }
`;

export const GET_USER_WEATHER_HISTORY = gql`
  query GetUserWeatherHistory($userId: String!, $limit: Int) {
    getUserWeatherHistory(userId: $userId, limit: $limit) {
      id
      location_query
      resolved_location {
        city
        country
        lat
        lon
      }
      date_range {
        start_date
        end_date
      }
      weather_summary {
        temperature
        conditions
        humidity
        wind_speed
      }
      external_metadata {
        air_quality {
          aqi
          quality_level
        }
      }
      email_sent
      created_at
    }
  }
`;

export const CREATE_WEATHER_REQUEST = gql`
  mutation CreateWeatherRequest($input: CreateWeatherRequestInput!) {
    createWeatherRequest(input: $input) {
      id
      location_query
      resolved_location {
        city
        country
        lat
        lon
      }
      date_range {
        start_date
        end_date
      }
      weather_summary {
        temperature
        temp_min
        temp_max
        humidity
        wind_speed
        wind_direction
        conditions
        description
        precipitation
        cloud_cover
        uv_index
        visibility
        sunrise
        sunset
        daily_forecast {
          date
          temp_max
          temp_min
          conditions
          precipitation
        }
      }
      external_metadata {
        youtube_videos {
          title
          videoId
          thumbnail
          channel
        }
        air_quality {
          aqi
          pm25
          pm10
          quality_level
        }
        city_history
        news_articles {
          title
          description
          url
          source
          publishedAt
        }
        city_images {
          url
          photographer
          description
        }
        points_of_interest {
          name
          kind
          lat
          lon
        }
      }
      created_at
    }
  }
`;

export const GET_ALL_WEATHER_REQUESTS = gql`
  query GetAllWeatherRequests($city: String, $country: String, $userId: String, $limit: Int, $offset: Int) {
    getAllWeatherRequests(city: $city, country: $country, userId: $userId, limit: $limit, offset: $offset) {
      id
      location_query
      resolved_location {
        city
        country
        lat
        lon
      }
      date_range {
        start_date
        end_date
      }
      weather_summary {
        temperature
        conditions
        humidity
        wind_speed
      }
      external_metadata {
        air_quality {
          aqi
          quality_level
        }
      }
      created_at
    }
  }
`;

export const GET_WEATHER_BY_ID = gql`
  query GetWeatherById($id: ID!) {
    getWeatherById(id: $id) {
      id
      location_query
      resolved_location {
        city
        country
        lat
        lon
      }
      date_range {
        start_date
        end_date
      }
      weather_summary {
        temperature
        temp_min
        temp_max
        humidity
        wind_speed
        wind_direction
        conditions
        description
        precipitation
        cloud_cover
        uv_index
        visibility
        sunrise
        sunset
        daily_forecast {
          date
          temp_max
          temp_min
          conditions
          precipitation
        }
      }
      external_metadata {
        youtube_videos {
          title
          videoId
          thumbnail
          channel
        }
        map_data
        air_quality {
          aqi
          pm25
          pm10
          o3
          no2
          so2
          co
          quality_level
        }
        city_history
        news_articles {
          title
          description
          url
          source
          publishedAt
        }
        city_images {
          url
          photographer
          description
        }
        points_of_interest {
          name
          kind
          lat
          lon
        }
      }
      created_at
      updated_at
    }
  }
`;

export const DELETE_WEATHER_REQUEST = gql`
  mutation DeleteWeatherRequest($id: ID!) {
    deleteWeatherRequest(id: $id)
  }
`;
