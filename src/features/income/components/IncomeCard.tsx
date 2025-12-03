'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { PLATFORMS } from '@/shared/lib/constants'
import { formatCurrency } from '@/shared/lib/calculations'
import type { Income, Campaign } from '@/shared/types'

interface IncomeCardProps {
  income: Income
}

export function IncomeCard({ income }: IncomeCardProps) {
  const platformInfo = income.source ? PLATFORMS[income.source] : null
  const displayDate = format(new Date(income.date), 'M/d', { locale: ko })

  return (
    <Card className="p-4 bg-white border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-lg">
              {income.type === 'platform' ? '📺' : '🏷️'}
            </span>
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
        <p className="text-base font-semibold text-foreground">
          {formatCurrency(income.amount)}
        </p>
      </div>
    </Card>
  )
}

interface CampaignCardProps {
  campaign: Campaign
  onTogglePaid?: (isPaid: boolean) => void
}

export function CampaignCard({ campaign, onTogglePaid }: CampaignCardProps) {
  const displayDate = campaign.payment_date
    ? format(new Date(campaign.payment_date), 'M/d', { locale: ko })
    : '-'

  return (
    <Card className="p-4 bg-white border-0 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <span className="text-lg">🏷️</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {campaign.brand_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant={campaign.is_paid ? 'default' : 'secondary'}
                className={
                  campaign.is_paid
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-neutral-100 text-neutral-600'
                }
              >
                {campaign.is_paid ? '입금완료' : '예정'}
              </Badge>
              <span className="text-xs text-muted-foreground">{displayDate}</span>
            </div>
          </div>
        </div>
        <p className="text-base font-semibold text-foreground">
          {formatCurrency(campaign.amount)}
        </p>
      </div>
    </Card>
  )
}
