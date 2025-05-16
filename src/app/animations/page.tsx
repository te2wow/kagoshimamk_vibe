'use client';

import { AnimationDemo } from '../components/AnimationDemo';
import { ThemeProvider } from '../contexts/ThemeContext';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

export default function AnimationsPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              <FiHome />
              <span>ホームに戻る</span>
            </Link>
          </div>
          
          <AnimationDemo />
        </div>
      </div>
    </ThemeProvider>
  );
} 