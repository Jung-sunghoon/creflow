'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog'
import { formatCurrency } from '@/shared/lib/calculations'
import type { Expense } from '@/shared/types'

interface ExpenseCardProps {
  expense: Expense
  onTogglePaid?: (isPaid: boolean) => void
  onEdit?: () => void
  onDelete?: () => void
}

export function ExpenseCard({ expense, onTogglePaid, onEdit, onDelete }: ExpenseCardProps) {
  const displayDate = format(new Date(expense.date), 'M/d', { locale: ko })
  const isCollaborator = expense.type === 'collaborator'

  return (
    <Card className="p-4 bg-white border-0 shadow-sm group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCollaborator ? 'bg-purple-50' : 'bg-neutral-100'
          }`}>
            <span className="text-lg" aria-hidden="true">
              {isCollaborator ? '👤' : '📦'}
            </span>
            <span className="sr-only">{isCollaborator ? '인건비' : '기타 지출'}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {expense.description || (isCollaborator ? '인건비' : '기타 지출')}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant={expense.is_paid ? 'default' : 'secondary'}
                className={`cursor-pointer transition-colors ${
                  expense.is_paid
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
                onClick={() => onTogglePaid?.(!expense.is_paid)}
              >
                {expense.is_paid ? '지급완료' : '예정'}
              </Badge>
              <span className="text-xs text-muted-foreground">{displayDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-neutral-100 hover:text-foreground"
              onClick={onEdit}
              aria-label="지출 수정"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>
            <DeleteConfirmDialog
              title="지출을 삭제하시겠습니까?"
              description="삭제된 지출 내역은 복구할 수 없습니다."
              onConfirm={() => onDelete?.()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="지출 삭제"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DeleteConfirmDialog>
          </div>
          <p className="text-base font-semibold text-foreground">
            -{formatCurrency(expense.amount)}
          </p>
        </div>
      </div>
    </Card>
  )
}
