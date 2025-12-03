// 플랫폼 타입
export type PlatformType = 'youtube' | 'soop' | 'chzzk' | 'instagram' | 'tiktok' | 'other'

// SOOP 등급
export type SoopTier = 'normal' | 'best' | 'partner'

// 치지직 등급
export type ChzzkTier = 'rookie' | 'pro' | 'partner'

// 유튜브 수익 유형
export type YoutubeIncomeType = 'ad' | 'superchat' | 'membership'

// 수익 유형
export type IncomeType = 'platform' | 'ad'

// 수익 입력 방식
export type InputMethod = 'direct' | 'raw_count'

// 협력자 역할
export type CollaboratorRole = 'editor' | 'thumbnail' | 'moderator' | 'manager' | 'other'

// 정산 방식
export type PaymentType = 'fixed' | 'percentage' | 'hybrid'

// 지출 유형
export type ExpenseType = 'collaborator' | 'other'

// 피드백 유형
export type FeedbackType = 'feature' | 'bug' | 'other'

// 사용자
export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

// 플랫폼 설정
export interface Platform {
  id: string
  user_id: string
  type: PlatformType
  tier: SoopTier | ChzzkTier | null
  commission_rate: number | null // 직접 입력 시 수수료율 (%)
  is_active: boolean
  created_at: string
}

// 협력자
export interface Collaborator {
  id: string
  user_id: string
  name: string
  role: string
  payment_type: PaymentType
  base_amount: number | null
  percentage: number | null
  memo: string | null
  created_at: string
}

// 광고/협찬 캠페인
export interface Campaign {
  id: string
  user_id: string
  brand_name: string
  amount: number
  payment_date: string | null
  is_paid: boolean
  memo: string | null
  created_at: string
}

// 수익
export interface Income {
  id: string
  user_id: string
  type: IncomeType
  source: PlatformType | null
  income_type: YoutubeIncomeType | null // 유튜브용
  input_method: InputMethod | null
  raw_count: number | null // 별풍선/치즈 개수
  raw_amount: number | null // 원본 금액
  commission_rate: number | null // 적용된 수수료율 (%)
  commission_amount: number | null // 수수료 금액
  withholding_tax: number | null // 원천징수 금액 (3.3%)
  amount: number // 실수령액
  date: string
  campaign_id: string | null
  memo: string | null
  created_at: string
}

// 지출
export interface Expense {
  id: string
  user_id: string
  type: ExpenseType
  collaborator_id: string | null
  description: string | null
  amount: number
  date: string
  is_paid: boolean
  memo: string | null
  created_at: string
  collaborators?: Collaborator
}

// 피드백
export interface Feedback {
  id: string
  user_id: string | null
  type: FeedbackType
  content: string
  email: string | null
  created_at: string
}

// 수익 입력 폼 데이터
export interface IncomeFormData {
  type: IncomeType
  source?: PlatformType
  income_type?: YoutubeIncomeType
  input_method?: InputMethod
  raw_count?: number
  amount: number
  date: string
  memo?: string
  // 광고/협찬용
  brand_name?: string
  payment_date?: string
  is_paid?: boolean
}

// 지출 입력 폼 데이터
export interface ExpenseFormData {
  type: ExpenseType
  collaborator_id?: string
  description?: string
  amount: number
  date: string
  is_paid?: boolean
  memo?: string
}

// 협력자 입력 폼 데이터
export interface CollaboratorFormData {
  name: string
  role: string
  payment_type: PaymentType
  base_amount?: number
  percentage?: number
  memo?: string
}

// 플랫폼 설정 폼 데이터
export interface PlatformFormData {
  type: PlatformType
  tier?: SoopTier | ChzzkTier
  commission_rate?: number
}

// 대시보드 요약 데이터
export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  netIncome: number
  previousMonthNetIncome: number
  changeRate: number // 전월 대비 순수익 증감률 (%)
  incomeChangeRate: number // 전월 대비 수익 증감률 (%)
  expenseChangeRate: number // 전월 대비 지출 증감률 (%)
}

// 다가오는 일정
export interface UpcomingEvent {
  id: string
  type: 'payment' | 'deadline'
  title: string
  date: string
  daysLeft: number
}

// 월별 요약
export interface MonthlySummary {
  month: string // YYYY-MM
  totalIncome: number
  totalExpense: number
  netIncome: number
  changeRate: number
}

// 연간 리포트
export interface AnnualReport {
  year: number
  totalIncome: number
  totalExpense: number
  netIncome: number
  incomeBySource: Record<PlatformType | 'ad', number>
  expenseByCollaborator: Array<{
    name: string
    amount: number
  }>
  monthlySummaries: MonthlySummary[]
}
