'use client';

import { FilterBar } from './components/FilterBar';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoProvider } from './contexts/TodoContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PachinkoEffect } from './components/PachinkoEffect';
import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTodo } from './contexts/TodoContext';
import { Todo, TodoStatus } from './db';
import { TodoCard } from './components/TodoCard';

function TodoApp() {
  const { todos, labels, changeStatus, updateTodoOrder } = useTodo();
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
        // より短い距離でドラッグを開始できるように調整
        distance: 5,
        // 長押しでもドラッグ開始できるように
        delay: 250,
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
      // ドラッグ開始時にスクロールを防止
      document.body.style.overflow = 'hidden';
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    // スクロールを復元
    document.body.style.overflow = 'auto';
    
    const { active, over } = event;
    
    if (!over) {
      setActiveTodo(null);
      return;
    }
    
    // ドラッグしたアイテムのID
    const todoId = active.id as string;
    
    // ドロップ先のエリアIDを取得（形式: "dropArea-{status}"）
    const overId = over.id as string;
    
    // ドロップ先のステータスを抽出
    if (overId.startsWith('dropArea-')) {
      const newStatus = overId.replace('dropArea-', '') as TodoStatus;
      
      // 同じステータスでの並び替え
      if (activeTodo && activeTodo.status === newStatus) {
        // 同じステータス内での順序変更
        const updatedTodos = [...todos];
        const currentTodoIndex = todos.findIndex(todo => todo.id === todoId);
        
        if (currentTodoIndex !== -1) {
          // 同じステータス内での新しい順序を計算
          const statusTodos = todos.filter(t => t.status === newStatus);
          const currentOrderIndex = statusTodos.findIndex(t => t.id === todoId);
          
          // 変更後の位置を計算（簡易的な方法）
          // 実際のアプリでは、マウス位置やUI要素の位置から計算することが多い
          const nextOrderIndex = Math.min(statusTodos.length - 1, currentOrderIndex + 1);
          
          // 順序を更新
          const newOrderedTodos = arrayMove(statusTodos, currentOrderIndex, nextOrderIndex);
          
          // 順序を付け直す
          newOrderedTodos.forEach((todo, index) => {
            todo.order = index;
          });
          
          // 全体のTodoリストを更新
          updateTodoOrder(updatedTodos);
        }
      } else {
        // 異なるステータスへの移動
        if (activeTodo) {
          changeStatus(todoId, newStatus);
        }
      }
    }
    
    setActiveTodo(null);
  };

  // ドラッグがキャンセルされた時の処理
  const handleDragCancel = () => {
    // スクロールを復元
    document.body.style.overflow = 'auto';
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
      {/* パチンコエフェクト */}
      <PachinkoEffect />
      
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
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <TodoList status="todo" title="未着手" />
          <TodoList status="inProgress" title="進行中" />
          <TodoList status="done" title="完了" />
        </div>
        
        {/* ドラッグ中のオーバーレイ表示 */}
        <DragOverlay adjustScale={true} zIndex={100}>
          {activeTodo ? (
            <div className="w-full max-w-md opacity-85">
              <TodoCard todo={activeTodo} labels={labels} />
            </div>
          ) : null}
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
