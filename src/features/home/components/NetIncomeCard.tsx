'use client'

import { Card } from '@/shared/components/ui/card'
import { formatCurrency, formatPercent } from '@/shared/lib/calculations'
import { cn } from '@/shared/lib/utils'

interface NetIncomeCardProps {
  month: string // "12월"
  netIncome: number
  changeRate: number
}

export function NetIncomeCard({ month, netIncome, changeRate }: NetIncomeCardProps) {
  const isPositive = changeRate >= 0

  return (
    <Card className="p-6 bg-white border-0 shadow-sm">
      <div className="text-center space-y-2">
        <p className="text-sm text-neutral-500">{month} 순수익</p>
        <p className="text-3xl font-bold text-neutral-900">
          {formatCurrency(netIncome)}
        </p>
        <p
          className={cn(
            'text-sm font-medium',
            isPositive ? 'text-green-600' : 'text-red-600'
          )}
        >
          전월 대비 {formatPercent(changeRate)}
        </p>
      </div>
    </Card>
  )
}
