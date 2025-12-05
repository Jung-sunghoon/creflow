'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Plus, Minus } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { formatCurrency } from '@/shared/lib/calculations'
import { cn } from '@/shared/lib/utils'
import type { RecentActivity } from '../hooks/useDashboard'

interface RecentActivitiesProps {
  activities: RecentActivity[]
  isLoading?: boolean
}

export function RecentActivities({ activities, isLoading }: RecentActivitiesProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-700">최근 활동</h2>
        <Card className="p-4 bg-card border-0 shadow-sm">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-neutral-100 rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-neutral-100 rounded w-24" />
                  <div className="h-3 bg-neutral-100 rounded w-16" />
                </div>
                <div className="h-4 bg-neutral-100 rounded w-20" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-700">최근 활동</h2>
        <Card className="p-6 bg-card border-0 shadow-sm">
          <p className="text-sm text-neutral-500 text-center">
            아직 기록이 없어요
          </p>
        </Card>
      </div>
    )
  }

  return (
    <section className="space-y-3" aria-labelledby="recent-activities-title">
      <h2 id="recent-activities-title" className="text-sm font-medium text-neutral-700">최근 활동</h2>
      <Card className="bg-card border-0 shadow-sm divide-y divide-border">
        {activities.map((activity) => (
          <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3 p-4">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                activity.type === 'income' ? 'bg-blue-50' : 'bg-red-50'
              )}
            >
              {activity.type === 'income' ? (
                <Plus className="w-4 h-4 text-blue-600" />
              ) : (
                <Minus className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-neutral-500">
                {format(new Date(activity.date), 'M월 d일', { locale: ko })}
              </p>
            </div>
            <p
              className={cn(
                'text-sm font-semibold shrink-0',
                activity.type === 'income' ? 'text-blue-600' : 'text-red-600'
              )}
            >
              {activity.type === 'income' ? '+' : '-'}
              {formatCurrency(activity.amount)}
            </p>
          </div>
        ))}
      </Card>
    </section>
  )
}
