// Local Storage Service for persisting user data, drafts, and response history

export interface DraftData {
  id: string;
  name: string;
  strengths: string[];
  weaknesses: string[];
  habits: string;
  speechTone: string;
  nature: string;
  savedAt: number; // timestamp
}

export interface UserData {
  name: string;
  createdAt: number;
  lastUpdated: number;
}

export interface ResponseHistoryItem {
  id: string;
  name: string;
  strength: string;
  weakness: string;
  habits: string;
  speechTone: string;
  nature: string;
  status: 'submitted' | 'draft';
  submittedAt?: number;
  createdAt: number;
}

const STORAGE_KEYS = {
  USER_DATA: 'userData',
  CURRENT_DRAFT: 'currentDraft',
  RESPONSE_HISTORY: 'responseHistory',
};

// User Data Functions
export const saveUserData = (userName: string): void => {
  const userData: UserData = {
    name: userName,
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

export const loadUserData = (): UserData | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
};

// Draft Functions
export const saveDraft = (draft: Omit<DraftData, 'savedAt'>): void => {
  const draftWithTimestamp: DraftData = {
    ...draft,
    savedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draftWithTimestamp));
};

export const loadDraft = (): DraftData | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
  return data ? JSON.parse(data) : null;
};

export const deleteDraft = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);
};

export const hasDraft = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT) !== null;
};

// Response History Functions
export const saveResponseHistory = (item: ResponseHistoryItem): void => {
  const history = loadResponseHistory();
  history.push(item);
  localStorage.setItem(STORAGE_KEYS.RESPONSE_HISTORY, JSON.stringify(history));
};

export const loadResponseHistory = (): ResponseHistoryItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESPONSE_HISTORY);
  return data ? JSON.parse(data) : [];
};

export const deleteResponseFromHistory = (id: string): void => {
  const history = loadResponseHistory();
  const filtered = history.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.RESPONSE_HISTORY, JSON.stringify(filtered));
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);
  localStorage.removeItem(STORAGE_KEYS.RESPONSE_HISTORY);
};

// Check if draft is valid (has name + at least one strength or weakness)
export const isValidDraftToSave = (draft: {
  name: string;
  strengths?: string[];
  strength?: string;
  weaknesses?: string[];
  weakness?: string;
}): boolean => {
  const hasStrengths =
    (Array.isArray(draft.strengths) && draft.strengths.length > 0) ||
    (typeof draft.strength === 'string' && draft.strength.trim().length > 0);

  const hasWeaknesses =
    (Array.isArray(draft.weaknesses) && draft.weaknesses.length > 0) ||
    (typeof draft.weakness === 'string' && draft.weakness.trim().length > 0);

  return draft.name.trim().length > 0 && (hasStrengths || hasWeaknesses);
};
