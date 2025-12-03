'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import { getAnnualReport, getMonthlySummaries } from '../api/report'

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export function useAnnualReport(year: number) {
  return useQuery({
    queryKey: ['annual-report', year],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      if (!userId) return null
      return getAnnualReport(userId, year)
    },
  })
}

export function useMonthlySummaries(year: number) {
  return useQuery({
    queryKey: ['monthly-summaries', year],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      if (!userId) return []
      return getMonthlySummaries(userId, year)
    },
  })
}
