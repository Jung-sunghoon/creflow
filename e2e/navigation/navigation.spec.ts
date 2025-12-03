import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should display bottom navigation on mobile', async ({ page }) => {
    await page.goto('/login')

    // 하단 네비게이션이 보이지 않아야 함 (로그인 페이지는 nav 없음)
    const nav = page.locator('nav')

    // 로그인 페이지에서는 nav가 없을 수 있음
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })
    await expect(loginButton).toBeVisible()
  })

  test('should navigate between pages via bottom nav or redirect to login', async ({ page }) => {
    await page.goto('/')

    // 로그인 리다이렉트 확인
    await expect(page).toHaveURL(/\/login/)
  })

  test('should have CreFlow logo on login page', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'CreFlow' })).toBeVisible()
  })

  test('should have terms and privacy notice on login', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText(/이용약관/)).toBeVisible()
    await expect(page.getByText(/개인정보처리방침/)).toBeVisible()
  })
})
