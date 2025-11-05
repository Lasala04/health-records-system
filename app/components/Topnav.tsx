'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Topnav() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply theme to DOM
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg transition-colors">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-1"
          aria-label="HealthCare System Home"
        >
          <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xl" aria-hidden="true">H</span>
          </div>
          <h1 className="text-xl font-bold">HealthCare System</h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
          <Link 
            href="/" 
            className="hover:text-blue-200 transition font-medium focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
          >
            Dashboard
          </Link>
          <Link 
            href="/patients" 
            className="hover:text-blue-200 transition font-medium focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
          >
            Patients
          </Link>
          <Link 
            href="/about" 
            className="hover:text-blue-200 transition font-medium focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
          >
            About
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
        </nav>

        <button
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white rounded p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <nav 
          className="md:hidden bg-blue-700 dark:bg-gray-800 p-4 space-y-2" 
          role="navigation" 
          aria-label="Mobile navigation"
        >
          <Link 
            href="/" 
            className="block hover:text-blue-200 py-2 focus:outline-none focus:ring-2 focus:ring-white rounded px-2"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/patients" 
            className="block hover:text-blue-200 py-2 focus:outline-none focus:ring-2 focus:ring-white rounded px-2"
            onClick={() => setMenuOpen(false)}
          >
            Patients
          </Link>
          <Link 
            href="/about" 
            className="block hover:text-blue-200 py-2 focus:outline-none focus:ring-2 focus:ring-white rounded px-2"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="w-full text-left py-2 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white rounded px-2"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </nav>
      )}
    </header>
  );
}