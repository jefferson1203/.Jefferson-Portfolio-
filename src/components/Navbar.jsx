import { Link, useLocation } from 'react-router-dom'
import Logo from '@/components/Logo'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FiMenu, FiLock } from 'react-icons/fi'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { name: 'Accueil', path: '/' },
    { name: 'Projets', path: '/projects' },
    { name: 'Formations', path: '/trainings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="hover:opacity-90">
          <Logo size="md" showText={true} />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive(link.path)
                  ? 'text-white font-semibold'
                  : 'text-zinc-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Admin Link & Mobile Trigger */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin/login"
            className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-350 flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            <FiLock className="h-3 w-3" />
            Admin
          </Link>

          {/* Mobile Menu via shadcn Sheet */}
          <div className="md:hidden">
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
                side="right"
                className="bg-zinc-950 border-zinc-900 text-white w-[260px] p-6 flex flex-col gap-6"
              >
                <SheetHeader className="text-left pb-4 border-b border-zinc-900">
                  <SheetTitle className="text-white text-base font-bold flex items-center justify-between w-full">
                    <span>Menu</span>
                    <Logo size="sm" showText={false} />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-sm font-semibold transition-colors ${
                        isActive(link.path)
                          ? 'text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <hr className="border-zinc-900 my-2" />
                  <Link
                    to="/admin/login"
                    className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-2"
                  >
                    <FiLock className="h-3.5 w-3.5" />
                    Console Admin
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
