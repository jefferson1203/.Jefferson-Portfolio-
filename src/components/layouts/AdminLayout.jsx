import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  FiLayout,
  FiUser,
  FiGrid,
  FiTrendingUp,
  FiLogOut,
  FiMenu,
} from 'react-icons/fi'

function SidebarContent({ links, isActive, handleLogout }) {
  return (
    <div className="flex h-full flex-col justify-between bg-zinc-950 border-r border-zinc-900 p-6">
      <div className="flex flex-col gap-8">
        {/* Title / Logo */}
        <div className="flex items-center gap-2">
          <Logo size="md" showText={true} />
        </div>

        {/* Links */}
        <div className="flex flex-col gap-1.5">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive(link.path)
                    ? 'bg-zinc-900 text-white shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="bg-red-950/40 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white w-full justify-start gap-3 uppercase tracking-wider text-[10px] font-bold h-9"
      >
        <FiLogOut className="h-4 w-4" />
        Déconnexion
      </Button>
    </div>
  )
}

export default function AdminLayout() {
  const { signOut } = useAuth()
  const location = useLocation()

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiLayout },
    { name: 'Profil', path: '/admin/profile', icon: FiUser },
    { name: 'Projets', path: '/admin/projects', icon: FiGrid },
    { name: 'Formations', path: '/admin/trainings', icon: FiTrendingUp },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar (visible on md+) */}
      <aside className="hidden md:block w-[240px] h-screen sticky top-0 shrink-0">
        <SidebarContent links={links} isActive={isActive} handleLogout={handleLogout} />
      </aside>

      {/* Mobile Header (visible on <md) */}
      <div className="md:hidden flex h-14 items-center justify-between px-4 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Logo size="sm" showText={true} />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none"
            >
              <FiMenu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-zinc-950 border-zinc-900 text-white p-0 w-[240px]"
          >
            <SidebarContent links={links} isActive={isActive} handleLogout={handleLogout} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Pane */}
      <main className="flex-grow min-h-screen bg-zinc-950/20 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
