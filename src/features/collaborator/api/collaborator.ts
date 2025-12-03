import { createClient } from '@/shared/lib/supabase/client'
import type { Collaborator, CollaboratorFormData } from '@/shared/types'

export async function getCollaborators(userId: string): Promise<Collaborator[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createCollaborator(
  userId: string,
  data: CollaboratorFormData
): Promise<Collaborator> {
  const supabase = createClient()

  const { data: collaborator, error } = await supabase
    .from('collaborators')
    .insert({
      user_id: userId,
      name: data.name,
      role: data.role,
      payment_type: data.payment_type,
      base_amount: data.base_amount,
      percentage: data.percentage,
      memo: data.memo,
    })
    .select()
    .single()

  if (error) throw error
  return collaborator
}

export async function updateCollaborator(
  id: string,
  data: Partial<CollaboratorFormData>
): Promise<Collaborator> {
  const supabase = createClient()

  const { data: collaborator, error } = await supabase
    .from('collaborators')
    .update({
      name: data.name,
      role: data.role,
      payment_type: data.payment_type,
      base_amount: data.base_amount,
      percentage: data.percentage,
      memo: data.memo,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return collaborator
}

export async function deleteCollaborator(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from('collaborators').delete().eq('id', id)

  if (error) throw error
}
