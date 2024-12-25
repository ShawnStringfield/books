import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
  type FieldValue,
  limit as limitQuery,
  onSnapshot,
} from "firebase/firestore";
import type { Highlight, BaseHighlight } from "@/app/stores/types";
import type { FirebaseModel, WithTimestamps } from "../types";

const HIGHLIGHTS_COLLECTION = "highlights";

type FirestoreHighlight = FirebaseModel<Highlight>;

// Helper function to safely convert Firestore timestamp to ISO string
function convertTimestamp(firestoreTimestamp: any): string {
  // If it's already a string (ISO format), return it
  if (typeof firestoreTimestamp === "string") {
    return firestoreTimestamp;
  }

  // If it's a Firebase Timestamp
  if (firestoreTimestamp && typeof firestoreTimestamp.toDate === "function") {
    return firestoreTimestamp.toDate().toISOString();
  }

  // For pending server timestamps or null/undefined values
  return new Date().toISOString();
}

// Helper function to convert Firestore document to Highlight
function convertDocToHighlight(doc: any): Highlight {
  const data = doc.data();
  const now = new Date().toISOString();

  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt === null ? now : convertTimestamp(data.createdAt),
    updatedAt: data.updatedAt === null ? now : convertTimestamp(data.updatedAt),
  } as Highlight;
}

export async function getHighlights(userId: string): Promise<Highlight[]> {
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(
    highlightsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertDocToHighlight);
}

export async function getHighlightsByBook(
  userId: string,
  bookId: string,
  limit?: number
): Promise<Highlight[]> {
  console.log("getHighlightsByBook called with:", { userId, bookId, limit });

  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  let q = query(
    highlightsRef,
    where("userId", "==", userId),
    where("bookId", "==", bookId),
    orderBy("createdAt", "desc")
  );

  if (limit) {
    q = query(q, limitQuery(limit));
  }

  console.log("Executing Firestore query:", {
    collection: HIGHLIGHTS_COLLECTION,
    conditions: [
      { field: "userId", operator: "==", value: userId },
      { field: "bookId", operator: "==", value: bookId },
    ],
    orderBy: { field: "createdAt", direction: "desc" },
    limit,
  });

  try {
    const snapshot = await getDocs(q);
    console.log("Query results:", {
      empty: snapshot.empty,
      size: snapshot.size,
      docs: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    });

    const highlights = snapshot.docs.map(convertDocToHighlight);

    console.log("Processed highlights:", highlights);
    return highlights;
  } catch (error) {
    console.error("Error in getHighlightsByBook:", error);
    throw error;
  }
}

export async function getFavoriteHighlights(
  userId: string
): Promise<Highlight[]> {
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(
    highlightsRef,
    where("userId", "==", userId),
    where("isFavorite", "==", true),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertDocToHighlight);
}

export async function addHighlight(
  userId: string,
  highlight: BaseHighlight
): Promise<Highlight> {
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const timestamp = serverTimestamp();

  // Create the document with server timestamps
  const newHighlight: Omit<FirestoreHighlight, "id"> = {
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
    userId,
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

export async function deleteHighlightsByBook(bookId: string): Promise<void> {
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(highlightsRef, where("bookId", "==", bookId));
  const snapshot = await getDocs(q);

  // Delete all highlights in parallel
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

export async function toggleFavorite(
  highlightId: string,
  isFavorite: boolean
): Promise<void> {
  const highlightRef = doc(db, HIGHLIGHTS_COLLECTION, highlightId);
  const timestamp = serverTimestamp();
  const updateData = {
    isFavorite,
    updatedAt: timestamp,
  };

  await updateDoc(highlightRef, updateData);
}

export function subscribeToHighlights(
  userId: string,
  onUpdate: (highlights: Highlight[]) => void,
  onError?: (error: Error) => void
): () => void {
  console.log("Setting up highlights subscription for user:", userId);
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(
    highlightsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      try {
        console.log("Received snapshot:", {
          size: snapshot.size,
          empty: snapshot.empty,
        });
        const highlights = snapshot.docs
          .map((doc, index) => {
            try {
              return convertDocToHighlight(doc);
            } catch (error) {
              console.error(
                `Error converting document at index ${index}:`,
                error
              );
              return null;
            }
          })
          .filter((h): h is Highlight => h !== null);
        console.log("Processed highlights:", highlights.length);
        onUpdate(highlights);
      } catch (error) {
        console.error("Error processing snapshot:", error);
        onError?.(error as Error);
      }
    },
    (error) => {
      console.error("Subscription error:", error);
      onError?.(error);
    }
  );
}

export function subscribeToHighlightsByBook(
  userId: string,
  bookId: string,
  onUpdate: (highlights: Highlight[]) => void,
  onError?: (error: Error) => void,
  limit?: number
): () => void {
  console.log("Setting up book highlights subscription:", {
    userId,
    bookId,
    limit,
  });
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  let q = query(
    highlightsRef,
    where("userId", "==", userId),
    where("bookId", "==", bookId),
    orderBy("createdAt", "desc")
  );

  if (limit) {
    q = query(q, limitQuery(limit));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      try {
        console.log("Received book snapshot:", {
          size: snapshot.size,
          empty: snapshot.empty,
        });
        const highlights = snapshot.docs
          .map((doc, index) => {
            try {
              return convertDocToHighlight(doc);
            } catch (error) {
              console.error(
                `Error converting book document at index ${index}:`,
                error
              );
              return null;
            }
          })
          .filter((h): h is Highlight => h !== null);
        console.log("Processed book highlights:", highlights.length);
        onUpdate(highlights);
      } catch (error) {
        console.error("Error processing book snapshot:", error);
        onError?.(error as Error);
      }
    },
    (error) => {
      console.error("Book subscription error:", error);
      onError?.(error);
    }
  );
}

export function subscribeToFavoriteHighlights(
  userId: string,
  onUpdate: (highlights: Highlight[]) => void,
  onError?: (error: Error) => void
): () => void {
  const highlightsRef = collection(db, HIGHLIGHTS_COLLECTION);
  const q = query(
    highlightsRef,
    where("userId", "==", userId),
    where("isFavorite", "==", true),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const highlights = snapshot.docs.map(convertDocToHighlight);
      onUpdate(highlights);
    },
    (error) => {
      console.error("Error in favorite highlights subscription:", error);
      onError?.(error);
    }
  );
}
