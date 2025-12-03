'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { formatCurrency } from '@/shared/lib/calculations'
import { useCreateIncome } from '../hooks/useIncome'
import { toast } from 'sonner'

export function CampaignForm() {
  const router = useRouter()
  const createIncome = useCreateIncome()

  const [brandName, setBrandName] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isPaid, setIsPaid] = useState(false)
  const [memo, setMemo] = useState('')

  const canSubmit = brandName && amount && paymentDate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!brandName || !amount) return

    try {
      await createIncome.mutateAsync({
        type: 'ad',
        brand_name: brandName,
        amount: Number(amount),
        date: paymentDate,
        payment_date: paymentDate,
        is_paid: isPaid,
        memo: memo || undefined,
      })

      toast.success('광고/협찬이 등록되었습니다')
      router.push('/income')
    } catch (error) {
      toast.error('등록에 실패했습니다')
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
        <Input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
      </div>

      {/* 입금 완료 여부 */}
      <div className="flex items-center justify-between">
        <Label>입금 완료</Label>
        <Switch checked={isPaid} onCheckedChange={setIsPaid} />
      </div>

      {/* 메모 */}
      <div className="space-y-2">
        <Label>메모 (선택)</Label>
        <Input
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력하세요"
        />
      </div>

      {/* 제출 버튼 */}
      <Button
        type="submit"
        className="w-full"
        disabled={!canSubmit || createIncome.isPending}
      >
        {createIncome.isPending ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  )
}
