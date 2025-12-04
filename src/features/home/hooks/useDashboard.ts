'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import { startOfMonth, endOfMonth, subMonths, format, differenceInDays } from 'date-fns'
import type { DashboardSummary, UpcomingEvent, PlatformType } from '@/shared/types'

// 최근 활동 타입
export interface RecentActivity {
  id: string
  type: 'income' | 'expense'
  source: PlatformType | 'ad' | 'collaborator' | 'other'
  description: string
  amount: number
  date: string
}

// 현재 로그인한 사용자 ID 가져오기
async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

// 변화율 계산
function calculateChangeRate(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardSummary | null> => {
      const userId = await getCurrentUserId()
      if (!userId) return null

      const supabase = createClient()
      const now = new Date()

      // 이번 달 범위
      const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd')
      const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd')

      // 지난 달 범위
      const prevMonth = subMonths(now, 1)
      const prevMonthStart = format(startOfMonth(prevMonth), 'yyyy-MM-dd')
      const prevMonthEnd = format(endOfMonth(prevMonth), 'yyyy-MM-dd')

      // 이번 달 플랫폼 수익
      const { data: currentIncomes } = await supabase
        .from('incomes')
        .select('amount')
        .eq('user_id', userId)
        .gte('date', currentMonthStart)
        .lte('date', currentMonthEnd)

      // 이번 달 입금된 캠페인 (광고/협찬)
      const { data: currentCampaigns } = await supabase
        .from('campaigns')
        .select('amount')
        .eq('user_id', userId)
        .eq('is_paid', true)
        .gte('payment_date', currentMonthStart)
        .lte('payment_date', currentMonthEnd)

      // 이번 달 지급된 지출
      const { data: currentExpenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', userId)
        .eq('is_paid', true)
        .gte('date', currentMonthStart)
        .lte('date', currentMonthEnd)

      // 지난 달 플랫폼 수익
      const { data: prevIncomes } = await supabase
        .from('incomes')
        .select('amount')
        .eq('user_id', userId)
        .gte('date', prevMonthStart)
        .lte('date', prevMonthEnd)

      // 지난 달 입금된 캠페인
      const { data: prevCampaigns } = await supabase
        .from('campaigns')
        .select('amount')
        .eq('user_id', userId)
        .eq('is_paid', true)
        .gte('payment_date', prevMonthStart)
        .lte('payment_date', prevMonthEnd)

      // 지난 달 지급된 지출
      const { data: prevExpenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', userId)
        .eq('is_paid', true)
        .gte('date', prevMonthStart)
        .lte('date', prevMonthEnd)

      // 이번 달 집계
      const incomeSum = currentIncomes?.reduce((sum, i) => sum + (i.amount || 0), 0) ?? 0
      const campaignSum = currentCampaigns?.reduce((sum, c) => sum + (c.amount || 0), 0) ?? 0
      const totalIncome = incomeSum + campaignSum

      const totalExpense = currentExpenses?.reduce((sum, e) => sum + (e.amount || 0), 0) ?? 0
      const netIncome = totalIncome - totalExpense

      // 지난 달 집계
      const prevIncomeSum = prevIncomes?.reduce((sum, i) => sum + (i.amount || 0), 0) ?? 0
      const prevCampaignSum = prevCampaigns?.reduce((sum, c) => sum + (c.amount || 0), 0) ?? 0
      const prevTotalIncome = prevIncomeSum + prevCampaignSum

      const prevTotalExpense = prevExpenses?.reduce((sum, e) => sum + (e.amount || 0), 0) ?? 0
      const previousMonthNetIncome = prevTotalIncome - prevTotalExpense

      // 변화율 계산
      const changeRate = calculateChangeRate(netIncome, previousMonthNetIncome)
      const incomeChangeRate = calculateChangeRate(totalIncome, prevTotalIncome)
      const expenseChangeRate = calculateChangeRate(totalExpense, prevTotalExpense)

      return {
        totalIncome,
        totalExpense,
        netIncome,
        previousMonthNetIncome,
        changeRate,
        incomeChangeRate,
        expenseChangeRate,
      }
    },
    staleTime: 0, // 즉시 업데이트
  })
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async (): Promise<UpcomingEvent[]> => {
      const userId = await getCurrentUserId()
      if (!userId) return []

      const supabase = createClient()
      const today = new Date()
      const todayStr = format(today, 'yyyy-MM-dd')
      const twoWeeksLater = format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')

      const events: UpcomingEvent[] = []

      // 미입금 캠페인 (입금 예정)
      const { data: unpaidCampaigns } = await supabase
        .from('campaigns')
        .select('id, brand_name, payment_date')
        .eq('user_id', userId)
        .eq('is_paid', false)
        .not('payment_date', 'is', null)
        .gte('payment_date', todayStr)
        .lte('payment_date', twoWeeksLater)
        .order('payment_date', { ascending: true })
        .limit(5)

      if (unpaidCampaigns) {
        for (const campaign of unpaidCampaigns) {
          if (campaign.payment_date) {
            const daysLeft = differenceInDays(new Date(campaign.payment_date), today)
            events.push({
              id: campaign.id,
              type: 'deadline',
              title: `${campaign.brand_name} 입금 예정`,
              date: campaign.payment_date,
              daysLeft: Math.max(0, daysLeft),
            })
          }
        }
      }

      // 미지급 지출 (정산 예정) - 협력자 정보 포함
      const { data: unpaidExpenses } = await supabase
        .from('expenses')
        .select('id, description, date, collaborators(name)')
        .eq('user_id', userId)
        .eq('is_paid', false)
        .gte('date', todayStr)
        .lte('date', twoWeeksLater)
        .order('date', { ascending: true })
        .limit(5)

      if (unpaidExpenses) {
        for (const expense of unpaidExpenses) {
          const daysLeft = differenceInDays(new Date(expense.date), today)
          const collaboratorData = expense.collaborators as unknown
          const collaborator = Array.isArray(collaboratorData)
            ? (collaboratorData[0] as { name: string } | undefined)
            : (collaboratorData as { name: string } | null)
          const title = collaborator?.name
            ? `${collaborator.name} 정산일`
            : expense.description || '지출 예정'

          events.push({
            id: expense.id,
            type: 'payment',
            title,
            date: expense.date,
            daysLeft: Math.max(0, daysLeft),
          })
        }
      }

      // daysLeft 기준으로 정렬
      return events.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5)
    },
    staleTime: 0, // 즉시 업데이트
  })
}

