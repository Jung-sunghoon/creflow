import { test, expect } from '@playwright/test'

test.describe('Settings', () => {
  test('should display settings page or redirect to login', async ({ page }) => {
    await page.goto('/settings')

    // 설정 페이지 또는 로그인
    const header = page.getByRole('heading', { name: '설정' })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(header.or(loginButton)).toBeVisible()
  })

  test('should display account section or login', async ({ page }) => {
    await page.goto('/settings')

    // 계정 섹션 또는 로그인
    const accountSection = page.getByText('계정')
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(accountSection.or(loginButton)).toBeVisible()
  })
})
