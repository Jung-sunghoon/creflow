'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/shared/components/ui/card'
import { ThemeToggle, LoadingSpinner } from '@/shared/components/common'
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
        <LoadingSpinner />
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

        {/* 테마 설정 */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">테마</h2>
          <Card className="p-4 bg-card border-0 shadow-sm">
            <ThemeToggle />
          </Card>
        </div>

        {/* 협력자 관리 */}
        <CollaboratorSettings />

        {/* 피드백 */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">피드백</h2>
          <Card className="p-4 bg-card border-0 shadow-sm">
            <FeedbackForm />
          </Card>
        </div>

        {/* 후원 */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">개발자 후원</h2>
          <Card className="p-4 bg-card border-0 shadow-sm">
            <p className="text-sm text-muted-foreground mb-3">
              CreFlow가 도움이 되셨다면 커피 한 잔 사주세요 ☕
            </p>
            <a
              href="https://qr.kakaopay.com/Ej87OcN6N"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FEE500] text-[#191919] text-sm font-medium rounded-lg hover:bg-[#FDD800] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.82 5.31 4.53 6.71L5.71 21l4.08-2.12c.72.12 1.46.12 2.21.12 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
              </svg>
              카카오페이로 후원하기
            </a>
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
