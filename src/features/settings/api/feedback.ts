import { createClient } from '@/shared/lib/supabase/client'
import type { Feedback, FeedbackType } from '@/shared/types'

export interface FeedbackFormData {
  type: FeedbackType
  content: string
  email?: string
}

export async function submitFeedback(
  userId: string | null,
  data: FeedbackFormData
): Promise<Feedback> {
  const supabase = createClient()

  const { data: feedback, error } = await supabase
    .from('feedbacks')
    .insert({
      user_id: userId,
      type: data.type,
      content: data.content,
      email: data.email,
    })
    .select()
    .single()

  if (error) throw error
  return feedback
}
