import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Thermometer, Wind, Trash2, Eye } from 'lucide-react';

const SearchHistory = ({ history, onSelect, onDelete, currentId }) => {
  if (!history || history.length === 0) {
    return null;
  }

  const getAQIColor = (aqi) => {
    if (!aqi) return 'text-gray-400';
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    return 'text-purple-400';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-400" />
          <h3 className="text-2xl font-light gradient-text">Recent Searches</h3>
        </div>
        <div className="text-sm text-white/60">
          {history.length} {history.length === 1 ? 'search' : 'searches'}
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 hover:from-white/15 hover:to-white/10 transition-all duration-300 border ${
                currentId === item.id 
                  ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                  : 'border-white/10 hover:border-white/20'
              } group cursor-pointer`}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Location Info */}
                <div 
                  className="flex-1 min-w-0"
                  onClick={() => onSelect(item.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <h4 className="text-lg font-semibold text-white/90 truncate">
                      {item.resolved_location.city}, {item.resolved_location.country}
                    </h4>
                  </div>

                  {/* Weather Summary */}
                  <div className="flex items-center gap-4 text-sm text-white/70 mb-2">
                    {item.weather_summary?.temperature && (
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4 text-red-400" />
                        <span>{item.weather_summary.temperature}°C</span>
                      </div>
                    )}
                    {item.weather_summary?.wind_speed && (
                      <div className="flex items-center gap-1">
                        <Wind className="w-4 h-4 text-cyan-400" />
                        <span>{item.weather_summary.wind_speed} km/h</span>
                      </div>
                    )}
                    {item.external_metadata?.air_quality && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs">AQI:</span>
                        <span className={`font-semibold ${getAQIColor(item.external_metadata.air_quality.aqi)}`}>
                          {item.external_metadata.air_quality.aqi}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Conditions and Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">
                      {item.weather_summary?.conditions || 'Loading...'}
                    </span>
                    <span className="text-white/50">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item.id);
                    }}
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-blue-400" />
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchHistory;
