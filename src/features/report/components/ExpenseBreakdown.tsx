'use client'

import { Card } from '@/shared/components/ui/card'
import { formatCurrency } from '@/shared/lib/calculations'

interface ExpenseBreakdownProps {
  expenseByCollaborator: Array<{ name: string; amount: number }>
}

export function ExpenseBreakdown({ expenseByCollaborator }: ExpenseBreakdownProps) {
  if (expenseByCollaborator.length === 0) {
    return null
  }

  const total = expenseByCollaborator.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">협력자별 지출</h2>

      <Card className="p-4 bg-white border-0 shadow-sm">
        <div className="space-y-3">
          {expenseByCollaborator.map(({ name, amount }) => {
            const percentage = Math.round((amount / total) * 100)

            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" id={`expense-label-${name}`}>{name}</span>
                  <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                </div>
                <div
                  className="h-2 bg-neutral-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-labelledby={`expense-label-${name}`}
                >
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
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
