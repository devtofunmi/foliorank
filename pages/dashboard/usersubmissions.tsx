'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

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
  const [userId, setUserId] = useState<string | null>(null)

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

      setUserId(user.id)

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

  if (loading) {
    return (
      <div className="text-white min-h-screen flex justify-center items-center bg-black">
        Loading your portfolios...
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
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}