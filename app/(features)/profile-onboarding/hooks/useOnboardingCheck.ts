"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function useOnboardingCheck() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          console.log("No authenticated user, redirecting to login");
          router.push("/login");
          return;
        }

        // Check user's onboarding status in Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        // Only redirect if we explicitly know onboarding is not complete
        if (userDoc.exists() && userData?.isOnboardingComplete === false) {
          console.log(
            "Onboarding explicitly marked as incomplete, redirecting to onboarding"
          );
          router.push("/profile-onboarding");
        } else if (!userDoc.exists()) {
          console.log("New user detected, redirecting to onboarding");
          router.push("/profile-onboarding");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Don't redirect on error, let the user stay on the current page
      } finally {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return isChecking;
}
