import type { Metadata } from "next";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { Toaster } from "@/app/components/ui/toaster";
import { Work_Sans, Inter } from "next/font/google";
import { Providers } from "@/app/providers/QueryClientProvider";
import { Toaster as SonnerToaster } from "sonner";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  preload: false,
  weight: ["600", "700"],
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
  weight: ["400", "500"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Salome Books",
  description:
    "Your reading companion for mindful insights and book highlights",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${workSans.variable} ${inter.variable}`}>
      <body className="antialiased bg-mono-surface text-mono">
        <Providers>
          <AuthProvider>
            {children}
            <Toaster />
            <SonnerToaster position="top-right" />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
