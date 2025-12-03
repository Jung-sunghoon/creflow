import { test, expect } from '@playwright/test'

test.describe('Expense Form', () => {
  test('should display expense form or redirect to login', async ({ page }) => {
    await page.goto('/expense/new')

    // 지출 등록 헤더 또는 로그인 버튼이 보여야 함
    const header = page.getByRole('heading', { name: '지출 등록' })
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(header.or(loginButton)).toBeVisible()
  })

  test('should have back button or show login', async ({ page }) => {
    await page.goto('/expense/new')

    // 뒤로가기 버튼 또는 로그인
    const backButton = page.locator('button').filter({ has: page.locator('svg') }).first()
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(backButton.or(loginButton)).toBeVisible()
  })

  test('should display expense type selector or login', async ({ page }) => {
    await page.goto('/expense/new')

    // 지출 유형 선택 또는 로그인
    const formElement = page.locator('form')
    const loginButton = page.getByRole('button', { name: /Google로 시작하기/i })

    await expect(formElement.or(loginButton)).toBeVisible()
  })
})
