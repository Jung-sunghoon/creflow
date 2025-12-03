import { test as base, expect } from '@playwright/test'

type AuthFixtures = {
  authenticatedPage: typeof expect
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // 테스트용 로그인 (환경변수로 테스트 계정 사용)
    await page.goto('/login')

    // 실제 E2E에서는 테스트 계정으로 로그인
    // 개발 환경에서는 mock 인증 사용 가능
    await page.evaluate(() => {
      localStorage.setItem('sb-test-auth-token', JSON.stringify({
        access_token: 'test-token',
        user: { id: 'test-user', email: 'test@example.com' }
      }))
    })

    await use(expect)
  },
})

export { expect } from '@playwright/test'
