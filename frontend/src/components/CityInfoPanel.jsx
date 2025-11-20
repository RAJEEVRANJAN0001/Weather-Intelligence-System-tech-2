import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Newspaper, Image as ImageIcon } from 'lucide-react';

const CityInfoPanel = ({ cityData }) => {
  if (!cityData) return null;

  const { city_history, news_articles, city_images } = cityData;

  return (
    <div className="space-y-6">
      {/* City History */}
      {city_history && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-light">City History</h2>
          </div>
          <p className="text-white/80 leading-relaxed line-clamp-6">
            {city_history}
          </p>
        </motion.div>
      )}

      {/* City Images */}
      {city_images && city_images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-6 h-6 text-pink-400" />
            <h2 className="text-2xl font-light">City Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {city_images.slice(0, 6).map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group rounded-xl overflow-hidden aspect-square"
              >
                <img
                  src={image.url}
                  alt={image.description || 'City view'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <p className="text-xs text-white/90">{image.photographer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* News Articles */}
      {news_articles && news_articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-light">Latest News</h2>
          </div>
          <div className="space-y-3">
            {news_articles.slice(0, 5).map((article, index) => (
              <motion.a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="block bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
              >
                <h3 className="font-medium text-white/90 mb-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-white/60 line-clamp-2 mb-2">
                  {article.description}
                </p>
                <div className="flex justify-between items-center text-xs text-white/50">
                  <span>{article.source}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}


    </div>
  );
};

export default CityInfoPanel;
