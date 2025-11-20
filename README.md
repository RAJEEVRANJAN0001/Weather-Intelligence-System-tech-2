# 🌤️ Weather Intelligence System

> **A production-ready, full-stack weather intelligence platform built with MERN + GraphQL**

An enterprise-grade weather analytics application featuring real-time weather data, comprehensive city insights, user authentication, air quality monitoring, interactive maps, and multi-format data export capabilities. Built with modern web technologies and premium glassmorphism UI design.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Developer:** Rajeev Ranjan Pratap Singh  
**Project:** PM Accelerator - Tech Assessment 2  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [User Authentication](#-user-authentication)
- [Data Export](#-data-export)
- [UI/UX Design](#-uiux-design)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Overview

The **Weather Intelligence System** is a comprehensive weather analytics platform that combines real-time weather data with rich city metadata to provide users with actionable insights. The application features a modern, space-themed glassmorphism UI and is built using the MERN stack with GraphQL for efficient data querying.

### What Makes This Special

- **User-Centric Design**: Personalized search history with unique user IDs
- **Rich Data Integration**: 8+ external APIs providing weather, news, videos, images, and more
- **Production Ready**: Full CRUD operations, error handling, rate limiting, and graceful fallbacks
- **Premium UI/UX**: Glassmorphism design with animated backgrounds and smooth transitions
- **Multi-Format Export**: JSON, CSV, XML, PDF, and Markdown support
 

---

## ✨ Key Features

### 🔐 User Authentication

- **Unique User IDs**: Simple ID-based authentication system (no passwords)
- **Persistent Sessions**: LocalStorage-based login persistence
- **Personal History**: Each user's searches are tracked and stored separately
- **Quick Login**: Auto-login on return visits
- **User Profile**: Optional email and name fields

### 🌍 Weather Intelligence

- **Multi-Location Support**: Cities, towns, villages, landmarks, ZIP codes, GPS coordinates
- **Date Range Analysis**: Historical and forecast data for custom date ranges
- **Comprehensive Metrics**:
  - Temperature (current, min, max)
  - Humidity levels
  - Wind speed & direction
  - Cloud cover percentage
  - Precipitation data
  - UV index
  - Visibility distance
  - Sunrise & sunset times
- **10-Day Forecast**: Detailed daily predictions

### 🌫️ Air Quality Monitoring

- **Real-time AQI**: Air Quality Index with color-coded severity
- **Pollutant Levels**: PM2.5, PM10, O₃, NO₂, SO₂, CO measurements
- **Health Recommendations**: Based on current air quality
- **Visual Indicators**: Circular gauge with gradient colors

### 🗺️ Interactive Maps

- **OpenStreetMap Integration**: High-quality map tiles
- **Location Markers**: Pinpoint accuracy for searched locations
- **Points of Interest**: Tourist attractions, landmarks, and notable places
- **Responsive Controls**: Zoom, pan, and layer controls

### 📹 Rich Media Integration

- **YouTube Videos**: Relevant travel and city guide videos
- **City Images**: High-quality photography from Unsplash
- **News Articles**: Latest weather-related news
- **City History**: Wikipedia-powered historical information

### 📊 Data Management

- **Full CRUD Operations**:
  - **Create**: New weather requests
  - **Read**: View all searches or specific weather data
  - **Update**: Modify location or date range
  - **Delete**: Remove individual search records
- **Search History**: Last 10 searches with quick access
- **Filtering**: By city, country, user ID

### 📥 Export Functionality

Export weather data in 5 formats:

1. **JSON**: Raw structured data for developers
2. **CSV**: Spreadsheet-compatible for Excel/Google Sheets
3. **XML**: Machine-readable format for integrations
4. **PDF**: Professional reports with styling
5. **Markdown**: Human-readable documentation

### Email Notifications

This project no longer includes built-in email notification functionality. Email-related code, environment variables, and examples have been removed from the codebase and documentation. The system focuses on search, data aggregation, storage, and export features. If you need email support later, it can be implemented as a separate microservice.

---

## 🛠️ Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.18+ | Web framework |
| Apollo Server | 4.10+ | GraphQL server |
| MongoDB | 6.0+ | Database |
| Mongoose | 8.0+ | ODM for MongoDB |
| Nodemailer | removed | (email support removed) |
| Axios | 1.6+ | HTTP client |
| PDFKit | 0.14+ | PDF generation |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2+ | UI framework |
| Apollo Client | 3.8+ | GraphQL client |
| Tailwind CSS | 3.4+ | Styling framework |
| Framer Motion | 10.18+ | Animation library |
| React Leaflet | 4.2+ | Map component |
| Lucide React | 0.303+ | Icon library |
| React Router | 6.21+ | Client routing |

### External APIs

| Service | Purpose | Fallback |
|---------|---------|----------|
| **Visual Crossing** | Primary weather data | Open-Meteo |
| **Open-Meteo** | Fallback weather data | N/A |
| **OpenStreetMap Nominatim** | Geocoding | Built-in |
| **YouTube Data API v3** | City videos | Skip |
| **NewsAPI** | Weather news | Skip |
| **Unsplash** | City photography | Skip |
| **Wikipedia REST API** | City history | Generic text |

---

## 🏗️ Architecture

### System Design

```text
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │ Apollo Client│  │ User Context │      │
│  │  Components  │◄─┤   (GraphQL)  │◄─┤  (Auth)      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                  │                                 │
└─────────┼──────────────────┼─────────────────────────────────┘
          │                  │
          │   HTTP/GraphQL   │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Apollo Server│  │  Express.js  │  │   REST API   │      │
│  │   (GraphQL)  │  │   Routes     │  │   (Export)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│  ┌──────┴──────────────────┴──────────────────┴───────┐    │
│  │              GraphQL Resolvers                       │    │
│  └──────┬───────────────────────────────────────┬──────┘    │
│         │                                        │           │
│  ┌──────┴──────────┐                    ┌───────┴──────┐    │
│  │  Service Layer  │                    │   Models     │    │
│  │  - Weather      │                    │  - User      │    │
│  │  - YouTube      │                    │  - Weather   │    │
│  │  - Air Quality  │                    │   Request    │    │
│  │  - News         │                    └───────┬──────┘    │
│  │  - Unsplash     │                            │           │
│  │  - Wikipedia    │                            ▼           │
│  │  - POIs         │                    ┌────────────────┐  │
│  │                 │                    │    MongoDB     │  │
│  └─────────────────┘                    └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → React Component (SearchBar)
2. **GraphQL Mutation** → Apollo Client sends to backend
3. **Resolver** → Validates input, calls services
4. **Services** → Fetch data from external APIs (parallel)
5. **Database** → Store in MongoDB (WeatherRequest model)
6. **Response** → Return data to frontend
7. **UI Update** → Display weather dashboard

### Project Structure

```text
weather-intelligence-system/
├── backend/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── graphql/
│   │   ├── typeDefs.js              # GraphQL schema definitions
│   │   └── resolvers.js             # Query/Mutation resolvers
│   ├── models/
│   │   ├── User.js                  # User model
│   │   └── WeatherRequest.js        # Weather request model
│   ├── routes/
│   │   └── export.js                # REST endpoints for exports
│   ├── services/
│   │   ├── weatherService.js        # Visual Crossing/Open-Meteo
│   │   ├── youtubeService.js        # YouTube Data API
│   │   ├── airQualityService.js     # Air quality data
│   │   ├── newsService.js           # NewsAPI integration
│   │   ├── unsplashService.js       # Unsplash image API
│   │   ├── wikipediaService.js      # Wikipedia REST API
│   │   ├── eventsService.js         # Events & festivals
│   │   ├── poisService.js           # Points of interest
│   │   
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── apollo/
│   │   │   ├── client.js            # Apollo Client config
│   │   │   └── queries.js           # GraphQL queries/mutations
│   │   ├── components/
│   │   │   ├── AnimatedBackground.jsx    # Stars + nebula
│   │   │   ├── SearchBar.jsx             # Location search
│   │   │   ├── WeatherDashboard.jsx      # Main weather display
│   │   │   ├── AirQualityPanel.jsx       # AQI gauge
│   │   │   ├── MapComponent.jsx          # Leaflet map
│   │   │   ├── VideoGallery.jsx          # YouTube videos
│   │   │   ├── CityInfoPanel.jsx         # City metadata
│   │   │   ├── LoadingScreen.jsx         # Shimmer loader
│   │   │   ├── SearchHistory.jsx         # User's search list
│   │   │   └── UserAuth.jsx              # Login/Register modal
│   │   ├── context/
│   │   │   └── UserContext.js            # User auth context
│   │   ├── pages/
│   │   │   └── Home.jsx                  # Main page
│   │   ├── App.js                        # Root component
│   │   ├── index.js                      # React entry point
│   │   └── index.css                     # Global styles
│   ├── tailwind.config.js               # Tailwind configuration
│   ├── postcss.config.js                # PostCSS config
│   └── package.json
│
├── .env.example                         # Example environment vars
├── .gitignore
├── package.json                         # Root package.json
└── README.md
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/RAJEEVRANJAN0001/weather-intelligence-system.git
cd weather-intelligence-system
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp ../.env.example .env

# Edit .env with your credentials (see Configuration section)
nano .env
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_GRAPHQL_URI=http://localhost:5001/graphql" > .env
echo "REACT_APP_API_URL=http://localhost:5001" >> .env
```

### Step 4: Start Development Servers

**Terminal 1 (Backend):**

```bash
cd backend
npm start
# Backend will run on http://localhost:5001
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm start
# Frontend will run on http://localhost:3001
```

### Step 5: Verify Installation

1. **Backend Health Check**:

   ```bash
   curl http://localhost:5001/health
   # Should return: {"status":"OK","message":"Weather Intelligence API is running"}
   ```

2. **Frontend**:
   - Open browser: `http://localhost:3001`
   - You should see the Weather Intelligence System homepage

3. **GraphQL Playground**:
   - Open browser: `http://localhost:5001/graphql`
   - Test a simple query

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env` with the following:

```env
# ================================
# Server Configuration
# ================================
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# ================================
# MongoDB Configuration
# ================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-intelligence

# ================================
# Weather API Keys
# ================================
# Primary weather provider (Visual Crossing)
VISUAL_CROSSING_API_KEY=your_visual_crossing_key

# Fallback weather provider (Open-Meteo - no key needed)
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1

# ================================
# External API Keys
# ================================
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key

# News API
NEWS_API_KEY=your_news_api_key

# Unsplash API
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Email service variables removed (email support disabled)
# ================================
# Security Configuration
# ================================
JWT_SECRET=your_random_secret_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Getting API Keys

#### 1. Visual Crossing Weather API

1. Visit: https://www.visualcrossing.com/sign-up
2. Create free account
3. Navigate to Account → API Keys
4. Copy your API key
5. **Free Tier**: 1,000 requests/day

#### 2. YouTube Data API v3

1. Go to: https://console.developers.google.com/
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy the API key
6. **Free Tier**: 10,000 units/day

#### 3. NewsAPI

1. Visit: https://newsapi.org/register
2. Sign up for free account
3. Copy your API key
4. **Free Tier**: 100 requests/day

#### 4. Unsplash API

1. Go to: https://unsplash.com/developers
2. Register as a developer
3. Create a new application
4. Copy "Access Key"
5. **Free Tier**: 50 requests/hour

#### 5. MongoDB Atlas

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster (M0 Sandbox)
3. Set up database access (username/password)
4. Whitelist IP: `0.0.0.0/0` (or your IP)
5. Get connection string: `mongodb+srv://...`


### Environment Variables: Required vs Optional

| Variable | Required | Fallback Behavior |
|----------|----------|-------------------|
| `MONGODB_URI` | ✅ Yes | App won't start |
| `PORT` | ❌ No | Defaults to 5001 |
| `VISUAL_CROSSING_API_KEY` | ❌ No | Uses Open-Meteo |
| `YOUTUBE_API_KEY` | ❌ No | Skips videos |
| `NEWS_API_KEY` | ❌ No | Skips news |
| `UNSPLASH_ACCESS_KEY` | ❌ No | Skips images |

**Note**: The app works with limited functionality without optional API keys.

---

## 📖 Usage Guide

### 1. User Registration/Login

**First Time Users:**

1. Click **"Login / Register"** button in top-right corner
2. Enter a unique User ID (3-50 characters)
   - Examples: `john_doe`, `weatherfan123`, `cityexplorer`
3. Optionally add email and name
4. Click **"Login / Register"**
5. Account created automatically if User ID is new

**Returning Users:**

- App automatically logs you in from previous session
- User ID stored in browser localStorage
- Click your User ID button to logout

### 2. Searching for Weather

**Basic Search:**

1. Enter location in search bar:
   - City name: "New York"
   - City + Country: "Paris, France"
   - ZIP code: "10001"
   - Coordinates: "40.7128,-74.0060"
2. Select date range (start and end dates)
3. Click **"Get Weather Intelligence"**
4. Click **"Get Weather Intelligence"**

**Advanced Options:**

- Date range can span up to 10 days
- Search is automatically saved to your history

### 3. Viewing Weather Data

The dashboard displays:

**Top Section:**

- Current temperature
- Weather conditions
- Temperature range (min/max)
- Humidity, wind speed, cloud cover
- UV index, visibility, precipitation

**Left Panel (Air Quality):**

- AQI gauge with color coding
- Pollutant levels (PM2.5, PM10, O₃, NO₂, SO₂, CO)
- Health recommendations

**Center Panel (Map):**

- Interactive Leaflet map
- Location marker
- Points of interest

**Right Panel (10-Day Forecast):**

- Daily temperature predictions
- Weather conditions
- Precipitation chances

**Bottom Sections:**

- YouTube videos about the city
- News articles
- City images
- City history
- Points of interest list

### 4. Search History

**Viewing History:**

- Your last 10 searches appear below search bar
- Shows city, temperature, AQI, and time ago
- Only your searches are visible (filtered by User ID)

**Actions:**

- **View**: Click to reload that search's data
- **Delete**: Remove search from history

### 5. Exporting Data

**Export Options:**

1. **Single Weather Report**:
   - Click export button below weather dashboard
   - Choose format: JSON, CSV, XML, PDF, or Markdown

2. **All Weather Data**:
   - Export button in header (when no specific weather shown)
   - Downloads all your weather requests

**Export Formats:**

- **JSON**: Developer-friendly, structured data
- **CSV**: Open in Excel/Google Sheets
- **XML**: For system integrations
- **PDF**: Professional report with styling
- **Markdown**: Human-readable documentation

---

## 📡 API Documentation

### GraphQL Endpoint

**URL**: `http://localhost:5001/graphql`

### Schema Overview

```graphql
type Query {
  # User queries
  getUserByUserId(userId: String!): User
  getUserWeatherHistory(userId: String!, limit: Int): [WeatherRequest!]!
  
  # Weather queries
  getWeatherById(id: ID!): WeatherRequest
  getAllWeatherRequests(
    city: String
    country: String
    userId: String
    limit: Int
    offset: Int
  ): [WeatherRequest!]!
  
  getWeatherRequestsCount(
    city: String
    country: String
  ): Int!
}

type Mutation {
  # User mutations
  createUser(input: CreateUserInput!): User!
  updateUserLogin(userId: String!): User!
  
  # Weather mutations
  createWeatherRequest(input: CreateWeatherRequestInput!): WeatherRequest!
  deleteWeatherRequest(id: ID!): Boolean!
}
```

### Example Queries

#### Get User Weather History

```graphql
query GetUserHistory {
  getUserWeatherHistory(userId: "john_doe", limit: 10) {
    id
    location_query
    resolved_location {
      city
      country
    }
    weather_summary {
      temperature
      conditions
    }
    created_at
  }
}
```

#### Get Weather by ID

```graphql
query GetWeather($id: ID!) {
  getWeatherById(id: $id) {
    id
    location_query
    weather_summary {
      temperature
      conditions
      humidity
      wind_speed
    }
  }
}
```

### Example Mutations

#### Create User

```graphql
mutation CreateUser {
  createUser(input: {
    userId: "john_doe"
    email: "john@example.com"
    name: "John Doe"
  }) {
    id
    userId
    email
    created_at
  }
}
```

#### Create Weather Request

```graphql
mutation CreateWeather {
  createWeatherRequest(input: {
    location_query: "Tokyo, Japan"
    start_date: "2025-11-20"
    end_date: "2025-11-27"
    userId: "john_doe"
  }) {
    id
    location_query
    weather_summary {
      temperature
      conditions
    }
  }
}
```

### REST Endpoints

#### Export Data

```bash
# Export single weather request
GET /api/export/single?format={format}&id={weatherId}

# Export all weather requests
GET /api/export?format={format}&city={city}&userId={userId}
```

**Parameters:**

- `format`: json | csv | xml | pdf | md
- `id`: Weather request ID (for single export)
- `city`: Filter by city name (optional)
- `userId`: Filter by user ID (optional)

**Examples:**

```bash
# Export all data as JSON
curl http://localhost:5001/api/export?format=json -o weather.json

# Export specific weather as PDF
curl "http://localhost:5001/api/export/single?format=pdf&id=673dc94a8f9e7c1a2b3d4e5f" -o report.pdf

# Export user's data as CSV
curl "http://localhost:5001/api/export?format=csv&userId=john_doe" -o my-weather.csv
```

#### Health Check

```bash
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "message": "Weather Intelligence API is running"
}
```

---

## 🔐 User Authentication

### How It Works

The app uses a **simple User ID-based authentication** system (no passwords). This design choice prioritizes ease of use while maintaining user-specific data tracking.

### Features

- **No Password Required**: Just a unique User ID (3-50 characters)
- **Auto-Creation**: New users are created automatically on first login
- **Persistent Sessions**: Login state stored in browser localStorage
- **Auto-Login**: Returning users are logged in automatically
- **Last Login Tracking**: Timestamp updated on each session

### Database Schema

**User Model:**

```javascript
{
  _id: ObjectId,
  userId: String,         // Unique, indexed, 3-50 chars
  email: String,          // Optional
  name: String,           // Optional
  created_at: Date,       // Account creation timestamp
  last_login: Date        // Last login timestamp
}
```

**WeatherRequest Model (with userId):**

```javascript
{
  _id: ObjectId,
  userId: String,         // Links to User.userId
  location_query: String,
  resolved_location: Object,
  date_range: Object,
  weather_summary: Object,
  external_metadata: Object,
  created_at: Date,
  updated_at: Date
}
```

---

## 📥 Data Export

### Supported Formats

The application supports exporting weather data in 5 different formats:

### 1. JSON Export

**Use Case**: APIs, web applications, data processing

**Example:**

```bash
curl "http://localhost:5001/api/export?format=json" -o weather.json
```

### 2. CSV Export

**Use Case**: Excel, Google Sheets, data analysis

**Example:**

```bash
curl "http://localhost:5001/api/export?format=csv" -o weather.csv
```

### 3. XML Export

**Use Case**: System integrations, SOAP APIs, legacy systems

**Example:**

```bash
curl "http://localhost:5001/api/export?format=xml" -o weather.xml
```

### 4. PDF Export

**Use Case**: Reports, presentations, printing

**Example:**

```bash
curl "http://localhost:5001/api/export?format=pdf" -o weather-report.pdf
```

### 5. Markdown Export

**Use Case**: Documentation, GitHub, wikis

**Example:**

```bash
curl "http://localhost:5001/api/export?format=md" -o weather.md
```

---

## 🎨 UI/UX Design

### Design Philosophy

The Weather Intelligence System features a **space-themed glassmorphism** design that combines:

- **Deep Space Aesthetics**: Dark backgrounds with star fields
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Neumorphism Elements**: Subtle shadows and highlights
- **Fluid Animations**: Smooth transitions using Framer Motion

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#60A5FA` | Buttons, links, accents |
| Secondary Purple | `#A78BFA` | Gradients, highlights |
| Cyan Accent | `#38BDF8` | Interactive elements |
| Background Dark | `#020617` | Base background |
| Glass Overlay | `rgba(255,255,255,0.1)` | Card backgrounds |
| Border | `rgba(255,255,255,0.2)` | Card borders |

### Key Features

- **Animated Background**: Twinkling stars + nebula blobs
- **Framer Motion**: Smooth animations and transitions
- **Gradient Effects**: Dynamic color schemes
- **Fully Responsive**: Perfect on all devices
- **Real-time Loading**: Aurora shimmer skeleton loaders
- **Hover Effects**: Interactive glassmorphic cards

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

#### Railway (Recommended)

1. Create account at https://railway.app/
2. Connect GitHub repository
3. Add environment variables from `.env`
4. Railway auto-deploys on push

#### Render

1. Create account at https://render.com/
2. New Web Service → Connect repository
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add environment variables in dashboard

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel --prod
```

Set environment variables:

```env
REACT_APP_GRAPHQL_URI=https://your-backend.railway.app/graphql
REACT_APP_API_URL=https://your-backend.railway.app
```

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error

**Error**: `MongooseError: Could not connect to MongoDB`

**Solutions:**

- Check `MONGODB_URI` in `.env`
- Verify database user credentials
- Whitelist IP address in MongoDB Atlas
- Check network connectivity

#### API Key Invalid

**Error**: `401 Unauthorized`

**Solutions:**

- Verify API key is correct
- Check for extra spaces in `.env`
- Ensure key is active (not expired)
- App will use fallback services

#### Port Already in Use

**Error**: `Error: listen EADDRINUSE`

**Solutions:**

```bash
# Find process using port
lsof -ti:5001

# Kill process
kill -9 <PID>
```

#### Frontend Can't Connect to Backend

**Solutions:**

- Check backend is running: `curl http://localhost:5001/health`
- Verify `REACT_APP_GRAPHQL_URI` in `frontend/.env`
- Restart both servers

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 About the Developer

**Rajeev Ranjan Pratap Singh**

- **GitHub**: [@RAJEEVRANJAN0001](https://github.com/RAJEEVRANJAN0001)
- **Project**: PM Accelerator - Tech Assessment 2
- **Year**: 2025

---

## 🙏 Acknowledgments

Special thanks to:

- **PM Accelerator** for the opportunity and assessment
- **Visual Crossing** for weather data API
- **OpenStreetMap** for maps and geocoding
- **YouTube**, **NewsAPI**, **Unsplash** for content APIs
- **MongoDB Atlas** for cloud database hosting
- **Open-Meteo** for fallback weather data
- Open-source community for amazing libraries

---

**Built with ❤️ using MERN + GraphQL Stack**

*Last Updated: November 20, 2025*
