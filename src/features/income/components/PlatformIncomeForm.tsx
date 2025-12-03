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
import { PLATFORMS, YOUTUBE_INCOME_TYPES } from '@/shared/lib/constants'
import { formatCurrency } from '@/shared/lib/calculations'
import { useCreateIncome } from '../hooks/useIncome'
import type { PlatformType, YoutubeIncomeType, InputMethod } from '@/shared/types'
import { toast } from 'sonner'

const platformOptions: PlatformType[] = ['youtube', 'soop', 'chzzk', 'other']

export function PlatformIncomeForm() {
  const router = useRouter()
  const createIncome = useCreateIncome()

  const [source, setSource] = useState<PlatformType | ''>('')
  const [incomeType, setIncomeType] = useState<YoutubeIncomeType | ''>('')
  const [inputMethod, setInputMethod] = useState<InputMethod>('direct')
  const [rawCount, setRawCount] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [memo, setMemo] = useState('')

  const isYoutube = source === 'youtube'
  const canSubmit = source && amount && date

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!source || !amount) return

    try {
      await createIncome.mutateAsync({
        type: 'platform',
        source: source as PlatformType,
        income_type: isYoutube ? (incomeType as YoutubeIncomeType) : undefined,
        input_method: inputMethod,
        raw_count: inputMethod === 'raw_count' ? Number(rawCount) : undefined,
        amount: Number(amount),
        date,
        memo: memo || undefined,
      })

      toast.success('수익이 등록되었습니다')
      router.push('/income')
    } catch (error) {
      toast.error('등록에 실패했습니다')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 플랫폼 선택 */}
      <div className="space-y-2">
        <Label>플랫폼</Label>
        <Select value={source} onValueChange={(v) => setSource(v as PlatformType)}>
          <SelectTrigger>
            <SelectValue placeholder="플랫폼을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {PLATFORMS[platform].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 유튜브 수익 유형 */}
      {isYoutube && (
        <div className="space-y-2">
          <Label>수익 유형</Label>
          <Select
            value={incomeType}
            onValueChange={(v) => setIncomeType(v as YoutubeIncomeType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="수익 유형을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(YOUTUBE_INCOME_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 금액 */}
      <div className="space-y-2">
        <Label>실수령액</Label>
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
        <Label>정산일</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
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
