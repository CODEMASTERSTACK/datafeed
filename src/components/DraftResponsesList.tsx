import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/responseslist.css';
import type { DataResponse } from '../types';

interface DraftResponsesListProps {
  responses: DataResponse[];
  // optional callback the parent may provide to refresh list; not sent through navigation
  onRefresh?: () => void;
}

const DraftResponsesList: React.FC<DraftResponsesListProps> = ({ responses }) => {
  const navigate = useNavigate();

  const handleViewResponses = () => {
    // Only pass serializable data (functions cannot be cloned into history state)
    navigate('/final-touch', {
      state: { responses }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="responses-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {responses.map((response) => (
        <motion.div
          key={response.id}
          className="response-card"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <div className="response-header">
            <h3>{response.name}</h3>
            <span className="response-status">Draft</span>
          </div>

          <div className="response-preview">
            <div className="preview-item">
              <span className="label">Strength:</span>
              <p className="truncate">{response.strength}</p>
            </div>
            <div className="preview-item">
              <span className="label">Weakness:</span>
              <p className="truncate">{response.weakness}</p>
            </div>
            <div className="preview-item">
              <span className="label">Speech Tone:</span>
              <p>{response.speechTone}</p>
            </div>
            <div className="preview-item">
              <span className="label">Nature:</span>
              <p>{response.nature}</p>
            </div>
          </div>

          <div className="response-footer">
            <small>ID: {response.id?.substring(0, 8)}...</small>
          </div>
        </motion.div>
      ))}

      <motion.div
        className="finalize-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          className="finalize-btn"
          onClick={handleViewResponses}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">→</span>
          Go to Final Touch Page
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DraftResponsesList;
