import { Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Building2, LogOut } from 'lucide-react'
import BrandMark from '@/components/BrandMark'
import UserAvatar from '@/components/UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { clearSession, getCurrentUser } from '@/lib/auth'

export default function AppShell() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  function signOut() {
    clearSession()
    navigate('/user/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandMark to="/organizations" />

          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 rounded-full p-0.5 pr-3 text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Account menu"
            >
              <UserAvatar name={user?.name} seed={user?.email ?? 'me'} className="size-7" />
              <span className="hidden max-w-40 truncate sm:inline">{user?.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="truncate text-sm font-medium text-foreground">{user?.name}</div>
                  <div className="truncate text-xs font-normal">{user?.email}</div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/organizations')}>
                <Building2 />
                Organizations
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={signOut}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
