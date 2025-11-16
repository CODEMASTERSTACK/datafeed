import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import DataResponseForm from '../components/DataResponseForm';
import DraftResponsesList from '../components/DraftResponsesList';
import SuccessModal from '../components/SuccessModal';
import '../styles/datafeeder.css';
import type { DataResponse } from '../types';
import { addDraftResponse, getUserDraftResponses } from '../services/database';

interface DataFeederPageProps {
  userName: string;
}

const DataFeederPage: React.FC<DataFeederPageProps> = ({ userName }) => {
  const location = useLocation();
  const [responses, setResponses] = useState<DataResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [restoredDraft, setRestoredDraft] = useState<any>(null);

  // Load draft responses on mount
  useEffect(() => {
    loadResponses();
    
    // Check if navigated from draft recovery modal
    if (location.state?.restoredDraft) {
      setRestoredDraft(location.state.restoredDraft);
      setShowForm(true);
    }
  }, [userName, location.state]);

  const loadResponses = async () => {
    try {
      setIsLoading(true);
      const drafts = await getUserDraftResponses(userName);
      setResponses(drafts);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResponse = (formData: Omit<DataResponse, 'id' | 'createdAt'>) => {
    // Add to database and show success only on confirmation
    addDraftResponse(userName, formData)
      .then((id) => {
        setResponses([
          ...responses,
          {
            id,
            ...formData,
            createdAt: new Date().toISOString(),
          },
        ]);
        setShowForm(false);
        // Show success modal after successful write
        setSuccessMessage('Your response has been drafted to "Final Touch Page"');
        setShowSuccess(true);
        // Close modal after 1 second
        setTimeout(() => setShowSuccess(false), 1000);
      })
      .catch((error) => {
        console.error('Error adding response:', error);
        // Show an alert so user notices failure
        alert('Failed to save response: ' + (error?.message || error));
      });
  };

  const handleRefresh = () => {
    loadResponses();
  };

  return (
    <div className="datafeeder-container">
      <motion.header
        className="datafeeder-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Welcome, <span className="user-name">{userName}</span></h1>
        <p>Manage your data responses</p>
      </motion.header>

      <div className="datafeeder-content">
        {/* Add New Response Button */}
        {!showForm && (
          <motion.div
            className="add-response-section"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              className="add-btn"
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="add-icon">+</span>
              <span>Add New Response</span>
            </motion.button>
          </motion.div>
        )}

        {/* Form Section */}
        {showForm && (
          <motion.div
            className="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DataResponseForm
              onSubmit={handleAddResponse}
              onCancel={() => {
                setShowForm(false);
                setRestoredDraft(null);
              }}
              initialData={restoredDraft}
            />
          </motion.div>
        )}

        {/* Responses List */}
        <motion.div
          className="responses-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="section-header">
            <h2>Your Draft Responses</h2>
            <motion.button
              className="refresh-btn"
              onClick={handleRefresh}
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
            >
              ↻
            </motion.button>
          </div>

          {isLoading ? (
            <motion.div
              className="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="spinner"></span>
              <p>Loading responses...</p>
            </motion.div>
          ) : responses.length > 0 ? (
            <DraftResponsesList
              responses={responses}
              onRefresh={handleRefresh}
            />
          ) : (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>No responses yet. Click "Add New Response" to get started!</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal message={successMessage} />
      )}
    </div>
  );
};

export default DataFeederPage;
