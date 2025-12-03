import type {
  PlatformType,
  SoopTier,
  ChzzkTier,
  PaymentType,
  ExpenseType,
  YoutubeIncomeType
} from '@/shared/types'

// 플랫폼 정보
export const PLATFORMS: Record<PlatformType, { label: string; icon: string }> = {
  youtube: { label: '유튜브', icon: 'Youtube' },
  soop: { label: '숲 (SOOP)', icon: 'Tv' },
  chzzk: { label: '치지직', icon: 'Gamepad2' },
  instagram: { label: '인스타그램', icon: 'Instagram' },
  tiktok: { label: '틱톡', icon: 'Music' },
  other: { label: '기타', icon: 'MoreHorizontal' },
}

// SOOP 등급별 수수료율
export const SOOP_COMMISSION_RATES: Record<SoopTier, number> = {
  normal: 40,   // 일반 BJ: 40%
  best: 30,     // 베스트 BJ: 30%
  partner: 20,  // 파트너 BJ: 20%
}

export const SOOP_TIERS: Record<SoopTier, string> = {
  normal: '일반 BJ (수수료 40%)',
  best: '베스트 BJ (수수료 30%)',
  partner: '파트너 BJ (수수료 20%)',
}

// 치지직 등급별 수수료율
export const CHZZK_COMMISSION_RATES: Record<ChzzkTier, number> = {
  rookie: 35,   // 루키: 35% (프로모션 적용)
  pro: 25,      // 프로: 25% (프로모션 적용)
  partner: 20,  // 파트너: 20%
}

export const CHZZK_TIERS: Record<ChzzkTier, string> = {
  rookie: '루키 (수수료 35%)',
  pro: '프로 (수수료 25%)',
  partner: '파트너 (수수료 20%)',
}

// 유튜브 수익 유형별 수수료율
export const YOUTUBE_COMMISSION_RATES: Record<YoutubeIncomeType, number> = {
  ad: 45,         // 광고 수익: 45%
  superchat: 30,  // 슈퍼챗/슈퍼스티커/슈퍼땡스: 30%
  membership: 30, // 채널 멤버십: 30%
}

export const YOUTUBE_INCOME_TYPES: Record<YoutubeIncomeType, string> = {
  ad: '광고 수익 (수수료 45%)',
  superchat: '슈퍼챗/슈퍼땡스 (수수료 30%)',
  membership: '채널 멤버십 (수수료 30%)',
}

// 원천징수율
export const WITHHOLDING_TAX_RATE = 0.033 // 3.3%

// 별풍선/치즈 단가
export const SOOP_BALLOON_PRICE = 110  // 별풍선 1개 = 110원
export const CHZZK_CHEESE_PRICE = 1    // 치즈 1개 = 1원

// 협력자 역할 예시
export const COLLABORATOR_ROLE_EXAMPLES = [
  '편집자',
  '썸네일러',
  '모더레이터',
  '매니저',
  '디자이너',
  '기타',
] as const

// 정산 방식
export const PAYMENT_TYPES: Record<PaymentType, string> = {
  fixed: '고정급',
  percentage: '수익 배분',
  hybrid: '고정급 + 수익 배분',
}

// 지출 유형
export const EXPENSE_TYPES: Record<ExpenseType, string> = {
  collaborator: '인건비',
  other: '기타',
}

// 컬러 시스템
export const COLORS = {
  primary: '#18181B',
  accent: '#2563EB',
  accentRed: '#DC2626',
  accentYellow: '#F59E0B',
  accentGreen: '#16A34A',
  background: '#FFFFFF',
  card: '#FAFAFA',
  border: '#E4E4E7',
  muted: '#71717A',
} as const

// 네비게이션 아이템
export const NAV_ITEMS = [
  { href: '/', label: '홈', icon: 'Home' },
  { href: '/income', label: '수익', icon: 'TrendingUp' },
  { href: '/expense', label: '지출', icon: 'TrendingDown' },
  { href: '/report', label: '리포트', icon: 'FileText' },
] as const

// 날짜 형식
export const DATE_FORMAT = 'yyyy-MM-dd'
export const MONTH_FORMAT = 'yyyy-MM'
export const DISPLAY_DATE_FORMAT = 'yyyy년 M월 d일'
export const DISPLAY_MONTH_FORMAT = 'yyyy년 M월'
