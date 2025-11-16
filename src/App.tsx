import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import DraftRecoveryModal from './components/DraftRecoveryModal';
import WelcomePage from './pages/WelcomePage';
import DataFeederPage from './pages/DataFeederPage';
import FinalTouchPage from './pages/FinalTouchPage';
import SubmittedTouchPage from './pages/SubmittedTouchPage';
import { loadDraft, deleteDraft, saveUserData } from './services/localStorage';
import './styles/globals.css';

function AppContent() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);

  // Check for draft on mount
  useEffect(() => {
    if (userName) {
      const draft = loadDraft();
      if (draft) {
        setShowDraftRecovery(true);
      }
    }
  }, [userName]);

  const handleNameSubmit = (name: string) => {
    localStorage.setItem('userName', name);
    saveUserData(name);
    setUserName(name);
  };

  const handleContinueDraft = () => {
    setIsRecoveryLoading(true);
    const draft = loadDraft();
    if (draft) {
      setTimeout(() => {
        navigate('/data-feeder', {
          state: {
            restoredDraft: {
              name: draft.name,
              strengths: draft.strengths,
              weaknesses: draft.weaknesses,
              habits: draft.habits,
              speechTone: draft.speechTone,
              nature: draft.nature,
            },
          },
        });
        setShowDraftRecovery(false);
        setIsRecoveryLoading(false);
      }, 300);
    }
  };

  const handleDiscardDraft = () => {
    deleteDraft();
    setShowDraftRecovery(false);
  };

  if (!userName) {
    return (
      <Routes>
        <Route path="/" element={<WelcomePage onNameSubmit={handleNameSubmit} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <DraftRecoveryModal
        isOpen={showDraftRecovery}
        onContinue={handleContinueDraft}
        onDiscard={handleDiscardDraft}
        isLoading={isRecoveryLoading}
      />
      <Navigation />
      <Routes>
        <Route path="/" element={<DataFeederPage userName={userName} />} />
        <Route path="/data-feeder" element={<DataFeederPage userName={userName} />} />
        <Route path="/final-touch" element={<FinalTouchPage />} />
        <Route path="/submitted" element={<SubmittedTouchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
