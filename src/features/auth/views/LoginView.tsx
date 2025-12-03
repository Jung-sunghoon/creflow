'use client'

import { GoogleLoginButton } from '../components/GoogleLoginButton'

export function LoginView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="w-full max-w-sm space-y-8">
        {/* 로고 & 슬로건 */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-neutral-900">CreFlow</h1>
          <p className="text-neutral-600 text-sm">
            크리에이터의 진짜 수익을 3초 만에
          </p>
        </div>

        {/* 로그인 버튼 */}
        <div className="space-y-4">
          <GoogleLoginButton />
          <p className="text-xs text-center text-neutral-500">
            로그인하면{' '}
            <span className="underline">이용약관</span>과{' '}
            <span className="underline">개인정보처리방침</span>에
            동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
