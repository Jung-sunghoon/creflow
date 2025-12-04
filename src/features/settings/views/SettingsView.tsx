'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/shared/components/ui/card'
import { AccountSettings } from '../components/AccountSettings'
import { CollaboratorSettings } from '../components/CollaboratorSettings'
import { FeedbackForm } from '../components/FeedbackForm'
import { createClient } from '@/shared/lib/supabase/client'

interface UserInfo {
  email?: string
  name?: string | null
  avatar_url?: string | null
}

export function SettingsView() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser({
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
        })
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background" aria-label="설정">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold">설정</h1>
        </div>
      </div>

      {/* 설정 섹션 */}
      <div className="px-4 py-6 space-y-8">
        {/* 계정 */}
        {user && <AccountSettings user={user} />}

        {/* 협력자 관리 */}
        <CollaboratorSettings />

        {/* 피드백 */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">피드백</h2>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <FeedbackForm />
          </Card>
        </div>

        {/* 앱 정보 */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>CreFlow v1.0.0</p>
          <p className="mt-1">크리에이터의 진짜 수익을 3초 만에</p>
        </div>
      </div>
    </main>
  )
}
