'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import Spinner from '@/components/Spinner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SubmitPortfolioPage() {
  const [title, setTitle] = useState<string>('')
  const [link, setLink] = useState<string>('')
  const [niche, setNiche] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const router = useRouter()

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'users_avater')

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/drirsnp0c/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Upload failed')
      }

      const data = await response.json()
      return data.secure_url as string
    } catch (error) {
      console.error('Upload to Cloudinary failed.', error)
      throw error
    }
  }

  const isDisabled =
    title.trim() === '' || link.trim() === '' || niche.trim() === '' || loading

  const validateUrl = (url: string): boolean => {
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

    if (!title.trim()) return setError('Title is required')
    if (!link.trim() || !validateUrl(link.trim()))
      return setError('Please enter a valid URL for the link')
    if (!niche.trim()) return setError('Niche is required')
    if (image && !validateUrl(image))
      return setError('Uploaded image URL is invalid')

    setLoading(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError('Unable to fetch user info.')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase.from('portfolios').insert({
        user_id: user.id,
        title: title.trim(),
        link: link.trim(),
        niche: niche.trim(),
        image: image || null,
      })

      if (insertError) {
        setError('Error saving portfolio. Please try again.')
      } else {
        setSuccessMessage('✅ Portfolio submitted successfully!')
        setTitle('')
        setLink('')
        setNiche('')
        setImage('')
      }
    } catch (err) {
      setError('❌ Something went wrong. Try again.')
    }

    setLoading(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    setSuccessMessage('')
    try {
      const imageUrl = await uploadToCloudinary(file)
      setImage(imageUrl)
      setSuccessMessage('✅ Image uploaded successfully!')
    } catch {
      setError('❌ Image upload failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <main className="bg-[#0a0a0a] text-white flex items-center justify-center px-4 font-inter">
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

          {/* Image Drop Area */}
          <div className="w-full mt-3 mb-3">
            <label
              htmlFor="image-upload"
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`block w-full rounded-2xl px-4 py-6 border-2 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-[#00FFF7] bg-[#1c1c1c]'
                  : 'border-[#333] bg-[#1c1c1c]'
              }`}
            >
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-xl mx-auto"
                />
              ) : (
                <p className="text-sm text-white">
                  Drag & drop an image here or{' '}
                  <span className="underline text-[#00FFF7]">
                    click to select
                  </span>
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setLoading(true)
                  try {
                    const imageUrl = await uploadToCloudinary(file)
                    setImage(imageUrl)
                    setSuccessMessage('✅ Image uploaded successfully!')
                  } catch {
                    setError('❌ Image upload failed.')
                  } finally {
                    setLoading(false)
                  }
                }}
              />
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}
          {successMessage && (
            <p className="text-green-400 text-sm mb-3 text-center">
              {successMessage}
            </p>
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
            {loading ? <div className='flex justify-center'><Spinner /></div> : 'Submit Portfolio'}
          </button>
        </div>
      </main>
    </DashboardLayout>
  )
}