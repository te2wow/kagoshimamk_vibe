import { v4 as uuidv4 } from 'uuid';
import { dbPromise, Label } from './index';

// すべてのラベルを取得
export const getAllLabels = async (): Promise<Label[]> => {
  const db = await dbPromise;
  return db.getAll('labels');
};

// ラベルの追加
export const addLabel = async (name: string, color: string): Promise<Label> => {
  const db = await dbPromise;
  
  const newLabel: Label = {
    id: uuidv4(),
    name,
    color,
  };
  
  await db.put('labels', newLabel);
  return newLabel;
};

// ラベルの更新
export const updateLabel = async (label: Label): Promise<Label> => {
  const db = await dbPromise;
  await db.put('labels', label);
  return label;
};

// ラベルの削除
export const deleteLabel = async (id: string): Promise<void> => {
  const db = await dbPromise;
  
  // ラベルを削除
  await db.delete('labels', id);
  
  // このラベルを持つすべてのTodoからラベルを削除
  const allTodos = await db.getAll('todos');
  const todosWithLabel = allTodos.filter(todo => todo.labels.includes(id));
  
  const tx = db.transaction('todos', 'readwrite');
  for (const todo of todosWithLabel) {
    const updatedLabels = todo.labels.filter((labelId: string) => labelId !== id);
    await tx.store.put({
      ...todo,
      labels: updatedLabels,
      updatedAt: new Date(),
    });
  }
  
  await tx.done;
}; 