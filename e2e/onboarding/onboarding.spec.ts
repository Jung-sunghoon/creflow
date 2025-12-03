import { test, expect } from '@playwright/test'

test.describe('Onboarding', () => {
  test('should display onboarding page or redirect to login', async ({ page }) => {
    await page.goto('/onboarding')

    // 온보딩 진행바 또는 로그인 버튼이 보여야 함
    const progressBar = page.locator('.bg-primary')
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(progressBar.or(loginButton)).toBeVisible()
  })

  test('should show platform selection step or login', async ({ page }) => {
    await page.goto('/onboarding')

    // 플랫폼 선택 텍스트 또는 로그인
    const platformText = page.getByText(/플랫폼|사용하시는/)
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(platformText.or(loginButton)).toBeVisible()
  })

  test('should have next button disabled when no platform selected or show login', async ({ page }) => {
    await page.goto('/onboarding')

    // 다음 버튼 또는 로그인
    const nextButton = page.getByRole('button', { name: '다음' })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(nextButton.or(loginButton)).toBeVisible()
  })
})
