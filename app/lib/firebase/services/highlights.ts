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
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(highlightsRef, where('userId', '==', userId), where('bookId', '==', bookId), orderBy('createdAt', 'desc'));

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
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const timestamp = serverTimestamp();
  const newHighlight: FirestoreHighlight = {
    ...highlight,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const docRef = await addDoc(highlightsRef, newHighlight);
  const now = new Date().toISOString();

  return {
    ...highlight,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };
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
