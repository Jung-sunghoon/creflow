import { Header } from '@/shared/components/layout/Header'
import { BottomNav } from '@/shared/components/layout/BottomNav'
import { SideNav } from '@/shared/components/layout/SideNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* PC 사이드바 */}
      <SideNav />

      {/* 모바일 헤더 (PC에서는 숨김) */}
      <div className="lg:hidden">
        <Header />
      </div>

      {/* 메인 컨텐츠 */}
      <main className="lg:ml-60 pb-20 lg:pb-0">
        <div className="mx-auto max-w-[480px] lg:max-w-5xl lg:px-8 lg:py-8">
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
