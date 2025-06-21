'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import Spinner from '@/components/Spinner'

type Portfolio = {
  id: number
  title: string
  link: string
  niche: string
  image?: string | null
}

type Review = {
  id: number
  reviewer_name: string
  feedback: string
  score: number
  date: string
  portfolio_title: string
  portfolio_link: string
}

type UserProfile = {
  user_id: string
  username: string
  xp: number
  rank: number
  portfolios: Portfolio[]
  reviews: Review[]
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getUser()
      const userId = sessionData?.user?.id
      if (!userId) return

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id, username, xp')
        .eq('user_id', userId)
        .single()

      if (!profile) return

      // Get portfolios
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)

      const portfolioIds = portfolios?.map(p => p.id) ?? []

      // Get enriched reviews
      const { data: reviewsData } = await supabase
        .from('enriched_reviews')
        .select('*')
        .in('left_portfolio_id', portfolioIds)
        .order('created_at', { ascending: false })

      const reviews: Review[] = (reviewsData ?? []).map(r => ({
        id: r.id,
        reviewer_name: r.reviewer_name,
        feedback: r.feedback_left,
        score: r.score_left,
        date: r.created_at,
        portfolio_title: r.left_title,
        portfolio_link: r.left_link,
      }))

      // Get rank using same logic as leaderboard
      const { data: leaderboardData } = await supabase.rpc('get_leaderboard')
      const sorted = leaderboardData?.sort((a: any, b: any) => b.total_xp - a.total_xp)
      const rank = sorted?.findIndex((entry: any) => entry.user_id === userId) + 1 || 0

      setUser({
        user_id: userId,
        username: profile.username,
        xp: profile.xp,
        rank,
        portfolios: portfolios ?? [],
        reviews,
      })
    }

    fetchProfile()
  }, [])

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-inter">
        <div className='flex justify-center'><Spinner /></div>
      </main>
    )
  }

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#0a0a0a] text-white font-inter max-w-5xl mx-auto">
        <motion.h1
          className="text-2xl font-extrabold text-[#00FFF7] mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {user.username} Profile
        </motion.h1>

        {/* XP and Rank */}
        <section className="mb-12 flex justify-center gap-12 text-center">
          <div className="bg-[#111111] rounded-xl p-3 md:p-6 w-32 md:w-40 shadow-lg border border-[#222]">
            <h3 className="text-lg font-semibold mb-2">XP</h3>
            <p className="text-3xl text-[#FF007F]">{user.xp.toLocaleString()}</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-3 md:p-6 w-32 md:w-40 shadow-lg border border-[#222]">
            <h3 className="text-lg font-semibold mb-2">Rank</h3>
            <p className="text-3xl text-[#00FFF7]">#{user.rank}</p>
          </div>
        </section>

        {/* Reviews */}
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
                    <div>
                      <h3 className="font-semibold">{review.reviewer_name}</h3>
                      <a
                        href={review.portfolio_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00FFF7] text-sm underline"
                      >
                        {review.portfolio_title}
                      </a>
                    </div>
                    <span className="bg-[#FF007F] px-3 py-1 rounded-full font-semibold text-sm">
                      Score: {review.score}/10
                    </span>
                  </div>
                  <p className="italic text-zinc-300 mb-2">"{review.feedback}"</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </DashboardLayout>
  )
}