import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/shared/components/ui/sonner'
import { QueryProvider } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'CreFlow - 크리에이터 수익 관리',
  description: '흩어진 수익, 한눈에 정리하세요. 유튜브, 숲, 치지직, 광고 수익부터 협력자 정산까지.',
  keywords: ['크리에이터', '수익 관리', '스트리머', '유튜버', '인플루언서', '정산'],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'CreFlow - 크리에이터 수익 관리',
    description: '흩어진 수익, 한눈에 정리하세요',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreFlow - 크리에이터 수익 관리',
    description: '흩어진 수익, 한눈에 정리하세요',
  },
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
