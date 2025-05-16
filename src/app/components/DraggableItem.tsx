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

  // ハイドレーション後にマウントフラグを設定
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // クライアントサイドでのみレンダリング
  if (!isMounted) {
    return <div className="mb-2">{children}</div>;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2 touch-manipulation cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      data-draggable="true"
    >
      {children}
    </motion.div>
  );
} 