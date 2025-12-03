import { Header } from '@/shared/components/layout/Header'
import { BottomNav } from '@/shared/components/layout/BottomNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="mx-auto max-w-[480px] pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
