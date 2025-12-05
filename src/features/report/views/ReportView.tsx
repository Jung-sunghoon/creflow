'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { AnnualSummary } from '../components/AnnualSummary'
import { MonthlyList } from '../components/MonthlyList'
import { IncomeBreakdown } from '../components/IncomeBreakdown'
import { ExpenseBreakdown } from '../components/ExpenseBreakdown'
import { useAnnualReport } from '../hooks/useReport'
import { toast } from 'sonner'
import { AdBanner } from '@/shared/components/common'

export function ReportView() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const { data: report, isLoading } = useAnnualReport(year)

  const handlePrevYear = () => setYear((y) => y - 1)
  const handleNextYear = () => setYear((y) => Math.min(y + 1, currentYear))

  const handleDownloadPDF = async () => {
    try {
      toast.loading('PDF 생성 중...')

      const response = await fetch(`/api/report/pdf?year=${year}`)

      if (!response.ok) {
        throw new Error('PDF 생성 실패')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `creflow-report-${year}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.dismiss()
      toast.success('PDF가 다운로드되었습니다')
    } catch (error) {
      toast.dismiss()
      toast.error('PDF 다운로드에 실패했습니다')
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen bg-background" aria-label="연간 리포트">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">연간 리포트</h1>
          <Button size="sm" variant="ghost" onClick={handleDownloadPDF}>
            <Download className="w-5 h-5" />
          </Button>
        </div>

        {/* 연도 선택 */}
        <div className="flex items-center justify-center gap-4 py-3">
          <button onClick={handlePrevYear} className="p-1 cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <span className="text-base font-medium">{year}년</span>
          <button
            onClick={handleNextYear}
            className="p-1 cursor-pointer disabled:cursor-not-allowed"
            disabled={year >= currentYear}
          >
            <ChevronRight className={`w-5 h-5 ${
              year >= currentYear ? 'text-neutral-200' : 'text-muted-foreground'
            }`} />
          </button>
        </div>
      </div>

      {/* 리포트 내용 */}
      <div className="px-4 py-6 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : report ? (
          <>
            <AnnualSummary report={report} />
            <IncomeBreakdown incomeBySource={report.incomeBySource} />
            <ExpenseBreakdown expenseByCollaborator={report.expenseByCollaborator} />
            <MonthlyList summaries={report.monthlySummaries} />
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            데이터를 불러올 수 없습니다
          </div>
        )}
      </div>

      {/* 광고 배너 */}
      <div className="px-4 pb-4">
        <AdBanner slot="7012859813" />
      </div>
    </main>
  )
}
