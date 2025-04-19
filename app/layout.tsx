import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Kodchasan } from 'next/font/google';
// Assuming ThemeProvider is correctly defined in '@/components/theme-provider'
// and Providers component might wrap ThemeProvider or other providers.
// If Providers solely wraps ThemeProvider, you might replace Providers with ThemeProvider directly.
// If Providers wraps multiple contexts including ThemeProvider, keep using Providers.
// This example assumes Providers handles the theme setup internally.
import { Providers } from './providers'; // Keep using Providers if it wraps ThemeProvider

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
    // suppressHydrationWarning is important for next-themes
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/*
          The Providers component should internally wrap its children
          with the ThemeProvider from 'components/theme-provider.tsx'.
          Example structure for './providers.tsx':

          import { ThemeProvider } from "@/components/theme-provider";

          export function Providers({ children }: { children: React.ReactNode }) {
            return (
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                // Other providers can be nested here
              </ThemeProvider>
            );
          }

          Ensure your './providers.tsx' file correctly implements the ThemeProvider.
          The layout.tsx file itself is correctly set up to use the Providers component.
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}