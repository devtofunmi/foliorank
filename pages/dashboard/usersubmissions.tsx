'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Spinner from '@/components/Spinner'

type Portfolio = {
  id: number
  title: string
  link: string
  niche: string
  image?: string | null
  created_at: string
}

export default function UserPortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<{ title: string; link: string; niche: string }>({
    title: '',
    link: '',
    niche: '',
  })

  const router = useRouter()

  useEffect(() => {
    const fetchPortfolios = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/authentication/login')
        return
      }

      const { data, error } = await supabase
        .from('portfolios')
        .select('id, title, link, niche, image, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPortfolios(data)
      }

      setLoading(false)
    }

    fetchPortfolios()
  }, [router])

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this portfolio?')
    if (!confirm) return

    const { error } = await supabase.from('portfolios').delete().eq('id', id)

    if (!error) {
      setPortfolios((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleEdit = (portfolio: Portfolio) => {
    setEditingId(portfolio.id)
    setEditData({
      title: portfolio.title,
      link: portfolio.link,
      niche: portfolio.niche,
    })
  }

  const handleEditChange = (field: keyof typeof editData, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdate = async (id: number) => {
    const { error } = await supabase
      .from('portfolios')
      .update({
        title: editData.title.trim(),
        link: editData.link.trim(),
        niche: editData.niche.trim(),
      })
      .eq('id', id)

    if (!error) {
      setPortfolios((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...editData } : p))
      )
      setEditingId(null)
    }
  }

  if (loading) {
    return (
      <div className="text-white min-h-screen flex justify-center items-center bg-black">
       <div className='flex justify-center'><Spinner /></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="text-white min-h-screen px-4 bg-[#0a0a0a]">
        <h1 className="md:text-3xl text-2xl font-bold mb-6 text-center text-[#00FFF7]">
          My Portfolios
        </h1>
        {portfolios.length === 0 ? (
          <div className="text-gray-400 text-center mt-20">
            You haven’t submitted any portfolio yet.
            <p className="mt-3">When you do, it’ll appear here 🚀</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="p-4 border border-[#2a2a2a] bg-[#111] rounded-lg"
              >
                {editingId === portfolio.id ? (
                  <>
                    <input
                      value={editData.title}
                      onChange={(e) => handleEditChange('title', e.target.value)}
                      className="w-full p-2 rounded bg-[#1c1c1c] border border-[#333] text-white mb-2"
                    />
                    <input
                      value={editData.link}
                      onChange={(e) => handleEditChange('link', e.target.value)}
                      className="w-full p-2 rounded bg-[#1c1c1c] border border-[#333] text-white mb-2"
                    />
                    <input
                      value={editData.niche}
                      onChange={(e) => handleEditChange('niche', e.target.value)}
                      className="w-full p-2 rounded bg-[#1c1c1c] border border-[#333] text-white mb-2"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleUpdate(portfolio.id)}
                        className="bg-green-600 cursor-pointer hover:bg-green-700 px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-600 cursor-pointer hover:bg-gray-700 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{portfolio.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{portfolio.niche}</p>
                    <a
                      href={portfolio.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#00FFF7] underline block mt-2"
                    >
                      Visit Project ↗
                    </a>
                    {portfolio.image && (
                      <img
                        src={portfolio.image}
                        alt={portfolio.title}
                        className="w-full max-h-48 object-cover rounded mt-4"
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted on {new Date(portfolio.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleEdit(portfolio)}
                        className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(portfolio.id)}
                        className="bg-red-600 cursor-pointer hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}