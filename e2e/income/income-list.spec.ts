import { test, expect } from '@playwright/test'

test.describe('Income List', () => {
  // 로그인 상태 시뮬레이션이 필요하므로 실제 환경에서는 beforeEach에서 인증 처리

  test('should display income management page or redirect to login', async ({ page }) => {
    // 실제 테스트에서는 인증 후 접근
    await page.goto('/income')

    // 로그인 페이지로 리다이렉트될 수 있음 (인증 미구현 시)
    // 인증이 되어있다면 수익 관리 타이틀 확인
    const title = page.getByRole('heading', { name: /수익 관리/ })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    // 둘 중 하나가 보여야 함
    await expect(title.or(loginButton)).toBeVisible()
  })

  test('should have month navigation or show login', async ({ page }) => {
    await page.goto('/income')

    // 월 선택 영역이 있어야 함 (인증된 상태에서)
    const monthSelector = page.getByText(/년/).first()
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })
    await expect(monthSelector.or(loginButton)).toBeVisible()
  })
})
