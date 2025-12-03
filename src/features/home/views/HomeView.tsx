'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { NetIncomeCard } from '../components/NetIncomeCard'
import { SummaryCards } from '../components/SummaryCards'
import { UpcomingEvents } from '../components/UpcomingEvents'
import type { UpcomingEvent } from '@/shared/types'

// TODO: 실제 데이터 연동
const mockData = {
  netIncome: 3080000,
  changeRate: 12.3,
  totalIncome: 4230000,
  totalExpense: 1150000,
  incomeChangeRate: 8.5,
  expenseChangeRate: 3.2,
}

const mockEvents: UpcomingEvent[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'OO브랜드 영상 업로드',
    date: '2025-12-06',
    daysLeft: 3,
  },
  {
    id: '2',
    type: 'payment',
    title: '편집자 김OO 정산일',
    date: '2025-12-10',
    daysLeft: 7,
  },
]

export function HomeView() {
  const currentMonth = format(new Date(), 'M월', { locale: ko })

  return (
    <div className="px-4 py-6 space-y-6">
      {/* 순수익 카드 */}
      <NetIncomeCard
        month={currentMonth}
        netIncome={mockData.netIncome}
        changeRate={mockData.changeRate}
      />

      {/* 수익/지출 요약 카드 */}
      <SummaryCards
        totalIncome={mockData.totalIncome}
        totalExpense={mockData.totalExpense}
        incomeChangeRate={mockData.incomeChangeRate}
        expenseChangeRate={mockData.expenseChangeRate}
      />

      {/* 다가오는 일정 */}
      <UpcomingEvents events={mockEvents} />
    </div>
  )
}
