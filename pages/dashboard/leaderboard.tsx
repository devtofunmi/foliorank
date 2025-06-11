'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'

// Type definitions
type LeaderboardEntry = {
  rank: number
  name: string
  xp: number
}

type TabKey = 'allTime' | 'monthly' | 'weekly'

const leaderboardData: Record<TabKey, LeaderboardEntry[]> = {
  allTime: [
    { rank: 1, name: 'PixelWizard', xp: 2150 },
    { rank: 2, name: 'DevNeko', xp: 1990 },
    { rank: 3, name: 'CodeNova', xp: 1800 },
    { rank: 4, name: 'UIKnight', xp: 1650 },
    { rank: 5, name: 'BugHunterX', xp: 1530 },
  ],
  weekly: [
    { rank: 1, name: 'NextGen', xp: 420 },
    { rank: 2, name: 'PixelWizard', xp: 390 },
    { rank: 3, name: 'DevStorm', xp: 360 },
    { rank: 4, name: 'CodeNova', xp: 310 },
    { rank: 5, name: 'UIKnight', xp: 275 },
  ],
  monthly: [
    { rank: 1, name: 'BugHunterX', xp: 1200 },
    { rank: 2, name: 'CodeNova', xp: 1120 },
    { rank: 3, name: 'DevNeko', xp: 1105 },
    { rank: 4, name: 'PixelWizard', xp: 1090 },
    { rank: 5, name: 'ShadowStack', xp: 1000 },
  ],
}

const tabs = ['All Time', 'Monthly', 'Weekly'] as const
type TabLabel = typeof tabs[number]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabLabel>('All Time')

  const getData = (): LeaderboardEntry[] => {
    const keyMap: Record<TabLabel, TabKey> = {
      'All Time': 'allTime',
      'Monthly': 'monthly',
      'Weekly': 'weekly',
    }
    const key = keyMap[activeTab]
    return leaderboardData[key] ?? []
  }

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#0a0a0a] text-white font-inter px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-[#00FFF7] mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🏆 FolioRank Leaderboard
        </motion.h1>
        <motion.p
          className="text-zinc-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          See who’s climbing the charts in the creative dev world.
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 cursor-pointer rounded-lg font-semibold transition duration-300 ${
              activeTab === tab
                ? 'bg-[#FF007F] text-white'
                : 'border border-[#444] text-zinc-300 hover:bg-[#1a1a1a]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <motion.div
        key={activeTab}
        className="bg-[#111111] rounded-2xl shadow-xl p-6 md:p-8 border border-[#2a2a2a] max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-3 text-left border-b border-[#2a2a2a] pb-3 mb-4 text-zinc-400 font-medium text-sm">
          <div>Rank</div>
          <div>User</div>
          <div className="text-right">XP</div>
        </div>

        {getData().map((user) => (
          <motion.div
            key={user.rank}
            className={`grid grid-cols-3 my-3 py-3 px-2 rounded-xl items-center ${
              user.rank <= 3
                ? 'bg-gradient-to-r from-[#1A1AFF]/20 via-[#FF007F]/10 to-[#00FFF7]/10'
                : 'hover:bg-white/5'
            } transition`}
            whileHover={{ scale: 1.015 }}
          >
            <div className="font-bold text-[#FF007F]">#{user.rank}</div>

            <div className="flex items-center gap-3">
              <img
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(user.name)}&radius=50`}
                alt={user.name}
                width={36}
                height={36}
                className="rounded-full border border-white/10"
              />
              <span className="font-semibold">{user.name}</span>
            </div>

            <div className="text-right text-cyan-300 font-mono">{user.xp} XP</div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <div className="text-center mt-12">
        <Link href="/dashboard">
          <button className="px-6 py-3 cursor-pointer rounded-xl font-semibold bg-[#FF007F] hover:bg-[#e60073] text-white transition duration-300">
            🚀 Go to Dashboard
          </button>
        </Link>
      </div>
    </main>
    </DashboardLayout>
    
  )
}
