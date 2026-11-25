import { useState, type KeyboardEvent } from 'react'
import { useDraggable } from '@dnd-kit/react'
import { Pencil, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DraggableProps {
  id: string
  itemName: string
  onDelete: () => void
  onRename: (text: string) => void
}

const iconButton =
  'flex size-6 items-center justify-center rounded text-paper-foreground/50 hover:bg-black/5 hover:text-paper-foreground focus-visible:outline-2 focus-visible:outline-primary'

export function Draggable({ id, itemName, onDelete, onRename }: DraggableProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(itemName)
  const { ref, isDragging } = useDraggable({ id, disabled: editing })

  function startEditing() {
    setDraft(itemName)
    setEditing(true)
  }

  function commit() {
    const text = draft.trim()
    setEditing(false)
    if (text && text !== itemName) onRename(text)
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      commit()
    } else if (e.key === 'Escape') {
      setEditing(false)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'group relative rounded-md border border-paper-edge bg-paper px-3 py-2.5 pl-6 text-sm font-medium text-paper-foreground shadow-sm transition-[box-shadow,transform] duration-150',
        editing ? 'cursor-text' : 'cursor-grab hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing',
        isDragging && 'rotate-2 shadow-xl ring-2 ring-primary/60',
      )}
    >
      <span className="absolute left-2.5 top-3.5 size-1.5 rounded-full bg-destructive" aria-hidden="true" />

      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          maxLength={500}
          rows={Math.min(6, Math.max(2, Math.ceil(draft.length / 32)))}
          className="block w-full resize-none bg-transparent outline-none"
          aria-label="Card text"
        />
      ) : (
        <>
          <p className="whitespace-pre-wrap break-words pr-12" onDoubleClick={startEditing}>
            {itemName}
          </p>
          <div className="absolute right-1.5 top-1.5 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <button type="button" className={iconButton} onClick={startEditing} aria-label="Edit card">
              <Pencil className="size-3.5" />
            </button>
            <button type="button" className={iconButton} onClick={onDelete} aria-label="Delete card">
              <X className="size-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
