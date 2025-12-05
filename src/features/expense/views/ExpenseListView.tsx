'use client'

import { useState } from 'react'
import { format, subMonths, addMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { ExpenseCard } from '../components/ExpenseCard'
import { useExpenses, useUpdateExpenseStatus, useDeleteExpense } from '../hooks/useExpense'
import { formatCurrency } from '@/shared/lib/calculations'
// import { AdBanner } from '@/shared/components/common'
import { CoupangBanner } from '@/shared/components/common'

export function ExpenseListView() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const monthString = format(currentMonth, 'yyyy-MM')

  const { data: expenses = [], isLoading } = useExpenses(monthString)
  const updateExpenseStatus = useUpdateExpenseStatus()
  const deleteExpense = useDeleteExpense()

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const collaboratorExpenses = expenses.filter((e) => e.type === 'collaborator')
  const otherExpenses = expenses.filter((e) => e.type === 'other')
  const totalCollaboratorExpense = collaboratorExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalOtherExpense = otherExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalExpense = totalCollaboratorExpense + totalOtherExpense

  const handleTogglePaid = (expenseId: string, isPaid: boolean) => {
    updateExpenseStatus.mutate({ id: expenseId, isPaid })
  }

  return (
    <main className="bg-background flex flex-col min-h-full">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">지출 관리</h1>
          <Link href="/expense/new">
            <Button size="sm" variant="ghost" aria-label="지출 등록">
              <Plus className="w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        {/* 월 선택 */}
        <div className="flex items-center justify-center gap-4 py-3">
          <button
            onClick={handlePrevMonth}
            className="p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="이전 달"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          </button>
          <span className="text-base font-medium">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="다음 달"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 총 지출 요약 */}
      <div className="px-4 py-6 bg-neutral-50">
        <p className="text-sm text-muted-foreground mb-1">이번 달 총 지출</p>
        <p className="text-2xl font-bold text-destructive">-{formatCurrency(totalExpense)}</p>
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
          <span>인건비 {formatCurrency(totalCollaboratorExpense)}</span>
          <span>기타 {formatCurrency(totalOtherExpense)}</span>
        </div>
      </div>

      {/* 지출 목록 */}
      <div className="px-4 py-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* 인건비 */}
            {collaboratorExpenses.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  인건비
                </h2>
                <div className="space-y-3">
                  {collaboratorExpenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      onTogglePaid={(isPaid) => handleTogglePaid(expense.id, isPaid)}
                      onEdit={() => router.push(`/expense/${expense.id}/edit`)}
                      onDelete={() => deleteExpense.mutate(expense.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 기타 지출 */}
            {otherExpenses.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  기타 지출
                </h2>
                <div className="space-y-3">
                  {otherExpenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      onTogglePaid={(isPaid) => handleTogglePaid(expense.id, isPaid)}
                      onEdit={() => router.push(`/expense/${expense.id}/edit`)}
                      onDelete={() => deleteExpense.mutate(expense.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 빈 상태 */}
            {expenses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  등록된 지출이 없습니다
                </p>
                <Link href="/expense/new">
                  <Button>지출 등록하기</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* 쿠팡 파트너스 배너 */}
      <div className="px-4 py-4 mt-auto">
        <CoupangBanner />
        {/* <AdBanner slot="7907957325" /> */}
      </div>
    </main>
  )
}
