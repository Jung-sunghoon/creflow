import type { Feedback, FeedbackType } from '@/shared/types'

export interface FeedbackFormData {
  type: FeedbackType
  content: string
  email?: string
}

export async function submitFeedback(
  _userId: string | null,
  data: FeedbackFormData
): Promise<Feedback> {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '피드백 전송에 실패했어요')
  }

  return response.json()
}
