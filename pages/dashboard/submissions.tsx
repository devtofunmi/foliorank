'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

type Portfolio = {
  title: string
  link: string
  niche: string
  image?: string
}

const mockDatabase: Portfolio[] = []

export default function SubmitPortfolioPage() {
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [niche, setNiche] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const isDisabled = title.trim() === '' || link.trim() === '' || niche.trim() === '' || image.trim() === '' || loading


  const router = useRouter()

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    setError('')
    setSuccessMessage('')

    // Basic validations
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!link.trim() || !validateUrl(link.trim())) {
      setError('Please enter a valid URL for the link')
      return
    }
    if (!niche.trim()) {
      setError('Niche is required')
      return
    }
    if (image.trim() && !validateUrl(image.trim())) {
      setError('Optional image URL is invalid')
      return
    }

    setLoading(true)

    try {
      // Simulate API delay
      await new Promise((res) => setTimeout(res, 1000))

      // Insert into mock DB
      mockDatabase.push({
        title: title.trim(),
        link: link.trim(),
        niche: niche.trim(),
        image: image.trim() || undefined,
      })

      setSuccessMessage('✅ Portfolio submitted successfully!')
      setTitle('')
      setLink('')
      setNiche('')
      setImage('')

      // Optionally navigate to dashboard or other page after submission
      // router.push('/dashboard')
    } catch (err) {
      setError('❌ Error submitting portfolio. Please try again.')
    }

    setLoading(false)
  }

  return (
    <DashboardLayout>
      <main className=" bg-[#0a0a0a] text-white flex items-center justify-center px-4  font-inter">
        <div className="w-full max-w-md">
          <h1 className="md:text-3xl text-2xl font-bold mb-6 text-center text-[#00FFF7]">
            🚀 Submit Your Portfolio
          </h1>

          <input
            type="text"
            placeholder="Title"
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="url"
            placeholder="Link (https://yourportfolio.com)"
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <input
            type="text"
            placeholder="Niche (e.g. UI Design, SaaS)"
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          />

          <input
            type="url"
            placeholder="Optional Image URL"
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-400 text-sm mb-3 text-center">{successMessage}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`w-full mt-3 py-3 rounded-full font-semibold transition ${
            isDisabled
              ? 'bg-[#555] cursor-not-allowed'
              : 'bg-[#FF007F] hover:bg-[#e60073] cursor-pointer'
          }`}
          >
            {loading ? 'Submitting...' : 'Submit Portfolio'}
          </button>
        </div>
      </main>
    </DashboardLayout>
  )
}

