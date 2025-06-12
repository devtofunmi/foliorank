'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'

type Portfolio = {
  id: number
  title: string
  link: string
  niche: string
  image?: string | null
}

type Review = {
  id: number
  reviewerName: string
  comment: string
  score: number
  date: string
}

type UserProfile = {
  id: number
  name: string
  xp: number
  rank: number
  portfolios: Portfolio[]
  reviews: Review[]
}

const mockUserProfile: UserProfile = {
  id: 1,
  name: 'Tofunmi',
  xp: 1240,
  rank: 12,
  portfolios: [
    {
      id: 101,
      title: 'My React Portfolio',
      link: 'https://janedoe.dev',
      niche: 'Frontend Development',
      image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 102,
      title: 'Design Project',
      link: 'https://behance.net/janedoe',
      niche: 'UI/UX Design',
      image: null,
    },
  ],
  reviews: [
    {
      id: 201,
      reviewerName: 'John Smith',
      comment: 'Great use of color and typography, very clean design!',
      score: 9,
      date: '2025-06-01',
    },
    {
      id: 202,
      reviewerName: 'Alice Cooper',
      comment: 'Loved the responsiveness and smooth animations.',
      score: 8,
      date: '2025-05-28',
    },
  ],
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    // simulate fetch with mock data
    setTimeout(() => {
      setUser(mockUserProfile)
    }, 500)
  }, [])

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-inter">
        <p>Loading profile...</p>
      </main>
    )
  }

  return (
    <DashboardLayout>
    <main className="min-h-screen bg-[#0a0a0a] text-white font-inter  max-w-5xl mx-auto">
      <motion.h1
        className="text-2xl font-extrabold text-[#00FFF7] mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {user.name} Profile
      </motion.h1>

      {/* XP and Rank */}
      <section className="mb-12 flex justify-center gap-12 text-center">
        <div className="bg-[#111111] rounded-xl p-6 w-40 shadow-lg border border-[#222]">
          <h3 className="text-lg font-semibold mb-2">XP</h3>
          <p className="text-3xl text-[#FF007F]">{user.xp.toLocaleString()}</p>
        </div>
        <div className="bg-[#111111] rounded-xl p-6 w-40 shadow-lg border border-[#222]">
          <h3 className="text-lg font-semibold mb-2">Rank</h3>
          <p className="text-3xl text-[#00FFF7]">#{user.rank}</p>
        </div>
      </section>

      {/* Portfolios */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 border-b border-[#333] pb-2">
          Portfolios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user.portfolios.map((portfolio) => (
            <motion.a
              key={portfolio.id}
              href={portfolio.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111111] rounded-2xl overflow-hidden shadow-lg border border-[#222] hover:scale-[1.02] transition-transform"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
            >
              {portfolio.image ? (
                <img
                  src={portfolio.image}
                  alt={portfolio.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-[#FF007F] via-[#00FFF7] to-[#FF007F] flex items-center justify-center text-white text-4xl font-bold">
                  {portfolio.title[0]}
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{portfolio.title}</h3>
                <p className="italic text-sm text-zinc-400 mb-2">Niche: {portfolio.niche}</p>
                <p className="text-sm text-[#00FFF7] truncate">{portfolio.link}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Reviews / Feedback */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b border-[#333] pb-2">
          Reviews & Feedback
        </h2>
        {user.reviews.length === 0 ? (
          <p className="text-center text-zinc-500">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {user.reviews.map((review) => (
              <motion.div
                key={review.id}
                className="bg-[#111111] rounded-xl p-6 shadow-md border border-[#222]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{review.reviewerName}</h3>
                  <span className="bg-[#FF007F] px-3 py-1 rounded-full font-semibold text-sm">
                    Score: {review.score}/10
                  </span>
                </div>
                <p className="italic text-zinc-300 mb-2">"{review.comment}"</p>
                <p className="text-xs text-zinc-500">{new Date(review.date).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
    </DashboardLayout>
  )
}
