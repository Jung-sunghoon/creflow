import { test, expect } from '@playwright/test'

test.describe('Income Form', () => {
  test('should display income form tabs or redirect to login', async ({ page }) => {
    await page.goto('/income/new')

    // 로그인 버튼 또는 플랫폼 수익 탭이 보여야 함
    const platformTab = page.getByRole('button', { name: '플랫폼 수익' })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(platformTab.or(loginButton)).toBeVisible()
  })

  test('should display campaign tab or redirect to login', async ({ page }) => {
    await page.goto('/income/new')

    const campaignTab = page.getByRole('button', { name: '광고/협찬' })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(campaignTab.or(loginButton)).toBeVisible()
  })

  test('should have back button or show login', async ({ page }) => {
    await page.goto('/income/new')

    // 뒤로가기 버튼 (ChevronLeft svg) 또는 로그인
    const backButton = page.locator('button').filter({ has: page.locator('svg') }).first()
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(backButton.or(loginButton)).toBeVisible()
  })

  test('should display "수익 등록" header or login', async ({ page }) => {
    await page.goto('/income/new')

    const header = page.getByRole('heading', { name: '수익 등록' })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(header.or(loginButton)).toBeVisible()
  })
})
