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
  isAllTasksCompleted: boolean;
  showPachinkoEffect: boolean;
  
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
  
  // パチンコ演出
  hidePachinkoEffect: () => void;
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
  const [isAllTasksCompleted, setIsAllTasksCompleted] = useState<boolean>(false);
  const [showPachinkoEffect, setShowPachinkoEffect] = useState<boolean>(false);

  // 初期データの読み込み
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [todoData, labelData] = await Promise.all([
          getAllTodos(),
          getAllLabels()
        ]);
        setTodos(todoData);
        setLabels(labelData);
      } catch (err) {
        setError(`データの読み込みに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInitialData();
  }, []);

  // 全てのタスクが完了状態かチェック
  useEffect(() => {
    // タスクが存在しない場合はパチンコ演出を表示しない
    if (todos.length === 0) {
      setIsAllTasksCompleted(false);
      return;
    }
    
    // フィルタリングされていない場合のみチェック
    if (statusFilter === 'all' && labelFilter === 'all') {
      const allCompleted = todos.length > 0 && todos.every(todo => todo.status === 'done');
      
      // 状態が変わった時だけパチンコ演出を表示
      if (allCompleted && !isAllTasksCompleted) {
        setShowPachinkoEffect(true);
      }
      
      setIsAllTasksCompleted(allCompleted);
    }
  }, [todos, statusFilter, labelFilter, isAllTasksCompleted]);

  // パチンコ演出を非表示
  const hidePachinkoEffect = () => {
    setShowPachinkoEffect(false);
  };

  // Todo追加
  const createTodo = async (title: string, description: string, status: TodoStatus, labels: string[]) => {
    try {
      const newTodo = await addTodo(title, description, status, labels);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setError(`Todoの追加に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Todo更新
  const updateTodoItem = async (todo: Todo) => {
    try {
      await updateTodo(todo);
      setTodos(prev => prev.map(t => t.id === todo.id ? todo : t));
    } catch (err) {
      setError(`Todoの更新に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Todo削除
  const removeTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(`Todoの削除に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // ステータス変更
  const changeStatus = async (id: string, newStatus: TodoStatus) => {
    try {
      const updatedTodo = await changeTodoStatus(id, newStatus);
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError(`ステータスの変更に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // 順序更新
  const updateTodoOrder = async (updatedTodos: Todo[]) => {
    try {
      await reorderTodos(updatedTodos);
      setTodos(updatedTodos);
    } catch (err) {
      setError(`順序の更新に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // ラベル追加
  const createLabel = async (name: string, color: string) => {
    try {
      const newLabel = await addLabel(name, color);
      setLabels(prev => [...prev, newLabel]);
    } catch (err) {
      setError(`ラベルの追加に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // ラベル更新
  const updateLabelItem = async (label: Label) => {
    try {
      await updateLabel(label);
      setLabels(prev => prev.map(l => l.id === label.id ? label : l));
    } catch (err) {
      setError(`ラベルの更新に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // ラベル削除
  const removeLabel = async (id: string) => {
    try {
      await deleteLabel(id);
      setLabels(prev => prev.filter(label => label.id !== id));
    } catch (err) {
      setError(`ラベルの削除に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const value = {
    todos,
    labels,
    isLoading,
    error,
    statusFilter,
    labelFilter,
    isAllTasksCompleted,
    showPachinkoEffect,
    createTodo,
    updateTodoItem,
    removeTodo,
    changeStatus,
    updateTodoOrder,
    createLabel,
    updateLabelItem,
    removeLabel,
    setStatusFilter,
    setLabelFilter,
    hidePachinkoEffect
  };

  return (
    <TodoContext.Provider value={value}>
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