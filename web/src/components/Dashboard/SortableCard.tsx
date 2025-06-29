import React, { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator } from 'react-icons/md';

interface SortableCardProps {
  id: string;
  children: ReactNode;
}

const SortableCard = ({ id, children }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-card ${isDragging ? 'is-dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <MdDragIndicator size={24} />
      </div>
      {children}
    </div>
  );
};

export default SortableCard;
