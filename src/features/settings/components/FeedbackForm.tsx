'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { submitFeedback } from '../api/feedback'
import { createClient } from '@/shared/lib/supabase/client'
import type { FeedbackType } from '@/shared/types'
import { toast } from 'sonner'

const feedbackTypes: { value: FeedbackType; label: string }[] = [
  { value: 'feature', label: '기능 제안' },
  { value: 'bug', label: '버그 신고' },
  { value: 'other', label: '기타' },
]

export function FeedbackForm() {
  const [type, setType] = useState<FeedbackType | ''>('')
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = type && content.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!type || !content.trim()) return

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      await submitFeedback(user?.id || null, {
        type: type as FeedbackType,
        content: content.trim(),
        email: email || undefined,
      })

      toast.success('피드백이 제출되었습니다. 감사합니다!')

      // Reset form
      setType('')
      setContent('')
      setEmail('')
    } catch (error) {
      toast.error('피드백 제출에 실패했습니다')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 피드백 유형 */}
      <div className="space-y-2">
        <Label>유형</Label>
        <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
          <SelectTrigger>
            <SelectValue placeholder="피드백 유형을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {feedbackTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 내용 */}
      <div className="space-y-2">
        <Label>내용</Label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="피드백 내용을 입력하세요"
          rows={4}
        />
      </div>

      {/* 이메일 (선택) */}
      <div className="space-y-2">
        <Label>이메일 (선택)</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="답변받을 이메일"
        />
        <p className="text-xs text-muted-foreground">
          답변이 필요한 경우 이메일을 입력해주세요
        </p>
      </div>

      {/* 제출 버튼 */}
      <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? '제출 중...' : '피드백 보내기'}
      </Button>
    </form>
  )
}
