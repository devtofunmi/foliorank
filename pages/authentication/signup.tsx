'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type SignUpParams = { email: string; password: string }
type SignUpResponse = { error: { message: string } | null }

const mockSupabase = {
  auth: {
    signUp: async ({ email, password }: SignUpParams): Promise<SignUpResponse> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!email.includes('@') || password.length < 6) {
            resolve({ error: { message: 'Invalid email or password too short' } })
          } else {
            resolve({ error: null })
          }
        }, 500)
      })
    },
  },
}

export default function SignupPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('') // new state
  const [error, setError] = useState<string>('')

  const router = useRouter()

  const handleSignup = async () => {
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const { error } = await mockSupabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push('/authentication/setup')
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">CREATE ACCOUNT</h2>

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
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <button
          onClick={handleSignup}
          className="w-full mt-3 bg-[#FF007F] py-3 rounded-full cursor-pointer font-semibold hover:bg-[#e60073]"
        >
          Sign Up
        </button>

        <p className="text-center mt-5 text-sm text-gray-400">
          Already have an account?{' '}
          <span className="hover:underline hover:text-white">
            <Link href="/authentication/login">Log In</Link>
          </span>
        </p>
      </div>
    </main>
  )
}

