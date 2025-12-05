import { Header } from '@/shared/components/layout/Header'
import { BottomNav } from '@/shared/components/layout/BottomNav'
import { SideNav } from '@/shared/components/layout/SideNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
      >
        본문으로 건너뛰기
      </a>

      {/* PC 사이드바 */}
      <SideNav />

      {/* 모바일 헤더 (PC에서는 숨김) */}
      <div className="lg:hidden">
        <Header />
      </div>

      {/* 메인 컨텐츠 */}
      <main id="main-content" className="flex-1 pb-20 lg:pb-0">
        <div className="mx-auto max-w-[480px] lg:max-w-5xl lg:px-8 lg:py-8 min-h-full flex flex-col">
          {children}
        </div>
      </main>

      {/* 모바일 하단 네비 (PC에서는 숨김) */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
