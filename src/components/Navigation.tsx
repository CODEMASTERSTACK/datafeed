import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const userName = localStorage.getItem('userName') || 'User';

  // Define navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/final-touch', label: 'Final Touch', icon: '✨' },
    { path: '/submitted', label: 'Submitted', icon: '✓' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Navigation Bar */}
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="nav-container">
          {/* Logo / Brand */}
          <div className="nav-brand">
            <motion.div
              className="brand-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              ✧
            </motion.div>
            <span className="brand-name">DataFeed</span>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-desktop">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive(item.path) && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="active-indicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* User Info */}
          <div className="nav-user">
            <span className="user-greeting">Hi, {userName.split(' ')[0]}</span>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nav-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-nav-items">
              {navItems.map((item) => (
                <motion.button
                  key={item.path}
                  className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
