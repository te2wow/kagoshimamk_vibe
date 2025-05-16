'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiPlus, FiArrowDown, FiArrowUp } from 'react-icons/fi';

export function AnimationDemo() {
  const [showInfo, setShowInfo] = useState<number | null>(null);

  const animations = [
    {
      id: 1,
      title: '新規タスクの追加アニメーション',
      description: 'タスク追加時に上から下へスライドインし、フェードインするアニメーションが適用されます。',
      demo: (
        <motion.div 
          className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg shadow-md mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiPlus className="text-blue-500" />
              <span>新しいタスク</span>
            </div>
            <div className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-0.5 rounded-full">
              新規追加
            </div>
          </div>
        </motion.div>
      )
    },
    {
      id: 2,
      title: 'フィルターの展開アニメーション',
      description: 'フィルターの展開・折りたたみ時に高さが変化するアニメーションです。スムーズに開閉します。',
      demo: (
        <div>
          <button 
            onClick={() => setShowInfo(showInfo === 2 ? null : 2)}
            className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg flex items-center justify-between w-full mb-2"
          >
            <span>フィルター</span>
            {showInfo === 2 ? <FiArrowUp /> : <FiArrowDown />}
          </button>
          <AnimatePresence>
            {showInfo === 2 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg overflow-hidden"
              >
                <div className="flex gap-2 mb-2">
                  <div className="px-2 py-1 bg-indigo-200 dark:bg-indigo-800 rounded-md text-xs">すべて</div>
                  <div className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 rounded-md text-xs">未着手</div>
                  <div className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded-md text-xs">進行中</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    },
    {
      id: 3,
      title: 'タスクのドラッグ＆ドロップアニメーション',
      description: 'ドラッグ中にタスクの透明度が変化し、ドロップ位置に移動するとスムーズに配置されます。',
      demo: (
        <div className="relative mb-4">
          <motion.div 
            className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg shadow-md mb-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
          >
            <span>ドラッグ可能なタスク 1</span>
          </motion.div>
          <motion.div 
            className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
          >
            <span>ドラッグ可能なタスク 2</span>
          </motion.div>
          <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400">
            ↑ タスクをドラッグしてみてください ↑
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'タスク詳細の展開アニメーション',
      description: 'タスクをクリックすると詳細が展開され、再度クリックすると折りたたまれます。',
      demo: (
        <div>
          <motion.div 
            className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => setShowInfo(showInfo === 4 ? null : 4)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="font-medium">タスクのタイトル</div>
            <AnimatePresence>
              {showInfo === 4 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <p>これはタスクの詳細説明です。クリックすると表示・非表示を切り替えられます。</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            ↑ クリックして詳細を表示 ↑
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'ステータス変更アニメーション',
      description: 'タスクのステータスを変更すると、タスクカードがフェードアウトし移動先のカラムでフェードインします。',
      demo: (
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">ステータス変更：</span>
            <div className="flex gap-1">
              <button className="px-2 py-0.5 text-xs bg-yellow-200 dark:bg-yellow-800 rounded" onClick={() => setShowInfo(5)}>未着手</button>
              <button className="px-2 py-0.5 text-xs bg-blue-200 dark:bg-blue-800 rounded" onClick={() => setShowInfo(null)}>進行中</button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {showInfo === 5 ? (
              <motion.div 
                key="todo"
                className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg shadow-md"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="font-medium">タスク：レポート作成</div>
                <div className="text-xs mt-1 bg-yellow-200 dark:bg-yellow-800 inline-block px-2 py-0.5 rounded-full">未着手</div>
              </motion.div>
            ) : (
              <motion.div 
                key="inProgress"
                className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg shadow-md"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="font-medium">タスク：レポート作成</div>
                <div className="text-xs mt-1 bg-blue-200 dark:bg-blue-800 inline-block px-2 py-0.5 rounded-full">進行中</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    },
    {
      id: 6,
      title: 'ラベル選択アニメーション',
      description: 'ラベルを選択するときに拡大・縮小のアニメーションが適用され、選択状態がわかりやすくなります。',
      demo: (
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {['重要', '仕事', '個人', '緊急', '後で'].map((label, index) => (
              <motion.button
                key={index}
                className={`px-2 py-0.5 rounded-full text-xs ${showInfo === 6 && index === 0 ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInfo(6)}
              >
                {label}
              </motion.button>
            ))}
          </div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            ↑ ラベルをクリックしてみてください ↑
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">ToDo アプリのアニメーション機能</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {animations.map((animation) => (
          <motion.div 
            key={animation.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: animation.id * 0.1 }}
          >
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{animation.id}. {animation.title}</h3>
                <button 
                  onClick={() => setShowInfo(showInfo === animation.id ? null : animation.id)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiInfo size={16} className="text-blue-500" />
                </button>
              </div>
              
              <AnimatePresence>
                {showInfo === animation.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden"
                  >
                    {animation.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900/30">
              {animation.demo}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>これらのアニメーションはすべて<strong>Framer Motion</strong>ライブラリを使用して実装されています。</p>
        <p>アニメーションによって、ユーザー体験が向上し、アプリの使いやすさが向上します。</p>
      </div>
    </div>
  );
} 