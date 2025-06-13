'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  Home,
  UserCircle,
  Trophy,
  Settings,
  Sword,
  User,
  LogOut,
} from 'lucide-react'

const mockUser = {
  username: 'Tofunmi',
  avatar:
    'https://api.dicebear.com/7.x/adventurer/svg?seed=rocket&backgroundType=gradientLinear&backgroundColor=ff007f,00fff7',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', href: '/dashboard/dashboard', icon: <Home size={18} /> },
    { label: 'My Submissions', href: '/dashboard/submissions', icon: <UserCircle size={18} /> },
    { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Trophy size={18} /> },
    { label: 'Review Arena', href: '/dashboard/reviewarena', icon: <Sword size={18} /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <User size={18} /> },
  ]

  const handleLogout = () => {
    alert('Logged out!')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-inter relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#111111] border-r border-[#2a2a2a] z-40
        transform transition-transform duration-300
        md:translate-x-0 md:sticky md:top-0 md:block
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex flex-col h-full justify-between p-6">
          {/* Top nav */}
          <div>
            <h2 className="text-xl font-bold gap-3 px-3 py-3 rounded-lg text-[#00FFF7] hover:bg-white/10 cursor-pointer mb-8">
            <Link href="/">Fol<span className='text-[#FF007F]'>io</span>Rank</Link></h2>
            <nav className="space-y-4">
              {navItems.map(({ label, href, icon }, i) => (
                <Link href={href} key={i} onClick={() => setSidebarOpen(false)}>
                  <div className="flex items-center text-xl gap-3 px-3 py-3 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    {icon}
                    <span>{label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer buttons */}
          <div className="space-y-2 border-t border-[#2a2a2a] pt-4">
            <Link href="/dashboard/settings" onClick={() => setSidebarOpen(false)}>
              <div className="flex items-center text-xl gap-3  py-3 rounded-lg hover:bg-white/10 transition cursor-pointer">
                <Settings size={18} />
                <span>Settings</span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer text-left"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="w-full flex items-center justify-between px-4 md:px-10 py-4 border-b border-[#2a2a2a] bg-[#0a0a0a] sticky top-0 z-30">
          <div className="md:hidden cursor-pointer">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <h2 className="text-lg font-semibold">FolioRank Dashboard</h2>

          <div className="flex items-center gap-3 px-3 py-1 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a]">
            <span className="hidden font-bold sm:block text-sm">{mockUser.username}</span>
            <img
              src={mockUser.avatar}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border border-white/20"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-10 flex-1">{children}</main>
      </div>
    </div>
  )
}