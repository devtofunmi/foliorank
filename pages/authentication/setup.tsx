'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Spinner from '@/components/Spinner'

const avatarSeeds = ['froggy', 'Ryker', 'rocket', 'paws', 'zappy', 'Easton', 'lunar', 'storm']
const avatarUrls = avatarSeeds.map(
  (seed) =>
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=ff007f,00fff7`
)

export default function SetupPage() {
  const [username, setUsername] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatarUrls[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const randomizeAvatar = () => {
    const random = avatarUrls[Math.floor(Math.random() * avatarUrls.length)]
    setSelectedAvatar(random)
  }

  const saveProfile = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    // 1. Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user?.id) {
      setError('Unable to fetch user info')
      setLoading(false)
      return
    }

    const userId = userData.user.id

    // 2. Optional: Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingProfile) {
      setError('Profile already exists. Redirecting...')
      setTimeout(() => router.push('/dashboard/dashboard'), 1500)
      return
    }

    // 3. Insert profile
    const { error: insertError } = await supabase.from('profiles').insert({
      user_id: userId,
      username,
      avatar_url: selectedAvatar,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      setSuccess('Profile saved! Redirecting...')
      setTimeout(() => router.push('/dashboard/dashboard'), 1500)
    }
  }

  const isDisabled = username.trim().length < 3 || loading

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">SET UP YOUR PROFILE</h2>

        <img
          src={selectedAvatar}
          alt="Selected Avatar"
          className="w-24 h-24 mx-auto rounded-full border border-white/20 mb-4"
        />

        <button
          onClick={randomizeAvatar}
          className="text-sm cursor-pointer text-[#00FFF7] hover:underline mb-4"
        >
          🎲 Randomize Avatar
        </button>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {avatarUrls.map((url, index) => {
            const isSelected = selectedAvatar === url
            return (
              <motion.button
                key={index}
                onClick={() => setSelectedAvatar(url)}
                className={`relative w-12 h-12 rounded-full border-2 cursor-pointer transition duration-200 ${
                  isSelected ? 'border-[#00FFF7]' : 'border-transparent'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <img
                  src={url}
                  alt={`Avatar ${index}`}
                  className="w-full h-full rounded-full object-cover"
                />
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-black p-[2px] rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle size={14} className="text-[#00FFF7]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        <input
          type="text"
          placeholder="Pick a username"
          className="w-full text-center rounded-full mb-4 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        <button
          onClick={saveProfile}
          disabled={isDisabled}
          className={`w-full mt-3 py-3 rounded-full font-semibold transition ${
            isDisabled
              ? 'bg-[#555] cursor-not-allowed'
              : 'bg-[#FF007F] hover:bg-[#e60073] cursor-pointer'
          }`}
        >
          {loading ? <div className='flex justify-center'><Spinner /></div>: 'Save & Continue'}
        </button>
      </div>
    </main>
  )
}