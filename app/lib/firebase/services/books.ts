import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import type { Book, BaseBook, ReadingStatusType } from '@/app/stores/types';
import type { FirebaseModel, WithTimestamps } from '../types';

const BOOKS_COLLECTION = 'books';

type FirestoreBook = FirebaseModel<Book>;

export async function getBooks(userId: string): Promise<Book[]> {
  const booksRef = collection(db, BOOKS_COLLECTION);
  const q = query(booksRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
      updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
    } as Book;
  });
}

export async function getBook(bookId: string): Promise<Book> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const bookDoc = await getDoc(bookRef);

  if (!bookDoc.exists()) {
    throw new Error('Book not found');
  }

  const data = bookDoc.data();
  return {
    id: bookDoc.id,
    ...data,
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
  } as Book;
}

export async function addBook(userId: string, book: BaseBook): Promise<Book> {
  const booksRef = collection(db, BOOKS_COLLECTION);
  const timestamp = serverTimestamp();
  const newBook: FirestoreBook = {
    ...book,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const docRef = await addDoc(booksRef, newBook);
  const now = new Date().toISOString();

  return {
    ...book,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateBook(bookId: string, updates: Partial<BaseBook>): Promise<WithTimestamps<Partial<BaseBook> & { id: string }>> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();
  const updateData = {
    ...updates,
    updatedAt: timestamp,
  };

  await updateDoc(bookRef, updateData);
  const now = new Date().toISOString();

  return {
    id: bookId,
    ...updates,
    createdAt: now,
    updatedAt: now,
  };
}

export async function deleteBook(bookId: string): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  await deleteDoc(bookRef);
}

export async function updateReadingStatus(bookId: string, status: ReadingStatusType): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();
  const updateData = {
    status,
    updatedAt: timestamp,
  };

  await updateDoc(bookRef, updateData);
}

export async function updateReadingProgress(bookId: string, currentPage: number): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();
  const updateData = {
    currentPage,
    updatedAt: timestamp,
  };

  await updateDoc(bookRef, updateData);
}
