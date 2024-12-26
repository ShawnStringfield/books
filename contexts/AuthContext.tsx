"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase/firebase";
import { setCookie, deleteCookie } from "@/app/lib/auth/utils/cookie-utils";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setCookie("auth-token", token);

        // Log the user data we receive from Firebase
        console.log("Auth State Changed - User Data:", {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          providerData: user.providerData,
          providerId: user.providerId,
        });
      } else {
        deleteCookie("auth-token");
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      setCookie("auth-token", token);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      setCookie("auth-token", token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      deleteCookie("auth-token");
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // Request all necessary scopes
      provider.addScope("https://www.googleapis.com/auth/userinfo.email");
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

      // Force account selection and request refresh token
      provider.setCustomParameters({
        prompt: "select_account",
        access_type: "offline",
      });

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (result.user) {
        // Get the user's Google profile data
        const googleUser = result.user;
        const googleData = googleUser.providerData[0];

        console.log("Google Sign In - User Data:", {
          user: googleUser,
          providerData: googleData,
          credential,
        });

        // Ensure profile is updated with Google data
        if (googleData) {
          await updateProfile(googleUser, {
            displayName:
              googleData.displayName || googleData.email?.split("@")[0],
            photoURL: googleData.photoURL,
          });

          // Force a refresh of the user object
          await googleUser.reload();
        }

        // Get fresh token after profile update
        const token = await googleUser.getIdToken(true);
        setCookie("auth-token", token);
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    signInWithGoogle,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
