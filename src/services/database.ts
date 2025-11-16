import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { DataResponse } from '../types';
import { saveResponseHistory } from './localStorage';

const RESPONSES_COLLECTION = 'dataResponses';
const SUBMITTED_COLLECTION = 'submittedData';

// Add a draft response
export const addDraftResponse = async (
  userName: string,
  responseData: Omit<DataResponse, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, RESPONSES_COLLECTION), {
      ...responseData,
      userName,
      isSubmitted: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding draft:', error);
    // Improve permission error message for developers
    if ((error as any)?.code === 'permission-denied') {
      throw new Error('Firestore permission denied. Update your Firestore rules or use the emulator for local development.');
    }
    throw error;
  }
};

// Get all draft responses for a user
export const getUserDraftResponses = async (userName: string): Promise<DataResponse[]> => {
  try {
    const q = query(
      collection(db, RESPONSES_COLLECTION),
      where('userName', '==', userName),
      where('isSubmitted', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
    } as DataResponse));
  } catch (error) {
    console.error('Error fetching draft responses:', error);
    if ((error as any)?.code === 'permission-denied') {
      throw new Error('Firestore permission denied. Update your Firestore rules or use the emulator for local development.');
    }
    throw error;
  }
};

// Update a draft response
export const updateDraftResponse = async (
  responseId: string,
  responseData: Partial<DataResponse>
): Promise<void> => {
  try {
    const docRef = doc(db, RESPONSES_COLLECTION, responseId);
    await updateDoc(docRef, responseData);
  } catch (error) {
    console.error('Error updating draft:', error);
    if ((error as any)?.code === 'permission-denied') {
      throw new Error('Firestore permission denied. Update your Firestore rules or use the emulator for local development.');
    }
    throw error;
  }
};

// Delete a draft response
export const deleteDraftResponse = async (responseId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, RESPONSES_COLLECTION, responseId));
  } catch (error) {
    console.error('Error deleting draft:', error);
    if ((error as any)?.code === 'permission-denied') {
      throw new Error('Firestore permission denied. Update your Firestore rules or use the emulator for local development.');
    }
    throw error;
  }
};

// Submit responses to final collection
export const submitResponses = async (
  userName: string,
  responseIds: string[]
): Promise<void> => {
  try {
    // Get the responses to submit
    const q = query(
      collection(db, RESPONSES_COLLECTION),
      where('userName', '==', userName)
    );
    const querySnapshot = await getDocs(q);

    const responsesToSubmit = querySnapshot.docs.filter((doc) =>
      responseIds.includes(doc.id)
    );

    // Add to submitted collection and mark as submitted in draft
    for (const docSnap of responsesToSubmit) {
      const data = docSnap.data();
      
      // Add to submitted collection
      await addDoc(collection(db, SUBMITTED_COLLECTION), {
        ...data,
        submittedAt: serverTimestamp(),
      });

      // Mark as submitted in draft
      await updateDoc(docSnap.ref, { isSubmitted: true });

      // Also save to localStorage for offline tracking
      saveResponseHistory({
        id: docSnap.id,
        name: data.name || '',
        strength: data.strength || '',
        weakness: data.weakness || '',
        habits: data.habits || '',
        speechTone: data.speechTone || '',
        nature: data.nature || '',
        status: 'submitted',
        submittedAt: Date.now(),
        createdAt: data.createdAt?.toDate?.()?.getTime() || Date.now(),
      });
    }
  } catch (error) {
    console.error('Error submitting responses:', error);
    if ((error as any)?.code === 'permission-denied') {
      throw new Error('Firestore permission denied. Update your Firestore rules or use the emulator for local development.');
    }
    throw error;
  }
};

// Get all submitted responses for a user
export const getUserSubmittedResponses = async (userName: string): Promise<DataResponse[]> => {
  try {
    const q = query(
      collection(db, SUBMITTED_COLLECTION),
      where('userName', '==', userName)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().submittedAt?.toDate?.()?.toISOString(),
    } as DataResponse));
  } catch (error) {
    console.error('Error fetching submitted responses:', error);
    if ((error as any)?.code === 'permission-denied') {
      throw new Error('Firestore permission denied. Update your Firestore rules or use the emulator for local development.');
    }
    throw error;
  }
};
