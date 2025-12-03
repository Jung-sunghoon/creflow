'use client'

import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Calendar } from 'lucide-react'
import type { UpcomingEvent } from '@/shared/types'
import { cn } from '@/shared/lib/utils'

interface UpcomingEventsProps {
  events: UpcomingEvent[]
}

function getDaysLeftColor(daysLeft: number) {
  if (daysLeft <= 3) return 'bg-red-100 text-red-700'
  if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-700'
  return 'bg-neutral-100 text-neutral-700'
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  if (events.length === 0) {
    return null
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
