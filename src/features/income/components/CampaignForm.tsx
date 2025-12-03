'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { DatePicker } from '@/shared/components/ui/date-picker'
import { formatCurrency } from '@/shared/lib/calculations'
import { useCreateIncome, useUpdateCampaign } from '../hooks/useIncome'
import type { Campaign } from '@/shared/types'
import { toast } from 'sonner'

interface CampaignFormProps {
  campaign?: Campaign
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter()
  const createIncome = useCreateIncome()
  const updateCampaign = useUpdateCampaign()

  const isEditMode = !!campaign

  const [brandName, setBrandName] = useState(campaign?.brand_name || '')
  const [amount, setAmount] = useState(campaign?.amount?.toString() || '')
  const [paymentDate, setPaymentDate] = useState<Date>(
    campaign?.payment_date ? new Date(campaign.payment_date) : new Date()
  )
  const [isPaid, setIsPaid] = useState(campaign?.is_paid || false)
  const [memo, setMemo] = useState('')

  const canSubmit = brandName && amount && paymentDate
  const isPending = createIncome.isPending || updateCampaign.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!brandName || !amount) return

    const dateStr = format(paymentDate, 'yyyy-MM-dd')

    try {
      if (isEditMode && campaign) {
        await updateCampaign.mutateAsync({
          id: campaign.id,
          data: {
            brand_name: brandName,
            amount: Number(amount),
            payment_date: dateStr,
            is_paid: isPaid,
          },
        })
        toast.success('광고/협찬이 수정되었습니다')
      } else {
        await createIncome.mutateAsync({
          type: 'ad',
          brand_name: brandName,
          amount: Number(amount),
          date: dateStr,
          payment_date: dateStr,
          is_paid: isPaid,
          memo: memo || undefined,
        })
        toast.success('광고/협찬이 등록되었습니다')
      }
      router.push('/income')
    } catch (error) {
      toast.error(isEditMode ? '수정에 실패했습니다' : '등록에 실패했습니다')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 브랜드명 */}
      <div className="space-y-2">
        <Label>브랜드명</Label>
        <Input
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="브랜드명을 입력하세요"
        />
      </div>

      {/* 금액 */}
      <div className="space-y-2">
        <Label>계약 금액</Label>
        <div className="relative">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            원
          </span>
        </div>
        {amount && (
          <p className="text-sm text-muted-foreground">
            {formatCurrency(Number(amount))}
          </p>
        )}
      </div>

      {/* 정산 예정일 */}
      <div className="space-y-2">
        <Label>정산 예정일</Label>
        <DatePicker
          value={paymentDate}
          onChange={(d) => d && setPaymentDate(d)}
          placeholder="날짜를 선택하세요"
        />
      </div>

      {/* 입금 완료 여부 */}
      <div className="flex items-center justify-between">
        <Label>입금 완료</Label>
        <Switch checked={isPaid} onCheckedChange={setIsPaid} />
      </div>

      {/* 메모 */}
      {!isEditMode && (
        <div className="space-y-2">
          <Label>메모 (선택)</Label>
          <Input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요"
          />
        </div>
      )}

      {/* 제출 버튼 */}
      <Button
        type="submit"
        className="w-full"
        disabled={!canSubmit || isPending}
      >
        {isPending ? '저장 중...' : isEditMode ? '수정하기' : '저장하기'}
      </Button>
    </form>
  )
}
