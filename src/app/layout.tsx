import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/shared/components/ui/sonner'
import { QueryProvider } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'CreFlow - 크리에이터 수익 관리',
  description: '크리에이터의 진짜 수익을 3초 만에. 수익부터 지출까지, 크리에이터 사업의 모든 숫자를 한눈에.',
  keywords: ['크리에이터', '수익 관리', '스트리머', '유튜버', '인플루언서'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
