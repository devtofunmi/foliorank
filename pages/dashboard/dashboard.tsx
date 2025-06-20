'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'

const rankThresholds = [
  { rank: 1, xp: 0 },
  { rank: 2, xp: 200 },
  { rank: 3, xp: 400 },
  { rank: 4, xp: 600 },
  { rank: 5, xp: 800 },
  { rank: 6, xp: 1000 },
  { rank: 7, xp: 1200 },
  { rank: 8, xp: 1400 },
  { rank: 9, xp: 1600 },
  { rank: 10, xp: 1800 },
  { rank: 11, xp: 2000 },
  { rank: 12, xp: 2400 },
  { rank: 13, xp: 2600 },
  { rank: 14, xp: 2800 },
  { rank: 15, xp: 3000 },
]

function getNextRankInfo(currentXp: number) {
  for (let i = 0; i < rankThresholds.length - 1; i++) {
    const current = rankThresholds[i]
    const next = rankThresholds[i + 1]

    if (currentXp >= current.xp && currentXp < next.xp) {
      const progress = ((currentXp - current.xp) / (next.xp - current.xp)) * 100
      return {
        xpNeeded: next.xp,
        progressPercent: Math.min(progress, 100).toFixed(0),
      }
    }
  }

  const last = rankThresholds[rankThresholds.length - 1]
  return {
    xpNeeded: null,
    progressPercent: '100',
  }
}

export default function DashboardPage() {
  const [username, setUsername] = useState('Creator')
  const [xp, setXp] = useState(0)
  const [rank, setRank] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const userId = user.id

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, xp')
        .eq('user_id', userId)
        .single()

      const currentXp = profile?.xp || 0
      const currentUsername = profile?.username || 'Creator'
      setUsername(currentUsername)
      setXp(currentXp)

      // Get user's portfolios
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', userId)

      const portfolioIds = portfolios?.map((p) => p.id) || []

      // Count reviews from both left and right portfolio references
      let count = 0
      if (portfolioIds.length > 0) {
        const { data: leftReviews } = await supabase
          .from('reviews')
          .select('id')
          .in('left_portfolio', portfolioIds)

        const { data: rightReviews } = await supabase
          .from('reviews')
          .select('id')
          .in('right_portfolio', portfolioIds)

        const uniqueIds = new Set([
          ...(leftReviews?.map((r) => r.id) || []),
          ...(rightReviews?.map((r) => r.id) || []),
        ])
        count = uniqueIds.size
      }
      setReviewCount(count)

      // Get rank from leaderboard
      const { data: leaderboard } = await supabase.rpc('get_leaderboard')
      const sorted = leaderboard?.sort((a: any, b: any) => b.total_xp - a.total_xp)
      const userRank = sorted?.findIndex((entry: any) => entry.user_id === userId) ?? -1
      setRank(userRank >= 0 ? userRank + 1 : null)
    }

    fetchStats()
  }, [])

  const { xpNeeded, progressPercent } = getNextRankInfo(xp)

  const stats = [
    { title: '💡 Reviews Received', value: reviewCount.toString() },
    { title: '⚡ XP Earned', value: xp.toLocaleString() },
    { title: '🏆 Rank', value: rank ? `#${rank} on Leaderboard` : 'N/A' },
  ]

  return (
    <DashboardLayout>
      <motion.h1
        className="text-2xl md:text-4xl md:mt-0 mt-10 font-bold text-[#FF007F] mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Welcome back, {username}!
      </motion.h1>

      <p className="text-zinc-400 mb-8">Here's how your portfolio is doing today:</p>

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

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">🔥 Your XP Progress</h2>
        <div className="w-full bg-zinc-800 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-[#FF007F] to-[#00FFF7] h-4 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          {xpNeeded
            ? `Next milestone at ${xpNeeded} XP`
            : '🎉 You’ve reached the highest milestone!'}
        </p>
      </div>
    </DashboardLayout>
  )
}