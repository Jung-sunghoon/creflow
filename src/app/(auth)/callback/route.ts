import { createClient } from '@/shared/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 신규 사용자인지 확인
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // 플랫폼 설정이 있는지 확인 (온보딩 완료 여부)
        const { data: platforms } = await supabase
          .from('platforms')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)

        // 온보딩 미완료 → 온보딩 페이지로
        if (!platforms || platforms.length === 0) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      // 온보딩 완료 또는 기존 사용자 → 원래 목적지로
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // 오류 발생 시 로그인 페이지로
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
