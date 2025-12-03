'use client'

import Link from 'next/link'
import { Card } from '@/shared/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/shared/lib/calculations'
import { cn } from '@/shared/lib/utils'

interface SummaryCardProps {
  type: 'income' | 'expense'
  amount: number
  changeRate: number
}

function SummaryCard({ type, amount, changeRate }: SummaryCardProps) {
  const isIncome = type === 'income'
  const isPositive = changeRate >= 0
  const Icon = isIncome ? TrendingUp : TrendingDown

  return (
    <Link href={isIncome ? '/income' : '/expense'}>
      <Card className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isIncome ? 'bg-blue-50' : 'bg-red-50'
            )}
          >
            <Icon
              className={cn(
                'w-5 h-5',
                isIncome ? 'text-blue-600' : 'text-red-600'
              )}
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-neutral-500">
              {isIncome ? '수익' : '지출'}
            </p>
            <p className="text-lg font-semibold text-neutral-900">
              {formatCurrency(amount)}
            </p>
          </div>
          <span
            className={cn(
              'text-xs font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {formatPercent(changeRate)}
          </span>
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
    <div className="grid grid-cols-2 gap-3">
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
    </div>
  )
}
