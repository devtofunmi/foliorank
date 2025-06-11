'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserCircle, Trophy, Settings, Home, Menu, X } from 'lucide-react'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', href: '/', icon: <Home size={18} /> },
    { label: 'My Submissions', href: '/submissions', icon: <UserCircle size={18} /> },
    { label: 'Leaderboard', href: '/leaderboard', icon: <Trophy size={18} /> },
    { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
  ]

  const stats = [
    { title: '💡 Reviews Received', value: '24' },
    { title: '⚡ XP Earned', value: '1,240' },
    { title: '🏆 Rank', value: '#12 on Leaderboard' },
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
      <main className="flex-1 p-6 md:p-10 ">
        <motion.h1
          className="text-2xl md:text-4xl md:mt-0 mt-10 font-bold text-[#FF007F] mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Welcome back, Creator!
        </motion.h1>
        <p className="text-zinc-400 mb-8">Here's how your portfolio is doing today:</p>

        {/* Stats Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ title, value }, i) => (
            <motion.div
              key={i}
              className="bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#2a2a2a]"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.15 }}
            >
              <h3 className="text-sm text-zinc-400 mb-1">{title}</h3>
              <p className="text-2xl font-semibold text-[#00FFF7]">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* XP Progress */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">🔥 Your XP Progress</h2>
          <div className="w-full bg-zinc-800 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-[#FF007F] to-[#00FFF7] h-4 rounded-full transition-all duration-300"
              style={{ width: '68%' }}
            />
          </div>
          <p className="mt-2 text-sm text-zinc-400">Next Rank at 1,500 XP</p>
        </div>
      </main>
    </div>
  )
}
