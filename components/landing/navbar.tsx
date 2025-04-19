'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navLinks = [
  { name: 'Plans', href: '#' },
  { name: 'Learn', href: '#' },
  { name: 'Lab', href: '#' },
  { name: 'Create', href: '#' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">StudyBuddy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost">Sign in</Button>
            <Button>Login</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="w-full">
                Sign in
              </Button>
              <Button className="w-full">Login</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}