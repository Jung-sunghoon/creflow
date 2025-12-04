'use client'

import Link from 'next/link'
import { Card } from '@/shared/components/ui/card'
import { TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/shared/lib/calculations'
import { cn } from '@/shared/lib/utils'

interface SummaryCardProps {
  type: 'income' | 'expense'
  amount: number
  changeRate: number
}

function SummaryCard({ type, amount, changeRate }: SummaryCardProps) {
  const isIncome = type === 'income'

  // 수익: 증가=좋음(green), 감소=나쁨(red)
  // 지출: 증가=나쁨(red), 감소=좋음(green)
  const isGood = isIncome
    ? changeRate > 0  // 수익 증가는 좋음
    : changeRate < 0  // 지출 감소는 좋음
  const isBad = isIncome
    ? changeRate < 0  // 수익 감소는 나쁨
    : changeRate > 0  // 지출 증가는 나쁨
  const isNeutral = changeRate === 0

  return (
    <Link href={isIncome ? '/income' : '/expense'} className="cursor-pointer">
      <Card className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isIncome ? 'bg-blue-50' : 'bg-red-50'
            )}
          >
            {isIncome ? (
              <Plus className="w-5 h-5 text-blue-600" />
            ) : (
              <Minus className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500">
              {isIncome ? '수익' : '지출'}
            </p>
            <p className="text-lg font-semibold text-neutral-900 truncate">
              {formatCurrency(amount)}
            </p>
          </div>
          <div
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium shrink-0',
              isGood && 'text-green-600',
              isBad && 'text-red-600',
              isNeutral && 'text-neutral-500'
            )}
          >
            {changeRate > 0 && <TrendingUp className="w-3 h-3" />}
            {changeRate < 0 && <TrendingDown className="w-3 h-3" />}
            <span>{formatPercent(changeRate)}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
  incomeChangeRate: number
  expenseChangeRate: number
}

export function SummaryCards({
  totalIncome,
  totalExpense,
  incomeChangeRate,
  expenseChangeRate,
}: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-3" aria-label="수익/지출 요약">
      <SummaryCard
        type="income"
        amount={totalIncome}
        changeRate={incomeChangeRate}
      />
      <SummaryCard
        type="expense"
        amount={totalExpense}
        changeRate={expenseChangeRate}
      />
    </section>
  )
}
