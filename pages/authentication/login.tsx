'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type LoginParams = { email: string; password: string }
type LoginResponse = { error: { message: string } | null }

const mockSupabase = {
  auth: {
    signInWithPassword: async ({ email, password }: LoginParams): Promise<LoginResponse> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (email === 'test@gmail.com' && password === 'password') {
            resolve({ error: null })
          } else {
            resolve({ error: { message: 'Invalid credentials' } })
          }
        }, 500)
      })
    },
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await mockSupabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">FolioRank</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full mt-3 bg-[#FF007F] py-3 rounded-full cursor-pointer font-semibold hover:bg-[#e60073]"
        >
          Log In
        </button>

        <p className="text-center mt-5 text-sm text-gray-400">
          Don't have an account?{' '}
          <span className="hover:underline hover:text-white">
            <Link href="/authentication/signup">Sign Up</Link>
          </span>
        </p>
      </div>
    </main>
  )
}
