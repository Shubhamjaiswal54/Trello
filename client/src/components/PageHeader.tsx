import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

export interface Crumb {
  label?: string
  to?: string
}

interface PageHeaderProps {
  crumbs?: Crumb[]
  title?: string
  description?: ReactNode
  actions?: ReactNode
}

export default function PageHeader({ crumbs, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-3">
      {crumbs && crumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, i) => (
              <Fragment key={i}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.label === undefined ? (
                    <Skeleton className="h-4 w-20" />
                  ) : crumb.to ? (
                    <BreadcrumbLink render={<Link to={crumb.to} />}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 space-y-1">
          {title === undefined ? (
            <Skeleton className="h-8 w-56" />
          ) : (
            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          )}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
