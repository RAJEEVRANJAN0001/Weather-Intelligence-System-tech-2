import React, { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, loading }) => {
  const [formData, setFormData] = useState({
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.location.trim()) {
      onSearch(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="premium-card p-8 mb-10 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Location Input */}
          <motion.div 
            className="relative group/input"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 z-10 group-hover/input:scale-110 transition-transform" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Town, or GPS"
              className="glass-input w-full pl-12 pr-4 py-4 text-base bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/20 hover:border-blue-400/50 focus:border-blue-500 transition-all duration-300 rounded-xl backdrop-blur-md"
              required
            />
          </motion.div>

          {/* Start Date */}
          <motion.div 
            className="relative group/input"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 z-10 group-hover/input:scale-110 transition-transform" />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="glass-input w-full pl-12 pr-4 py-4 text-base bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/20 hover:border-blue-400/50 focus:border-blue-500 transition-all duration-300 rounded-xl backdrop-blur-md"
              required
            />
          </motion.div>

          {/* End Date */}
          <motion.div 
            className="relative group/input"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5 z-10 group-hover/input:scale-110 transition-transform" />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="glass-input w-full pl-12 pr-4 py-4 text-base bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/20 hover:border-purple-400/50 focus:border-purple-500 transition-all duration-300 rounded-xl backdrop-blur-md"
              required
            />
          </motion.div>
        </div>

        {/* Search Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 60px rgba(59, 130, 246, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/button"
        >
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          >
            <Search className="w-6 h-6" />
          </motion.div>
          <span className="relative z-10">
            {loading ? 'Fetching Weather Intelligence...' : 'Get Weather Intelligence'}
          </span>
          {!loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000" />
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SearchBar;
