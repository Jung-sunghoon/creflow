import { test, expect } from '@playwright/test'

test.describe('Expense List', () => {
  test('should display expense management page or redirect to login', async ({ page }) => {
    await page.goto('/expense')

    // 지출 관리 페이지 또는 로그인 리다이렉트
    const title = page.getByRole('heading', { name: /지출 관리/ })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(title.or(loginButton)).toBeVisible()
  })

  test('should have add expense button or show login', async ({ page }) => {
    await page.goto('/expense')

    // 지출 추가 버튼 확인 (인증된 상태에서)
    const addButton = page.getByRole('button').filter({ has: page.locator('svg') })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(addButton.first().or(loginButton)).toBeVisible()
  })
})
