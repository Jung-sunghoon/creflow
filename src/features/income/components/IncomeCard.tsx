'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog'
import { PLATFORMS } from '@/shared/lib/constants'
import { formatCurrency } from '@/shared/lib/calculations'
import type { Income, Campaign } from '@/shared/types'

interface IncomeCardProps {
  income: Income
  onEdit?: () => void
  onDelete?: () => void
}

export function IncomeCard({ income, onEdit, onDelete }: IncomeCardProps) {
  const platformInfo = income.source ? PLATFORMS[income.source] : null
  const displayDate = format(new Date(income.date), 'M/d', { locale: ko })

  return (
    <Card className="p-4 bg-white border-0 shadow-sm group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-lg" aria-hidden="true">
              {income.type === 'platform' ? '📺' : '🏷️'}
            </span>
            <span className="sr-only">{income.type === 'platform' ? '플랫폼 수익' : '광고/협찬'}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {platformInfo?.label || '광고/협찬'}
            </p>
            <p className="text-xs text-muted-foreground">
              {income.input_method === 'direct' ? '직접 입력' : '자동 계산'} · {displayDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-neutral-100 hover:text-foreground"
              onClick={onEdit}
              aria-label="수익 수정"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>
            <DeleteConfirmDialog
              title="수익을 삭제하시겠습니까?"
              description="삭제된 수익 내역은 복구할 수 없습니다."
              onConfirm={() => onDelete?.()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="수익 삭제"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DeleteConfirmDialog>
          </div>
          <p className="text-base font-semibold text-foreground">
            {formatCurrency(income.amount)}
          </p>
        </div>
      </div>
    </Card>
  )
}

interface CampaignCardProps {
  campaign: Campaign
  onTogglePaid?: (isPaid: boolean) => void
  onEdit?: () => void
  onDelete?: () => void
}

export function CampaignCard({ campaign, onTogglePaid, onEdit, onDelete }: CampaignCardProps) {
  const displayDate = campaign.payment_date
    ? format(new Date(campaign.payment_date), 'M/d', { locale: ko })
    : '-'

  return (
    <Card className="p-4 bg-white border-0 shadow-sm group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <span className="text-lg" aria-hidden="true">🏷️</span>
            <span className="sr-only">광고/협찬</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {campaign.brand_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant={campaign.is_paid ? 'default' : 'secondary'}
                className={`cursor-pointer transition-colors ${
                  campaign.is_paid
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
                onClick={() => onTogglePaid?.(!campaign.is_paid)}
              >
                {campaign.is_paid ? '입금완료' : '예정'}
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
              aria-label="광고/협찬 수정"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>
            <DeleteConfirmDialog
              title="광고/협찬을 삭제하시겠습니까?"
              description="삭제된 내역은 복구할 수 없습니다."
              onConfirm={() => onDelete?.()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="광고/협찬 삭제"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DeleteConfirmDialog>
          </div>
          <p className="text-base font-semibold text-foreground">
            {formatCurrency(campaign.amount)}
          </p>
        </div>
      </div>
    </Card>
  )
}
