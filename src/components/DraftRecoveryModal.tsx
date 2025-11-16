import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/modal.css';

interface DraftRecoveryModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onDiscard: () => void;
  isLoading?: boolean;
}

const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  isOpen,
  onContinue,
  onDiscard,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDiscard}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">⚠️</div>
            <h2>Unfinished Response</h2>
            <p>You left a response unfinished. Would you like to continue where you left off?</p>

            <div className="modal-actions">
              <motion.button
                className="btn-secondary"
                onClick={onDiscard}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                No, Discard
              </motion.button>
              <motion.button
                className="btn-primary"
                onClick={onContinue}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? '✓ Redirecting...' : 'Yes, Continue'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DraftRecoveryModal;
