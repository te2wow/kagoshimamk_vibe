'use client';

import { useState, useEffect } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Todo, TodoStatus } from '../db';
import { useTodo } from '../contexts/TodoContext';
import { DraggableItem } from './DraggableItem';
import { TodoCard } from './TodoCard';
import { motion, AnimatePresence } from 'framer-motion';

interface TodoListProps {
  status: TodoStatus;
  title: string;
}

export function TodoList({ status, title }: TodoListProps) {
  const { todos, labels, statusFilter, labelFilter } = useTodo();
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isClient, setIsClient] = useState(false);

  // ドロップエリアとしての設定
  const { setNodeRef, isOver } = useDroppable({
    id: `dropArea-${status}`,
  });

  // クライアントサイドでのレンダリングを検出
  useEffect(() => {
    setIsClient(true);
  }, []);

  // フィルター適用したTodo一覧を作成
  useEffect(() => {
    if (!isClient) return;
    
    let filtered = todos.filter(todo => todo.status === status);
    
    // ステータスフィルター適用
    if (statusFilter !== 'all' && statusFilter !== status) {
      setFilteredTodos([]);
      return;
    }
    
    // ラベルフィルター適用
    if (labelFilter !== 'all') {
      filtered = filtered.filter(todo => todo.labels.includes(labelFilter));
    }
    
    // 順番でソート
    filtered.sort((a, b) => a.order - b.order);
    
    setFilteredTodos(filtered);
  }, [todos, status, statusFilter, labelFilter, isClient]);

  // 背景色の設定
  const bgColors: Record<TodoStatus, string> = {
    'todo': 'bg-yellow-50 dark:bg-yellow-900/20',
    'inProgress': 'bg-blue-50 dark:bg-blue-900/20',
    'done': 'bg-green-50 dark:bg-green-900/20'
  };

  // 活性化中（ドロップ領域がハイライト）の背景色
  const activeBgColors: Record<TodoStatus, string> = {
    'todo': 'bg-yellow-100 dark:bg-yellow-900/40',
    'inProgress': 'bg-blue-100 dark:bg-blue-900/40',
    'done': 'bg-green-100 dark:bg-green-900/40'
  };

  // ヘッダー色の設定
  const headerColors: Record<TodoStatus, string> = {
    'todo': 'bg-yellow-200 dark:bg-yellow-800',
    'inProgress': 'bg-blue-200 dark:bg-blue-800',
    'done': 'bg-green-200 dark:bg-green-800'
  };

  // 件数を表示するバッジの色
  const badgeColors: Record<TodoStatus, string> = {
    'todo': 'bg-yellow-500 text-white',
    'inProgress': 'bg-blue-500 text-white',
    'done': 'bg-green-500 text-white'
  };

  return (
    <div 
      ref={setNodeRef}
      className={`rounded-lg shadow-md overflow-hidden transition-colors duration-200 ${isOver ? activeBgColors[status] : bgColors[status]}`}
    >
      {/* ヘッダー */}
      <div className={`p-3 ${headerColors[status]} flex justify-between items-center`}>
        <h2 className="font-bold text-gray-800 dark:text-white">{title}</h2>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColors[status]}`}>
          {filteredTodos.length}
        </span>
      </div>
      
      {/* Todoリスト */}
      <div className="p-3 min-h-[200px]">
        {isClient ? (
          <SortableContext
            items={filteredTodos.map(todo => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {filteredTodos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm"
                >
                  タスクがありません
                </motion.div>
              ) : (
                filteredTodos.map(todo => (
                  <DraggableItem key={todo.id} id={todo.id}>
                    <TodoCard todo={todo} labels={labels} />
                  </DraggableItem>
                ))
              )}
            </AnimatePresence>
          </SortableContext>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm animate-pulse">
            読み込み中...
          </div>
        )}
      </div>
    </div>
  );
} 