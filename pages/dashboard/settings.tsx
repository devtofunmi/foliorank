'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'

type UserSettings = {
  name: string
  email: string
  theme: 'light' | 'dark'
  notificationsEnabled: boolean
}

const mockSettings: UserSettings = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  theme: 'dark',
  notificationsEnabled: true,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setSettings(mockSettings)
    }, 400)
  }, [])

  if (!settings) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-inter">
        <p>Loading settings...</p>
      </main>
    )
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
          }
        : prev
    )
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setPassword((prev) => ({ ...prev, [name]: value }))
  }

  function handleSaveSettings() {
    // Validate password change fields
    if (password.newPass !== password.confirm) {
      setMessage('New password and confirmation do not match.')
      return
    }
    // Here you would normally send updated data to your backend
    setMessage('✅ Settings saved successfully!')
    setPassword({ current: '', newPass: '', confirm: '' })
  }

  return (
    <DashboardLayout>
        <main className="min-h-screen bg-[#0a0a0a] text-white font-inter px-6 py-12 max-w-4xl mx-auto">
      <motion.h1
        className="text-4xl font-extrabold text-[#00FFF7] mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Settings
      </motion.h1>

      {message && (
        <p className="mb-6 text-center text-sm text-green-400 dark:text-green-300">{message}</p>
      )}

      <section className="mb-12 bg-[#111111] p-6 rounded-xl border border-[#222] shadow-md">
        <h2 className="text-2xl font-semibold mb-4 border-b border-[#333] pb-2">Profile Info</h2>
        <label className="block mb-3">
          <span className="text-sm font-semibold mb-1 block">Name</span>
          <input
            type="text"
            name="name"
            value={settings.name}
            onChange={handleInputChange}
            className="w-full rounded bg-[#1c1c1c] border border-[#333] p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold mb-1 block">Email</span>
          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleInputChange}
            className="w-full rounded bg-[#1c1c1c] border border-[#333] p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
          />
        </label>
      </section>

      <section className="mb-12 bg-[#111111] p-6 rounded-xl border border-[#222] shadow-md">
        <h2 className="text-2xl font-semibold mb-4 border-b border-[#333] pb-2">Change Password</h2>
        <label className="block mb-3">
          <span className="text-sm font-semibold mb-1 block">Current Password</span>
          <input
            type="password"
            name="current"
            value={password.current}
            onChange={handlePasswordChange}
            className="w-full rounded bg-[#1c1c1c] border border-[#333] p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
            placeholder="••••••••"
          />
        </label>
        <label className="block mb-3">
          <span className="text-sm font-semibold mb-1 block">New Password</span>
          <input
            type="password"
            name="newPass"
            value={password.newPass}
            onChange={handlePasswordChange}
            className="w-full rounded bg-[#1c1c1c] border border-[#333] p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
            placeholder="••••••••"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold mb-1 block">Confirm New Password</span>
          <input
            type="password"
            name="confirm"
            value={password.confirm}
            onChange={handlePasswordChange}
            className="w-full rounded bg-[#1c1c1c] border border-[#333] p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
            placeholder="••••••••"
          />
        </label>
      </section>

      <section className="mb-12 bg-[#111111] p-6 rounded-xl border border-[#222] shadow-md">
        <h2 className="text-2xl font-semibold mb-4 border-b border-[#333] pb-2">Preferences</h2>
        <div className="flex flex-col gap-6">
          {/* Theme selection */}
          <div>
            <label className="font-semibold block mb-1">Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleInputChange}
              className="w-full rounded bg-[#1c1c1c] border border-[#333] p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          {/* Notifications toggle */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="notifications"
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={handleInputChange}
              className="w-5 h-5 rounded bg-[#1c1c1c] border border-[#333] accent-[#FF007F]"
            />
            <label htmlFor="notifications" className="font-semibold select-none">
              Enable Notifications
            </label>
          </div>
        </div>
      </section>

      <div className="text-center">
        <button
          onClick={handleSaveSettings}
          className="px-10 py-3 bg-[#FF007F] rounded-xl font-semibold text-white hover:bg-[#e60073] transition"
        >
          Save Settings
        </button>
      </div>
    </main>
    </DashboardLayout>
    
  )
}
