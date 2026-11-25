import { Link } from 'react-router-dom'
import { SquareKanban } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BrandMark({ to = '/', className }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
        <SquareKanban className="size-4.5" />
      </span>
      <span>Corkboard</span>
    </Link>
  )
}
