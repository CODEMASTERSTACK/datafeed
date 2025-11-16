import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/modal.css';
import '../styles/editmodal.css';
import type { DataResponse } from '../types';

interface EditResponseModalProps {
  response: DataResponse;
  onSave: (data: DataResponse) => void;
  onCancel: () => void;
}

const EditResponseModal: React.FC<EditResponseModalProps> = ({ response, onSave, onCancel }) => {
  const [formData, setFormData] = useState(response);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (typeof formData.strength === 'string' ? !formData.strength?.trim() : !formData.strength?.length) newErrors.strength = 'Strength is required';
    if (typeof formData.weakness === 'string' ? !formData.weakness?.trim() : !formData.weakness?.length) newErrors.weakness = 'Weakness is required';
    if (!formData.speechTone?.trim()) newErrors.speechTone = 'Speech Tone is required';
    if (!formData.nature?.trim()) newErrors.nature = 'Nature is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={onCancel}
    >
      <motion.div
        className="modal-content edit-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="edit-modal-header">
          <h2>Edit Response</h2>
          <motion.button
            className="close-btn"
            onClick={onCancel}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="edit-form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="edit-form-group">
            <label>Strength</label>
            <textarea
              name="strength"
              value={formData.strength}
              onChange={handleChange}
              rows={3}
              className={errors.strength ? 'input-error' : ''}
            />
            {errors.strength && <span className="error-message">{errors.strength}</span>}
          </div>

          <div className="edit-form-group">
            <label>Weakness</label>
            <textarea
              name="weakness"
              value={formData.weakness}
              onChange={handleChange}
              rows={3}
              className={errors.weakness ? 'input-error' : ''}
            />
            {errors.weakness && <span className="error-message">{errors.weakness}</span>}
          </div>

          <div className="edit-form-group">
            <label>Habits</label>
            <textarea
              name="habits"
              value={formData.habits || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="edit-form-group">
            <label>Speech Tone</label>
            <input
              type="text"
              name="speechTone"
              value={formData.speechTone}
              onChange={handleChange}
              className={errors.speechTone ? 'input-error' : ''}
            />
            {errors.speechTone && <span className="error-message">{errors.speechTone}</span>}
          </div>

          <div className="edit-form-group">
            <label>Nature</label>
            <input
              type="text"
              name="nature"
              value={formData.nature}
              onChange={handleChange}
              className={errors.nature ? 'input-error' : ''}
            />
            {errors.nature && <span className="error-message">{errors.nature}</span>}
          </div>

          <div className="edit-modal-actions">
            <motion.button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="modal-btn modal-btn-confirm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditResponseModal;
