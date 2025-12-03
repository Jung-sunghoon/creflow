'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { formatCurrency, formatPercent } from '@/shared/lib/calculations'
import { cn } from '@/shared/lib/utils'
import Link from 'next/link'

interface NetIncomeCardProps {
  month: string // "12월"
  netIncome: number
  changeRate: number
}

export function NetIncomeCard({ month, netIncome, changeRate }: NetIncomeCardProps) {
  const isPositive = changeRate > 0
  const isNegative = changeRate < 0
  const hasData = netIncome !== 0 || changeRate !== 0

  // 빈 상태
  if (!hasData) {
    return (
      <Card className="p-6 bg-white border-0 shadow-sm">
        <div className="text-center lg:text-left space-y-3">
          <p className="text-sm text-neutral-500">{month} 순수익</p>
          <p className="text-3xl font-bold text-neutral-300">₩0</p>
          <div className="pt-2">
            <p className="text-sm text-neutral-500 mb-3">
              아직 이번 달 수익이 없어요
            </p>
            <Link
              href="/income/new"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              첫 수익 등록하기 →
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white border-0 shadow-sm">
      <div className="text-center lg:text-left space-y-2">
        <p className="text-sm text-neutral-500">{month} 순수익</p>
        <div className="lg:flex lg:items-baseline lg:gap-4">
          <p className="text-3xl font-bold text-neutral-900">
            {formatCurrency(netIncome)}
          </p>
          <div
            className={cn(
              'inline-flex items-center gap-1 text-sm font-medium',
              isPositive && 'text-green-600',
              isNegative && 'text-red-600',
              !isPositive && !isNegative && 'text-neutral-500'
            )}
          >
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
            <span>전월 대비 {formatPercent(changeRate)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
