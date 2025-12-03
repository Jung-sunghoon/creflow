'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
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
import { Switch } from '@/shared/components/ui/switch'
import { formatCurrency } from '@/shared/lib/calculations'
import { useCreateExpense } from '../hooks/useExpense'
import { useCollaborators } from '@/features/collaborator/hooks/useCollaborator'
import type { ExpenseType } from '@/shared/types'
import { toast } from 'sonner'

const expenseTypes: { value: ExpenseType; label: string }[] = [
  { value: 'collaborator', label: '인건비 (협력자)' },
  { value: 'other', label: '기타 지출' },
]

export function ExpenseForm() {
  const router = useRouter()
  const createExpense = useCreateExpense()
  const { data: collaborators = [] } = useCollaborators()

  const [type, setType] = useState<ExpenseType | ''>('')
  const [collaboratorId, setCollaboratorId] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isPaid, setIsPaid] = useState(false)
  const [memo, setMemo] = useState('')

  const isCollaboratorType = type === 'collaborator'
  const canSubmit = type && amount && date && (isCollaboratorType ? collaboratorId : description)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!type || !amount) return

    try {
      await createExpense.mutateAsync({
        type: type as ExpenseType,
        collaborator_id: isCollaboratorType ? collaboratorId : undefined,
        description: isCollaboratorType
          ? collaborators.find(c => c.id === collaboratorId)?.name
          : description,
        amount: Number(amount),
        date,
        is_paid: isPaid,
        memo: memo || undefined,
      })

      toast.success('지출이 등록되었습니다')
      router.push('/expense')
    } catch (error) {
      toast.error('등록에 실패했습니다')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 지출 유형 */}
      <div className="space-y-2">
        <Label>지출 유형</Label>
        <Select value={type} onValueChange={(v) => setType(v as ExpenseType)}>
          <SelectTrigger>
            <SelectValue placeholder="지출 유형을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {expenseTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 협력자 선택 (인건비인 경우) */}
      {isCollaboratorType && (
        <div className="space-y-2">
          <Label>협력자</Label>
          <Select value={collaboratorId} onValueChange={setCollaboratorId}>
            <SelectTrigger>
              <SelectValue placeholder="협력자를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {collaborators.length > 0 ? (
                collaborators.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.role})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  등록된 협력자가 없습니다
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 지출 내용 (기타 지출인 경우) */}
      {type === 'other' && (
        <div className="space-y-2">
          <Label>지출 내용</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="지출 내용을 입력하세요"
          />
        </div>
      )}

      {/* 금액 */}
      <div className="space-y-2">
        <Label>금액</Label>
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

      {/* 날짜 */}
      <div className="space-y-2">
        <Label>지급일</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* 지급 완료 여부 */}
      <div className="flex items-center justify-between">
        <Label>지급 완료</Label>
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
        disabled={!canSubmit || createExpense.isPending}
      >
        {createExpense.isPending ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  )
}
