'use client'

import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/calculations'
import type { Collaborator } from '@/shared/types'

interface CollaboratorCardProps {
  collaborator: Collaborator
  onDelete?: () => void
}

export function CollaboratorCard({ collaborator, onDelete }: CollaboratorCardProps) {
  const paymentInfo =
    collaborator.payment_type === 'fixed'
      ? `월 ${formatCurrency(collaborator.base_amount || 0)}`
      : collaborator.payment_type === 'percentage'
      ? `수익의 ${collaborator.percentage}%`
      : `${formatCurrency(collaborator.base_amount || 0)} + ${collaborator.percentage}%`

  return (
    <Card className="p-4 bg-white border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {collaborator.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="bg-neutral-100 text-neutral-600">
                {collaborator.role}
              </Badge>
              <span className="text-xs text-muted-foreground">{paymentInfo}</span>
            </div>
          </div>
        </div>
        {onDelete && (
          <DeleteConfirmDialog
            title={`${collaborator.name} 협력자를 삭제하시겠습니까?`}
            description="삭제된 협력자 정보는 복구할 수 없습니다."
            onConfirm={onDelete}
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </DeleteConfirmDialog>
        )}
      </div>
    </Card>
  )
}
