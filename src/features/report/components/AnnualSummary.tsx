'use client'

import { Card } from '@/shared/components/ui/card'
import { formatCurrency } from '@/shared/lib/calculations'
import type { AnnualReport } from '@/shared/types'

interface AnnualSummaryProps {
  report: AnnualReport
}

export function AnnualSummary({ report }: AnnualSummaryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{report.year}년 연간 요약</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-4 bg-white border-0 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">총 수익</p>
          <p className="text-lg font-bold text-accent">
            {formatCurrency(report.totalIncome)}
          </p>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">총 지출</p>
          <p className="text-lg font-bold text-destructive">
            {formatCurrency(report.totalExpense)}
          </p>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">순수익</p>
          <p className={`text-lg font-bold ${report.netIncome >= 0 ? 'text-foreground' : 'text-destructive'}`}>
            {formatCurrency(report.netIncome)}
          </p>
        </Card>
      </div>
    </div>
  )
}
