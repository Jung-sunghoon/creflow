'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { DatePicker } from '@/shared/components/ui/date-picker'
import { Card } from '@/shared/components/ui/card'
import {
  PLATFORMS,
  YOUTUBE_INCOME_TYPES,
  SOOP_TIERS,
  CHZZK_TIERS,
} from '@/shared/lib/constants'
import {
  formatCurrency,
  calculateSoopIncome,
  calculateChzzkIncome,
  calculateYoutubeIncome,
} from '@/shared/lib/calculations'
import { useCreateIncome, useUpdateIncome } from '../hooks/useIncome'
import { usePlatformSettings } from '@/features/settings/hooks/usePlatformSettings'
import type {
  Income,
  PlatformType,
  YoutubeIncomeType,
  SoopTier,
  ChzzkTier,
} from '@/shared/types'
import { toast } from 'sonner'

const platformOptions: PlatformType[] = ['youtube', 'soop', 'chzzk', 'other']

interface PlatformIncomeFormProps {
  income?: Income
}

export function PlatformIncomeForm({ income }: PlatformIncomeFormProps) {
  const router = useRouter()
  const createIncome = useCreateIncome()
  const updateIncome = useUpdateIncome()
  const { data: platformSettings = [] } = usePlatformSettings()

  const isEditMode = !!income

  // 온보딩에서 설정한 주 플랫폼 (첫 번째 활성 플랫폼)
  const primaryPlatform = platformSettings[0]

  // 공통 상태
  const [source, setSource] = useState<PlatformType | ''>(income?.source || '')
  const [date, setDate] = useState<Date>(income?.date ? new Date(income.date) : new Date())
  const [memo, setMemo] = useState(income?.memo || '')

  // 유튜브 상태
  const [youtubeIncomeType, setYoutubeIncomeType] = useState<YoutubeIncomeType | ''>(
    income?.income_type || ''
  )
  const [youtubeAmount, setYoutubeAmount] = useState(income?.amount?.toString() || '')

  // 숲 상태 - 온보딩 설정에서 가져오기
  const soopSetting = platformSettings.find(p => p.type === 'soop')
  const [soopTier, setSoopTier] = useState<SoopTier>((soopSetting?.tier as SoopTier) || 'best')
  const [soopBalloonCount, setSoopBalloonCount] = useState(income?.raw_count?.toString() || '')

  // 치지직 상태 - 온보딩 설정에서 가져오기
  const chzzkSetting = platformSettings.find(p => p.type === 'chzzk')
  const [chzzkTier, setChzzkTier] = useState<ChzzkTier>((chzzkSetting?.tier as ChzzkTier) || 'pro')
  const [chzzkCheeseCount, setChzzkCheeseCount] = useState(income?.raw_count?.toString() || '')

  // 온보딩에서 설정한 주 플랫폼을 기본값으로 (신규 등록 시에만)
  useEffect(() => {
    if (!isEditMode && !source && primaryPlatform) {
      setSource(primaryPlatform.type as PlatformType)
    }
  }, [isEditMode, source, primaryPlatform])

  // 플랫폼 설정이 로드되면 등급 업데이트
  useEffect(() => {
    if (soopSetting?.tier && !income) {
      setSoopTier(soopSetting.tier as SoopTier)
    }
    if (chzzkSetting?.tier && !income) {
      setChzzkTier(chzzkSetting.tier as ChzzkTier)
    }
  }, [soopSetting, chzzkSetting, income])

  // 기타 상태
  const [otherAmount, setOtherAmount] = useState(income?.amount?.toString() || '')

  // 계산 결과
  const calculationResult = useMemo(() => {
    if (source === 'soop' && soopBalloonCount) {
      return calculateSoopIncome(Number(soopBalloonCount), soopTier)
    }
    if (source === 'chzzk' && chzzkCheeseCount) {
      return calculateChzzkIncome(Number(chzzkCheeseCount), chzzkTier)
    }
    if (source === 'youtube' && youtubeIncomeType && youtubeAmount) {
      return calculateYoutubeIncome(Number(youtubeAmount), youtubeIncomeType as YoutubeIncomeType)
    }
    return null
  }, [source, soopTier, soopBalloonCount, chzzkTier, chzzkCheeseCount, youtubeIncomeType, youtubeAmount])

  // 제출 가능 여부
  const canSubmit = useMemo(() => {
    if (!source || !date) return false
    switch (source) {
      case 'youtube':
        return youtubeIncomeType && youtubeAmount
      case 'soop':
        return soopBalloonCount
      case 'chzzk':
        return chzzkCheeseCount
      case 'other':
        return otherAmount
      default:
        return false
    }
  }, [source, date, youtubeIncomeType, youtubeAmount, soopBalloonCount, chzzkCheeseCount, otherAmount])

  const isPending = createIncome.isPending || updateIncome.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!source) return

    let formData: Record<string, unknown> = {
      type: 'platform',
      source,
      date: format(date, 'yyyy-MM-dd'),
      memo: memo || undefined,
    }

    // 플랫폼별 데이터 설정
    switch (source) {
      case 'youtube':
        formData = {
          ...formData,
          income_type: youtubeIncomeType,
          input_method: 'direct',
          amount: Number(youtubeAmount),
          raw_amount: calculationResult?.rawAmount,
          commission_rate: calculationResult?.commissionRate,
          commission_amount: calculationResult?.commissionAmount,
        }
        break

      case 'soop':
        formData = {
          ...formData,
          input_method: 'raw_count',
          raw_count: Number(soopBalloonCount),
          raw_amount: calculationResult?.rawAmount,
          commission_rate: calculationResult?.commissionRate,
          commission_amount: calculationResult?.commissionAmount,
          withholding_tax: calculationResult?.withholdingTax,
          amount: calculationResult?.netAmount || 0,
        }
        break

      case 'chzzk':
        formData = {
          ...formData,
          input_method: 'raw_count',
          raw_count: Number(chzzkCheeseCount),
          raw_amount: calculationResult?.rawAmount,
          commission_rate: calculationResult?.commissionRate,
          commission_amount: calculationResult?.commissionAmount,
          withholding_tax: calculationResult?.withholdingTax,
          amount: calculationResult?.netAmount || 0,
        }
        break

      case 'other':
      default:
        formData = {
          ...formData,
          input_method: 'direct',
          amount: Number(otherAmount),
        }
        break
    }

    try {
      if (isEditMode && income) {
        await updateIncome.mutateAsync({ id: income.id, data: formData })
        toast.success('수익이 수정되었습니다')
      } else {
        await createIncome.mutateAsync(formData as never)
        toast.success('수익이 등록되었습니다')
      }
      router.push('/income')
    } catch (error) {
      toast.error(isEditMode ? '수정에 실패했습니다' : '등록에 실패했습니다')
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

      {/* ===== 유튜브 ===== */}
      {source === 'youtube' && (
        <>
          <div className="space-y-2">
            <Label>수익 유형</Label>
            <Select
              value={youtubeIncomeType}
              onValueChange={(v) => setYoutubeIncomeType(v as YoutubeIncomeType)}
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

          <div className="space-y-2">
            <Label>정산 금액 (유튜브 스튜디오 표시 금액)</Label>
            <div className="relative">
              <Input
                type="number"
                value={youtubeAmount}
                onChange={(e) => setYoutubeAmount(e.target.value)}
                placeholder="0"
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
          </div>

          {calculationResult && (
            <Card className="p-4 bg-blue-50 border-blue-100">
              <p className="text-sm text-blue-600 mb-2">💰 수익 계산 결과</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">추정 원본 수익</span>
                  <span>{formatCurrency(calculationResult.rawAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>유튜브 수수료 ({calculationResult.commissionRate}%)</span>
                  <span>-{formatCurrency(calculationResult.commissionAmount)}</span>
                </div>
                <div className="border-t pt-1 mt-1 flex justify-between font-semibold">
                  <span>실수령액</span>
                  <span>{formatCurrency(calculationResult.netAmount)}</span>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* ===== 숲 (SOOP) ===== */}
      {source === 'soop' && (
        <>
          <div className="space-y-2">
            <Label>BJ 등급</Label>
            <Select value={soopTier} onValueChange={(v) => setSoopTier(v as SoopTier)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SOOP_TIERS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>별풍선 개수</Label>
            <div className="relative">
              <Input
                type="number"
                value={soopBalloonCount}
                onChange={(e) => setSoopBalloonCount(e.target.value)}
                placeholder="0"
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                개
              </span>
            </div>
          </div>

          {calculationResult && (
            <Card className="p-4 bg-blue-50 border-blue-100">
              <p className="text-sm text-blue-600 mb-2">💰 수익 계산 결과</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">별풍선 {soopBalloonCount}개 × 110원</span>
                  <span>{formatCurrency(calculationResult.rawAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>수수료 ({calculationResult.commissionRate}%)</span>
                  <span>-{formatCurrency(calculationResult.commissionAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>원천징수 (3.3%)</span>
                  <span>-{formatCurrency(calculationResult.withholdingTax)}</span>
                </div>
                <div className="border-t pt-1 mt-1 flex justify-between font-semibold">
                  <span>실수령액</span>
                  <span>{formatCurrency(calculationResult.netAmount)}</span>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* ===== 치지직 ===== */}
      {source === 'chzzk' && (
        <>
          <div className="space-y-2">
            <Label>스트리머 등급</Label>
            <Select value={chzzkTier} onValueChange={(v) => setChzzkTier(v as ChzzkTier)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHZZK_TIERS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>치즈 개수</Label>
            <div className="relative">
              <Input
                type="number"
                value={chzzkCheeseCount}
                onChange={(e) => setChzzkCheeseCount(e.target.value)}
                placeholder="0"
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                개
              </span>
            </div>
          </div>

          {calculationResult && (
            <Card className="p-4 bg-green-50 border-green-100">
              <p className="text-sm text-green-600 mb-2">💰 수익 계산 결과</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">치즈 {chzzkCheeseCount}개 × 1원</span>
                  <span>{formatCurrency(calculationResult.rawAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>수수료 ({calculationResult.commissionRate}%)</span>
                  <span>-{formatCurrency(calculationResult.commissionAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>원천징수 (3.3%)</span>
                  <span>-{formatCurrency(calculationResult.withholdingTax)}</span>
                </div>
                <div className="border-t pt-1 mt-1 flex justify-between font-semibold">
                  <span>실수령액</span>
                  <span>{formatCurrency(calculationResult.netAmount)}</span>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* ===== 기타 ===== */}
      {source === 'other' && (
        <div className="space-y-2">
          <Label>수익 금액</Label>
          <div className="relative">
            <Input
              type="number"
              value={otherAmount}
              onChange={(e) => setOtherAmount(e.target.value)}
              placeholder="0"
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              원
            </span>
          </div>
          {otherAmount && (
            <p className="text-sm text-muted-foreground">
              {formatCurrency(Number(otherAmount))}
            </p>
          )}
        </div>
      )}

      {/* 날짜 */}
      {source && (
        <div className="space-y-2">
          <Label>정산일</Label>
          <DatePicker
            value={date}
            onChange={(d) => d && setDate(d)}
            placeholder="날짜를 선택하세요"
          />
        </div>
      )}

      {/* 메모 */}
      {source && (
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
