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
import { DatePicker } from '@/shared/components/ui/date-picker'
import { formatCurrency } from '@/shared/lib/calculations'
import { useCreateExpense, useUpdateExpense } from '../hooks/useExpense'
import { useCollaborators } from '@/features/collaborator/hooks/useCollaborator'
import type { Expense, ExpenseType } from '@/shared/types'
import { toast } from 'sonner'

const expenseTypes: { value: ExpenseType; label: string }[] = [
  { value: 'collaborator', label: '인건비 (협력자)' },
  { value: 'other', label: '기타 지출' },
]

interface ExpenseFormProps {
  expense?: Expense // 수정 모드일 때 기존 데이터
}

export function ExpenseForm({ expense }: ExpenseFormProps) {
  const router = useRouter()
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const { data: collaborators = [] } = useCollaborators()

  const isEditMode = !!expense

  const [type, setType] = useState<ExpenseType | ''>(expense?.type || '')
  const [collaboratorId, setCollaboratorId] = useState(expense?.collaborator_id || '')
  const [description, setDescription] = useState(expense?.description || '')
  const [amount, setAmount] = useState(expense?.amount?.toString() || '')
  const [date, setDate] = useState<Date>(expense?.date ? new Date(expense.date) : new Date())
  const [isPaid, setIsPaid] = useState(expense?.is_paid || false)
  const [memo, setMemo] = useState(expense?.memo || '')

  const isCollaboratorType = type === 'collaborator'
  const canSubmit = type && amount && date && (isCollaboratorType ? collaboratorId : description)
  const isPending = createExpense.isPending || updateExpense.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!type || !amount) return

    const formData = {
      type: type as ExpenseType,
      collaborator_id: isCollaboratorType ? collaboratorId : undefined,
      description: isCollaboratorType
        ? collaborators.find(c => c.id === collaboratorId)?.name
        : description,
      amount: Number(amount),
      date: format(date, 'yyyy-MM-dd'),
      is_paid: isPaid,
      memo: memo || undefined,
    }

    try {
      if (isEditMode && expense) {
        await updateExpense.mutateAsync({ id: expense.id, data: formData })
        toast.success('지출이 수정되었습니다')
      } else {
        await createExpense.mutateAsync(formData)
        toast.success('지출이 등록되었습니다')
      }
      router.push('/expense')
    } catch (error) {
      toast.error(isEditMode ? '수정에 실패했습니다' : '등록에 실패했습니다')
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
        <DatePicker
          value={date}
          onChange={(d) => d && setDate(d)}
          placeholder="날짜를 선택하세요"
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
        disabled={!canSubmit || isPending}
      >
        {isPending ? '저장 중...' : isEditMode ? '수정하기' : '저장하기'}
      </Button>
    </form>
  )
}
