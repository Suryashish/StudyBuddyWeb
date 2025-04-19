import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Kodchasan } from 'next/font/google';
import { Providers } from './providers';

// const inter = Inter({ subsets: ['latin'] });
const inter = Kodchasan({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'StudyBuddy - Find the right study plan for you',
  description: 'Intelligent study planner to help you reach your goals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}