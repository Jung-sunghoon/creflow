'use client'

import { Card } from '@/shared/components/ui/card'
import { formatCurrency } from '@/shared/lib/calculations'
import { PLATFORMS } from '@/shared/lib/constants'
import type { PlatformType } from '@/shared/types'

interface IncomeBreakdownProps {
  incomeBySource: Record<PlatformType | 'ad', number>
}

export function IncomeBreakdown({ incomeBySource }: IncomeBreakdownProps) {
  const entries = Object.entries(incomeBySource)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])

  const total = entries.reduce((sum, [, amount]) => sum + amount, 0)

  if (entries.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">수익 구성</h2>

      <Card className="p-4 bg-white border-0 shadow-sm">
        <div className="space-y-3">
          {entries.map(([source, amount]) => {
            const label = source === 'ad' ? '광고/협찬' : PLATFORMS[source as PlatformType]?.label || source
            const percentage = Math.round((amount / total) * 100)

            return (
              <div key={source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" id={`income-label-${source}`}>{label}</span>
                  <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                </div>
                <div
                  className="h-2 bg-neutral-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-labelledby={`income-label-${source}`}
                >
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
