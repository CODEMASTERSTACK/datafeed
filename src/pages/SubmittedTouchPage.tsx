import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { DataResponse } from '../types';
import { getUserSubmittedResponses } from '../services/database';
import '../styles/submitted.css';

interface LocationState {
  userName?: string;
}

const SubmittedTouchPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [responses, setResponses] = useState<DataResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmitted();
  }, []);

  const loadSubmitted = async () => {
    setIsLoading(true);
    try {
      const userName = state?.userName || localStorage.getItem('userName') || 'User';
      const submitted = await getUserSubmittedResponses(userName);
      setResponses(submitted);
    } catch (error) {
      console.error('Error loading submitted responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="submitted-container">
      <motion.header
        className="submitted-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Submitted Touch</h1>
        <p>Responses you've posted to the database</p>
      </motion.header>

      <div className="submitted-content">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : responses.length === 0 ? (
          <div className="empty">No submitted responses yet.</div>
        ) : (
          <div className="submitted-list">
            {responses.map((r) => (
              <div key={r.id} className="submitted-card">
                <div className="submitted-top">
                  <h3>{r.name}</h3>
                  <small>{new Date(r.createdAt || '').toLocaleString()}</small>
                </div>
                <div className="submitted-body">
                  <p><strong>Strength:</strong> {r.strength}</p>
                  <p><strong>Weakness:</strong> {r.weakness}</p>
                  <p><strong>Habits:</strong> {r.habits || 'N/A'}</p>
                  <p><strong>Speech Tone:</strong> {r.speechTone}</p>
                  <p><strong>Nature:</strong> {r.nature}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmittedTouchPage;