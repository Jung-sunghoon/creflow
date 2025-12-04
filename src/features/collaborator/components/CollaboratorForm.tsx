'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useCreateCollaborator } from '../hooks/useCollaborator'
import type { PaymentType } from '@/shared/types'
import { toast } from 'sonner'

const paymentTypes: { value: PaymentType; label: string }[] = [
  { value: 'fixed', label: '고정급' },
  { value: 'percentage', label: '수익 배분' },
  { value: 'hybrid', label: '고정급 + 수익 배분' },
]

interface CollaboratorFormProps {
  onSuccess?: () => void
}

export function CollaboratorForm({ onSuccess }: CollaboratorFormProps) {
  const createCollaborator = useCreateCollaborator()

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [paymentType, setPaymentType] = useState<PaymentType | ''>('')
  const [baseAmount, setBaseAmount] = useState('')
  const [percentage, setPercentage] = useState('')
  const [memo, setMemo] = useState('')

  const showBaseAmount = paymentType === 'fixed' || paymentType === 'hybrid'
  const showPercentage = paymentType === 'percentage' || paymentType === 'hybrid'

  const canSubmit = name && role && paymentType

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !role || !paymentType) return

    try {
      await createCollaborator.mutateAsync({
        name,
        role,
        payment_type: paymentType as PaymentType,
        base_amount: baseAmount ? Number(baseAmount) : undefined,
        percentage: percentage ? Number(percentage) : undefined,
        memo: memo || undefined,
      })

      toast.success('협력자가 등록되었습니다')

      // Reset form
      setName('')
      setRole('')
      setPaymentType('')
      setBaseAmount('')
      setPercentage('')
      setMemo('')

      onSuccess?.()
    } catch (error) {
      toast.error('등록에 실패했습니다')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 이름 */}
      <div className="space-y-2">
        <Label htmlFor="collaborator-name">이름</Label>
        <Input
          id="collaborator-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="협력자 이름"
        />
      </div>

      {/* 역할 */}
      <div className="space-y-2">
        <Label htmlFor="collaborator-role">역할</Label>
        <Input
          id="collaborator-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="예: 편집자, 디자이너, 매니저"
        />
      </div>

      {/* 정산 방식 */}
      <div className="space-y-2">
        <Label htmlFor="collaborator-payment-type">정산 방식</Label>
        <Select value={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)}>
          <SelectTrigger id="collaborator-payment-type">
            <SelectValue placeholder="정산 방식을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {paymentTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 고정급 */}
      {showBaseAmount && (
        <div className="space-y-2">
          <Label htmlFor="collaborator-base-amount">고정급 (월)</Label>
          <div className="relative">
            <Input
              id="collaborator-base-amount"
              type="number"
              value={baseAmount}
              onChange={(e) => setBaseAmount(e.target.value)}
              placeholder="0"
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              원
            </span>
          </div>
        </div>
      )}

      {/* 수익 배분율 */}
      {showPercentage && (
        <div className="space-y-2">
          <Label htmlFor="collaborator-percentage">수익 배분율</Label>
          <div className="relative">
            <Input
              id="collaborator-percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="0"
              className="pr-8"
              min="0"
              max="100"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>
      )}

      {/* 메모 */}
      <div className="space-y-2">
        <Label htmlFor="collaborator-memo">메모 (선택)</Label>
        <Input
          id="collaborator-memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력하세요"
        />
      </div>

      {/* 제출 버튼 */}
      <Button
        type="submit"
        className="w-full"
        disabled={!canSubmit || createCollaborator.isPending}
      >
        {createCollaborator.isPending ? '저장 중...' : '협력자 추가'}
      </Button>
    </form>
  )
}
