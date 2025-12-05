'use client'

import { Skeleton } from '@/shared/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="px-4 py-6 lg:px-0">
      {/* PC: 2컬럼 그리드, 모바일: 수직 스택 */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
        {/* 왼쪽 영역 */}
        <div className="lg:col-span-2 space-y-6">
          {/* NetIncomeCard 스켈레톤 */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <Skeleton className="h-4 w-20 mb-4" />
            <div className="lg:flex lg:items-baseline lg:gap-4">
              <Skeleton className="h-10 w-40 mb-2 lg:mb-0" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* SummaryCards 스켈레톤 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <Skeleton className="h-4 w-16 mb-3" />
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <Skeleton className="h-4 w-16 mb-3" />
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 - UpcomingEvents 스켈레톤 */}
        <div className="lg:col-span-1 space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="bg-card rounded-xl shadow-sm divide-y divide-neutral-100">
            <div className="flex items-center gap-3 p-4">
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-3 p-4">
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
