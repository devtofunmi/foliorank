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

export default function ReviewArenaPage() {
  const [selected, setSelected] = useState<{ left?: Portfolio; right?: Portfolio }>({})
  const [scoreLeft, setScoreLeft] = useState<number | null>(null)
  const [scoreRight, setScoreRight] = useState<number | null>(null)
  const [leftScoreError, setLeftScoreError] = useState<string | null>(null)
  const [rightScoreError, setRightScoreError] = useState<string | null>(null)
  const [leftFeedback, setLeftFeedback] = useState('')
  const [rightFeedback, setRightFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [previousIds, setPreviousIds] = useState<number[]>([])
  const [reviewCountToday, setReviewCountToday] = useState(0)

  async function fetchTwoPortfolios(prevIds: number[] = []) {
    setLoading(true)

    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData?.user

    if (userError || !user) {
      setMessage('⚠️ You must be logged in to review portfolios.')
      setLoading(false)
      return
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count: reviewCountToday } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString())

    setReviewCountToday(reviewCountToday || 0)

    const { data: reviewed } = await supabase
      .from('reviews')
      .select('left_portfolio_id, right_portfolio_id')
      .eq('user_id', user.id)

    const reviewedIds = new Set<number>()
    reviewed?.forEach((r) => {
      if (r.left_portfolio_id) reviewedIds.add(r.left_portfolio_id)
      if (r.right_portfolio_id) reviewedIds.add(r.right_portfolio_id)
    })

    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .neq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error || !portfolios || portfolios.length < 2) {
      setMessage('⚠️ Not enough portfolios available for review.')
      setLoading(false)
      return
    }

    const filtered = portfolios.filter(
      (p) => !reviewedIds.has(p.id) && !prevIds.includes(p.id)
    )

    if (filtered.length < 2 && portfolios.length >= 2) {
      setMessage('⚠️ No new portfolios left, showing from previous pool.')
    }

    const pool = filtered.length >= 2 ? filtered : portfolios
    const shuffled = [...pool].sort(() => Math.random() - 0.5)

    const left = shuffled[0]
    let right = shuffled[1]

    if (!left || !right || left.id === right.id) {
      setMessage('⚠️ Could not find two distinct portfolios. Try again later.')
      setLoading(false)
      return
    }

    setSelected({ left, right })
    setScoreLeft(null)
    setScoreRight(null)
    setLeftFeedback('')
    setRightFeedback('')
    setLeftScoreError(null)
    setRightScoreError(null)
    setMessage('')
    setPreviousIds([left.id, right.id])
    setLoading(false)
  }

  useEffect(() => {
    fetchTwoPortfolios()
  }, [])

  const handleSubmitReview = async () => {
    if (scoreLeft === null || scoreLeft < 0 || scoreLeft > 10) {
      setLeftScoreError('Score must be between 0 and 10')
    } else {
      setLeftScoreError(null)
    }

    if (scoreRight === null || scoreRight < 0 || scoreRight > 10) {
      setRightScoreError('Score must be between 0 and 10')
    } else {
      setRightScoreError(null)
    }

    if (
      !selected.left ||
      !selected.right ||
      scoreLeft === null ||
      scoreRight === null ||
      scoreLeft < 0 ||
      scoreLeft > 10 ||
      scoreRight < 0 ||
      scoreRight > 10 ||
      leftFeedback.trim() === '' ||
      rightFeedback.trim() === ''
    ) {
      setMessage('Please score (0–10) and give feedback for both portfolios.')
      return
    }

    if (reviewCountToday >= 10) {
      setMessage('⚠️ You have reached your daily review limit. Try again tomorrow.')
      return
    }

    setSubmitting(true)
    setMessage('')

    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData?.user

    if (userError || !user) {
      setMessage('⚠️ You must be logged in to submit a review.')
      setSubmitting(false)
      return
    }

    let xp = 0
    const lfb = leftFeedback.trim()
    const rfb = rightFeedback.trim()

    if (lfb.length > 300) xp += 20
    else if (lfb.length > 150) xp += 15
    else if (lfb.length > 50) xp += 10

    if (rfb.length > 300) xp += 20
    else if (rfb.length > 150) xp += 15
    else if (rfb.length > 50) xp += 10

    xp += 10

    const { error: reviewError } = await supabase.from('reviews').insert({
      user_id: user.id,
      left_portfolio_id: selected.left.id,
      right_portfolio_id: selected.right.id,
      score_left: scoreLeft,
      score_right: scoreRight,
      feedback_left: lfb,
      feedback_right: rfb,
      xp,
    })

    if (reviewError) {
      setMessage('❌ Failed to submit review.')
      setSubmitting(false)
      return
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('xp')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profileData) {
      setMessage('✅ Review submitted, but failed to fetch profile XP.')
      setSubmitting(false)
      return
    }

    const currentXP = profileData.xp || 0
    const newXP = currentXP + xp

    const { error: xpUpdateError } = await supabase
      .from('profiles')
      .update({ xp: newXP })
      .eq('user_id', user.id)

    if (xpUpdateError) {
      setMessage('✅ Review submitted, but XP update failed.')
    } else {
      setMessage(`✅ Review submitted! You earned ${xp} XP 🎉`)
    }

    setSubmitting(false)
    fetchTwoPortfolios([selected.left.id, selected.right.id])
  }

  const handleSkip = () => {
    fetchTwoPortfolios(previousIds)
  }

  const hideReviewUI = message.includes('Not enough portfolios') || message.includes('Try again later') || message.includes('daily review limit')

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

        {message && <p className="mb-6 text-red-600 text-center text-sm">{message}</p>}

        {loading ? (
          <div className='flex justify-center'><Spinner /></div>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
            {selected.left && (
              <PortfolioCard
                portfolio={selected.left}
                score={scoreLeft}
                onScoreChange={(val) => {
                  setScoreLeft(val)
                  if (val < 0 || val > 10) setLeftScoreError('Score must be between 0 and 10')
                  else setLeftScoreError(null)
                }}
                feedback={leftFeedback}
                onFeedbackChange={setLeftFeedback}
                scoreError={leftScoreError}
                side="left"
              />
            )}
            {selected.right && (
              <PortfolioCard
                portfolio={selected.right}
                score={scoreRight}
                onScoreChange={(val) => {
                  setScoreRight(val)
                  if (val < 0 || val > 10) setRightScoreError('Score must be between 0 and 10')
                  else setRightScoreError(null)
                }}
                feedback={rightFeedback}
                onFeedbackChange={setRightFeedback}
                scoreError={rightScoreError}
                side="right"
              />
            )}
          </div>
        )}

        {!loading && !hideReviewUI && (
          <div className="max-w-5xl mx-auto text-center mt-8 flex justify-center gap-4">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="md:px-6 px-4 py-3 cursor-pointer bg-[#FF007F] rounded-xl font-semibold text-white hover:bg-[#e60073] transition disabled:opacity-50"
            >
              {submitting ? <div className='flex justify-center'><Spinner /></div> : 'Submit Review & Earn XP'}
            </button>
            <button
              onClick={handleSkip}
              disabled={loading}
              className="md:px-6 px-4 py-3 cursor-pointer bg-[#333] rounded-xl font-semibold text-white hover:bg-[#444] transition disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}

type PortfolioCardProps = {
  portfolio: Portfolio
  score: number | null
  onScoreChange: (score: number) => void
  feedback: string
  onFeedbackChange: (text: string) => void
  scoreError?: string | null
  side: 'left' | 'right'
}

function PortfolioCard({
  portfolio,
  score,
  onScoreChange,
  feedback,
  onFeedbackChange,
  scoreError,
  side,
}: PortfolioCardProps) {
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
      <p className="text-zinc-400 italic mb-4">Niche: {portfolio.niche}</p>

      <label className="block mb-1 font-semibold">Your Score (0–10):</label>
      <input
        type="number"
        min={0}
        max={10}
        value={score ?? ''}
        onChange={(e) => onScoreChange(Number(e.target.value))}
        className={`w-full px-3 py-2 mb-1 rounded bg-[#1c1c1c] border ${
          scoreError ? 'border-red-500' : 'border-[#333]'
        } text-white focus:outline-none focus:ring-2 ${
          scoreError ? 'focus:ring-red-500' : 'focus:ring-[#FF007F]'
        }`}
      />
      {scoreError && <p className="text-red-500 text-sm mb-3">{scoreError}</p>}

      <label className="block mb-1 font-semibold">Your Feedback:</label>
      <textarea
        rows={3}
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        className="w-full rounded bg-[#1c1c1c] border border-[#333] p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
        placeholder={`What do you think about the ${side} portfolio?`}
      />
    </motion.div>
  )
}