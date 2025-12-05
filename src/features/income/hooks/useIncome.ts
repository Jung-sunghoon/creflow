'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  getCampaigns,
  getCampaign,
  updateCampaignStatus,
  updateCampaign,
  deleteCampaign,
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

export function useIncome(id: string) {
  return useQuery({
    queryKey: ['income', id],
    queryFn: () => getIncome(id),
    enabled: !!id,
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

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => getCampaign(id),
    enabled: !!id,
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
      // 관련 캐시 완전 제거 - 다음 접근 시 새로 fetch
      queryClient.removeQueries({ queryKey: ['incomes'] })
      queryClient.removeQueries({ queryKey: ['campaigns'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useUpdateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IncomeFormData> }) =>
      updateIncome(id, data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['incomes'] })
      queryClient.removeQueries({ queryKey: ['income'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useDeleteIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteIncome(id),
    onMutate: async (id) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ['incomes'] })

      // 이전 데이터 저장 (롤백용)
      const previousIncomes = queryClient.getQueriesData({ queryKey: ['incomes'] })

      // 옵티미스틱 업데이트: 캐시에서 해당 아이템 즉시 제거
      queryClient.setQueriesData({ queryKey: ['incomes'] }, (old: unknown) => {
        if (Array.isArray(old)) {
          return old.filter((item: { id: string }) => item.id !== id)
        }
        return old
      })

      return { previousIncomes }
    },
    onError: (_err, _id, context) => {
      // 실패 시 롤백
      if (context?.previousIncomes) {
        context.previousIncomes.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      // 성공/실패 상관없이 캐시 제거
      queryClient.removeQueries({ queryKey: ['incomes'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPaid }: { id: string; isPaid: boolean }) =>
      updateCampaignStatus(id, isPaid),
    onMutate: async ({ id, isPaid }) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] })

      const previousCampaigns = queryClient.getQueriesData({ queryKey: ['campaigns'] })

      queryClient.setQueriesData({ queryKey: ['campaigns'] }, (old: unknown) => {
        if (Array.isArray(old)) {
          return old.map((item: { id: string; is_paid: boolean }) =>
            item.id === id ? { ...item, is_paid: isPaid } : item
          )
        }
        return old
      })

      return { previousCampaigns }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCampaigns) {
        context.previousCampaigns.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ['campaigns'] })
      queryClient.removeQueries({ queryKey: ['campaign'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateCampaign>[1] }) =>
      updateCampaign(id, data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['campaigns'] })
      queryClient.removeQueries({ queryKey: ['campaign'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] })

      const previousCampaigns = queryClient.getQueriesData({ queryKey: ['campaigns'] })

      queryClient.setQueriesData({ queryKey: ['campaigns'] }, (old: unknown) => {
        if (Array.isArray(old)) {
          return old.filter((item: { id: string }) => item.id !== id)
        }
        return old
      })

      return { previousCampaigns }
    },
    onError: (_err, _id, context) => {
      if (context?.previousCampaigns) {
        context.previousCampaigns.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ['campaigns'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}
