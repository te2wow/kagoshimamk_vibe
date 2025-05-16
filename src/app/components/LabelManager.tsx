'use client';

import { useState } from 'react';
import { Label } from '../db';
import { useTodo } from '../contexts/TodoContext';
import { FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export function LabelManager() {
  const { labels, createLabel, updateLabelItem, removeLabel } = useTodo();
  const [isOpen, setIsOpen] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#3B82F6'); // デフォルトはブルー
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  // 新しいラベル追加
  const handleAddLabel = async () => {
    if (newLabelName.trim() === '') return;
    
    await createLabel(newLabelName.trim(), newLabelColor);
    setNewLabelName('');
  };

  // ラベル編集開始
  const startEditing = (label: Label) => {
    setEditingLabelId(label.id);
    setEditName(label.name);
    setEditColor(label.color);
  };

  // ラベル編集保存
  const saveEdit = async (labelId: string) => {
    if (editName.trim() === '') return;
    
    const label = labels.find(l => l.id === labelId);
    if (!label) return;
    
    await updateLabelItem({
      ...label,
      name: editName.trim(),
      color: editColor,
    });
    
    setEditingLabelId(null);
  };

  // ラベル削除
  const handleDeleteLabel = async (labelId: string) => {
    await removeLabel(labelId);
  };

  // プリセットカラー
  const presetColors = [
    '#EF4444', // 赤
    '#F59E0B', // オレンジ
    '#10B981', // 緑
    '#3B82F6', // 青
    '#6366F1', // インディゴ
    '#8B5CF6', // 紫
    '#EC4899', // ピンク
    '#6B7280', // グレー
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center text-sm"
      >
        <FiEdit2 className="mr-1" />
        ラベル管理
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-72 max-h-96 overflow-y-auto"
          >
            <div className="flex justify-between mb-3">
              <h3 className="font-medium dark:text-white">ラベル管理</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX />
              </button>
            </div>
            
            {/* 新規ラベル追加フォーム */}
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <h4 className="text-sm font-medium mb-2 dark:text-gray-200">新規ラベル</h4>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="ラベル名"
                  className="flex-1 p-1.5 text-sm border rounded-md mr-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="color"
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                  className="w-10 h-8 p-0 border-0 rounded cursor-pointer"
                />
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {presetColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewLabelColor(color)}
                    className="w-6 h-6 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: color }}
                    aria-label={`色: ${color}`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleAddLabel}
                disabled={newLabelName.trim() === ''}
                className="w-full py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus className="mr-1" /> 追加
              </button>
            </div>
            
            {/* ラベル一覧 */}
            <div>
              <h4 className="text-sm font-medium mb-2 dark:text-gray-200">ラベル一覧</h4>
              <ul className="space-y-2">
                <AnimatePresence>
                  {labels.length === 0 ? (
                    <li className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                      ラベルはありません
                    </li>
                  ) : (
                    labels.map(label => (
                      <motion.li
                        key={label.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                      >
                        {editingLabelId === label.id ? (
                          <div className="flex-1">
                            <div className="flex mb-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 p-1.5 text-sm border rounded-md mr-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                              />
                              <input
                                type="color"
                                value={editColor}
                                onChange={(e) => setEditColor(e.target.value)}
                                className="w-10 h-8 p-0 border-0 rounded cursor-pointer"
                              />
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {presetColors.map(color => (
                                <button
                                  key={color}
                                  onClick={() => setEditColor(color)}
                                  className="w-5 h-5 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600"
                                  style={{ backgroundColor: color }}
                                  aria-label={`色: ${color}`}
                                />
                              ))}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingLabelId(null)}
                                className="flex-1 py-1 px-2 text-xs bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md"
                              >
                                キャンセル
                              </button>
                              <button
                                onClick={() => saveEdit(label.id)}
                                className="flex-1 py-1 px-2 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md"
                              >
                                保存
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: label.color }}
                            ></span>
                            <span className="flex-1 truncate dark:text-white">{label.name}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEditing(label)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                              >
                                <FiEdit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteLabel(label.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </>
                        )}
                      </motion.li>
                    ))
                  )}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 