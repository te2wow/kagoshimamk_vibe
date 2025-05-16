'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Todo, TodoStatus } from '../db';
import { getAllTodos, addTodo, updateTodo, deleteTodo, changeTodoStatus, reorderTodos } from '../db/todoUtils';
import { getAllLabels, addLabel, updateLabel, deleteLabel } from '../db/labelUtils';
import { Label } from '../db';

interface TodoContextType {
  todos: Todo[];
  labels: Label[];
  isLoading: boolean;
  error: string | null;
  statusFilter: TodoStatus | 'all';
  labelFilter: string | 'all';
  
  // Todo操作
  createTodo: (title: string, description: string, status: TodoStatus, labels: string[]) => Promise<void>;
  updateTodoItem: (todo: Todo) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  changeStatus: (id: string, newStatus: TodoStatus) => Promise<void>;
  updateTodoOrder: (updatedTodos: Todo[]) => Promise<void>;
  
  // ラベル操作
  createLabel: (name: string, color: string) => Promise<void>;
  updateLabelItem: (label: Label) => Promise<void>;
  removeLabel: (id: string) => Promise<void>;
  
  // フィルタリング
  setStatusFilter: (status: TodoStatus | 'all') => void;
  setLabelFilter: (labelId: string | 'all') => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TodoStatus | 'all'>('all');
  const [labelFilter, setLabelFilter] = useState<string | 'all'>('all');
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでの実行を確認
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初期データの読み込み
  useEffect(() => {
    // サーバーサイドレンダリング時やハイドレーション中は実行しない
    if (!isClient) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // TodoとLabelの取得
        const [todosData, labelsData] = await Promise.all([
          getAllTodos(),
          getAllLabels()
        ]);
        
        // ステータスごとにソート
        const sortedTodos = todosData.sort((a, b) => a.order - b.order);
        
        setTodos(sortedTodos);
        setLabels(labelsData);
        setError(null);
      } catch (err) {
        setError('データの読み込みに失敗しました');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isClient]);

  // Todo操作関数
  const createTodo = async (title: string, description: string, status: TodoStatus, labels: string[]) => {
    if (!isClient) return;
    try {
      const newTodo = await addTodo(title, description, status, labels);
      setTodos(prev => [...prev, newTodo].sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Todoの作成に失敗しました');
      console.error(err);
    }
  };

  const updateTodoItem = async (todo: Todo) => {
    if (!isClient) return;
    try {
      const updatedTodo = await updateTodo(todo);
      setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
    } catch (err) {
      setError('Todoの更新に失敗しました');
      console.error(err);
    }
  };

  const removeTodo = async (id: string) => {
    if (!isClient) return;
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Todoの削除に失敗しました');
      console.error(err);
    }
  };

  const changeStatus = async (id: string, newStatus: TodoStatus) => {
    if (!isClient) return;
    try {
      const updatedTodo = await changeTodoStatus(id, newStatus);
      setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
    } catch (err) {
      setError('ステータスの変更に失敗しました');
      console.error(err);
    }
  };

  const updateTodoOrder = async (updatedTodos: Todo[]) => {
    if (!isClient) return;
    try {
      await reorderTodos(updatedTodos);
      setTodos(updatedTodos);
    } catch (err) {
      setError('並び替えに失敗しました');
      console.error(err);
    }
  };

  // ラベル操作関数
  const createLabel = async (name: string, color: string) => {
    if (!isClient) return;
    try {
      const newLabel = await addLabel(name, color);
      setLabels(prev => [...prev, newLabel]);
    } catch (err) {
      setError('ラベルの作成に失敗しました');
      console.error(err);
    }
  };

  const updateLabelItem = async (label: Label) => {
    if (!isClient) return;
    try {
      const updatedLabel = await updateLabel(label);
      setLabels(prev => prev.map(l => l.id === updatedLabel.id ? updatedLabel : l));
    } catch (err) {
      setError('ラベルの更新に失敗しました');
      console.error(err);
    }
  };

  const removeLabel = async (id: string) => {
    if (!isClient) return;
    try {
      await deleteLabel(id);
      setLabels(prev => prev.filter(label => label.id !== id));
    } catch (err) {
      setError('ラベルの削除に失敗しました');
      console.error(err);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        labels,
        isLoading,
        error,
        statusFilter,
        labelFilter,
        createTodo,
        updateTodoItem,
        removeTodo,
        changeStatus,
        updateTodoOrder,
        createLabel,
        updateLabelItem,
        removeLabel,
        setStatusFilter,
        setLabelFilter
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
} 