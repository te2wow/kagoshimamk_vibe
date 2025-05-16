'use client';

import { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';
import { TodoStatus } from '../db';
import { FiPlus, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function TodoForm() {
  const { createTodo, labels } = useTodo();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TodoStatus>('todo');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // フォームリセット
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setSelectedLabels([]);
  };

  // Todoの追加
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() === '') return;
    
    await createTodo(title.trim(), description.trim(), status, selectedLabels);
    resetForm();
    setIsOpen(false);
  };

  // ラベル選択の切り替え
  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg shadow-md flex items-center justify-center transition-colors duration-200"
        >
          <FiPlus className="mr-2" size={18} />
          新しいタスクを追加
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-lg dark:text-white">新しいタスク</h3>
            <button
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="タスクのタイトル"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                説明
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="タスクの詳細"
                rows={3}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ステータス
              </label>
              <div className="flex">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    value="todo"
                    checked={status === 'todo'}
                    onChange={() => setStatus('todo')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">未着手</span>
                </label>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    value="inProgress"
                    checked={status === 'inProgress'}
                    onChange={() => setStatus('inProgress')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">進行中</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="done"
                    checked={status === 'done'}
                    onChange={() => setStatus('done')}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">完了</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ラベル
              </label>
              <div className="flex flex-wrap gap-1">
                {labels.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ラベルがありません。先にラベルを作成してください。
                  </p>
                ) : (
                  labels.map(label => (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => toggleLabel(label.id)}
                      className={`text-xs px-2 py-1 rounded-full mr-1 mb-1 transition-colors ${
                        selectedLabels.includes(label.id)
                          ? 'text-white'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      style={{
                        backgroundColor: selectedLabels.includes(label.id) ? label.color : undefined
                      }}
                    >
                      {label.name}
                    </button>
                  ))
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-md"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={title.trim() === ''}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
} 