'use client'

import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Calendar } from 'lucide-react'
import type { UpcomingEvent } from '@/shared/types'
import { cn } from '@/shared/lib/utils'

interface UpcomingEventsProps {
  events: UpcomingEvent[]
  isLoading?: boolean
}

function getDaysLeftColor(daysLeft: number) {
  if (daysLeft <= 3) return 'bg-red-100 text-red-700'
  if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-700'
  return 'bg-neutral-100 text-neutral-700'
}

export function UpcomingEvents({ events, isLoading = false }: UpcomingEventsProps) {
  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          다가오는 일정
        </h2>
        <Card className="bg-white border-0 shadow-sm divide-y divide-neutral-100">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </Card>
      </div>
    )
  }

  // 일정이 없을 때
  if (events.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          다가오는 일정
        </h2>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-center text-sm text-neutral-500">
            <p className="mb-1">📅 예정된 일정이 없어요</p>
            <p className="text-xs text-neutral-400">
              광고 입금일, 정산일이 여기에 표시돼요
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        다가오는 일정
      </h2>

      <Card className="bg-white border-0 shadow-sm divide-y divide-neutral-100">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs font-medium',
                  getDaysLeftColor(event.daysLeft)
                )}
              >
                D-{event.daysLeft}
              </Badge>
              <span className="text-sm text-neutral-700">{event.title}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
