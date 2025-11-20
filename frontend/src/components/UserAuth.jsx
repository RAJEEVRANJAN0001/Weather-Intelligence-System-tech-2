import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

const UserAuth = () => {
  const { currentUser, login, logout, isAuthenticated } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.userId.trim()) {
      setError('User ID is required');
      return;
    }

    if (formData.userId.length < 3 || formData.userId.length > 50) {
      setError('User ID must be between 3 and 50 characters');
      return;
    }

    setLoading(true);

    const result = await login(
      formData.userId.trim(),
      formData.email.trim(),
      formData.name.trim()
    );

    setLoading(false);

    if (result.success) {
      setIsModalOpen(false);
      setFormData({ userId: '', email: '', name: '' });
      if (result.isNewUser) {
        console.log('Welcome! Your account has been created.');
      }
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setFormData({ userId: '', email: '', name: '' });
  };

  return (
    <>
      {/* User Button */}
      <motion.button
        onClick={() => isAuthenticated ? handleLogout() : setIsModalOpen(true)}
        className="fixed top-4 right-4 z-40 px-6 py-2.5 rounded-xl font-semibold text-sm
                   bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md
                   border border-white/20 text-white hover:border-white/40
                   shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>{currentUser?.userId}</span>
          </div>
        ) : (
          'Login / Register'
        )}
      </motion.button>

      {/* Login/Register Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-md p-8 rounded-2xl
                         bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40
                         backdrop-blur-xl border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome
              </h2>
              <p className="text-white/60 mb-6">
                Login or create a new account to track your weather searches
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    User ID *
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="Choose a unique ID (3-50 characters)"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                             text-white placeholder-white/40 focus:outline-none focus:border-purple-400
                             transition-colors"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                             text-white placeholder-white/40 focus:outline-none focus:border-purple-400
                             transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                             text-white placeholder-white/40 focus:outline-none focus:border-purple-400
                             transition-colors"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-purple-600 to-pink-600
                           hover:from-purple-500 hover:to-pink-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? 'Please wait...' : 'Login / Register'}
                </motion.button>
              </form>

              <p className="mt-4 text-xs text-white/40 text-center">
                New users will be automatically registered
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserAuth;
