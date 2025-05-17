'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DraggableItemProps {
  id: string;
  children: ReactNode;
}

export function DraggableItem({ id, children }: DraggableItemProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Sortableの設定
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      type: 'todo',
      item: { id }
    }
  });

  // ハイドレーション後にマウントフラグを設定
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // スタイル設定
  const style = isMounted ? {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  } : {};

  // クライアントサイドでのみ完全なDraggable要素を返す
  if (!isMounted) {
    return (
      <div className="mb-6 mt-2">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-6 mt-2 touch-manipulation cursor-grab active:cursor-grabbing relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      data-draggable="true"
      data-todo-id={id}
    >
      {/* ドロップエリアを広げるための要素（上部） */}
      <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent" />
      
      {children}
      
      {/* ドロップエリアを広げるための要素（下部） */}
      <div className="absolute -bottom-3 left-0 right-0 h-3 bg-transparent" />
    </motion.div>
  );
} 