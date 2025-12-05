'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, TrendingDown, FileText, Settings } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const navItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/income', label: '수익', icon: TrendingUp },
  { href: '/expense', label: '지출', icon: TrendingDown },
  { href: '/report', label: '리포트', icon: FileText },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-background border-r border-border fixed left-0 top-0">
      {/* 로고 */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-100">
        <Link href="/" className="text-xl font-bold text-neutral-900 cursor-pointer">
          CreFlow
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/'
              ? pathname === '/'
              : pathname.startsWith(href)

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
                    isActive
                      ? 'bg-neutral-100 text-neutral-900 font-medium'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 하단 설정 */}
      <div className="p-3 border-t border-neutral-100">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
            pathname === '/settings'
              ? 'bg-neutral-100 text-neutral-900 font-medium'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
          )}
          aria-current={pathname === '/settings' ? 'page' : undefined}
        >
          <Settings className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          <span>설정</span>
        </Link>
      </div>
    </aside>
  )
}
