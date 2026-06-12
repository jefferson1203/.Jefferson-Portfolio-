import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      <Navbar />
      <main className="flex-grow mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Jefferson. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
