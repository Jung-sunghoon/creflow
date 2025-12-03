import type {
  SoopTier,
  ChzzkTier,
  YoutubeIncomeType,
  Income,
  Expense,
  Campaign,
  Collaborator,
  PaymentType,
} from '@/shared/types'
import {
  SOOP_COMMISSION_RATES,
  CHZZK_COMMISSION_RATES,
  YOUTUBE_COMMISSION_RATES,
  WITHHOLDING_TAX_RATE,
  SOOP_BALLOON_PRICE,
  CHZZK_CHEESE_PRICE,
} from './constants'

interface CalculationResult {
  rawAmount: number      // 원본 금액
  commissionRate: number // 수수료율 (%)
  commissionAmount: number // 수수료 금액
  withholdingTax: number // 원천징수 금액
  netAmount: number      // 실수령액
}

/**
 * SOOP 별풍선 수익 계산
 * @param count 별풍선 개수
 * @param tier SOOP 등급
 * @param customRate 직접 입력한 수수료율 (선택)
 */
export function calculateSoopIncome(
  count: number,
  tier: SoopTier,
  customRate?: number
): CalculationResult {
  const rawAmount = count * SOOP_BALLOON_PRICE
  const commissionRate = customRate ?? SOOP_COMMISSION_RATES[tier]
  const afterCommission = rawAmount * (1 - commissionRate / 100)
  const withholdingTax = Math.floor(afterCommission * WITHHOLDING_TAX_RATE)
  const netAmount = Math.floor(afterCommission - withholdingTax)
  const commissionAmount = rawAmount - afterCommission

  return {
    rawAmount,
    commissionRate,
    commissionAmount: Math.floor(commissionAmount),
    withholdingTax,
    netAmount,
  }
}

/**
 * 치지직 치즈 수익 계산
 * @param count 치즈 개수
 * @param tier 치지직 등급
 * @param customRate 직접 입력한 수수료율 (선택)
 */
export function calculateChzzkIncome(
  count: number,
  tier: ChzzkTier,
  customRate?: number
): CalculationResult {
  const rawAmount = count * CHZZK_CHEESE_PRICE
  const commissionRate = customRate ?? CHZZK_COMMISSION_RATES[tier]
  const afterCommission = rawAmount * (1 - commissionRate / 100)
  const withholdingTax = Math.floor(afterCommission * WITHHOLDING_TAX_RATE)
  const netAmount = Math.floor(afterCommission - withholdingTax)
  const commissionAmount = rawAmount - afterCommission

  return {
    rawAmount,
    commissionRate,
    commissionAmount: Math.floor(commissionAmount),
    withholdingTax,
    netAmount,
  }
}

/**
 * 유튜브 수익 계산 (이미 정산된 금액에서 역산)
 * @param netAmount 정산받은 금액 (실수령액)
 * @param incomeType 수익 유형
 */
export function calculateYoutubeIncomeFromNet(
  netAmount: number,
  incomeType: YoutubeIncomeType
): CalculationResult {
  const commissionRate = YOUTUBE_COMMISSION_RATES[incomeType]
  // 역산: netAmount = rawAmount * (1 - commissionRate/100)
  const rawAmount = Math.round(netAmount / (1 - commissionRate / 100))
  const commissionAmount = rawAmount - netAmount

  return {
    rawAmount,
    commissionRate,
    commissionAmount,
    withholdingTax: 0, // 유튜브는 이미 처리됨
    netAmount,
  }
}

/**
 * 이번 달 총 수익 계산
 * 플랫폼 수익 + 입금완료된 광고 수익
 */
export function calculateTotalIncome(
  incomes: Income[],
  campaigns: Campaign[]
): number {
  const platformIncome = incomes
    .filter(income => income.type === 'platform')
    .reduce((sum, income) => sum + income.amount, 0)

  const adIncome = campaigns
    .filter(campaign => campaign.is_paid)
    .reduce((sum, campaign) => sum + campaign.amount, 0)

  return platformIncome + adIncome
}

/**
 * 이번 달 총 지출 계산
 * 지급완료된 인건비 + 기타 지출
 */
export function calculateTotalExpense(expenses: Expense[]): number {
  return expenses
    .filter(expense => expense.is_paid)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

/**
 * 순수익 계산
 */
export function calculateNetIncome(totalIncome: number, totalExpense: number): number {
  return totalIncome - totalExpense
}

/**
 * 전월 대비 증감률 계산
 */
export function calculateChangeRate(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0
  }
  return Math.round(((currentValue - previousValue) / previousValue) * 100 * 10) / 10
}

/**
 * 협력자 이번 달 지출 계산
 */
export function calculateCollaboratorExpense(
  collaborator: Collaborator,
  totalMonthlyIncome: number
): number {
  const baseAmount = collaborator.base_amount ?? 0
  const percentage = collaborator.percentage ?? 0

  switch (collaborator.payment_type) {
    case 'fixed':
      return baseAmount

    case 'percentage':
      return Math.floor(totalMonthlyIncome * (percentage / 100))

    case 'hybrid':
      return baseAmount + Math.floor(totalMonthlyIncome * (percentage / 100))

    default:
      return 0
  }
}

/**
 * 금액 포맷팅 (원화)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * 금액 포맷팅 (단위 축약)
 * 예: 1,234,567 → 123.5만
 */
export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억`
  }
  if (Math.abs(amount) >= 10000) {
    return `${(amount / 10000).toFixed(1)}만`
  }
  return formatCurrency(amount)
}

/**
 * 퍼센트 포맷팅
 */
export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

/**
 * 정산 방식 설명 텍스트
 */
export function getPaymentTypeDescription(
  type: PaymentType,
  baseAmount?: number,
  percentage?: number
): string {
  switch (type) {
    case 'fixed':
      return baseAmount ? `월 ${formatCurrency(baseAmount)}` : '고정급'
    case 'percentage':
      return percentage ? `수익의 ${percentage}%` : '수익 배분'
    case 'hybrid':
      if (baseAmount && percentage) {
        return `${formatCurrency(baseAmount)} + ${percentage}%`
      }
      return '고정급 + 수익 배분'
    default:
      return ''
  }
}
