import type { Metadata } from 'next';
import { Providers } from '@/lib/auth/providers/Providers';
import { Toaster } from '@/app/components/ui/toaster';
import { Work_Sans, Inter } from 'next/font/google';
import './globals.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${workSans.variable} ${inter.variable}`}>
      <body className="antialiased bg-brand-fill/50 text-brand-textweak">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
