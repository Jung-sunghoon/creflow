'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  updateExpenseStatus,
} from '../api/expense'
import type { ExpenseFormData } from '@/shared/types'

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export function useExpenses(month?: string) {
  return useQuery({
    queryKey: ['expenses', month],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      if (!userId) return []
      return getExpenses(userId, month)
    },
  })
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: () => getExpense(id),
    enabled: !!id,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('로그인이 필요합니다')
      return createExpense(userId, data)
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['expenses'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) =>
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['expenses'] })
      queryClient.removeQueries({ queryKey: ['expense'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['expenses'] })

      const previousExpenses = queryClient.getQueriesData({ queryKey: ['expenses'] })

      queryClient.setQueriesData({ queryKey: ['expenses'] }, (old: unknown) => {
        if (Array.isArray(old)) {
          return old.filter((item: { id: string }) => item.id !== id)
        }
        return old
      })

      return { previousExpenses }
    },
    onError: (_err, _id, context) => {
      if (context?.previousExpenses) {
        context.previousExpenses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ['expenses'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useUpdateExpenseStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPaid }: { id: string; isPaid: boolean }) =>
      updateExpenseStatus(id, isPaid),
    onMutate: async ({ id, isPaid }) => {
      await queryClient.cancelQueries({ queryKey: ['expenses'] })

      const previousExpenses = queryClient.getQueriesData({ queryKey: ['expenses'] })

      queryClient.setQueriesData({ queryKey: ['expenses'] }, (old: unknown) => {
        if (Array.isArray(old)) {
          return old.map((item: { id: string; is_paid: boolean }) =>
            item.id === id ? { ...item, is_paid: isPaid } : item
          )
        }
        return old
      })

      return { previousExpenses }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousExpenses) {
        context.previousExpenses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ['expenses'] })
      queryClient.removeQueries({ queryKey: ['expense'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}
