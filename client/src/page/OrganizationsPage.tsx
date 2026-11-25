import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Building2, LogOut, Trash2, Users } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import QuickCreate from '@/components/QuickCreate'
import EmptyState from '@/components/EmptyState'
import ConfirmDialog from '@/components/ConfirmDialog'
import EntityTile, { EntityTileSkeleton, TileGrid } from '@/components/EntityTile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { api, getErrorMessage } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { useResource } from '@/lib/useResource'
import { initials } from '@/lib/utils'
import type { Organization } from '@/lib/types'

type PendingAction = { kind: 'delete' | 'leave'; org: Organization } | null

const OrganizationsPage = () => {
  const navigate = useNavigate()
  const me = getCurrentUser()
  const { data, loading, error, setData, reload } = useResource<{ organization: Organization[] }>(
    '/organizations/allorganizations/me',
    'Could not load your organizations.',
  )
  const [pending, setPending] = useState<PendingAction>(null)
  const orgs = data?.organization ?? []

  async function createOrg(name: string) {
    try {
      const res = await api.post<{ organization: Organization }>('/organizations/create', { name })
      setData((d) => ({ organization: [res.data.organization, ...d.organization] }))
      toast.success(`Created “${name}”`)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not create that organization.'))
      return false
    }
  }

  async function confirmPending() {
    if (!pending || !me) return false
    const { kind, org } = pending
    try {
      if (kind === 'delete') await api.delete(`/organizations/${org._id}`)
      else await api.delete(`/organizations/${org._id}/${me._id}`)
      setData((d) => ({ organization: d.organization.filter((o) => o._id !== org._id) }))
      toast.success(kind === 'delete' ? `Deleted “${org.name}”` : `You left “${org.name}”`)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'That didn’t work. Try again.'))
      return false
    }
  }

  return (
    <>
      <PageHeader
        title="Organizations"
        description="Every workspace you own or have been invited to."
        actions={<QuickCreate placeholder="New organization name" buttonLabel="Create" onCreate={createOrg} />}
      />

      {loading ? (
        <TileGrid>
          {[0, 1, 2].map((i) => (
            <EntityTileSkeleton key={i} />
          ))}
        </TileGrid>
      ) : error ? (
        <EmptyState
          icon={Building2}
          title="Something went wrong"
          description={error}
          action={<Button variant="outline" onClick={reload}>Try again</Button>}
        />
      ) : orgs.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations yet"
          description="Create one above, or ask an owner to invite you by email."
        />
      ) : (
        <TileGrid>
          {orgs.map((org) => {
            const isOwner = org.owner === me?._id
            return (
              <EntityTile
                key={org._id}
                to={`/organizations/${org._id}`}
                title={org.name}
                icon={initials(org.name)}
                badge={isOwner ? <Badge variant="secondary">Owner</Badge> : null}
                meta={`${org.members.length} ${org.members.length === 1 ? 'member' : 'members'}`}
                menu={
                  <>
                    <DropdownMenuItem onClick={() => navigate(`/organizations/${org._id}/members`)}>
                      <Users />
                      Members
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isOwner ? (
                      <DropdownMenuItem variant="destructive" onClick={() => setPending({ kind: 'delete', org })}>
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem variant="destructive" onClick={() => setPending({ kind: 'leave', org })}>
                        <LogOut />
                        Leave
                      </DropdownMenuItem>
                    )}
                  </>
                }
              />
            )
          })}
        </TileGrid>
      )}

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={pending?.kind === 'delete' ? `Delete “${pending.org.name}”?` : `Leave “${pending?.org.name}”?`}
        description={
          pending?.kind === 'delete'
            ? 'This permanently removes the organization along with all of its departments, boards and cards.'
            : 'You’ll lose access to its departments and boards until an owner invites you again.'
        }
        confirmLabel={pending?.kind === 'delete' ? 'Delete organization' : 'Leave'}
        onConfirm={confirmPending}
      />
    </>
  )
}

export default OrganizationsPage
