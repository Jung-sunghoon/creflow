'use client'

import { Button } from '@/shared/components/ui/button'
import { CheckCircle } from 'lucide-react'

interface CompleteStepProps {
  onComplete: () => void
  isLoading?: boolean
}

export function CompleteStep({ onComplete, isLoading = false }: CompleteStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">준비 완료!</h2>
        <p className="text-sm text-muted-foreground text-center mt-2">
          이제 수익을 기록해보세요
        </p>
      </div>

      <Button
        className="w-full"
        onClick={onComplete}
        disabled={isLoading}
      >
        {isLoading ? '저장 중...' : '시작하기'}
      </Button>
    </div>
  )
}
