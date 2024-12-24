import { db } from '../firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, type Timestamp } from 'firebase/firestore';
import type { Highlight, BaseHighlight } from '@/app/stores/types';
import type { FirebaseModel, WithTimestamps } from '../types';

const HIGHLIGHTS_COLLECTION = 'highlights';

type FirestoreHighlight = FirebaseModel<Highlight>;

export async function getHighlights(userId: string): Promise<Highlight[]> {
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(highlightsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
      updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
    } as Highlight;
  });
}

export async function getHighlightsByBook(userId: string, bookId: string): Promise<Highlight[]> {
  console.log('getHighlightsByBook called with:', { userId, bookId });

  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(highlightsRef, where('userId', '==', userId), where('bookId', '==', bookId), orderBy('createdAt', 'desc'));

  console.log('Executing Firestore query:', {
    collection: HIGHLIGHTS_COLLECTION,
    conditions: [
      { field: 'userId', operator: '==', value: userId },
      { field: 'bookId', operator: '==', value: bookId },
    ],
    orderBy: { field: 'createdAt', direction: 'desc' },
  });

  try {
    const snapshot = await getDocs(q);
    console.log('Query results:', {
      empty: snapshot.empty,
      size: snapshot.size,
      docs: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    });

    const highlights = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
      } as Highlight;
    });

    console.log('Processed highlights:', highlights);
    return highlights;
  } catch (error) {
    console.error('Error in getHighlightsByBook:', error);
    throw error;
  }
}

export async function getFavoriteHighlights(userId: string): Promise<Highlight[]> {
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(highlightsRef, where('userId', '==', userId), where('isFavorite', '==', true), orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
      updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
    } as Highlight;
  });
}

export async function addHighlight(userId: string, highlight: BaseHighlight): Promise<Highlight> {
  console.log('addHighlight called with:', { userId, highlight });

  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const timestamp = serverTimestamp();
  const newHighlight: Omit<FirestoreHighlight, 'id'> = {
    ...highlight,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  console.log('Creating new highlight document:', newHighlight);

  try {
    const docRef = await addDoc(highlightsRef, newHighlight);
    const now = new Date().toISOString();

    const createdHighlight = {
      ...highlight,
      id: docRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    console.log('Successfully created highlight:', createdHighlight);
    return createdHighlight;
  } catch (error) {
    console.error('Error in addHighlight:', error);
    throw error;
  }
}

export async function updateHighlight(
  highlightId: string,
  updates: Partial<BaseHighlight>
): Promise<WithTimestamps<Partial<BaseHighlight> & { id: string }>> {
  const highlightRef = doc(db, HIGHLIGHTS_COLLECTION, highlightId);
  const timestamp = serverTimestamp();
  const updateData = {
    ...updates,
    updatedAt: timestamp,
  };

  await updateDoc(highlightRef, updateData);
  const now = new Date().toISOString();

  return {
    id: highlightId,
    ...updates,
    createdAt: now,
    updatedAt: now,
  };
}

export async function deleteHighlight(highlightId: string): Promise<void> {
  const highlightRef = doc(db, HIGHLIGHTS_COLLECTION, highlightId);
  await deleteDoc(highlightRef);
}

export async function toggleFavorite(highlightId: string, isFavorite: boolean): Promise<void> {
  const highlightRef = doc(db, HIGHLIGHTS_COLLECTION, highlightId);
  const timestamp = serverTimestamp();
  const updateData = {
    isFavorite,
    updatedAt: timestamp,
  };

  await updateDoc(highlightRef, updateData);
}
