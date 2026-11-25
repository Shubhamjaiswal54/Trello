import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { SquareKanban, Trash2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import QuickCreate from '@/components/QuickCreate'
import EmptyState from '@/components/EmptyState'
import ConfirmDialog from '@/components/ConfirmDialog'
import EntityTile, { EntityTileSkeleton, TileGrid } from '@/components/EntityTile'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { api, getErrorMessage } from '@/lib/api'
import { useResource } from '@/lib/useResource'
import type { Board, NamedRef } from '@/lib/types'

interface Response {
  organization: NamedRef
  department: NamedRef
  boards: Board[]
}

const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

const BoardsPage = () => {
  const { departmentId } = useParams()
  const { data, loading, error, setData, reload } = useResource<Response>(
    `/boards/${departmentId}`,
    'Could not load boards.',
  )
  const [toDelete, setToDelete] = useState<Board | null>(null)
  const boards = data?.boards ?? []

  async function createBoard(name: string) {
    try {
      const res = await api.post<{ board: Board }>(`/boards/${departmentId}/create`, { name })
      setData((d) => ({ ...d, boards: [res.data.board, ...d.boards] }))
      toast.success(`Created “${name}”`)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not create that board.'))
      return false
    }
  }

  async function deleteBoard() {
    if (!toDelete) return false
    try {
      await api.delete(`/boards/${departmentId}/${toDelete._id}`)
      setData((d) => ({ ...d, boards: d.boards.filter((b) => b._id !== toDelete._id) }))
      toast.success(`Deleted “${toDelete.name}”`)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete that board.'))
      return false
    }
  }

  const fallback = error ? '…' : undefined

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Organizations', to: '/organizations' },
          { label: data?.organization.name ?? fallback, to: data ? `/organizations/${data.organization._id}` : undefined },
          { label: data?.department.name ?? fallback },
        ]}
        title={data?.department.name ?? (error ? 'Boards' : undefined)}
        description="Each board is a kanban of cards moving from backlog to done."
        actions={<QuickCreate placeholder="New board name" buttonLabel="Create" onCreate={createBoard} />}
      />

      {loading ? (
        <TileGrid>
          {[0, 1, 2].map((i) => (
            <EntityTileSkeleton key={i} />
          ))}
        </TileGrid>
      ) : error ? (
        <EmptyState
          icon={SquareKanban}
          title="Couldn’t open this department"
          description={error}
          action={<Button variant="outline" onClick={reload}>Try again</Button>}
        />
      ) : boards.length === 0 ? (
        <EmptyState icon={SquareKanban} title="No boards yet" description="Create a board for a sprint, project or team." />
      ) : (
        <TileGrid>
          {boards.map((board) => (
            <EntityTile
              key={board._id}
              to={`/boards/${board._id}`}
              title={board.name}
              icon={<SquareKanban className="size-4.5" />}
              meta={board.createdAt ? `Created ${dateFormat.format(new Date(board.createdAt))}` : undefined}
              menu={
                <DropdownMenuItem variant="destructive" onClick={() => setToDelete(board)}>
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              }
            />
          ))}
        </TileGrid>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`Delete “${toDelete?.name}”?`}
        description="Every card on this board will be deleted too."
        confirmLabel="Delete board"
        onConfirm={deleteBoard}
      />
    </>
  )
}

export default BoardsPage
