import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Search, UserMinus, Users } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import QuickCreate from '@/components/QuickCreate'
import EmptyState from '@/components/EmptyState'
import ConfirmDialog from '@/components/ConfirmDialog'
import UserAvatar from '@/components/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { api, getErrorMessage } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { useResource } from '@/lib/useResource'
import type { Member, OrganizationDetails } from '@/lib/types'

const MembersPage = () => {
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const me = getCurrentUser()
  const { data, loading, error, setData, reload } = useResource<{ organization: OrganizationDetails }>(
    `/organizations/${organizationId}`,
    'Could not load members.',
  )
  const [query, setQuery] = useState('')
  const [toRemove, setToRemove] = useState<Member | null>(null)

  const org = data?.organization
  const isOwner = !!org && org.owner._id === me?._id
  const members = org?.members ?? []
  const q = query.trim().toLowerCase()
  const filtered = q
    ? members.filter((m) => m.name?.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    : members
  const removingSelf = toRemove?._id === me?._id

  async function invite(email: string) {
    try {
      const res = await api.post<{ member: Member }>(`/organizations/${organizationId}/members`, { email })
      setData((d) => ({ organization: { ...d.organization, members: [...d.organization.members, res.data.member] } }))
      toast.success(`${res.data.member.name} now has access`)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add that member.'))
      return false
    }
  }

  async function removeMember() {
    if (!toRemove) return false
    try {
      await api.delete(`/organizations/${organizationId}/${toRemove._id}`)
      if (removingSelf) {
        toast.success(`You left ${org?.name}`)
        navigate('/organizations', { replace: true })
        return true
      }
      setData((d) => ({
        organization: { ...d.organization, members: d.organization.members.filter((m) => m._id !== toRemove._id) },
      }))
      toast.success(`Removed ${toRemove.name}`)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not remove that member.'))
      return false
    }
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Organizations', to: '/organizations' },
          { label: org?.name ?? (error ? 'Organization' : undefined), to: `/organizations/${organizationId}` },
          { label: 'Members' },
        ]}
        title="Members"
        description={
          isOwner ? 'Invite people by the email they registered with.' : 'People with access to this organization.'
        }
        actions={
          isOwner && <QuickCreate type="email" placeholder="teammate@example.com" buttonLabel="Invite" onCreate={invite} />
        }
      />

      {error ? (
        <EmptyState
          icon={Users}
          title="Couldn’t load members"
          description={error}
          action={<Button variant="outline" onClick={reload}>Try again</Button>}
        />
      ) : (
        <Card className="gap-0 py-0">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members"
                aria-label="Search members"
                className="h-8 pl-8"
              />
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {loading ? '—' : `${members.length} ${members.length === 1 ? 'member' : 'members'}`}
            </span>
          </div>

          <ul className="divide-y">
            {loading
              ? [0, 1, 2].map((i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </li>
                ))
              : filtered.map((member) => {
                  const memberIsOwner = member._id === org?.owner._id
                  const isMe = member._id === me?._id
                  const canRemove = !memberIsOwner && (isOwner || isMe)
                  return (
                    <li key={member._id} className="flex items-center gap-3 px-4 py-3 animate-in fade-in-0">
                      <UserAvatar name={member.name} seed={member.email} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{member.name}</span>
                          {isMe && <span className="text-xs text-muted-foreground">(you)</span>}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{member.email}</div>
                      </div>
                      <Badge variant={memberIsOwner ? 'default' : 'secondary'}>{memberIsOwner ? 'Owner' : 'Member'}</Badge>
                      <div className="w-8">
                        {canRemove && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => setToRemove(member)}
                                  aria-label={isMe ? 'Leave organization' : `Remove ${member.name}`}
                                />
                              }
                            >
                              <UserMinus />
                            </TooltipTrigger>
                            <TooltipContent>{isMe ? 'Leave' : 'Remove'}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </li>
                  )
                })}
            {!loading && filtered.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">No members match “{query}”.</li>
            )}
          </ul>
        </Card>
      )}

      <ConfirmDialog
        open={toRemove !== null}
        onOpenChange={(open) => !open && setToRemove(null)}
        title={removingSelf ? `Leave ${org?.name}?` : `Remove ${toRemove?.name}?`}
        description={
          removingSelf
            ? 'You’ll lose access until an owner invites you again.'
            : 'They’ll immediately lose access to this organization’s departments and boards.'
        }
        confirmLabel={removingSelf ? 'Leave' : 'Remove'}
        onConfirm={removeMember}
      />
    </>
  )
}

export default MembersPage
