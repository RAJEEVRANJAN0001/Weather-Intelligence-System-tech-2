import React from 'react';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

const AirQualityPanel = ({ airQuality }) => {
  if (!airQuality) return null;

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'from-green-500 to-emerald-500';
    if (aqi <= 100) return 'from-yellow-500 to-amber-500';
    if (aqi <= 150) return 'from-orange-500 to-red-500';
    if (aqi <= 200) return 'from-red-500 to-rose-600';
    return 'from-purple-600 to-pink-600';
  };

  const getAQITextColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    return 'text-purple-400';
  };

  const pollutants = [
    { name: 'PM2.5', value: airQuality.pm25, unit: 'μg/m³', icon: '🔬' },
    { name: 'PM10', value: airQuality.pm10, unit: 'μg/m³', icon: '💨' },
    { name: 'O₃', value: airQuality.o3, unit: 'ppb', icon: '🌫️' },
    { name: 'NO₂', value: airQuality.no2, unit: 'ppb', icon: '⚗️' },
    { name: 'SO₂', value: airQuality.so2, unit: 'ppb', icon: '🧪' },
    { name: 'CO', value: airQuality.co, unit: 'ppm', icon: '☁️' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-8 group hover:shadow-[0_0_60px_rgba(34,211,238,0.3)] transition-all duration-500"
    >
      <div className="flex items-center gap-3 mb-8">
        <Wind className="w-10 h-10 text-cyan-400 drop-shadow-glow group-hover:scale-110 transition-transform" />
        <h2 className="text-3xl font-light gradient-text">Air Quality Index</h2>
      </div>

      {/* AQI Circle Gauge */}
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          className="relative w-56 h-56"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Outer glow */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getAQIColor(airQuality.aqi)} opacity-20 blur-2xl`} />
          
          <svg className="w-full h-full transform -rotate-90 relative z-10">
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="16"
            />
            <motion.circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="url(#aqiGradient)"
              strokeWidth="16"
              strokeDasharray={`${(airQuality.aqi / 500) * 628.32} 628.32`}
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_currentColor]"
              initial={{ strokeDasharray: "0 628.32" }}
              animate={{ strokeDasharray: `${(airQuality.aqi / 500) * 628.32} 628.32` }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={`${getAQIColor(airQuality.aqi).split(' ')[0].replace('from-', 'stop-')}`} />
                <stop offset="100%" className={`${getAQIColor(airQuality.aqi).split(' ')[1].replace('to-', 'stop-')}`} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div 
              className={`text-6xl font-bold ${getAQITextColor(airQuality.aqi)} drop-shadow-glow`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {airQuality.aqi}
            </motion.div>
            <div className="text-base text-white/70 mt-2 font-medium tracking-wider">AQI</div>
          </div>
        </motion.div>
        <motion.div 
          className={`text-2xl font-semibold mt-6 px-6 py-3 bg-gradient-to-r ${getAQIColor(airQuality.aqi)} rounded-full ${getAQITextColor(airQuality.aqi)} shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {airQuality.quality_level}
        </motion.div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pollutants.map((pollutant, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 hover:from-white/15 hover:to-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group/pollutant cursor-pointer"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div className="text-3xl mb-2 group-hover/pollutant:scale-110 transition-transform">{pollutant.icon}</div>
            <div className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-2">{pollutant.name}</div>
            <div className="text-xl font-bold text-white/90">
              {pollutant.value?.toFixed(1) || '0'} <span className="text-xs text-white/50 font-normal">{pollutant.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AQI Scale Reference */}
      <motion.div 
        className="mt-8 pt-8 border-t border-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="text-sm text-white/70 uppercase tracking-widest font-semibold mb-4 flex items-center gap-2">
          <span>📊</span>
          <span>AQI Scale Reference</span>
        </div>
        <div className="space-y-3">
          {[
            { range: '0-50', level: 'Good', color: 'bg-green-500', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.4)]' },
            { range: '51-100', level: 'Moderate', color: 'bg-yellow-500', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.4)]' },
            { range: '101-150', level: 'Unhealthy for Sensitive', color: 'bg-orange-500', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]' },
            { range: '151-200', level: 'Unhealthy', color: 'bg-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]' },
            { range: '201+', level: 'Very Unhealthy', color: 'bg-purple-600', glow: 'shadow-[0_0_15px_rgba(147,51,234,0.4)]' }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group/scale"
              whileHover={{ x: 5 }}
            >
              <div className={`w-4 h-4 rounded-full ${item.color} ${item.glow} group-hover/scale:scale-125 transition-transform`}></div>
              <span className="text-sm text-white/90 font-semibold min-w-[60px]">{item.range}</span>
              <span className="text-sm text-white/70 flex-1">{item.level}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AirQualityPanel;
