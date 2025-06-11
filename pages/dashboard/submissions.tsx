'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'

type Portfolio = {
  title: string
  link: string
  niche: string
  image?: string
}

const mockDatabase: Portfolio[] = []

export default function SubmitPortfolioPage() {
  const [form, setForm] = useState({
    title: '',
    link: '',
    niche: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Simulate insert into mock database
    try {
      await new Promise((res) => setTimeout(res, 1000)) // simulate network delay

      mockDatabase.push({
        title: form.title,
        link: form.link,
        niche: form.niche,
        image: form.image || undefined,
      })

      setMessage('✅ Portfolio submitted successfully!')
      setForm({ title: '', link: '', niche: '', image: '' })
    } catch (err) {
      setMessage('❌ Error submitting portfolio. Try again.')
    }

    setLoading(false)
  }

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#0a0a0a] text-white px-4 py-20 font-inter">
      <div className="max-w-xl mx-auto bg-[#111] p-8 rounded-2xl border border-white/10 shadow-xl">
        <motion.h1
          className="text-3xl font-bold mb-6 text-center text-[#00FFF7]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🚀 Submit Your Portfolio
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#1c1c1c] border border-[#333] text-white"
              placeholder="My Awesome Portfolio"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Link</label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#1c1c1c] border border-[#333] text-white"
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Niche</label>
            <input
              type="text"
              name="niche"
              value={form.niche}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#1c1c1c] border border-[#333] text-white"
              placeholder="e.g. UI Design, SaaS, Developer Portfolio"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Optional Image URL</label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#1c1c1c] border border-[#333] text-white"
              placeholder="https://image.url"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF007F] hover:bg-[#e60073] transition rounded font-semibold"
          >
            {loading ? 'Submitting...' : 'Submit Portfolio'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-zinc-300">{message}</p>
        )}
      </div>
    </main>
    </DashboardLayout>
    
  )
}
