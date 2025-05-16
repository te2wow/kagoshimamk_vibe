import { openDB } from 'idb';

export type TodoStatus = 'todo' | 'inProgress' | 'done';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  labels: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

const DB_NAME = 'todo-app';
const DB_VERSION = 1;

// サーバーサイドレンダリング時にはダミーのプロミスを返す
const isServer = typeof window === 'undefined';
const hasIndexedDB = !isServer && 'indexedDB' in window;

export const initDB = async () => {
  // サーバーサイドまたはindexedDBが使用できない環境ではダミーのDBオブジェクトを返す
  if (isServer || !hasIndexedDB) {
    console.info('IndexedDB not available, using dummy DB');
    return null;
  }

  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Todoストアの作成
        if (!db.objectStoreNames.contains('todos')) {
          const todoStore = db.createObjectStore('todos', { keyPath: 'id' });
          todoStore.createIndex('status', 'status', { unique: false });
          todoStore.createIndex('labels', 'labels', { unique: false, multiEntry: true });
          todoStore.createIndex('order', 'order', { unique: false });
        }

        // ラベルストアの作成
        if (!db.objectStoreNames.contains('labels')) {
          db.createObjectStore('labels', { keyPath: 'id' });
        }
      },
    });

    return db;
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    return null;
  }
};

// クライアントサイドでのみ初期化
export const dbPromise = !isServer && hasIndexedDB ? initDB() : Promise.resolve(null); 