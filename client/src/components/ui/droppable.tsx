import { useDroppable } from '@dnd-kit/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DroppableProps {
  id: string
  children?: ReactNode
  className?: string
}

export function Droppable({ id, children, className }: DroppableProps) {
  const { ref, isDropTarget } = useDroppable({ id })

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-h-32 flex-1 flex-col gap-2 rounded-lg p-2 transition-colors duration-150',
        isDropTarget && 'bg-primary/10 ring-2 ring-primary/40 ring-inset',
        className,
      )}
    >
      {children}
    </div>
  )
}
