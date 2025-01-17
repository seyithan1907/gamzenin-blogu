'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900/50 py-4 mb-8">
      <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
          Ana Sayfa
        </Link>
      </div>
    </header>
  );
} 