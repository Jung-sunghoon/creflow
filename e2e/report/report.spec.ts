import { test, expect } from '@playwright/test'

test.describe('Report', () => {
  test('should display report page or redirect to login', async ({ page }) => {
    await page.goto('/report')

    // 연간 리포트 헤더 또는 로그인
    const header = page.getByRole('heading', { name: '연간 리포트' })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(header.or(loginButton)).toBeVisible()
  })

  test('should display current year or login', async ({ page }) => {
    await page.goto('/report')

    const currentYear = new Date().getFullYear()
    const yearText = page.getByText(`${currentYear}년`)
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(yearText.or(loginButton)).toBeVisible()
  })

  test('should have download button or show login', async ({ page }) => {
    await page.goto('/report')

    // 다운로드 버튼 (Download icon) 또는 로그인
    const downloadButton = page.locator('button').filter({ has: page.locator('svg') })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(downloadButton.first().or(loginButton)).toBeVisible()
  })

  test('should have year navigation or show login', async ({ page }) => {
    await page.goto('/report')

    // 연도 네비게이션 버튼 (ChevronLeft/Right) 또는 로그인
    const navButton = page.locator('button').filter({ has: page.locator('svg') })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(navButton.first().or(loginButton)).toBeVisible()
  })
})
