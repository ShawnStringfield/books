import { Timestamp, FieldValue } from 'firebase/firestore';

export interface FirebaseTimestamps {
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface WithUserId {
  userId: string;
}

export type FirebaseModel<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'> & FirebaseTimestamps & WithUserId;

export interface TimestampedDoc {
  createdAt: string;
  updatedAt: string;
}

export type WithTimestamps<T> = T & TimestampedDoc;
