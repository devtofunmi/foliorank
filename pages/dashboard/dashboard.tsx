'use client'

import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'

export default function DashboardPage() {
  const stats = [
    { title: '💡 Reviews Received', value: '24' },
    { title: '⚡ XP Earned', value: '1,240' },
    { title: '🏆 Rank', value: '#12 on Leaderboard' },
  ]

  return (
    <>
    <DashboardLayout>
      <motion.h1
        className="text-2xl md:text-4xl md:mt-0 mt-10 font-bold text-[#FF007F] mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Welcome back, Creator!
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
            style={{ width: '68%' }}
          />
        </div>
        <p className="mt-2 text-sm text-zinc-400">Next Rank at 1,500 XP</p>
      </div>
    </DashboardLayout>     
    </>
  )
}
