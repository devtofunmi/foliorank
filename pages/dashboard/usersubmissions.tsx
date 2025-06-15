'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

type Submission = {
  id: number
  title: string
  description: string
  created_at: string
}

export default function UserSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchSubmissions = async () => {
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
        .from('submissions')
        .select('id, title, description, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setSubmissions(data)
      }

      setLoading(false)
    }

    fetchSubmissions()
  }, [router])

  if (loading) {
    return (
      <div className="text-white min-h-screen flex justify-center items-center bg-black">
        Loading your submissions...
      </div>
    )
  }

  return (
    <DashboardLayout>
    <div className="text-white min-h-screen px-4 bg-[#0a0a0a]">
        <h1 className="md:text-3xl text-2xl font-bold mb-6 text-center text-[#00FFF7]">
          My Submissions
        </h1>
      {submissions.length === 0 ? (
        <div className="text-gray-400 text-center mt-20">
          You haven’t submitted any project yet.
          <p className="mt-3">When you do, it’ll appear here 🚀</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 border border-[#2a2a2a] bg-[#111] rounded-lg"
            >
              <h3 className="text-lg font-semibold">{submission.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{submission.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Submitted on {new Date(submission.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    </DashboardLayout>
   
  )
}
