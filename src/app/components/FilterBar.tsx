'use client';

import { useEffect, useState } from 'react';
import { useTodo } from '../contexts/TodoContext';
import { useTheme } from '../contexts/ThemeContext';
import { TodoStatus } from '../db';
import { FiSun, FiMoon, FiFilter, FiX, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { LabelManager } from './LabelManager';
import Link from 'next/link';

export function FilterBar() {
  const { theme, toggleTheme } = useTheme();
  const { labels, statusFilter, labelFilter, setStatusFilter, setLabelFilter } = useTodo();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);  // デフォルトはモバイル表示
  const [mounted, setMounted] = useState(false);

  // ブラウザ環境かどうかを検出し、画面サイズを設定
  useEffect(() => {
    setMounted(true);
    
    // マウント後、実際の画面サイズをチェック
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ステータスフィルター切り替え
  const handleStatusFilterChange = (status: TodoStatus | 'all') => {
    setStatusFilter(status);
    // モバイルでは選択後にフィルターを閉じる
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  // ラベルフィルター切り替え
  const handleLabelFilterChange = (labelId: string | 'all') => {
    setLabelFilter(labelId);
    // モバイルでは選択後にフィルターを閉じる
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  // ESCキーでフィルターを閉じる
  useEffect(() => {
    if (!mounted) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [mounted]);

  return (
    <div className="mb-6 sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm pb-2">
      <div className="flex justify-between items-center pb-2 mb-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ToDoリスト</h1>
        
        <div className="flex items-center gap-2">
          {/* アニメーション説明ページへのリンク */}
          <Link 
            href="/animations" 
            className="px-3 py-1.5 bg-purple-200 hover:bg-purple-300 dark:bg-purple-900/50 dark:hover:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-md flex items-center text-sm"
          >
            <FiZap className="mr-1" />
            <span className="hidden sm:inline">アニメーション</span>
            <span className="sm:hidden">機能</span>
          </Link>
          
          {/* フィルターボタン（モバイル用） */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center text-sm"
          >
            {isFilterOpen ? <FiX className="mr-1" /> : <FiFilter className="mr-1" />}
            {isFilterOpen ? '閉じる' : 'フィルター'}
          </button>
          
          {/* ラベル管理 */}
          <LabelManager />
          
          {/* テーマ切り替え */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label={`${theme === 'light' ? 'ダークモード' : 'ライトモード'}に切り替え`}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
        </div>
      </div>
      
      {/* フィルターUI */}
      <AnimatePresence>
        {mounted && (isFilterOpen || !isMobile) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden md:overflow-visible"
          >
            <div className="md:flex justify-between items-center mb-2">
              {/* ステータスフィルター */}
              <div className="mb-3 md:mb-0">
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">ステータス</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusFilterChange('all')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    すべて
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange('todo')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      statusFilter === 'todo'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50 dark:text-yellow-200'
                    }`}
                  >
                    未着手
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange('inProgress')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      statusFilter === 'inProgress'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-200'
                    }`}
                  >
                    進行中
                  </button>
                  <button
                    onClick={() => handleStatusFilterChange('done')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      statusFilter === 'done'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50 dark:text-green-200'
                    }`}
                  >
                    完了
                  </button>
                </div>
              </div>
              
              {/* ラベルフィルター */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">ラベル</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleLabelFilterChange('all')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      labelFilter === 'all'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    すべて
                  </button>
                  {labels.map(label => (
                    <button
                      key={label.id}
                      onClick={() => handleLabelFilterChange(label.id)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        labelFilter === label.id
                          ? 'text-white'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                      }`}
                      style={{
                        backgroundColor: labelFilter === label.id ? label.color : undefined
                      }}
                    >
                      {label.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 