'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import type { Platform, PlatformType, SoopTier, ChzzkTier } from '@/shared/types'

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export function usePlatformSettings() {
  return useQuery({
    queryKey: ['platform-settings'],
    queryFn: async (): Promise<Platform[]> => {
      const userId = await getCurrentUserId()
      if (!userId) return []

      const supabase = createClient()
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('플랫폼 설정 조회 오류:', error)
        return []
      }

      return data || []
    },
  })
}

// 주 플랫폼 (첫 번째 활성 플랫폼)
export function usePrimaryPlatform() {
  const { data: platforms = [] } = usePlatformSettings()

  const primaryPlatform = platforms[0]

  return {
    platform: primaryPlatform?.type as PlatformType | undefined,
    tier: primaryPlatform?.tier as SoopTier | ChzzkTier | undefined,
  }
}

// 특정 플랫폼의 등급 가져오기
export function usePlatformTier(platform: PlatformType | '') {
  const { data: platforms = [] } = usePlatformSettings()

  if (!platform) return undefined

  const found = platforms.find(p => p.type === platform)
  return found?.tier as SoopTier | ChzzkTier | undefined
}
