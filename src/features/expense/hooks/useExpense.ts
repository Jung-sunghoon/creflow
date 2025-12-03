'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import {
  getExpenses,
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

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('로그인이 필요합니다')
      return createExpense(userId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) =>
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

export function useUpdateExpenseStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPaid }: { id: string; isPaid: boolean }) =>
      updateExpenseStatus(id, isPaid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}
