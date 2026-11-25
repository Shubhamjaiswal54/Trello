import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useParams } from 'react-router-dom'
import { DragDropProvider } from '@dnd-kit/react'
import { toast } from 'sonner'
import { Plus, SquareKanban, X } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import { Draggable } from '@/components/ui/draggable'
import { Droppable } from '@/components/ui/droppable'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api, getErrorMessage } from '@/lib/api'
import { useResource } from '@/lib/useResource'
import type { CardItem, CardPosition, NamedRef } from '@/lib/types'

interface Response {
  organization: NamedRef
  department: NamedRef | null
  board: NamedRef
  cards: CardItem[]
}

// Droppable ids can't be empty strings, so the backlog ('' on the server) gets its own id.
const LANES: { id: string; pos: CardPosition; label: string; color: string }[] = [
  { id: 'backlog', pos: '', label: 'Backlog', color: 'var(--muted-foreground)' },
  { id: 'A', pos: 'A', label: 'To do', color: 'var(--lane-todo)' },
  { id: 'B', pos: 'B', label: 'In progress', color: 'var(--lane-progress)' },
  { id: 'C', pos: 'C', label: 'Done', color: 'var(--lane-done)' },
]
const laneById = new Map(LANES.map((lane) => [lane.id, lane]))

function AddCardForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  function submit(e?: FormEvent) {
    e?.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) submit(e)
    else if (e.key === 'Escape') setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Plus className="size-4" />
        Add a card
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="What needs doing?"
        rows={2}
        maxLength={500}
        className="block w-full resize-none rounded-md border border-input bg-background px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="flex items-center gap-1">
        <Button type="submit" size="sm" disabled={!text.trim()}>
          Add card
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="Cancel">
          <X />
        </Button>
      </div>
    </form>
  )
}

const CardsPage = () => {
  const { boardId } = useParams()
  const { data, loading, error, setData, reload } = useResource<Response>(
    `/cards/${boardId}/getallcards`,
    'Could not load this board.',
  )
  const cards = data?.cards ?? []
  const base = `/cards/${boardId}`

  const setCards = (update: (cards: CardItem[]) => CardItem[]) => setData((d) => ({ ...d, cards: update(d.cards) }))

  async function addCard(text: string, pos: CardPosition, uuid: string = crypto.randomUUID()) {
    const card: CardItem = { uuid, text, pos, boardId: boardId! }
    setCards((c) => [...c, card])
    try {
      await api.post(`${base}/create`, { uuid, text, pos })
    } catch (err) {
      setCards((c) => c.filter((x) => x.uuid !== uuid))
      toast.error(getErrorMessage(err, `Could not save “${text}”.`))
    }
  }

  async function updateCard(uuid: string, patch: Partial<Pick<CardItem, 'text' | 'pos'>>) {
    const previous = cards.find((c) => c.uuid === uuid)
    if (!previous) return
    setCards((c) => c.map((x) => (x.uuid === uuid ? { ...x, ...patch } : x)))
    try {
      await api.patch(`${base}/${uuid}`, patch)
    } catch (err) {
      // Only roll back the fields this request changed, so concurrent edits survive.
      const rollback = Object.fromEntries(Object.keys(patch).map((k) => [k, previous[k as keyof typeof patch]]))
      setCards((c) => c.map((x) => (x.uuid === uuid ? { ...x, ...rollback } : x)))
      toast.error(getErrorMessage(err, 'Could not update that card. Change reverted.'))
    }
  }

  async function deleteCard(card: CardItem) {
    setCards((c) => c.filter((x) => x.uuid !== card.uuid))
    try {
      await api.delete(`${base}/${card.uuid}`)
      toast('Card deleted', {
        description: card.text.length > 60 ? `${card.text.slice(0, 60)}…` : card.text,
        action: { label: 'Undo', onClick: () => addCard(card.text, card.pos, card.uuid) },
      })
    } catch (err) {
      setCards((c) => [...c, card])
      toast.error(getErrorMessage(err, 'Could not delete that card.'))
    }
  }

  const fallback = error ? '…' : undefined

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Organizations', to: '/organizations' },
          { label: data?.organization.name ?? fallback, to: data ? `/organizations/${data.organization._id}` : undefined },
          { label: data ? (data.department?.name ?? 'Department') : fallback, to: data?.department ? `/departments/${data.department._id}` : undefined },
          { label: data?.board.name ?? fallback },
        ]}
        title={data?.board.name ?? (error ? 'Board' : undefined)}
        description="Drag cards between lanes. Double-click a card to edit it."
      />

      {error ? (
        <EmptyState
          icon={SquareKanban}
          title="Couldn’t open this board"
          description={error}
          action={<Button variant="outline" onClick={reload}>Try again</Button>}
        />
      ) : (
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return
            const uuid = event.operation.source?.id
            const lane = laneById.get(String(event.operation.target?.id))
            if (!uuid || !lane) return
            const card = cards.find((c) => c.uuid === String(uuid))
            if (card && card.pos !== lane.pos) updateCard(card.uuid, { pos: lane.pos })
          }}
        >
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
            {LANES.map((lane) => {
              const laneCards = cards.filter((c) => (c.pos ?? '') === lane.pos)
              return (
                <section
                  key={lane.id}
                  className="flex w-72 shrink-0 snap-start flex-col self-start rounded-xl border bg-card/60 lg:w-auto lg:min-w-0 lg:flex-1"
                  aria-label={lane.label}
                >
                  <header
                    className="flex items-center justify-between border-b px-3 py-2.5"
                    style={{ boxShadow: `inset 0 2px 0 ${lane.color}` }}
                  >
                    <h2 className="flex items-center gap-2 text-sm font-medium">
                      <span className="size-2 rounded-full" style={{ backgroundColor: lane.color }} />
                      {lane.label}
                    </h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      {loading ? '–' : laneCards.length}
                    </span>
                  </header>

                  <Droppable id={lane.id}>
                    {loading ? (
                      <>
                        <Skeleton className="h-12" />
                        <Skeleton className="h-16" />
                      </>
                    ) : laneCards.length > 0 ? (
                      laneCards.map((card) => (
                        <Draggable
                          key={card.uuid}
                          id={card.uuid}
                          itemName={card.text}
                          onDelete={() => deleteCard(card)}
                          onRename={(text) => updateCard(card.uuid, { text })}
                        />
                      ))
                    ) : (
                      <div className="flex flex-1 items-center justify-center rounded-md border border-dashed py-6 text-xs text-muted-foreground">
                        Drop cards here
                      </div>
                    )}
                  </Droppable>

                  {!loading && (
                    <div className="px-2 pb-2">
                      <AddCardForm onAdd={(text) => addCard(text, lane.pos)} />
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </DragDropProvider>
      )}
    </>
  )
}

export default CardsPage
