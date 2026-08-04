// components/ui/droppable.tsx
import { useDroppable } from '@dnd-kit/react';
import type { ReactNode } from 'react';

interface DroppableProps {
  id: string;
  children?: ReactNode;
  className?: string;
}

export function Droppable({ id, children, className = '' }: DroppableProps) {
  const { ref } = useDroppable({ id });

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-2 min-h-[240px] rounded-md p-3 transition-colors duration-150 ${className}`}
    >
      {children}
    </div>
  );
}