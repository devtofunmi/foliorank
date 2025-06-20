'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { getUser } from '@/lib/getUser'

export default function DashboardPage() {
  const [username, setUsername] = useState('')
  const [xp, setXp] = useState(0)
  const [rank, setRank] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser()
      if (!user) return

      const userId = user.id

      // Fetch profile data (username + xp)
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, xp')
        .eq('user_id', userId)
        .single()

      if (profile) {
        setUsername(profile.username || 'Creator')
        setXp(profile.xp || 0)
      }

      // Fetch leaderboard to determine user's rank
      const { data: leaderboard } = await supabase.rpc('get_leaderboard')
      if (leaderboard && Array.isArray(leaderboard)) {
        const sorted = leaderboard.sort((a, b) => b.total_xp - a.total_xp)
        const index = sorted.findIndex((entry) => entry.user_id === userId)
        if (index !== -1) setRank(index + 1)
      }

      // Fetch review count
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .or(`left_portfolio.in.(select id from portfolios where user_id.eq.${userId}),right_portfolio.in.(select id from portfolios where user_id.eq.${userId})`)

      if (typeof count === 'number') {
        setReviewCount(count)
      }
    }

    fetchData()
  }, [])

  const progressPercent = Math.min((xp / 1500) * 100, 100).toFixed(0)

  return (
    <DashboardLayout>
      <motion.h1
        className="text-2xl md:text-4xl md:mt-0 mt-10 font-bold text-[#FF007F] mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Welcome back, {username || 'Creator'}!
      </motion.h1>
      <p className="text-zinc-400 mb-8">Here's how your portfolio is doing today:</p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          className="bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#2a2a2a]"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-sm text-zinc-400 mb-1">💡 Reviews Received</h3>
          <p className="text-2xl font-semibold text-[#00FFF7]">{reviewCount}</p>
        </motion.div>

        <motion.div
          className="bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#2a2a2a]"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <h3 className="text-sm text-zinc-400 mb-1">⚡ XP Earned</h3>
          <p className="text-2xl font-semibold text-[#00FFF7]">{xp.toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-[#2a2a2a]"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-sm text-zinc-400 mb-1">🏆 Rank</h3>
          <p className="text-2xl font-semibold text-[#00FFF7]">
            {rank ? `#${rank} on Leaderboard` : 'Unranked'}
          </p>
        </motion.div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">🔥 Your XP Progress</h2>
        <div className="w-full bg-zinc-800 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-[#FF007F] to-[#00FFF7] h-4 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* <p className="mt-2 text-sm text-zinc-400">Next Rank at 1,500 XP</p> */}
      </div>
    </DashboardLayout>
  )
}
