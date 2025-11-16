import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/form.css';
import type { DataResponse } from '../types';
import { saveDraft, deleteDraft, isValidDraftToSave } from '../services/localStorage';

interface DataResponseFormProps {
  onSubmit: (data: Omit<DataResponse, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: {
    name?: string;
    strengths?: string[];
    weaknesses?: string[];
    habits?: string;
    speechTone?: string;
    nature?: string;
  };
}

const DataResponseForm: React.FC<DataResponseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    strengths: initialData?.strengths || [],
    weaknesses: initialData?.weaknesses || [],
    habits: initialData?.habits || '',
    speechTone: initialData?.speechTone || '',
    nature: initialData?.nature || '',
  });

  const [tempStrength, setTempStrength] = useState('');
  const [tempWeakness, setTempWeakness] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save draft to localStorage (debounced)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      if (isValidDraftToSave(formData)) {
        saveDraft({
          id: 'current-draft', // Using a fixed ID for current draft
          ...formData,
        });
        console.log('Draft auto-saved to localStorage');
      }
    }, 1000); // Save after 1 second of inactivity

    // Cleanup on component unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const addStrength = () => {
    if (tempStrength.trim()) {
      setFormData((prev) => ({
        ...prev,
        strengths: [...prev.strengths, tempStrength.trim()],
      }));
      setTempStrength('');
      if (errors.strength) {
        setErrors((prev) => ({ ...prev, strength: '' }));
      }
    }
  };

  const removeStrength = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index),
    }));
  };

  const addWeakness = () => {
    if (tempWeakness.trim()) {
      setFormData((prev) => ({
        ...prev,
        weaknesses: [...prev.weaknesses, tempWeakness.trim()],
      }));
      setTempWeakness('');
      if (errors.weakness) {
        setErrors((prev) => ({ ...prev, weakness: '' }));
      }
    }
  };

  const removeWeakness = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      weaknesses: prev.weaknesses.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.strengths.length === 0) newErrors.strength = 'Add at least one strength';
    if (formData.weaknesses.length === 0) newErrors.weakness = 'Add at least one weakness';
    if (!formData.speechTone.trim()) newErrors.speechTone = 'Speech Tone is required';
    if (!formData.nature.trim()) newErrors.nature = 'Nature is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert arrays to joined strings for submission
      const submitData = {
        ...formData,
        strength: formData.strengths.join(', '),
        weakness: formData.weaknesses.join(', '),
      };
      // Remove the arrays from the submission
      const { strengths, weaknesses, ...dataToSubmit } = submitData as any;
      onSubmit(dataToSubmit);
      
      // Clear the draft from localStorage after successful submission
      deleteDraft();
    }
  };

  return (
    <motion.div
      className="form-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-header">
        <h2>Add New Response</h2>
        <motion.button
          className="close-btn"
          onClick={onCancel}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ✕
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="response-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <div>
            <label>Strength * (Add multiple)</label>
            <div className="list-input-group">
              <input
                type="text"
                value={tempStrength}
                onChange={(e) => setTempStrength(e.target.value)}
                placeholder="Type a strength"
                className={errors.strength ? 'input-error' : ''}
                onKeyPress={(e) => e.key === 'Enter' && addStrength()}
              />
              <motion.button
                type="button"
                className="add-btn-small"
                onClick={addStrength}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                + Add
              </motion.button>
            </div>
            <AnimatePresence>
              {formData.strengths.length > 0 && (
                <div className="list-items">
                  {formData.strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      className="list-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <span>{strength}</span>
                      <motion.button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeStrength(index)}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
            {errors.strength && <span className="error-message">{errors.strength}</span>}
          </div>
        </div>

        <div className="form-group">
          <div>
            <label>Weakness * (Add multiple)</label>
            <div className="list-input-group">
              <input
                type="text"
                value={tempWeakness}
                onChange={(e) => setTempWeakness(e.target.value)}
                placeholder="Type a weakness"
                className={errors.weakness ? 'input-error' : ''}
                onKeyPress={(e) => e.key === 'Enter' && addWeakness()}
              />
              <motion.button
                type="button"
                className="add-btn-small"
                onClick={addWeakness}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                + Add
              </motion.button>
            </div>
            <AnimatePresence>
              {formData.weaknesses.length > 0 && (
                <div className="list-items">
                  {formData.weaknesses.map((weakness, index) => (
                    <motion.div
                      key={index}
                      className="list-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <span>{weakness}</span>
                      <motion.button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeWeakness(index)}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
            {errors.weakness && <span className="error-message">{errors.weakness}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="habits">Habits (Optional)</label>
          <textarea
            id="habits"
            name="habits"
            value={formData.habits}
            onChange={handleChange}
            placeholder="Describe any habits"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="speechTone">Speech Tone *</label>
          <input
            type="text"
            id="speechTone"
            name="speechTone"
            value={formData.speechTone}
            onChange={handleChange}
            placeholder="e.g., Formal, Casual, Professional"
            className={errors.speechTone ? 'input-error' : ''}
          />
          {errors.speechTone && <span className="error-message">{errors.speechTone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nature">Nature *</label>
          <input
            type="text"
            id="nature"
            name="nature"
            value={formData.nature}
            onChange={handleChange}
            placeholder="e.g., Introverted, Extroverted, Ambivert"
            className={errors.nature ? 'input-error' : ''}
          />
          {errors.nature && <span className="error-message">{errors.nature}</span>}
        </div>

        <div className="form-actions">
          <motion.button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="btn-submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default DataResponseForm;
