import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { FolderKanban, Trash2, Users } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import QuickCreate from '@/components/QuickCreate'
import EmptyState from '@/components/EmptyState'
import ConfirmDialog from '@/components/ConfirmDialog'
import EntityTile, { EntityTileSkeleton, TileGrid } from '@/components/EntityTile'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { api, getErrorMessage } from '@/lib/api'
import { useResource } from '@/lib/useResource'
import type { Department, NamedRef } from '@/lib/types'

const ACCENTS = ['#5b7ea3', '#d3944a', '#7a9b74', '#a37bb5', '#d1495b']

interface Response {
  organization: NamedRef
  departments: Department[]
}

const DepartmentsPage = () => {
  const { organizationId } = useParams()
  const { data, loading, error, setData, reload } = useResource<Response>(
    `/departments/${organizationId}`,
    'Could not load departments.',
  )
  const [toDelete, setToDelete] = useState<Department | null>(null)
  const departments = data?.departments ?? []

  async function createDepartment(name: string) {
    try {
      const res = await api.post<{ department: Department }>(`/departments/${organizationId}/create`, { name })
      setData((d) => ({
        ...d,
        departments: [...d.departments, res.data.department].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      toast.success(`Added “${name}”`)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add that department.'))
      return false
    }
  }

  async function deleteDepartment() {
    if (!toDelete) return false
    try {
      await api.delete(`/departments/${organizationId}/${toDelete._id}`)
      setData((d) => ({ ...d, departments: d.departments.filter((x) => x._id !== toDelete._id) }))
      toast.success(`Deleted “${toDelete.name}”`)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete that department.'))
      return false
    }
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Organizations', to: '/organizations' }, { label: data?.organization.name ?? (error ? 'Organization' : undefined) }]}
        title={data?.organization.name ?? (error ? 'Departments' : undefined)}
        description="Departments group related boards together."
        actions={
          <>
            <Link to={`/organizations/${organizationId}/members`} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <Users />
              Members
            </Link>
            <QuickCreate placeholder="New department name" buttonLabel="Add" onCreate={createDepartment} />
          </>
        }
      />

      {loading ? (
        <TileGrid>
          {[0, 1, 2].map((i) => (
            <EntityTileSkeleton key={i} />
          ))}
        </TileGrid>
      ) : error ? (
        <EmptyState
          icon={FolderKanban}
          title="Couldn’t open this organization"
          description={error}
          action={<Button variant="outline" onClick={reload}>Try again</Button>}
        />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No departments yet"
          description="Add one like “Engineering” or “Marketing” to start creating boards."
        />
      ) : (
        <TileGrid>
          {departments.map((dept, i) => (
            <EntityTile
              key={dept._id}
              to={`/departments/${dept._id}`}
              title={dept.name}
              icon={dept.name.charAt(0).toUpperCase()}
              accent={ACCENTS[i % ACCENTS.length]}
              meta="Open boards"
              menu={
                <DropdownMenuItem variant="destructive" onClick={() => setToDelete(dept)}>
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
        description="All boards and cards in this department will be deleted too."
        confirmLabel="Delete department"
        onConfirm={deleteDepartment}
      />
    </>
  )
}

export default DepartmentsPage