// 플랫폼 이름 변환
const platformNames: Record<string, string> = {
  youtube: '유튜브',
  soop: '숲',
  chzzk: '치지직',
  instagram: '인스타그램',
  tiktok: '틱톡',
  other: '기타',
  ad: '광고',
  collaborator: '협력자',
}

export function useRecentActivities(limit = 5) {
  return useQuery({
    queryKey: ['recent-activities', limit],
    queryFn: async (): Promise<RecentActivity[]> => {
      const userId = await getCurrentUserId()
      if (!userId) return []

      const supabase = createClient()
      const activities: RecentActivity[] = []

      // 최근 수익 (플랫폼)
      const { data: incomes } = await supabase
        .from('incomes')
        .select('id, source, amount, date, memo')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit)

      if (incomes) {
        for (const income of incomes) {
          activities.push({
            id: income.id,
            type: 'income',
            source: income.source || 'other',
            description: platformNames[income.source || 'other'] || '수익',
            amount: income.amount,
            date: income.date,
          })
        }
      }

      // 최근 캠페인 (광고)
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, brand_name, amount, payment_date, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (campaigns) {
        for (const campaign of campaigns) {
          activities.push({
            id: campaign.id,
            type: 'income',
            source: 'ad',
            description: campaign.brand_name,
            amount: campaign.amount,
            date: campaign.payment_date || campaign.created_at.split('T')[0],
          })
        }
      }

      // 최근 지출
      const { data: expenses } = await supabase
        .from('expenses')
        .select('id, type, description, amount, date, collaborators(name)')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit)

      if (expenses) {
        for (const expense of expenses) {
          const collaboratorData = expense.collaborators as unknown
          const collaborator = Array.isArray(collaboratorData)
            ? (collaboratorData[0] as { name: string } | undefined)
            : (collaboratorData as { name: string } | null)

          activities.push({
            id: expense.id,
            type: 'expense',
            source: expense.type === 'collaborator' ? 'collaborator' : 'other',
            description: collaborator?.name || expense.description || '지출',
            amount: expense.amount,
            date: expense.date,
          })
        }
      }

      // 날짜순 정렬 후 limit 개수만 반환
      return activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    },
    staleTime: 0,
  })
}
