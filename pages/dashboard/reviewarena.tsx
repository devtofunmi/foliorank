'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'

type Portfolio = {
  id: number
  title: string
  link: string
  niche: string
  image?: string | null
}

// Mock portfolio data
const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 1,
    title: 'Creative Minds',
    link: 'https://creativeminds.dev',
    niche: 'Design Agency',
    image: 'https://placehold.co/600x400/png?text=Creative+Minds',
  },
  {
    id: 2,
    title: 'Techie Blog',
    link: 'https://techieblog.com',
    niche: 'Tech Blog',
    image: null,
  },
  {
    id: 3,
    title: 'ShopSmart',
    link: 'https://shopsmart.io',
    niche: 'E-commerce',
    image: 'https://placehold.co/600x400/png?text=ShopSmart',
  },
  {
    id: 4,
    title: 'Fitness Pro',
    link: 'https://fitnesspro.app',
    niche: 'Health & Fitness',
    image: null,
  },
  {
    id: 5,
    title: 'Travel Tales',
    link: 'https://traveltales.co',
    niche: 'Travel Blog',
    image: 'https://placehold.co/600x400/png?text=Travel+Tales',
  },
]

export default function ReviewArenaPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(MOCK_PORTFOLIOS)
  const [selected, setSelected] = useState<{ left?: Portfolio; right?: Portfolio }>({})
  const [scoreLeft, setScoreLeft] = useState<number | null>(null)
  const [scoreRight, setScoreRight] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // Pick two random distinct portfolios from mock data
  function fetchTwoPortfolios() {
    if (MOCK_PORTFOLIOS.length < 2) {
      setMessage('Not enough portfolios to review.')
      return
    }
    let leftIndex = Math.floor(Math.random() * MOCK_PORTFOLIOS.length)
    let rightIndex = Math.floor(Math.random() * MOCK_PORTFOLIOS.length)

    // Ensure distinct portfolios
    while (rightIndex === leftIndex) {
      rightIndex = Math.floor(Math.random() * MOCK_PORTFOLIOS.length)
    }

    setSelected({
      left: MOCK_PORTFOLIOS[leftIndex],
      right: MOCK_PORTFOLIOS[rightIndex],
    })
    setScoreLeft(null)
    setScoreRight(null)
    setFeedback('')
    setMessage('')
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

    // Simulate async submission delay
    await new Promise((r) => setTimeout(r, 1000))

    // Here, instead of inserting into DB, just show success message
    setMessage('✅ Review submitted! XP earned 🎉')
    setSubmitting(false)

    // Load new portfolios to review
    fetchTwoPortfolios()
  }

  return (
    <DashboardLayout>
        <main className="min-h-screen bg-[#0a0a0a] text-white font-inter px-4 py-12">
      <motion.h1
        className="text-center text-4xl font-extrabold text-[#00FFF7] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚔️ Review Arena
      </motion.h1>

      {message && (
        <p className="mb-6 text-center text-sm text-zinc-400">{message}</p>
      )}

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Portfolio */}
        {selected.left && (
          <PortfolioCard
            portfolio={selected.left}
            score={scoreLeft}
            onScoreChange={setScoreLeft}
            side="left"
          />
        )}

        {/* Right Portfolio */}
        {selected.right && (
          <PortfolioCard
            portfolio={selected.right}
            score={scoreRight}
            onScoreChange={setScoreRight}
            side="right"
          />
        )}
      </div>

      {/* Feedback */}
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

      <div className="max-w-5xl mx-auto text-center mt-8">
        <button
          onClick={handleSubmitReview}
          disabled={submitting}
          className="px-8 py-3 bg-[#FF007F] rounded-xl font-semibold text-white hover:bg-[#e60073] transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review & Earn XP'}
        </button>
      </div>
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

function PortfolioCard({ portfolio, score, onScoreChange, side }: PortfolioCardProps) {
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

      {/* Score input */}
      <label className="block mb-1 font-semibold">Your Score (0-10):</label>
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
