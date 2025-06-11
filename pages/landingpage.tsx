'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LandingPage() {
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
          🎮 Rank Up Your Portfolio
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
          <Link href="/dashboard">
            <button className="px-6 py-3 cursor-pointer rounded-xl font-semibold bg-[#FF007F] hover:bg-[#e60073] transition duration-300 text-white shadow-md">
              🚀 Join FolioRank
            </button>
          </Link>
          <Link href="#how-it-works">
            <button className="px-6 py-3 cursor-pointer rounded-xl font-semibold border border-cyan-300 text-cyan-300 hover:bg-cyan-300/10 transition duration-300">
              See How It Works
            </button>
          </Link>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#111111] px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-[#00FFF7]">How It Works</h2>
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
              transition={{ duration: 0.4, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="text-lg font-semibold mb-2 text-[#FF007F]">{title}</h3>
              <p className="text-zinc-400 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 font-bold text-center bg-gradient-to-r from-[#1A1AFF] via-[#FF007F] to-[#00FFF7] text-black">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to level up your portfolio?
        </motion.h2>
        <p className="text-lg mb-8 font-bold text-black/70">Get feedback, earn XP, and rise to the top.</p>
        <Link href="/dashboard">
          <button className="px-6 py-3 cursor-pointer rounded-xl font-semibold bg-black hover:bg-zinc-900 text-white transition duration-300">
            🚀 Get Started Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-sm text-zinc-500 text-center py-10 bg-[#0a0a0a]">
        © {new Date().getFullYear()} FolioRank. Built with 💜 by creators for creators.
      </footer>
    </main>
  )
}

