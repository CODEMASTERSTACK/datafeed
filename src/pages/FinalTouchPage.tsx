import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/finaltouchpage.css';
import ConfirmModal from '../components/ConfirmModal';
import SuccessModal from '../components/SuccessModal';
import EditResponseModal from '../components/EditResponseModal';
import type { DataResponse } from '../types';
import { submitResponses, getUserDraftResponses } from '../services/database';

const FinalTouchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const responsesFromNav = (location.state as any)?.responses || [];
  
  // Extend responses with a stable local id so items without a server id still
  // have unique, stable keys across renders. _localId is never sent to the server.
  type ExtendedResponse = DataResponse & { _localId: string };
  const withLocalIds = (responsesFromNav as DataResponse[]).map((r, i) => ({
    ...r,
    _localId: ((r as any)._localId) || (r.id ?? `local-${i}-${Math.random().toString(36).slice(2,9)}`),
  })) as ExtendedResponse[];
  const [responses, setResponses] = useState<ExtendedResponse[]>(withLocalIds);
  const [isLoading, setIsLoading] = useState(!responsesFromNav.length);

  // Load draft responses from database if navigating directly (no state passed)
  useEffect(() => {
    if (!responsesFromNav.length) {
      loadResponses();
    }
  }, []);

  const loadResponses = async () => {
    try {
      setIsLoading(true);
      const userName = localStorage.getItem('userName') || 'User';
      const drafts = await getUserDraftResponses(userName);
      const withIds = drafts.map((r, i) => ({
        ...r,
        _localId: r.id ?? `local-${i}-${Math.random().toString(36).slice(2,9)}`,
      })) as ExtendedResponse[];
      setResponses(withIds);
    } catch (error) {
      console.error('Error loading draft responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // selectedIds tracks _localId values (always serializable)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<DataResponse> | null>(null);

  const handleToggleSelect = (localId: string) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      if (s.has(localId)) s.delete(localId);
      else s.add(localId);
      return s;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === responses.length) {
      setSelectedIds(new Set());
    } else {
      const allLocalIds = new Set(responses.map((r) => r._localId));
      setSelectedIds(allLocalIds);
    }
  };

  const handleEditResponse = (response: ExtendedResponse) => {
    setEditingId(response._localId || null);
    setEditData({ ...response });
  };

  const handleSaveEdit = (updatedData: DataResponse) => {
    setResponses((prev) =>
      prev.map((r) => {
        if (r._localId === editingId) {
          // preserve _localId and any server id
          return { ...r, ...updatedData, _localId: r._localId } as ExtendedResponse;
        }
        return r;
      })
    );
    setEditingId(null);
    setEditData(null);
  };

  const handlePostFinalTouch = () => {
    if (selectedIds.size === 0) {
      setShowConfirm(true);
    } else {
      submitAndFinalize();
    }
  };

  const submitAndFinalize = async () => {
    try {
      const userName = localStorage.getItem('userName') || 'User';
      // Map selected local ids back to server ids. Only submit responses that have a real server id.
      const selectedLocalIds = Array.from(selectedIds);
      let toSubmit: DataResponse[] = [];
      if (selectedLocalIds.length) {
        toSubmit = responses.filter(r => selectedLocalIds.includes((r as any)._localId));
      } else {
        toSubmit = responses;
      }
      // Map to server IDs (skip local-only items without server id)
      const idsToSubmit = toSubmit.map(r => r.id).filter(Boolean) as string[];
      
      await submitResponses(userName, idsToSubmit);
      setShowSuccess(true);
      
      setTimeout(() => {
        // navigate to submitted page; avoid passing functions in location state
        navigate('/submitted', { 
          state: { 
            userName,
          } 
        });
      }, 1500);
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };

  return (
    <div className="finaltouchpage-container">
      <motion.header
        className="finaltouchpage-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="back-btn"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
        <div className="header-content">
          <h1>Final Touch Page</h1>
          <p>Review and select responses to post</p>
        </div>
      </motion.header>

      <div className="finaltouchpage-content">
        {isLoading ? (
          <motion.div
            className="loading-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="spinner"></div>
            <p>Loading your responses...</p>
          </motion.div>
        ) : responses.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No responses to review yet. Go back and add some!</p>
          </motion.div>
        ) : (
          <>
        <motion.div
          className="selection-toolbar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="select-all-label">
            <input
              type="checkbox"
              checked={selectedIds.size === responses.length && responses.length > 0}
              onChange={handleSelectAll}
            />
            <span>Select All</span>
          </label>
          <span className="selection-count">
            {selectedIds.size} of {responses.length} selected
          </span>
        </motion.div>

        <motion.div
          className="responses-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {responses.map((response) => (
              <motion.div
                key={response._localId}
                className={`response-item ${selectedIds.has(response._localId) ? 'selected' : ''}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -2 }}
              >
                <div className="response-selector">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(response._localId)}
                    onChange={() => handleToggleSelect(response._localId)}
                    disabled={!response.id}
                  />
                </div>

                <div className="response-body">
                  <div className="response-title">
                    <h3>{response.name}</h3>
                  </div>

                  <div className="response-grid">
                    <div className="response-row">
                      <div className="response-field">
                        <span className="field-label">Strength:</span>
                        <p>{response.strength}</p>
                      </div>
                      <div className="response-field">
                        <span className="field-label">Weakness:</span>
                        <p>{response.weakness}</p>
                      </div>
                    </div>
                    <div className="response-row">
                      <div className="response-field">
                        <span className="field-label">Habits:</span>
                        <p>{response.habits || 'N/A'}</p>
                      </div>
                      <div className="response-field">
                        <span className="field-label">Speech Tone:</span>
                        <p>{response.speechTone}</p>
                      </div>
                    </div>
                    <div className="response-row">
                      <div className="response-field full-width">
                        <span className="field-label">Nature:</span>
                        <p>{response.nature}</p>
                      </div>
                    </div>
                  </div>

                  <div className="response-actions">
                    <motion.button
                      className="edit-btn"
                      onClick={() => handleEditResponse(response)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✎ Edit
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="action-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            className="post-btn"
            onClick={handlePostFinalTouch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Post Final Touch
          </motion.button>
        </motion.div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            onConfirm={submitAndFinalize}
            onCancel={() => setShowConfirm(false)}
          />
        )}
        {showSuccess && <SuccessModal message="Data posted successfully! Redirecting..." />}
        {editingId && editData && (
          <EditResponseModal
            response={editData as DataResponse}
            onSave={handleSaveEdit}
            onCancel={() => setEditingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalTouchPage;
