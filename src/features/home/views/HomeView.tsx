'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { NetIncomeCard } from '../components/NetIncomeCard'
import { SummaryCards } from '../components/SummaryCards'
import { UpcomingEvents } from '../components/UpcomingEvents'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { useDashboard, useUpcomingEvents } from '../hooks/useDashboard'

export function HomeView() {
  const currentMonth = format(new Date(), 'M월', { locale: ko })
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard()
  const { data: events = [], isLoading: eventsLoading } = useUpcomingEvents()

  // 로딩 중일 때 스켈레톤 표시
  if (dashboardLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="px-4 py-6 lg:px-0">
      {/* PC: 2컬럼 그리드, 모바일: 수직 스택 */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
        {/* 왼쪽 영역 - 순수익 + 수익/지출 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 순수익 카드 */}
          <NetIncomeCard
            month={currentMonth}
            netIncome={dashboard?.netIncome ?? 0}
            changeRate={dashboard?.changeRate ?? 0}
          />

          {/* 수익/지출 요약 카드 */}
          <SummaryCards
            totalIncome={dashboard?.totalIncome ?? 0}
            totalExpense={dashboard?.totalExpense ?? 0}
            incomeChangeRate={dashboard?.incomeChangeRate ?? 0}
            expenseChangeRate={dashboard?.expenseChangeRate ?? 0}
          />
        </div>

        {/* 오른쪽 영역 - 다가오는 일정 */}
        <div className="lg:col-span-1">
          <UpcomingEvents events={events} isLoading={eventsLoading} />
        </div>
      </div>
    </div>
  )
}
