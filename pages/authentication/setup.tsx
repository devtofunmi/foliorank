'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

// Mock Supabase logic
type User = { id: string }
type MockAuthResponse = { data: { user: User | null } }
type MockInsertResponse = { error: { message: string } | null }

const mockSupabase = {
  auth: {
    getUser: async (): Promise<MockAuthResponse> => {
      return new Promise((resolve) =>
        setTimeout(() => resolve({ data: { user: { id: 'mock-user-id' } } }), 300)
      )
    },
  },
  from: (_: string) => ({
    insert: async (_: Record<string, any>): Promise<MockInsertResponse> => {
      return new Promise((resolve) =>
        setTimeout(() => resolve({ error: null }), 500)
      )
    },
  }),
}

const avatarSeeds = ['froggy', 'jelly', 'rocket', 'paws', 'zappy', 'blink', 'lunar', 'storm']
const avatarUrls = avatarSeeds.map(
  (seed) =>
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=ff007f,00fff7`
)

export default function SetupPage() {
  const [username, setUsername] = useState<string>('')
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatarUrls[0])
  const router = useRouter()

  const randomizeAvatar = () => {
    const random = avatarUrls[Math.floor(Math.random() * avatarUrls.length)]
    setSelectedAvatar(random)
  }

  const saveProfile = async () => {
    const {
      data: { user },
    } = await mockSupabase.auth.getUser()

    if (!user) return

    const { error } = await mockSupabase.from('profiles').insert({
      user_id: user.id,
      username,
      avatar_url: selectedAvatar,
    })

    if (!error) {
      router.push('/dashboard/dashboard')
    }
  }

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

        <button
          onClick={saveProfile}
          className="w-full mt-3 bg-[#FF007F] py-3 rounded-full cursor-pointer font-semibold hover:bg-[#e60073]"
        >
          Save & Continue
        </button>
      </div>
    </main>
  )
}