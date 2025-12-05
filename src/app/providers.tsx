'use client'

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  )
}

function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // 항상 fresh
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // 인증 관련 에러는 재시도하지 않음
              const errorMessage = (error as Error).message?.toLowerCase() ?? ''
              if (
                errorMessage.includes('로그인') ||
                errorMessage.includes('인증') ||
                errorMessage.includes('auth')
              ) {
                return false
              }
              return failureCount < 2
            },
          },
          mutations: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            // 쿼리 에러 로깅
            console.error('Query error:', error)
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            // 뮤테이션 에러 시 토스트 표시
            const message = (error as Error).message || '오류가 발생했습니다'
            toast.error(message)
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
