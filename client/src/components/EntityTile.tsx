import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import SpotlightCard from '@/components/SpotlightCard'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

interface EntityTileProps {
  to: string
  title: string
  icon: ReactNode
  meta?: ReactNode
  badge?: ReactNode
  // DropdownMenuItem elements; the menu is hidden when omitted.
  menu?: ReactNode
  accent?: string
}

export default function EntityTile({ to, title, icon, meta, badge, menu, accent = '#5b7ea3' }: EntityTileProps) {
  return (
    <SpotlightCard
      className="group rounded-xl p-5 transition-transform duration-200 hover:-translate-y-0.5 animate-in fade-in-0 slide-in-from-bottom-1"
      spotlightColor={accent}
      intensity={0.35}
      style={{ '--spotlight-card-surface': 'var(--card)' } as React.CSSProperties}
    >
      <Link to={to} className="absolute inset-0 z-[2] rounded-[inherit] focus-visible:ring-2 focus-visible:ring-ring outline-none" aria-label={`Open ${title}`} />

      <div className="flex items-start justify-between gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
          style={{
            backgroundColor: `color-mix(in srgb, ${accent} 20%, transparent)`,
            color: `color-mix(in srgb, ${accent} 65%, white)`,
          }}
        >
          {icon}
        </div>
        {menu && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="relative z-[3] -mr-1 -mt-1 flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Actions for ${title}`}
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {menu}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mt-5 space-y-1.5">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{title}</h3>
          {badge}
        </div>
        {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
      </div>
    </SpotlightCard>
  )
}

export function EntityTileSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <Skeleton className="size-10 rounded-lg" />
      <Skeleton className="mt-5 h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/3" />
    </div>
  )
}

export function TileGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}
