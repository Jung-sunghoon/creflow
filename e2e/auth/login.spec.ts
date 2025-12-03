import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/')

    // 미인증 시 로그인 페이지로 리다이렉트 확인 (쿼리 파라미터 포함 가능)
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display Google login button', async ({ page }) => {
    await page.goto('/login')

    // Google 로그인 버튼 확인 (Google로 시작하기)
    await expect(page.getByRole('button', { name: /Google로 시작하기/i })).toBeVisible()
  })

  test('should display CreFlow branding', async ({ page }) => {
    await page.goto('/login')

    // CreFlow 로고/텍스트 확인
    await expect(page.getByRole('heading', { name: 'CreFlow' })).toBeVisible()
  })
})
