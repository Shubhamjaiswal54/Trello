import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, initials } from '@/lib/utils'

// Deterministic hue so the same person always gets the same color.
function hue(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % 360
}

export default function UserAvatar({
  name,
  seed,
  className,
}: {
  name?: string
  seed: string
  className?: string
}) {
  const h = hue(seed)
  return (
    <Avatar className={cn('size-9', className)}>
      <AvatarFallback
        className="text-xs font-semibold text-white"
        style={{ background: `linear-gradient(135deg, hsl(${h} 55% 50%), hsl(${(h + 45) % 360} 55% 38%))` }}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
