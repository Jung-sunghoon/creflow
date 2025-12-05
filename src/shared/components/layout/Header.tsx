'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'

interface HeaderProps {
  title?: string
  showSettings?: boolean
}

export function Header({ title = 'CreFlow', showSettings = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="mx-auto max-w-[480px] h-14 px-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-neutral-900">{title}</h1>

        {showSettings && (
          <Link
            href="/settings"
            className="p-2 -mr-2 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="설정"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </header>
  )
}
