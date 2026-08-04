// components/ui/draggable.tsx
import { useDraggable } from '@dnd-kit/react';

interface DraggableProps {
  id: string;
  itemName: string;
}

export function Draggable({ id, itemName }: DraggableProps) {
  const { ref } = useDraggable({ id });

  return (
    <button
      ref={ref}
      className="
        group relative w-full text-left px-4 py-3 rounded-[3px]
        bg-[#f7f2e7] text-[#23262b] text-sm font-medium
        border border-[#e4dcc8]
        shadow-[0_1px_2px_rgba(0,0,0,0.12)]
        transition-all duration-150 ease-out
        hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.22)]
        active:scale-[0.98] active:cursor-grabbing cursor-grab
      "
    >
      {/* pin dot — the one signature detail, kept consistent everywhere */}
      <span className="absolute left-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#d1495b]" />
      {/* folded corner, subtle */}
      <span
        className="absolute top-0 right-0 h-3 w-3 bg-[#e4dcc8]"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />
      <span className="block pl-3">{itemName}</span>
    </button>
  );
}