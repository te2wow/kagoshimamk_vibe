import { v4 as uuidv4 } from 'uuid';
import { dbPromise, Todo, TodoStatus } from './index';

// Todoの取得
export const getAllTodos = async (): Promise<Todo[]> => {
  const db = await dbPromise;
  return db.getAll('todos');
};

// ステータスでフィルタリングしたTodoの取得
export const getTodosByStatus = async (status: TodoStatus): Promise<Todo[]> => {
  const db = await dbPromise;
  return db.getAllFromIndex('todos', 'status', status);
};

// ラベルでフィルタリングしたTodoの取得
export const getTodosByLabel = async (labelId: string): Promise<Todo[]> => {
  const db = await dbPromise;
  return db.getAllFromIndex('todos', 'labels', labelId);
};

// Todoの追加
export const addTodo = async (
  title: string,
  description: string = '',
  status: TodoStatus = 'todo',
  labels: string[] = []
): Promise<Todo> => {
  const db = await dbPromise;
  
  // 新しいTodoの順番を決定する（同じステータスの中で最後に配置）
  const existingTodos = await getTodosByStatus(status);
  const maxOrder = existingTodos.length > 0
    ? Math.max(...existingTodos.map(todo => todo.order))
    : -1;
  
  const newTodo: Todo = {
    id: uuidv4(),
    title,
    description,
    status,
    labels,
    order: maxOrder + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await db.put('todos', newTodo);
  return newTodo;
};

// Todoの更新
export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const db = await dbPromise;
  const updatedTodo = {
    ...todo,
    updatedAt: new Date(),
  };
  await db.put('todos', updatedTodo);
  return updatedTodo;
};

// Todoの削除
export const deleteTodo = async (id: string): Promise<void> => {
  const db = await dbPromise;
  await db.delete('todos', id);
};

// Todoのステータス変更
export const changeTodoStatus = async (id: string, newStatus: TodoStatus): Promise<Todo> => {
  const db = await dbPromise;
  const todo = await db.get('todos', id);
  
  if (!todo) {
    throw new Error(`Todo with id ${id} not found`);
  }
  
  // 新しいステータスでの順番を決定する（そのステータスの最後に配置）
  const todosInNewStatus = await getTodosByStatus(newStatus);
  const maxOrder = todosInNewStatus.length > 0
    ? Math.max(...todosInNewStatus.map(todo => todo.order))
    : -1;
  
  const updatedTodo: Todo = {
    ...todo,
    status: newStatus,
    order: maxOrder + 1,
    updatedAt: new Date(),
  };
  
  await db.put('todos', updatedTodo);
  return updatedTodo;
};

// Todoの順序更新
export const reorderTodos = async (todos: Todo[]): Promise<void> => {
  const db = await dbPromise;
  const tx = db.transaction('todos', 'readwrite');
  
  for (const todo of todos) {
    await tx.store.put(todo);
  }
  
  await tx.done;
}; 