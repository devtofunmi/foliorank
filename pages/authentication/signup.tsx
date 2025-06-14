'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff } from 'lucide-react'

function isValidEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email)
}

function isStrongPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/.test(password)
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const allValid =
    isValidEmail(email) &&
    isStrongPassword(password) &&
    password === confirmPassword

  const handleSignup = async () => {
    setError('')
    setSuccess('')

    if (!allValid) return

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Signup successful! Redirecting...')
      setTimeout(() => router.push('/authentication/setup'), 1500)
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
          aria-label="Email"
        />
        {!isValidEmail(email) && email && (
          <p className="text-sm text-red-500 text-center -mt-2 mb-2">
            Please enter a valid email.
          </p>
        )}

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[50%] -translate-y-1/2 cursor-pointer text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {!isStrongPassword(password) && password && (
          <p className="text-sm text-yellow-500 text-center -mt-2 mb-2">
            Password must be 8+ chars, include uppercase, number & special symbol.
          </p>
        )}

        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-label="Confirm Password"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-[50%] -translate-y-1/2 cursor-pointer text-gray-400"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {confirmPassword && confirmPassword !== password && (
          <p className="text-sm text-red-500 text-center -mt-2 mb-2">
            Passwords do not match.
          </p>
        )}

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3 text-center">{success}</p>}

        <button
          onClick={handleSignup}
          disabled={!allValid || loading}
          className={`w-full mt-3 py-3 rounded-full font-semibold transition ${
            !allValid || loading
              ? 'bg-[#555] cursor-not-allowed'
              : 'bg-[#FF007F] hover:bg-[#e60073] cursor-pointer'
          }`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
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