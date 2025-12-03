'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { formatCurrency } from '@/shared/lib/calculations'
import type { Expense } from '@/shared/types'

interface ExpenseCardProps {
  expense: Expense
  onTogglePaid?: (isPaid: boolean) => void
}

export function ExpenseCard({ expense, onTogglePaid }: ExpenseCardProps) {
  const displayDate = format(new Date(expense.date), 'M/d', { locale: ko })
  const isCollaborator = expense.type === 'collaborator'

  return (
    <Card className="p-4 bg-white border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCollaborator ? 'bg-purple-50' : 'bg-neutral-100'
          }`}>
            <span className="text-lg">
              {isCollaborator ? '👤' : '📦'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {expense.description || (isCollaborator ? '인건비' : '기타 지출')}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant={expense.is_paid ? 'default' : 'secondary'}
                className={
                  expense.is_paid
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-neutral-100 text-neutral-600'
                }
              >
                {expense.is_paid ? '지급완료' : '예정'}
              </Badge>
              <span className="text-xs text-muted-foreground">{displayDate}</span>
            </div>
          </div>
        </div>
        <p className="text-base font-semibold text-foreground">
          -{formatCurrency(expense.amount)}
        </p>
      </div>
    </Card>
  )
}
