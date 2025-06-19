'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'

type Portfolio = {
  id: number
  title: string
  link: string
  niche: string
  image?: string | null
}

export default function ReviewArenaPage() {
  const [selected, setSelected] = useState<{ left?: Portfolio; right?: Portfolio }>({})
  const [scoreLeft, setScoreLeft] = useState<number | null>(null)
  const [scoreRight, setScoreRight] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [previousIds, setPreviousIds] = useState<number[]>([])

  async function fetchTwoPortfolios(prevIds: number[] = []) {
    setLoading(true)
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !portfolios || portfolios.length < 2) {
      setMessage('Not enough portfolios available for review.')
      setLoading(false)
      return
    }

    const filtered = portfolios.filter(p => !prevIds.includes(p.id))

    if (filtered.length < 2) {
      setMessage('⚠️ Not enough new portfolios available. Showing from previous pool.')
    }

    const pool = filtered.length >= 2 ? filtered : portfolios
    const shuffled = [...pool].sort(() => Math.random() - 0.5)

    const left = shuffled[0]
    let right = shuffled[1]

    if (left.id === right.id && shuffled.length > 2) {
      right = shuffled[2]
    }

    setSelected({ left, right })
    setScoreLeft(null)
    setScoreRight(null)
    setFeedback('')
    setMessage('')
    setPreviousIds([left.id, right.id])
    setLoading(false)
  }

  useEffect(() => {
    fetchTwoPortfolios()
  }, [])

  const handleSubmitReview = async () => {
  if (
    !selected.left ||
    !selected.right ||
    scoreLeft === null ||
    scoreRight === null ||
    feedback.trim() === ''
  ) {
    setMessage('Please provide scores for both portfolios and leave feedback.')
    return
  }

  setSubmitting(true)
  setMessage('')

  const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null

  if (!user) {
    setMessage('⚠️ You must be logged in to submit a review.')
    setSubmitting(false)
    return
  }

  // Step 1: Count reviews submitted today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { count: reviewCountToday } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', todayStart.toISOString())

  // Step 2: XP Calculation
  let xp = 0
  const trimmedFeedback = feedback.trim()

  if (trimmedFeedback.length > 300) xp += 30
  else if (trimmedFeedback.length > 150) xp += 20
  else if (trimmedFeedback.length > 50) xp += 10

  if (scoreLeft !== null && scoreRight !== null) xp += 10

  const todayCount = reviewCountToday ?? 0
  if (todayCount <= 3) xp += 10
  else if (todayCount <= 5) xp += 5

  // Step 3: Insert review
  const { error: reviewError } = await supabase.from('reviews').insert({
    user_id: user.id,
    left_portfolio_id: selected.left.id,
    right_portfolio_id: selected.right.id,
    score_left: scoreLeft,
    score_right: scoreRight,
    feedback: trimmedFeedback,
    xp: xp,
  })

  if (reviewError) {
    console.error('Review insert error:', reviewError)
    setMessage('❌ Failed to submit review.')
    setSubmitting(false)
    return
  }

  // Step 4: Update user XP in profiles table using RPC
  const { error: updateError } = await supabase.rpc('increment_xp', {
    uid: user.id,
    points: xp,
  })

  if (updateError) {
    console.error("XP RPC error:", updateError)
    setMessage('✅ Review submitted, but failed to update XP.')
  } else {
    setMessage(`✅ Review submitted! You earned ${xp} XP 🎉`)
  }

  setSubmitting(false)
  fetchTwoPortfolios([selected.left.id, selected.right.id]) // Avoid showing same pair again
}



  const handleSkip = () => {
    fetchTwoPortfolios(previousIds)
  }

  return (
    <DashboardLayout>
      <main className="bg-[#0a0a0a] text-white font-inter min-h-screen">
        <motion.h1
          className="text-center text-2xl md:text-4xl font-extrabold text-[#00FFF7] mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚔️ Review Arena
        </motion.h1>

        {message && (
          <p className="mb-6 text-center text-sm text-zinc-400">{message}</p>
        )}

        {loading ? (
          <p className="text-center text-zinc-400">Loading portfolios...</p>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
            {selected.left && (
              <PortfolioCard
                portfolio={selected.left}
                score={scoreLeft}
                onScoreChange={setScoreLeft}
                side="left"
              />
            )}
            {selected.right && (
              <PortfolioCard
                portfolio={selected.right}
                score={scoreRight}
                onScoreChange={setScoreRight}
                side="right"
              />
            )}
          </div>
        )}

        {!loading && (
          <>
            <div className="max-w-5xl mx-auto mt-10">
              <label htmlFor="feedback" className="block mb-2 text-sm font-semibold">
                Leave your feedback and thoughts
              </label>
              <textarea
                id="feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded bg-[#1c1c1c] border border-[#333] p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
                placeholder="What did you like or dislike about these portfolios?"
              />
            </div>

            <div className="max-w-5xl mx-auto text-center mt-8 flex justify-center gap-4">
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="px-6 py-3 bg-[#FF007F] rounded-xl font-semibold text-white hover:bg-[#e60073] transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review & Earn XP'}
              </button>

              <button
                onClick={handleSkip}
                disabled={loading}
                className="px-6 py-3 bg-[#333] rounded-xl font-semibold text-white hover:bg-[#444] transition disabled:opacity-50"
              >
                Skip This Pair
              </button>
            </div>
          </>
        )}
      </main>
    </DashboardLayout>
  )
}

type PortfolioCardProps = {
  portfolio: Portfolio
  score: number | null
  onScoreChange: (score: number) => void
  side: 'left' | 'right'
}

function PortfolioCard({ portfolio, score, onScoreChange }: PortfolioCardProps) {
  return (
    <motion.div
      className="flex-1 bg-[#111111] rounded-2xl p-6 border border-[#2a2a2a] shadow-lg flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {portfolio.image ? (
        <img
          src={portfolio.image}
          alt={portfolio.title}
          className="w-full h-48 object-cover rounded-lg mb-4 border border-white/10"
        />
      ) : (
        <div className="w-full h-48 rounded-lg bg-gradient-to-r from-[#FF007F] via-[#00FFF7] to-[#FF007F] mb-4 flex items-center justify-center text-3xl font-bold text-white/20">
          {portfolio.title[0]}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-1">{portfolio.title}</h2>
      <a
        href={portfolio.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00FFF7] underline mb-3 truncate block"
        title={portfolio.link}
      >
        {portfolio.link}
      </a>
      <p className="text-zinc-400 italic mb-6">Niche: {portfolio.niche}</p>

      <label className="block mb-1 font-semibold">Your Score (0–10):</label>
      <input
        type="number"
        min={0}
        max={10}
        value={score ?? ''}
        onChange={(e) => onScoreChange(Number(e.target.value))}
        className="w-full px-3 py-2 rounded bg-[#1c1c1c] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
      />
    </motion.div>
  )
}
