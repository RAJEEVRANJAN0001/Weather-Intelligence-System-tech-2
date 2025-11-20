import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/98 backdrop-blur-2xl">
      <div className="text-center max-w-md px-8">
        {/* Animated Weather Icon */}
        <motion.div
          className="relative w-40 h-40 mx-auto mb-10"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-2xl"></div>
          
          {/* Middle rotating ring */}
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-40"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          
          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600"
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 40px rgba(147, 51, 234, 0.7)',
                '0 0 20px rgba(59, 130, 246, 0.5)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          
          {/* Weather emoji */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center text-5xl"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🌤️
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          className="text-3xl font-light text-white mb-3 gradient-text"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Fetching Weather Intelligence
        </motion.h2>

        <p className="text-white/50 text-sm mb-8">Please wait while we gather comprehensive data</p>

        {/* Loading Steps */}
        <div className="space-y-3 mt-8">
          {[
            { text: 'Resolving location...', icon: '🌍' },
            { text: 'Gathering weather data...', icon: '☁️' },
            { text: 'Analyzing air quality...', icon: '💨' },
            { text: 'Loading city information...', icon: '🏙️' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: [0, 1, 0.6], x: 0 }}
              transition={{
                delay: index * 0.5,
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1.5
              }}
              className="text-sm text-white/70 flex items-center justify-center gap-3 bg-white/5 py-3 px-6 rounded-xl backdrop-blur-sm"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-10 w-80 h-2 mx-auto bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
