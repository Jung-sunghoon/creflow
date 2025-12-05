'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import {
  getCollaborators,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
} from '../api/collaborator'
import type { CollaboratorFormData } from '@/shared/types'

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export function useCollaborators() {
  return useQuery({
    queryKey: ['collaborators'],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      if (!userId) return []
      return getCollaborators(userId)
    },
  })
}

export function useCreateCollaborator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CollaboratorFormData) => {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('로그인이 필요합니다')
      return createCollaborator(userId, data)
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['collaborators'] })
      queryClient.removeQueries({ queryKey: ['expenses'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useUpdateCollaborator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CollaboratorFormData> }) =>
      updateCollaborator(id, data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['collaborators'] })
      queryClient.removeQueries({ queryKey: ['expenses'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}

export function useDeleteCollaborator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCollaborator(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['collaborators'] })
      queryClient.removeQueries({ queryKey: ['expenses'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['upcoming-events'] })
      queryClient.removeQueries({ queryKey: ['recent-activities'] })
    },
  })
}
