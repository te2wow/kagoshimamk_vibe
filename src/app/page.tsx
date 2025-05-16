'use client';

import { FilterBar } from './components/FilterBar';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoProvider } from './contexts/TodoContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useTodo } from './contexts/TodoContext';
import { Todo, TodoStatus } from './db';
import { TodoCard } from './components/TodoCard';

function TodoApp() {
  const { todos, labels, changeStatus } = useTodo();
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのレンダリングを検出
  useEffect(() => {
    setIsClient(true);
  }, []);

  // センサー設定（マウス/タッチとキーボードでのドラッグを有効化）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px以上動かしたらドラッグ開始
      },
    }),
    useSensor(KeyboardSensor)
  );

  // ドラッグ開始時の処理
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedTodo = todos.find(todo => todo.id === active.id);
    
    if (draggedTodo) {
      setActiveTodo(draggedTodo);
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // ドロップ先のステータスを取得（"dropArea-todo"、"dropArea-inProgress"、"dropArea-done"）
    if (over.id.toString().startsWith('dropArea-')) {
      const newStatus = over.id.toString().replace('dropArea-', '') as TodoStatus;
      const todoId = active.id.toString();
      
      // 元のステータスと異なる場合のみ更新
      const todoToMove = todos.find(todo => todo.id === todoId);
      if (todoToMove && todoToMove.status !== newStatus) {
        changeStatus(todoId, newStatus);
      }
    }
    
    setActiveTodo(null);
  };

  if (!isClient) {
    return (
      <main className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
        <div className="text-center text-gray-500 dark:text-gray-400 animate-pulse mt-20">
          読み込み中...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      {/* フィルターバー */}
      <FilterBar />
      
      {/* 新規タスク作成フォーム */}
      <TodoForm />
      
      {/* ToDoリスト */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <TodoList status="todo" title="未着手" />
          <TodoList status="inProgress" title="進行中" />
          <TodoList status="done" title="完了" />
        </div>
        
        {/* ドラッグ中のオーバーレイ表示 */}
        <DragOverlay>
          {activeTodo && (
            <div className="w-full max-w-md opacity-80">
              <TodoCard todo={activeTodo} labels={labels} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </main>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <TodoApp />
      </TodoProvider>
    </ThemeProvider>
  );
}
