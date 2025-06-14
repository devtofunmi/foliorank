'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const isDisabled = email.trim() === '' || password.trim() === '' || loading

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
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
          disabled={isDisabled}
          className={`w-full mt-3 py-3 rounded-full font-semibold transition ${
            isDisabled
              ? 'bg-[#555] cursor-not-allowed'
              : 'bg-[#FF007F] hover:bg-[#e60073] cursor-pointer'
          }`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-center mt-5 text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/authentication/signup" className="hover:underline hover:text-white">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  )
}
