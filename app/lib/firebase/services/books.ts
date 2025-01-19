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
  onSnapshot,
} from "firebase/firestore";
import type { Book, BaseBook, ReadingStatusType } from "@/app/stores/types";
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
    limit(50), // Limit initial load to 50 books
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...transformTimestamps(doc.data()),
      }) as Book,
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
  updates: Partial<Book>,
): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();

  const updateData = {
    ...updates,
    updatedAt: timestamp,
  };

  await updateDoc(bookRef, updateData);
}

export async function deleteBook(bookId: string): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  await deleteDoc(bookRef);
}

export async function updateReadingStatus(
  bookId: string,
  status: ReadingStatusType,
  additionalUpdates: Partial<Omit<Book, "startDate" | "completedDate">> = {},
): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();

  // Get current book status
  const bookSnap = await getDoc(bookRef);
  const bookData = bookSnap.data();
  const currentStatus = bookData?.status;

  // Create base update data
  const baseUpdate = {
    status,
    updatedAt: timestamp,
    ...additionalUpdates,
  };

  // Handle date fields separately to ensure proper typing
  const dateUpdates: {
    startDate?: FieldValue | Timestamp;
    completedDate?: FieldValue;
  } = {};

  // Handle startDate
  if (
    currentStatus === ReadingStatus.NOT_STARTED &&
    status === ReadingStatus.IN_PROGRESS
  ) {
    // Set start date when starting a book
    dateUpdates.startDate = timestamp;
  } else if (status === ReadingStatus.NOT_STARTED) {
    // Clear both dates when resetting
    dateUpdates.startDate = deleteField();
    dateUpdates.completedDate = deleteField();
  } else if (
    status === ReadingStatus.COMPLETED ||
    status === ReadingStatus.IN_PROGRESS
  ) {
    // Preserve existing start date if it exists
    if (bookData?.startDate) {
      dateUpdates.startDate = bookData.startDate;
    } else {
      // If no start date exists (edge case), set it now
      dateUpdates.startDate = timestamp;
    }
  }

  // Handle completedDate
  if (status === ReadingStatus.COMPLETED) {
    dateUpdates.completedDate = timestamp;
  } else if (currentStatus === ReadingStatus.COMPLETED) {
    dateUpdates.completedDate = deleteField();
  }

  // Combine updates
  const updateData = {
    ...baseUpdate,
    ...dateUpdates,
  };

  await updateDoc(bookRef, updateData);
}

export async function updateReadingProgress(
  bookId: string,
  currentPage: number,
  additionalUpdates: Partial<Book> = {},
): Promise<void> {
  const bookRef = doc(db, BOOKS_COLLECTION, bookId);
  const timestamp = serverTimestamp();

  const updateData = {
    currentPage,
    updatedAt: timestamp,
    ...additionalUpdates,
  };

  await updateDoc(bookRef, updateData);
}

export function subscribeToBooks(
  userId: string,
  onUpdate: (books: Book[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const booksRef = collection(db, BOOKS_COLLECTION);
  const q = query(
    booksRef,
    where("userId", "==", userId),
    orderBy("updatedAt", "desc"),
    limit(50),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      try {
        const books = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...transformTimestamps(doc.data()),
            }) as Book,
        );
        onUpdate(books);
      } catch (error) {
        console.error("Error processing books snapshot:", error);
        onError?.(error as Error);
      }
    },
    (error) => {
      console.error("Books subscription error:", error);
      onError?.(error);
    },
  );
}
