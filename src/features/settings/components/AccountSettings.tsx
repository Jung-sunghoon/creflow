'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { createClient } from '@/shared/lib/supabase/client'
import { toast } from 'sonner'

interface AccountSettingsProps {
  user: {
    email?: string
    name?: string | null
    avatar_url?: string | null
  }
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('로그아웃되었습니다')
    router.push('/login')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">계정</h2>

      <Card className="p-4 bg-card border-0 shadow-sm">
        <div className="flex items-center gap-3">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name || '프로필'}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
          )}
          <div>
            <p className="font-medium">{user.name || '사용자'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        로그아웃
      </Button>
    </div>
  )
}
