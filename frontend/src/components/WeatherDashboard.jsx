import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Cloud, 
  Umbrella, 
  Eye,
  Sun,
  Sunrise,
  Sunset
} from 'lucide-react';

const WeatherDashboard = ({ weatherData }) => {
  if (!weatherData) return null;

  const { resolved_location, weather_summary, date_range } = weatherData;
  const ws = weather_summary;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Location Header */}
      <motion.div variants={itemVariants} className="premium-card p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative z-10">
          <h1 className="text-6xl font-extralight tracking-wider drop-shadow-2xl mb-3 gradient-text">
            {resolved_location.city}
          </h1>
          <p className="text-2xl text-white/80 font-light tracking-wide">{resolved_location.country}</p>
          <div className="inline-block mt-4 px-6 py-2 bg-white/10 rounded-full backdrop-blur-sm">
            <p className="text-sm text-white/70 tracking-wider">
              {new Date(date_range.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(date_range.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Weather Card */}
      <motion.div 
        variants={itemVariants}
        className="premium-card p-10 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <motion.div 
              className="text-8xl font-extralight mb-3 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {ws.temperature}°C
            </motion.div>
            <div className="text-3xl text-white/90 font-light tracking-wide mb-2">{ws.conditions}</div>
            <div className="text-base text-white/70 max-w-md">{ws.description}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <motion.div 
              className="text-center p-5 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Thermometer className="w-10 h-10 mx-auto mb-3 text-red-400 drop-shadow-glow" />
              <div className="text-xs text-white/70 uppercase tracking-widest mb-1">High</div>
              <div className="text-3xl font-semibold text-red-300">{ws.temp_max}°</div>
            </motion.div>
            <motion.div 
              className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Thermometer className="w-10 h-10 mx-auto mb-3 text-blue-400 drop-shadow-glow" />
              <div className="text-xs text-white/70 uppercase tracking-widest mb-1">Low</div>
              <div className="text-3xl font-semibold text-blue-300">{ws.temp_min}°</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <motion.div 
          variants={itemVariants} 
          className="premium-card p-7 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <Droplets className="w-10 h-10 text-blue-400 mb-4 drop-shadow-glow group-hover:scale-110 transition-transform" />
          <div className="text-xs text-white/70 uppercase tracking-widest mb-2 font-medium">Humidity</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{ws.humidity}%</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="premium-card p-7 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <Wind className="w-10 h-10 text-cyan-400 mb-4 drop-shadow-glow group-hover:scale-110 transition-transform" />
          <div className="text-xs text-white/70 uppercase tracking-widest mb-2 font-medium">Wind Speed</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{ws.wind_speed}</div>
          <div className="text-xs text-white/60 mt-1">km/h</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="premium-card p-7 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <Umbrella className="w-10 h-10 text-indigo-400 mb-4 drop-shadow-glow group-hover:scale-110 transition-transform" />
          <div className="text-xs text-white/70 uppercase tracking-widest mb-2 font-medium">Precipitation</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{ws.precipitation}</div>
          <div className="text-xs text-white/60 mt-1">mm</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="premium-card p-7 hover:shadow-[0_0_40px_rgba(156,163,175,0.4)] transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <Cloud className="w-10 h-10 text-gray-300 mb-4 drop-shadow-glow group-hover:scale-110 transition-transform" />
          <div className="text-xs text-white/70 uppercase tracking-widest mb-2 font-medium">Cloud Cover</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-gray-300 to-slate-400 bg-clip-text text-transparent">{ws.cloud_cover}%</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="premium-card p-7 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <Sun className="w-10 h-10 text-yellow-400 mb-4 drop-shadow-glow group-hover:scale-110 transition-transform" />
          <div className="text-xs text-white/70 uppercase tracking-widest mb-2 font-medium">UV Index</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{ws.uv_index}</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="premium-card p-7 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <Eye className="w-10 h-10 text-purple-400 mb-4 drop-shadow-glow group-hover:scale-110 transition-transform" />
          <div className="text-xs text-white/70 uppercase tracking-widest mb-2 font-medium">Visibility</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">{ws.visibility}</div>
          <div className="text-xs text-white/60 mt-1">km</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="premium-card p-7 hover:shadow-[0_0_40px_rgba(251,146,60,0.4)] transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <Sunrise className="w-10 h-10 text-orange-400 mb-4 drop-shadow-glow group-hover:scale-110 transition-transform" />
          <div className="text-xs text-white/70 uppercase tracking-widest mb-2 font-medium">Sunrise</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">{ws.sunrise}</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="premium-card p-7 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-300 group"
          whileHover={{ y: -5 }}
        >
          <Sunset className="w-10 h-10 text-pink-400 mb-4 drop-shadow-glow group-hover:scale-110 transition-transform" />
          <div className="text-xs text-white/70 uppercase tracking-widest mb-2 font-medium">Sunset</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">{ws.sunset}</div>
        </motion.div>
      </div>

      {/* 10-Day Forecast */}
      {ws.daily_forecast && ws.daily_forecast.length > 0 && (
        <motion.div variants={itemVariants} className="premium-card p-8">
          <div className="flex items-center justify-between mb-8 border-b border-white/20 pb-4">
            <h2 className="text-3xl font-light tracking-wide gradient-text">
              10-Day Forecast
            </h2>
            <div className="text-sm text-white/60 bg-white/10 px-4 py-2 rounded-full">
              Extended Outlook
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {ws.daily_forecast.map((day, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 text-center hover:from-white/15 hover:to-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 group cursor-pointer"
                whileHover={{ y: -8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-sm text-white/70 mb-3 font-medium tracking-wide">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs text-white/90 mb-3 h-8 flex items-center justify-center font-light">
                  {day.conditions}
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">
                    {day.temp_max}°
                  </div>
                  <div className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {day.temp_min}°
                  </div>
                </div>
                {day.precipitation > 0 && (
                  <div className="text-xs text-cyan-400 mt-3 bg-cyan-500/20 rounded-full py-1 px-2 inline-block">
                    💧 {day.precipitation}mm
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WeatherDashboard;
