'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
  getCampaigns,
  updateCampaignStatus,
} from '../api/income'
import type { IncomeFormData } from '@/shared/types'

// 현재 로그인한 사용자 ID 가져오기
async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export function useIncomes(month?: string) {
  return useQuery({
    queryKey: ['incomes', month],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      if (!userId) return []
      return getIncomes(userId, month)
    },
  })
}

export function useCampaigns(month?: string) {
  return useQuery({
    queryKey: ['campaigns', month],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      if (!userId) return []
      return getCampaigns(userId, month)
    },
  })
}

export function useCreateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IncomeFormData) => {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('로그인이 필요합니다')
      return createIncome(userId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useUpdateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IncomeFormData> }) =>
      updateIncome(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
    },
  })
}

export function useDeleteIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
    },
  })
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPaid }: { id: string; isPaid: boolean }) =>
      updateCampaignStatus(id, isPaid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
