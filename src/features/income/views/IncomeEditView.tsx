'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { LoadingSpinner } from '@/shared/components/common'
import { PlatformIncomeForm } from '../components/PlatformIncomeForm'
import { useIncome } from '../hooks/useIncome'

interface IncomeEditViewProps {
  incomeId: string
}

export function IncomeEditView({ incomeId }: IncomeEditViewProps) {
  const router = useRouter()
  const { data: income, isLoading } = useIncome(incomeId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!income) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">수익을 찾을 수 없습니다</p>
          <button
            onClick={() => router.back()}
            className="text-primary underline cursor-pointer"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => router.back()} className="mr-3 cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">수익 수정</h1>
        </div>
      </div>

      {/* 폼 */}
      <div className="p-4">
        <PlatformIncomeForm income={income} />
      </div>
    </div>
  )
}
