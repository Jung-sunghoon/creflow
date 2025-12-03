import { createClient } from '@/shared/lib/supabase/client'
import type { Income, Expense, Campaign, MonthlySummary, AnnualReport, PlatformType } from '@/shared/types'

export async function getAnnualReport(
  userId: string,
  year: number
): Promise<AnnualReport> {
  const supabase = createClient()

  // 해당 연도의 모든 수익 조회
  const { data: incomes, error: incomeError } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', userId)
    .gte('date', `${year}-01-01`)
    .lte('date', `${year}-12-31`)

  if (incomeError) throw incomeError

  // 해당 연도의 모든 캠페인 조회
  const { data: campaigns, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .gte('payment_date', `${year}-01-01`)
    .lte('payment_date', `${year}-12-31`)

  if (campaignError) throw campaignError

  // 해당 연도의 모든 지출 조회
  const { data: expenses, error: expenseError } = await supabase
    .from('expenses')
    .select('*, collaborators(*)')
    .eq('user_id', userId)
    .gte('date', `${year}-01-01`)
    .lte('date', `${year}-12-31`)

  if (expenseError) throw expenseError

  return calculateAnnualReport(
    year,
    incomes || [],
    campaigns || [],
    expenses || []
  )
}

function calculateAnnualReport(
  year: number,
  incomes: Income[],
  campaigns: Campaign[],
  expenses: Expense[]
): AnnualReport {
  // 월별 요약 계산
  const monthlySummaries: MonthlySummary[] = []

  for (let month = 1; month <= 12; month++) {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`

    const monthIncomes = incomes.filter((i) => i.date.startsWith(monthStr))
    const monthCampaigns = campaigns.filter((c) =>
      c.payment_date?.startsWith(monthStr) && c.is_paid
    )
    const monthExpenses = expenses.filter((e) =>
      e.date.startsWith(monthStr) && e.is_paid
    )

    const totalIncome =
      monthIncomes.reduce((sum, i) => sum + i.amount, 0) +
      monthCampaigns.reduce((sum, c) => sum + c.amount, 0)

    const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0)

    const netIncome = totalIncome - totalExpense

    // 전월 대비 변화율
    const prevMonth = monthlySummaries[monthlySummaries.length - 1]
    const changeRate = prevMonth
      ? prevMonth.netIncome === 0
        ? netIncome > 0
          ? 100
          : 0
        : Math.round(((netIncome - prevMonth.netIncome) / Math.abs(prevMonth.netIncome)) * 100)
      : 0

    monthlySummaries.push({
      month: monthStr,
      totalIncome,
      totalExpense,
      netIncome,
      changeRate,
    })
  }

  // 플랫폼별 수익 집계
  const incomeBySource: Record<PlatformType | 'ad', number> = {
    youtube: 0,
    soop: 0,
    chzzk: 0,
    instagram: 0,
    tiktok: 0,
    other: 0,
    ad: 0,
  }

  incomes.forEach((income) => {
    if (income.type === 'platform' && income.source) {
      incomeBySource[income.source] += income.amount
    }
  })

  campaigns.forEach((campaign) => {
    if (campaign.is_paid) {
      incomeBySource.ad += campaign.amount
    }
  })

  // 협력자별 지출 집계
  const expenseByCollaboratorMap = new Map<string, number>()

  expenses.forEach((expense) => {
    if (expense.is_paid && expense.type === 'collaborator') {
      const name = expense.description || '미지정'
      const current = expenseByCollaboratorMap.get(name) || 0
      expenseByCollaboratorMap.set(name, current + expense.amount)
    }
  })

  const expenseByCollaborator = Array.from(expenseByCollaboratorMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)

  // 연간 합계
  const totalIncome = monthlySummaries.reduce((sum, m) => sum + m.totalIncome, 0)
  const totalExpense = monthlySummaries.reduce((sum, m) => sum + m.totalExpense, 0)
  const netIncome = totalIncome - totalExpense

  return {
    year,
    totalIncome,
    totalExpense,
    netIncome,
    incomeBySource,
    expenseByCollaborator,
    monthlySummaries,
  }
}

export async function getMonthlySummaries(
  userId: string,
  year: number
): Promise<MonthlySummary[]> {
  const report = await getAnnualReport(userId, year)
  return report.monthlySummaries
}
