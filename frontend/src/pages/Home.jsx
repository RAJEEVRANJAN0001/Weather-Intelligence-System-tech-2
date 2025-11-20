import React, { useState } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { CREATE_WEATHER_REQUEST, GET_ALL_WEATHER_REQUESTS, GET_WEATHER_BY_ID, DELETE_WEATHER_REQUEST, GET_USER_WEATHER_HISTORY } from '../apollo/queries';
import { useUser } from '../context/UserContext';
import AnimatedBackground from '../components/AnimatedBackground';
import SearchBar from '../components/SearchBar';
import WeatherDashboard from '../components/WeatherDashboard';
import AirQualityPanel from '../components/AirQualityPanel';
import MapComponent from '../components/MapComponent';
import VideoGallery from '../components/VideoGallery';
import CityInfoPanel from '../components/CityInfoPanel';
import LoadingScreen from '../components/LoadingScreen';
import SearchHistory from '../components/SearchHistory';
import UserAuth from '../components/UserAuth';
import { Download, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { currentUser, isAuthenticated } = useUser();
  const [weatherData, setWeatherData] = useState(null);
  const [createWeatherRequest, { loading }] = useMutation(CREATE_WEATHER_REQUEST);
  const [deleteWeatherRequest] = useMutation(DELETE_WEATHER_REQUEST);
  const [getWeatherById, { loading: loadingById }] = useLazyQuery(GET_WEATHER_BY_ID);
  
  // Fetch user's search history if authenticated
  const { data: historyData, refetch: refetchHistory } = useQuery(
    isAuthenticated ? GET_USER_WEATHER_HISTORY : GET_ALL_WEATHER_REQUESTS,
    {
      variables: isAuthenticated 
        ? { userId: currentUser?.userId, limit: 10 }
        : { limit: 10 },
      skip: !isAuthenticated && !currentUser?.userId,
      fetchPolicy: 'cache-and-network'
    }
  );

  const handleSearch = async (formData) => {
    try {
      const { data } = await createWeatherRequest({
        variables: {
          input: {
            location_query: formData.location,
            start_date: formData.startDate,
            end_date: formData.endDate,
            userId: currentUser?.userId || undefined
          }
        }
      });

      if (data && data.createWeatherRequest) {
        setWeatherData(data.createWeatherRequest);
        // Refetch history to show the new search
        refetchHistory();
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSelectHistory = async (id) => {
    try {
      const { data } = await getWeatherById({
        variables: { id }
      });

      if (data && data.getWeatherById) {
        setWeatherData(data.getWeatherById);
      }
    } catch (error) {
      console.error('Error loading weather data:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteHistory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this search?')) {
      return;
    }

    try {
      await deleteWeatherRequest({
        variables: { id }
      });

      // If we're viewing the deleted item, clear it
      if (weatherData?.id === id) {
        setWeatherData(null);
      }

      // Refetch history
      refetchHistory();
    } catch (error) {
      console.error('Error deleting weather data:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleExport = (format) => {
    // Use environment variable, or relative URL in production, localhost in development
    let baseUrl;
    if (process.env.REACT_APP_API_URL) {
      baseUrl = process.env.REACT_APP_API_URL;
    } else if (process.env.NODE_ENV === 'production') {
      baseUrl = ''; // Use relative URLs in production
    } else {
      baseUrl = 'http://localhost:5001';
    }
    
    // If we have weather data, export it directly
    if (weatherData) {
      const exportUrl = `${baseUrl}/api/export/single?format=${format}&id=${weatherData.id}`;
      window.open(exportUrl, '_blank');
    } else {
      // Export all data
      window.open(`${baseUrl}/api/export?format=${format}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* User Authentication */}
      <UserAuth />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h1 className="text-7xl md:text-8xl font-extralight tracking-wider mb-4 gradient-text drop-shadow-2xl">
              Weather Intelligence System
            </h1>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-white/70 text-xl font-light leading-relaxed">
              Advanced weather analytics powered by AI and real-time data integration
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-white/60">Built by </span>
                <span className="text-blue-400 font-semibold">Rajeev Ranjan Pratap Singh</span>
              </div>
              <a
                href="https://pmaccelerator.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/60 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              >
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-white/80">PM Accelerator Tech Assessment 2</span>
              </a>
            </div>
          </div>
        </motion.header>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} loading={loading || loadingById} />

        {/* Search History */}
        {isAuthenticated && (
          <>
            {historyData?.getUserWeatherHistory && historyData.getUserWeatherHistory.length > 0 && (
              <SearchHistory 
                history={historyData.getUserWeatherHistory}
                onSelect={handleSelectHistory}
                onDelete={handleDeleteHistory}
                currentId={weatherData?.id}
              />
            )}
          </>
        )}
        {!isAuthenticated && historyData?.getAllWeatherRequests && historyData.getAllWeatherRequests.length > 0 && (
          <SearchHistory 
            history={historyData.getAllWeatherRequests}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            currentId={weatherData?.id}
          />
        )}

        {/* Export Buttons */}
        {weatherData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-8 mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Download className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-light text-white/90 gradient-text">
                Export Weather Data
              </h3>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { format: 'json', label: 'JSON', icon: '📄', color: 'from-yellow-500 via-orange-500 to-amber-500', glow: 'rgba(251,191,36,0.5)' },
                { format: 'csv', label: 'CSV', icon: '📊', color: 'from-green-500 via-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.5)' },
                { format: 'xml', label: 'XML', icon: '📋', color: 'from-blue-500 via-cyan-500 to-sky-500', glow: 'rgba(59,130,246,0.5)' },
                { format: 'pdf', label: 'PDF', icon: '📕', color: 'from-red-500 via-pink-500 to-rose-500', glow: 'rgba(239,68,68,0.5)' },
                { format: 'md', label: 'Markdown', icon: '📝', color: 'from-purple-500 via-indigo-500 to-violet-500', glow: 'rgba(147,51,234,0.5)' }
              ].map(({ format, label, icon, color, glow }) => (
                <motion.button
                  key={format}
                  onClick={() => handleExport(format)}
                  className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${color} hover:shadow-[0_0_40px_${glow}] transform transition-all duration-300 flex items-center gap-3 text-white font-semibold text-base relative overflow-hidden group`}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
                  <span className="relative z-10">Export {label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading Screen */}
        {(loading || loadingById) && <LoadingScreen />}

        {/* Weather Data Display */}
        {weatherData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Main Weather Dashboard */}
            <WeatherDashboard weatherData={weatherData} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <AirQualityPanel airQuality={weatherData.external_metadata?.air_quality} />
                <MapComponent
                  location={weatherData.resolved_location}
                  pointsOfInterest={weatherData.external_metadata?.points_of_interest}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <CityInfoPanel cityData={weatherData.external_metadata} />
              </div>
            </div>

            {/* Full Width Video Gallery */}
            {weatherData.external_metadata?.youtube_videos && (
              <VideoGallery videos={weatherData.external_metadata.youtube_videos} />
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!weatherData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🌍</div>
            <h2 className="text-3xl font-light mb-3">
              Discover Weather Intelligence
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Enter any location to get comprehensive weather data, air quality analysis,
              city information, local events, and much more. Experience the future of
              weather forecasting.
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-20 pb-8 text-center text-white/40 text-sm">
        <p>
          © 2025 Weather Intelligence System • Developed by Rajeev Ranjan Pratap Singh
        </p>
      </footer>
    </div>
  );
};

export default Home;
