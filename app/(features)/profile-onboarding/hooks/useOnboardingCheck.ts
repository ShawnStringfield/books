"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase/firebase";
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

        // Skip onboarding check and redirect
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return isChecking;
}
