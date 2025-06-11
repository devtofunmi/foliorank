'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { Menu, X, Home, UserCircle, Trophy, Settings, Sword, User } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', href: '/dashboard/dashboard', icon: <Home size={18} /> },
    { label: 'My Submissions', href: '/dashboard/submissions', icon: <UserCircle size={18} /> },
    { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Trophy size={18} /> },
    { label: 'Review Arena', href: '/dashboard/reviewarena', icon: <Sword size={18} /> },
    { label: 'Profile Page', href: '/dashboard/profile', icon: <User size={18} /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-inter relative">
      {/* Mobile Hamburger Button */}
      <div className="md:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
          className="focus:outline-none"
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#111111] p-6 space-y-6 border-r border-[#2a2a2a] z-40
          transform transition-transform duration-300
          md:translate-x-0 md:sticky md:top-0 md:block
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <h2 className="text-xl font-bold text-[#00FFF7] mb-8">FolioRank</h2>
        <nav className="space-y-4">
          {navItems.map(({ label, href, icon }, i) => (
            <Link href={href} key={i} onClick={() => setSidebarOpen(false)}>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer">
                {icon}
                <span>{label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  )
}