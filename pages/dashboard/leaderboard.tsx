'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'

// Type definitions
type LeaderboardEntry = {
  rank: number
  username: string
  avatar_url: string | null
  xp: number
}

type TabKey = 'allTime' | 'monthly' | 'weekly'
type TabLabel = 'All Time' | 'Monthly' | 'Weekly'

const tabs: TabLabel[] = ['All Time', 'Monthly', 'Weekly']

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabLabel>('All Time')
  const [leaderboardData, setLeaderboardData] = useState<Record<TabKey, LeaderboardEntry[]>>({
    allTime: [],
    monthly: [],
    weekly: [],
  })

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase.rpc('get_leaderboard')
      if (error || !data) return

      const mapData = (
        key: 'total_xp' | 'month_xp' | 'week_xp'
      ): LeaderboardEntry[] =>
        data
          .sort((a: any, b: any) => b[key] - a[key])
          .map((entry: any, i: number) => ({
            rank: i + 1,
            username: entry.username || 'Anonymous',
            avatar_url: entry.avatar_url,
            xp: entry[key],
          }))

      setLeaderboardData({
        allTime: mapData('total_xp'),
        monthly: mapData('month_xp'),
        weekly: mapData('week_xp'),
      })
    }

    fetchLeaderboard()
  }, [])

  const getData = (): LeaderboardEntry[] => {
    const keyMap: Record<TabLabel, TabKey> = {
      'All Time': 'allTime',
      'Monthly': 'monthly',
      'Weekly': 'weekly',
    }
    return leaderboardData[keyMap[activeTab]] ?? []
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white font-inter">
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.h1
              className="text-2xl md:text-6xl font-extrabold text-[#00FFF7] mb-4"
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
            className="bg-[#111111] rounded-2xl shadow-xl p-6 border border-[#2a2a2a] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-3 text-left border-b border-[#2a2a2a] pb-3 mb-4 text-zinc-400 font-medium text-sm">
              <div>Rank</div>
              <div>User</div>
              <div className="text-right">XP</div>
            </div>

            {getData().length === 0 ? (
              <p className="text-center text-zinc-500 py-6">No leaderboard data yet.</p>
            ) : (
              getData().map((user) => (
                <motion.div
                  key={`${user.rank}-${user.username}`}
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
                      src={user.avatar_url || '/default-avatar.png'}
                      alt={user.username}
                      width={36}
                      height={36}
                      className="rounded-full border border-white/10 object-cover"
                    />
                    <span className="font-semibold">{user.username}</span>
                  </div>

                  <div className="text-right text-cyan-300 font-mono">{user.xp} XP</div>
                </motion.div>
              ))
            )}
          </motion.div>
        </main>

        {/* CTA Footer */}
        <footer className="text-center mt-12 mb-8">
          <Link href="/dashboard/dashboard">
            <button className="px-6 py-3 cursor-pointer rounded-xl font-semibold bg-[#FF007F] hover:bg-[#e60073] text-white transition duration-300">
              🚀 Go to Dashboard
            </button>
          </Link>
        </footer>
      </div>
    </DashboardLayout>
  )
}