'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

type AvatarCardProps = {
  avatarUrl: string
  username: string
  rank: string
  xp: number
  level: number
  maxXP: number
}

export default function AvatarCard({ avatarUrl, username, rank, xp, level, maxXP }: AvatarCardProps) {
  return (
    <motion.div
      className="bg-[#1a1a1a] rounded-xl p-4 w-full max-w-xs text-white shadow-lg border border-white/10"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src={avatarUrl}
          alt={username}
          width={50}
          height={50}
          className="rounded-full border border-purple-500"
        />
        <div>
          <h3 className="text-lg font-semibold">{username}</h3>
          <p className="text-sm text-zinc-400">{rank} • Level {level}</p>
        </div>
      </div>

      <div className="mb-2 text-sm text-zinc-300">XP: {xp} / {maxXP}</div>
      <progress value={(xp / maxXP) * 100} className="h-2 bg-zinc-700" />
    </motion.div>
  )
}
