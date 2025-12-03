'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { ExpenseForm } from '../components/ExpenseForm'

export function ExpenseFormView() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => router.back()} className="mr-3 cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">지출 등록</h1>
        </div>
      </div>

      {/* 폼 */}
      <div className="p-4">
        <ExpenseForm />
      </div>
    </div>
  )
}
