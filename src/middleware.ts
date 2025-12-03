import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/shared/lib/supabase/middleware'

// 공개 라우트 (인증 불필요)
const publicRoutes = ['/login', '/callback']

// 인증 필요 라우트
const protectedRoutes = ['/', '/income', '/expense', '/report', '/settings', '/onboarding']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 세션 갱신 및 사용자 확인
  const { supabaseResponse, user } = await updateSession(request)

  // 공개 라우트 처리
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // 이미 로그인된 사용자가 로그인 페이지 접근 시 홈으로 리다이렉트
    if (user && pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return supabaseResponse
  }

  // 보호된 라우트 처리
  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    if (!user) {
      // 미인증 사용자 → 로그인 페이지로 리다이렉트
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 다음을 제외한 모든 요청 경로에서 실행:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - public 폴더의 정적 파일들
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
