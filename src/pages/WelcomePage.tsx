import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/welcome.css';

interface WelcomePageProps {
  onNameSubmit: (name: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onNameSubmit }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsLoading(true);
      // Wait for exit animation then call onNameSubmit
      setTimeout(() => {
        onNameSubmit(name);
      }, 1200);
    }
  };

  return (
    <div className="welcome-container">
      <motion.div
        className="welcome-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="welcome-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          You're helping build the data for app.
        </motion.h1>

        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Please enter your name to get started
        </motion.p>

        <form onSubmit={handleSubmit} className="welcome-form">
          <motion.div
            className="input-wrapper"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-input"
              disabled={isLoading}
              autoFocus
            />
          </motion.div>

          <motion.button
            type="submit"
            className="submit-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            disabled={!name.trim() || isLoading}
            whileHover={!isLoading ? { scale: 1.08, boxShadow: '0 20px 40px rgba(246, 201, 101, 0.3)' } : {}}
            whileTap={!isLoading ? { scale: 0.92 } : {}}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⏳
              </motion.span>
            ) : (
              'Continue'
            )}
          </motion.button>
        </form>

        {isLoading && (
          <motion.div
            className="loading-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              Welcoming you...
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WelcomePage;
