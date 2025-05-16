'use client';

import { useState } from 'react';
import { Todo, Label, TodoStatus } from '../db';
import { useTodo } from '../contexts/TodoContext';
import { motion } from 'framer-motion';
import { FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

interface TodoCardProps {
  todo: Todo;
  labels: Label[];
}

export function TodoCard({ todo, labels }: TodoCardProps) {
  const { updateTodoItem, removeTodo, changeStatus } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editLabels, setEditLabels] = useState<string[]>(todo.labels);
  const [showDetails, setShowDetails] = useState(false);

  // Todoのラベル情報を取得
  const todoLabels = labels.filter(label => todo.labels.includes(label.id));

  // ステータスによって背景色を変更
  const statusColors: Record<TodoStatus, string> = {
    'todo': 'bg-yellow-50 dark:bg-yellow-900/30',
    'inProgress': 'bg-blue-50 dark:bg-blue-900/30',
    'done': 'bg-green-50 dark:bg-green-900/30'
  };

  // ステータス変更処理
  const handleStatusChange = async (newStatus: TodoStatus) => {
    await changeStatus(todo.id, newStatus);
  };

  // 編集保存処理
  const handleSaveEdit = async () => {
    const updatedTodo = {
      ...todo,
      title: editTitle,
      description: editDescription,
      labels: editLabels,
    };
    await updateTodoItem(updatedTodo);
    setIsEditing(false);
  };

  // 削除処理
  const handleDelete = async () => {
    await removeTodo(todo.id);
  };

  // ラベル選択の切り替え
  const toggleLabel = (labelId: string) => {
    setEditLabels(prev => 
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  // 編集モード
  if (isEditing) {
    return (
      <motion.div
        className={`p-4 rounded-lg shadow-md ${statusColors[todo.status]} transition-all duration-300`}
        animate={{ scale: 1.02 }}
      >
        <div className="mb-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="タイトル"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 mb-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="説明"
            rows={3}
          />
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">ラベル:</p>
          <div className="flex flex-wrap gap-1">
            {labels.map(label => (
              <button
                key={label.id}
                onClick={() => toggleLabel(label.id)}
                className={`text-xs px-2 py-1 rounded-full mr-1 mb-1 transition-colors ${
                  editLabels.includes(label.id)
                    ? `bg-${label.color}-500 text-white`
                    : `bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300`
                }`}
                style={{
                  backgroundColor: editLabels.includes(label.id) ? label.color : undefined
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="mr-1" /> キャンセル
          </button>
          <button
            onClick={handleSaveEdit}
            className="flex items-center text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            <FiCheck className="mr-1" /> 保存
          </button>
        </div>
      </motion.div>
    );
  }

  // 表示モード
  return (
    <motion.div
      className={`p-4 rounded-lg shadow-md ${statusColors[todo.status]} cursor-pointer transition-all duration-300`}
      onClick={() => setShowDetails(!showDetails)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold dark:text-white">{todo.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      
      {todoLabels.length > 0 && (
        <div className="flex flex-wrap mt-2">
          {todoLabels.map(label => (
            <span
              key={label.id}
              className="text-xs px-2 py-0.5 rounded-full mr-1 mb-1 text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      
      {showDetails && todo.description && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2"
        >
          <p className="text-gray-600 dark:text-gray-300 text-sm">{todo.description}</p>
        </motion.div>
      )}
      
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(todo.updatedAt).toLocaleDateString()}
        </span>
        
        <div className="flex gap-1">
          {todo.status !== 'todo' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('todo');
              }}
              className="text-xs px-2 py-0.5 bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 rounded"
            >
              未着手
            </button>
          )}
          {todo.status !== 'inProgress' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('inProgress');
              }}
              className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 rounded"
            >
              進行中
            </button>
          )}
          {todo.status !== 'done' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('done');
              }}
              className="text-xs px-2 py-0.5 bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 rounded"
            >
              完了
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 