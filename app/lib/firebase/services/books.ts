import { db } from "../firebase";
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
  Timestamp,
  FieldValue,
  deleteField,
  limit,
} from "firebase/firestore";
import type { Book, BaseBook, ReadingStatusType } from "@/app/stores/types";
import type { WithTimestamps } from "../types";
import { ReadingStatus } from "@/app/stores/types";

const BOOKS_COLLECTION = "books";

// Helper function to transform Firestore timestamps
const transformTimestamps = (data: Record<string, unknown>) => {
  const transformed = { ...data };

  // Transform standard timestamps
  ["createdAt", "updatedAt", "startDate", "completedDate"].forEach((field) => {
    if (transformed[field] instanceof Timestamp) {
      transformed[field] = (transformed[field] as Timestamp)
        .toDate()
        .toISOString();
    }
  });

  return transformed;
};

export async function getBooks(userId: string): Promise<Book[]> {
  const booksRef = collection(db, BOOKS_COLLECTION);
  const q = query(
    booksRef,
    where("userId", "==", userId),
    orderBy("updatedAt", "desc"),
    limit(50) // Limit initial load to 50 books
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...transformTimestamps(doc.data()),
      } as Book)
  );
}

export async function getBook(bookId: string): Promise<Book> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const bookDoc = await getDoc(bookRef);

  if (!bookDoc.exists()) {
    throw new Error("Book not found");
  }

  return {
    id: bookDoc.id,
    ...transformTimestamps(bookDoc.data()),
  } as Book;
}

export async function addBook(userId: string, book: BaseBook): Promise<Book> {
  const booksRef = collection(db, BOOKS_COLLECTION);
  const timestamp = serverTimestamp();

  const newBook = {
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

export async function updateBook(
  bookId: string,
  updates: Partial<BaseBook>
): Promise<WithTimestamps<Partial<BaseBook> & { id: string }>> {
  if (!bookId) {
    throw new Error("Book ID is required for update");
  }

  // Clean undefined values from updates
  const cleanUpdates = Object.entries(updates).reduce<Partial<BaseBook>>(
    (acc, [key, value]) => {
      if (value !== undefined) {
        (acc as Record<keyof BaseBook, BaseBook[keyof BaseBook]>)[
          key as keyof BaseBook
        ] = value;
      }
      return acc;
    },
    {}
  );

  if (Object.keys(cleanUpdates).length === 0) {
    throw new Error("No valid updates provided");
  }

  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();
  const updateData = {
    ...cleanUpdates,
    updatedAt: timestamp,
  };

  await updateDoc(bookRef, updateData);
  const now = new Date().toISOString();

  // Get the current document to include createdAt in the response
  const bookSnap = await getDoc(bookRef);
  const bookData = bookSnap.data();

  return {
    ...cleanUpdates,
    id: bookId,
    createdAt: bookData?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function deleteBook(bookId: string): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  await deleteDoc(bookRef);
}

export async function updateReadingStatus(
  bookId: string,
  status: ReadingStatusType
): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();

  // Get current book status
  const bookSnap = await getDoc(bookRef);
  const bookData = bookSnap.data();
  const currentStatus = bookData?.status;

  const updateData: {
    status: ReadingStatusType;
    updatedAt: FieldValue;
    startDate?: FieldValue;
    completedDate?: FieldValue;
  } = {
    status,
    updatedAt: timestamp,
  };

  // Only set startDate when transitioning from NOT_STARTED to IN_PROGRESS
  if (
    currentStatus === ReadingStatus.NOT_STARTED &&
    status === ReadingStatus.IN_PROGRESS
  ) {
    updateData.startDate = timestamp;
  } else if (status === ReadingStatus.NOT_STARTED) {
    // Remove startDate when moving back to NOT_STARTED
    updateData.startDate = deleteField();
  }

  // Set completedDate when marking as completed
  if (status === ReadingStatus.COMPLETED) {
    updateData.completedDate = timestamp;
  } else if (currentStatus === ReadingStatus.COMPLETED) {
    // Remove completedDate when moving from completed to another status
    updateData.completedDate = deleteField();
  }

  await updateDoc(bookRef, updateData);
}

export async function updateReadingProgress(
  bookId: string,
  currentPage: number
): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();
  const updateData = {
    currentPage,
    updatedAt: timestamp,
  };

  await updateDoc(bookRef, updateData);
}
