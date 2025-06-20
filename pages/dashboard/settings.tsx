'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Spinner from '@/components/Spinner'

type UserSettings = {
  name: string
  email: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
      const user = sessionData?.user
      if (!user) return

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError.message)
        return
      }

      setSettings({
        name: profile.username,
        email: user.email ?? '',
      })
    }

    fetchSettings()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPassword((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setError('')
    setMessage('')

    if (!settings) return

    // Update name in profiles table
    const { data: sessionData } = await supabase.auth.getUser()
    const user = sessionData?.user
    if (!user) return

    if (settings.name) {
      await supabase
        .from('profiles')
        .update({ username: settings.name })
        .eq('user_id', user.id)
    }

    //  Handle password update
    if (password.newPass) {
      if (password.newPass !== password.confirm) {
        setError('❌ Passwords do not match.')
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: settings.email,
        password: password.current,
      })

      if (signInError) {
        setError('❌ Incorrect current password.')
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password.newPass,
      })

      if (updateError) {
        setError('Failed to update password.')
        return
      }
    }

    setMessage('Settings updated successfully!')
    setPassword({ current: '', newPass: '', confirm: '' })
  }

  if (!settings) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-inter">
        <div className='flex justify-center'><Spinner /></div>
      </main>
    )
  }

  return (
    <DashboardLayout>
      <main className="bg-[#0a0a0a] text-white flex items-center justify-center font-inter">
        <div className="w-full max-w-md p-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-6 text-center text-[#00FFF7]"
          >
            Update Your Settings
          </motion.h1>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={settings.name}
            onChange={handleInputChange}
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={settings.email}
            disabled
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-zinc-500 cursor-not-allowed"
          />

          <input
            type="password"
            name="current"
            placeholder="Current Password"
            value={password.current}
            onChange={handlePasswordChange}
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
          />

          <input
            type="password"
            name="newPass"
            placeholder="New Password"
            value={password.newPass}
            onChange={handlePasswordChange}
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirm New Password"
            value={password.confirm}
            onChange={handlePasswordChange}
            className="w-full mt-3 text-center rounded-full mb-3 px-4 py-4 bg-[#1c1c1c] border border-[#333] text-white"
          />

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          {message && <p className="text-green-400 text-sm mb-3 text-center">{message}</p>}

          <button
            onClick={handleSave}
            className="w-full mt-3 bg-[#FF007F] py-3 rounded-full cursor-pointer font-semibold hover:bg-[#e60073] transition"
          >
            Save Changes
          </button>
        </div>
      </main>
    </DashboardLayout>
  )
}