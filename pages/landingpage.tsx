'use client'

import AvatarCard from '@/components/AvatarCard'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const faqItems = [
  {
    question: 'How do I earn XP?',
    answer:
      'You earn XP by submitting reviews of portfolios. Each review you submit grants XP based on the quality and frequency of your feedback.',
  },
  {
    question: 'What is the ranking system?',
    answer:
      'Your XP determines your rank on the leaderboard. Higher ranks unlock badges and recognition among the community.',
  },
  {
    question: 'How are portfolios reviewed?',
    answer:
      'Portfolios are reviewed by other users who score and leave feedback. This helps you improve and gain XP.',
  },
  {
    question: 'Can I submit multiple portfolios?',
    answer:
      'Yes! You can submit as many portfolios as you want and get feedback on all of them.',
  },
]

export default function LandingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Smooth scroll on mount
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-inter">
      {/* Hero Section */}
      <section className="py-28 px-6 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-[#00FFF7]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Rank Up Your Portfolio
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Submit your portfolio, get real reviews, earn XP, and climb the leaderboard.
          It’s like a game for your growth.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/authentication/signup">
            <button className="px-6 py-3 cursor-pointer rounded-xl font-semibold bg-[#FF007F] hover:bg-[#e60073] transition duration-300 text-white shadow-md">
              🚀 Join FolioRank
            </button>
          </Link>
          <a href="#how-it-works">
            <button className="px-6 py-3 cursor-pointer rounded-xl font-semibold border border-cyan-300 text-cyan-300 hover:bg-cyan-300/10 transition duration-300">
              See How It Works
            </button>
          </a>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#111111] px-6 scroll-mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-[#00FFF7]">
          How It Works
        </h2>
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {[
            ['📝', 'Submit Your Portfolio', 'Add your title, link, and niche.'],
            ['👀', 'Get Reviewed', 'Receive honest and helpful feedback.'],
            ['⚡', 'Earn XP & Rank Up', 'Good reviews = XP and better ranks.'],
            ['🏆', 'Climb Leaderboards', 'Compete to be the top creator.'],
          ].map(([emoji, title, desc], i) => (
            <motion.div
              key={i}
              className="bg-[#1a1a1a] p-6 rounded-2xl shadow-md text-center border border-[#333]"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="text-lg font-semibold mb-2 text-[#FF007F]">{title}</h3>
              <p className="text-zinc-400 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 mt-10 max-w-4xl mx-auto bg-[#111111] rounded-xl border border-[#222] shadow-lg mb-20">
        <h2 className="text-3xl font-bold text-[#00FFF7] mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map(({ question, answer }, index) => (
            <div key={index} className="border border-[#333] rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-white hover:bg-[#222] rounded-lg"
              >
                <span>{question}</span>
                <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
              </button>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={openIndex === index ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden px-4 pb-4 text-zinc-400"
              >
                <p>{answer}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Avatar Card Preview Section */}
      <section className="py-20 px-6 bg-[#111111] text-center">
        <h2 className="text-3xl font-bold text-white mb-12">Top Creators</h2>

        <motion.div
          className="flex flex-wrap gap-6 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          <AvatarCard
            avatarUrl="https://api.dicebear.com/7.x/adventurer/svg?seed=Ace&backgroundType=gradientLinear&backgroundColor=ff007f,00fff7"
            username="AceBuilder"
            rank="🥇 Gold"
            xp={520}
            level={4}
            maxXP={700}
          />
          <AvatarCard
            avatarUrl="https://api.dicebear.com/7.x/adventurer/svg?seed=Nova&backgroundType=gradientLinear&backgroundColor=ff007f,00fff7"
            username="NovaCode"
            rank="🥈 Silver"
            xp={310}
            level={3}
            maxXP={400}
          />
          <AvatarCard
            avatarUrl="https://api.dicebear.com/7.x/adventurer/svg?seed=Echo&backgroundType=gradientLinear&backgroundColor=ff007f,00fff7"
            username="EchoDev"
            rank="🥉 Bronze"
            xp={120}
            level={2}
            maxXP={200}
          />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 font-bold text-center bg-gradient-to-r from-[#1A1AFF] via-[#FF007F] to-[#00FFF7] text-black">
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          Ready to level up your portfolio?
        </motion.h2>
        <p className="text-lg mb-8 font-bold text-black/70">
          Get feedback, earn XP, and rise to the top.
        </p>
        <Link href="/authentication/signup">
          <button className="px-6 py-3 cursor-pointer rounded-xl font-semibold bg-black hover:bg-zinc-900 text-white transition duration-300">
            🚀 Get Started Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-sm text-zinc-500 text-center py-10 bg-[#0a0a0a]">
        © {new Date().getFullYear()} FolioRank. Built with 💜 by creator for creators.
      </footer>
    </main>
  )
}