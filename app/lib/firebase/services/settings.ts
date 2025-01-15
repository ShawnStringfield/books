import { db } from "@/app/lib/firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface ReadingGoals {
  monthlyTarget: number;
  yearlyTarget: number;
}

export interface UserSettings {
  readingGoals: ReadingGoals;
  selectedGenres: string[];
  updatedAt: Date;
}

const SETTINGS_COLLECTION = "settings";

export async function getUserSettings(
  userId: string,
): Promise<UserSettings | null> {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      return null;
    }

    return settingsSnap.data() as UserSettings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw error;
  }
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>,
): Promise<void> {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
    const settingsWithTimestamp = {
      ...settings,
      updatedAt: new Date(),
    };

    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, settingsWithTimestamp);
    } else {
      await updateDoc(settingsRef, settingsWithTimestamp);
    }
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
}

export async function updateReadingGoals(
  userId: string,
  goals: ReadingGoals,
): Promise<void> {
  try {
    await updateUserSettings(userId, {
      readingGoals: goals,
    });
  } catch (error) {
    console.error("Error updating reading goals:", error);
    throw error;
  }
}
