import React from 'react';
import { motion } from 'framer-motion';
import '../styles/modal.css';

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={onCancel}
    >
      <motion.div
        className="modal-content confirm-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="confirm-title">⚠ Confirm Action</h2>
        <p className="confirm-message">
          You haven't selected any particular response so all responses will be posted. 
          You can cancel and select the particular responses if you want.
        </p>
        <div className="modal-actions">
          <motion.button
            className="modal-btn modal-btn-cancel"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="modal-btn modal-btn-confirm"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Post All
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmModal;
