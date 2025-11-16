import React from 'react';
import { motion } from 'framer-motion';
import '../styles/modal.css';

interface SuccessModalProps {
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message }) => {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal-content success-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          ✓
        </motion.div>
        <p className="modal-message">{message}</p>
      </motion.div>
    </motion.div>
  );
};

export default SuccessModal;
