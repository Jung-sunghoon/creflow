'use client'

import { Card } from '@/shared/components/ui/card'
import { formatCurrency, formatPercent } from '@/shared/lib/calculations'
import type { MonthlySummary } from '@/shared/types'

interface MonthlyListProps {
  summaries: MonthlySummary[]
}

export function MonthlyList({ summaries }: MonthlyListProps) {
  // 데이터가 있는 월만 표시 (역순)
  const activeSummaries = summaries
    .filter((s) => s.totalIncome > 0 || s.totalExpense > 0)
    .reverse()

  if (activeSummaries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        데이터가 없습니다
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">월별 내역</h2>

      <div className="space-y-3">
        {activeSummaries.map((summary) => {
          const [, month] = summary.month.split('-')
          const monthNum = parseInt(month, 10)

          return (
            <Card key={summary.month} className="p-4 bg-card border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{monthNum}월</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>수익 {formatCurrency(summary.totalIncome)}</span>
                    <span>지출 {formatCurrency(summary.totalExpense)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-base font-semibold ${
                    summary.netIncome >= 0 ? 'text-foreground' : 'text-destructive'
                  }`}>
                    {formatCurrency(summary.netIncome)}
                  </p>
                  {summary.changeRate !== 0 && (
                    <p className={`text-xs ${
                      summary.changeRate > 0 ? 'text-accent' : 'text-destructive'
                    }`}>
                      {formatPercent(summary.changeRate)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
