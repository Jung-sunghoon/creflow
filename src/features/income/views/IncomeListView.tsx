'use client'

import { useState } from 'react'
import { format, subMonths, addMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { IncomeCard, CampaignCard } from '../components/IncomeCard'
import { useIncomes, useCampaigns, useUpdateCampaignStatus, useDeleteIncome, useDeleteCampaign } from '../hooks/useIncome'
import { formatCurrency } from '@/shared/lib/calculations'

export function IncomeListView() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const monthString = format(currentMonth, 'yyyy-MM')

  const { data: incomes = [], isLoading: incomesLoading } = useIncomes(monthString)
  const { data: campaigns = [], isLoading: campaignsLoading } = useCampaigns(monthString)
  const updateCampaignStatus = useUpdateCampaignStatus()
  const deleteIncome = useDeleteIncome()
  const deleteCampaign = useDeleteCampaign()

  const isLoading = incomesLoading || campaignsLoading

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const platformIncomes = incomes.filter((i) => i.type === 'platform')
  const totalPlatformIncome = platformIncomes.reduce((sum, i) => sum + i.amount, 0)
  const totalCampaignIncome = campaigns.reduce((sum, c) => sum + c.amount, 0)
  const totalIncome = totalPlatformIncome + totalCampaignIncome

  const handleTogglePaid = (campaignId: string, isPaid: boolean) => {
    updateCampaignStatus.mutate({ id: campaignId, isPaid })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">수익 관리</h1>
          <Link href="/income/new">
            <Button size="sm" variant="ghost">
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* 월 선택 */}
        <div className="flex items-center justify-center gap-4 py-3">
          <button onClick={handlePrevMonth} className="p-1 cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <span className="text-base font-medium">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </span>
          <button onClick={handleNextMonth} className="p-1 cursor-pointer">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 총 수익 요약 */}
      <div className="px-4 py-6 bg-neutral-50">
        <p className="text-sm text-muted-foreground mb-1">이번 달 총 수익</p>
        <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
          <span>플랫폼 {formatCurrency(totalPlatformIncome)}</span>
          <span>광고/협찬 {formatCurrency(totalCampaignIncome)}</span>
        </div>
      </div>

      {/* 수익 목록 */}
      <div className="px-4 py-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* 플랫폼 수익 */}
            {platformIncomes.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  플랫폼 수익
                </h2>
                <div className="space-y-3">
                  {platformIncomes.map((income) => (
                    <IncomeCard
                      key={income.id}
                      income={income}
                      onEdit={() => router.push(`/income/${income.id}/edit`)}
                      onDelete={() => deleteIncome.mutate(income.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 광고/협찬 */}
            {campaigns.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  광고/협찬
                </h2>
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onTogglePaid={(isPaid) => handleTogglePaid(campaign.id, isPaid)}
                      onEdit={() => router.push(`/income/campaign/${campaign.id}/edit`)}
                      onDelete={() => deleteCampaign.mutate(campaign.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 빈 상태 */}
            {platformIncomes.length === 0 && campaigns.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  등록된 수익이 없습니다
                </p>
                <Link href="/income/new">
                  <Button>수익 등록하기</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
