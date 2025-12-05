'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, TrendingDown, FileText } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const navItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/income', label: '수익', icon: TrendingUp },
  { href: '/expense', label: '지출', icon: TrendingDown },
  { href: '/report', label: '리포트', icon: FileText },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="mx-auto max-w-[480px]">
        <ul className="flex items-center justify-around h-16">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/'
              ? pathname === '/'
              : pathname.startsWith(href)

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer',
                    isActive
                      ? 'text-neutral-900'
                      : 'text-neutral-400 hover:text-neutral-600'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                  <span className={cn(
                    'text-xs',
                    isActive ? 'font-semibold' : 'font-medium'
                  )}>
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
