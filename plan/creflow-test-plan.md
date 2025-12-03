# CreFlow 테스트 플랜

> Vitest (단위/통합 테스트) + Playwright (E2E 테스트)

---

## 1. 테스트 환경 설정

### 1.1 패키지 설치

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D @playwright/test
```

### 1.2 Vitest 설정

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'vitest.setup.ts',
        '**/*.d.ts',
        '**/types/**',
        'e2e/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Supabase client
vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  }),
}))
```

### 1.3 Playwright 설정

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 1.4 package.json 스크립트 추가

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

---

## 2. 단위 테스트 (Vitest)

### 2.1 유틸리티 함수 테스트

```
shared/lib/__tests__/
├── calculations.test.ts
├── utils.test.ts
└── constants.test.ts
```

#### calculations.test.ts

```typescript
// shared/lib/__tests__/calculations.test.ts
import { describe, it, expect } from 'vitest'
import {
  calculateSoopIncome,
  calculateChzzkIncome,
  calculateTotalIncome,
  calculateTotalExpense,
  calculateNetIncome,
  calculateChangeRate,
  calculateCollaboratorExpense,
  formatCurrency,
  formatCurrencyCompact,
  formatPercent,
} from '../calculations'

describe('calculateSoopIncome', () => {
  it('should calculate normal tier income correctly', () => {
    const result = calculateSoopIncome(1000, 'normal')

    expect(result.rawAmount).toBe(110000) // 1000 * 110원
    expect(result.commissionRate).toBe(40)
    expect(result.netAmount).toBeGreaterThan(0)
    expect(result.netAmount).toBeLessThan(result.rawAmount)
  })

  it('should calculate best tier income correctly', () => {
    const result = calculateSoopIncome(1000, 'best')

    expect(result.commissionRate).toBe(30)
    expect(result.netAmount).toBeGreaterThan(
      calculateSoopIncome(1000, 'normal').netAmount
    )
  })

  it('should apply custom commission rate', () => {
    const result = calculateSoopIncome(1000, 'normal', 25)

    expect(result.commissionRate).toBe(25)
  })
})

describe('calculateChzzkIncome', () => {
  it('should calculate rookie tier income correctly', () => {
    const result = calculateChzzkIncome(100000, 'rookie')

    expect(result.rawAmount).toBe(100000) // 치즈 1개 = 1원
    expect(result.commissionRate).toBe(35)
  })

  it('should calculate partner tier income correctly', () => {
    const result = calculateChzzkIncome(100000, 'partner')

    expect(result.commissionRate).toBe(20)
    expect(result.netAmount).toBeGreaterThan(
      calculateChzzkIncome(100000, 'rookie').netAmount
    )
  })
})

describe('calculateTotalIncome', () => {
  it('should sum platform incomes and paid campaigns', () => {
    const incomes = [
      { id: '1', type: 'platform', amount: 100000 },
      { id: '2', type: 'platform', amount: 50000 },
    ]
    const campaigns = [
      { id: '1', is_paid: true, amount: 200000 },
      { id: '2', is_paid: false, amount: 100000 },
    ]

    const total = calculateTotalIncome(incomes as any, campaigns as any)

    expect(total).toBe(350000) // 100000 + 50000 + 200000
  })
})

describe('calculateTotalExpense', () => {
  it('should sum only paid expenses', () => {
    const expenses = [
      { id: '1', is_paid: true, amount: 50000 },
      { id: '2', is_paid: false, amount: 30000 },
      { id: '3', is_paid: true, amount: 20000 },
    ]

    const total = calculateTotalExpense(expenses as any)

    expect(total).toBe(70000) // 50000 + 20000
  })
})

describe('calculateNetIncome', () => {
  it('should return income minus expense', () => {
    expect(calculateNetIncome(500000, 200000)).toBe(300000)
    expect(calculateNetIncome(100000, 150000)).toBe(-50000)
  })
})

describe('calculateChangeRate', () => {
  it('should calculate percentage change correctly', () => {
    expect(calculateChangeRate(1200000, 1000000)).toBe(20)
    expect(calculateChangeRate(800000, 1000000)).toBe(-20)
  })

  it('should handle zero previous value', () => {
    expect(calculateChangeRate(100000, 0)).toBe(100)
    expect(calculateChangeRate(0, 0)).toBe(0)
  })
})

describe('calculateCollaboratorExpense', () => {
  it('should calculate fixed payment', () => {
    const collaborator = {
      payment_type: 'fixed' as const,
      base_amount: 500000,
      percentage: null,
    }

    expect(calculateCollaboratorExpense(collaborator as any, 1000000)).toBe(500000)
  })

  it('should calculate percentage payment', () => {
    const collaborator = {
      payment_type: 'percentage' as const,
      base_amount: null,
      percentage: 10,
    }

    expect(calculateCollaboratorExpense(collaborator as any, 1000000)).toBe(100000)
  })

  it('should calculate hybrid payment', () => {
    const collaborator = {
      payment_type: 'hybrid' as const,
      base_amount: 300000,
      percentage: 5,
    }

    expect(calculateCollaboratorExpense(collaborator as any, 1000000)).toBe(350000)
  })
})

describe('formatCurrency', () => {
  it('should format Korean Won correctly', () => {
    expect(formatCurrency(1234567)).toBe('₩1,234,567')
    expect(formatCurrency(0)).toBe('₩0')
  })
})

describe('formatCurrencyCompact', () => {
  it('should format large numbers with 만 unit', () => {
    expect(formatCurrencyCompact(10000)).toBe('1.0만')
    expect(formatCurrencyCompact(1234567)).toBe('123.5만')
  })

  it('should format very large numbers with 억 unit', () => {
    expect(formatCurrencyCompact(100000000)).toBe('1.0억')
    expect(formatCurrencyCompact(250000000)).toBe('2.5억')
  })
})

describe('formatPercent', () => {
  it('should format percentage with sign', () => {
    expect(formatPercent(25.5)).toBe('+25.5%')
    expect(formatPercent(-10.3)).toBe('-10.3%')
  })

  it('should format without sign when specified', () => {
    expect(formatPercent(25.5, false)).toBe('25.5%')
  })
})
```

### 2.2 컴포넌트 테스트

```
features/__tests__/
├── home/
│   ├── NetIncomeCard.test.tsx
│   └── SummaryCards.test.tsx
├── income/
│   ├── IncomeCard.test.tsx
│   └── PlatformIncomeForm.test.tsx
├── expense/
│   └── ExpenseCard.test.tsx
└── common/
    ├── EmptyState.test.tsx
    └── ErrorBoundary.test.tsx
```

#### 컴포넌트 테스트 예시

```typescript
// features/__tests__/income/IncomeCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IncomeCard } from '@/features/income/components/IncomeCard'

const mockIncome = {
  id: '1',
  user_id: 'user-1',
  type: 'platform' as const,
  source: 'youtube' as const,
  input_method: 'direct' as const,
  amount: 1500000,
  date: '2024-01-15',
  income_type: null,
  raw_count: null,
  raw_amount: null,
  commission_rate: null,
  commission_amount: null,
  withholding_tax: null,
  campaign_id: null,
  memo: null,
  created_at: '2024-01-15T00:00:00Z',
}

describe('IncomeCard', () => {
  it('should render income amount', () => {
    render(<IncomeCard income={mockIncome} />)

    expect(screen.getByText('₩1,500,000')).toBeInTheDocument()
  })

  it('should display platform name', () => {
    render(<IncomeCard income={mockIncome} />)

    expect(screen.getByText('유튜브')).toBeInTheDocument()
  })

  it('should show input method', () => {
    render(<IncomeCard income={mockIncome} />)

    expect(screen.getByText(/직접 입력/)).toBeInTheDocument()
  })
})
```

```typescript
// features/__tests__/common/EmptyState.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/shared/components/common/EmptyState'

describe('EmptyState', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        title="데이터가 없습니다"
        description="새로운 데이터를 추가해보세요"
      />
    )

    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument()
    expect(screen.getByText('새로운 데이터를 추가해보세요')).toBeInTheDocument()
  })

  it('should render action button with link', () => {
    render(
      <EmptyState
        title="수익이 없습니다"
        actionLabel="수익 등록하기"
        actionHref="/income/new"
      />
    )

    const button = screen.getByRole('link', { name: '수익 등록하기' })
    expect(button).toHaveAttribute('href', '/income/new')
  })
})
```

### 2.3 Hook 테스트

```typescript
// features/__tests__/income/useIncome.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useIncomes, useCreateIncome } from '@/features/income/hooks/useIncome'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useIncomes', () => {
  it('should return empty array when not authenticated', async () => {
    const { result } = renderHook(() => useIncomes('2024-01'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual([])
    })
  })
})
```

---

## 3. E2E 테스트 (Playwright)

### 3.1 폴더 구조

```
e2e/
├── auth/
│   └── login.spec.ts
├── income/
│   ├── income-list.spec.ts
│   └── income-form.spec.ts
├── expense/
│   ├── expense-list.spec.ts
│   └── expense-form.spec.ts
├── report/
│   └── report.spec.ts
├── settings/
│   └── settings.spec.ts
├── fixtures/
│   └── auth.ts
└── utils/
    └── helpers.ts
```

### 3.2 인증 Fixture

```typescript
// e2e/fixtures/auth.ts
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
```

### 3.3 E2E 테스트 시나리오

#### 인증 플로우

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL('/login')
  })

  test('should display Google login button', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('button', { name: /Google로 로그인/i })).toBeVisible()
  })

  test('should show onboarding after first login', async ({ page }) => {
    // Mock 첫 로그인 상태
    await page.goto('/onboarding')

    await expect(page.getByText('CreFlow에 오신 것을 환영합니다')).toBeVisible()
  })
})
```

#### 수익 관리 플로우

```typescript
// e2e/income/income-list.spec.ts
import { test, expect } from '../fixtures/auth'

test.describe('Income List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/income')
  })

  test('should display income list page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '수익 관리' })).toBeVisible()
  })

  test('should navigate to add income form', async ({ page }) => {
    await page.getByRole('button', { name: /추가|등록/i }).click()

    await expect(page).toHaveURL('/income/new')
  })

  test('should filter incomes by month', async ({ page }) => {
    // 이전 달 버튼 클릭
    await page.getByRole('button').filter({ has: page.locator('svg') }).first().click()

    // URL이나 화면이 업데이트되었는지 확인
    await expect(page.getByText(/2024년/)).toBeVisible()
  })

  test('should show empty state when no incomes', async ({ page }) => {
    await expect(page.getByText('등록된 수익이 없습니다')).toBeVisible()
  })
})
```

```typescript
// e2e/income/income-form.spec.ts
import { test, expect } from '../fixtures/auth'

test.describe('Income Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/income/new')
  })

  test('should display platform income form by default', async ({ page }) => {
    await expect(page.getByText('플랫폼 수익')).toBeVisible()
    await expect(page.getByText('광고/협찬')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: '저장하기' })

    await expect(submitButton).toBeDisabled()
  })

  test('should add platform income', async ({ page }) => {
    // 플랫폼 선택
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: '유튜브' }).click()

    // 금액 입력
    await page.getByPlaceholder('0').fill('1500000')

    // 제출 버튼 활성화 확인
    await expect(page.getByRole('button', { name: '저장하기' })).toBeEnabled()
  })

  test('should switch to campaign form', async ({ page }) => {
    await page.getByRole('tab', { name: '광고/협찬' }).click()

    await expect(page.getByPlaceholder('브랜드명을 입력하세요')).toBeVisible()
  })

  test('should add campaign income', async ({ page }) => {
    await page.getByRole('tab', { name: '광고/협찬' }).click()

    // 브랜드명 입력
    await page.getByPlaceholder('브랜드명을 입력하세요').fill('테스트 브랜드')

    // 금액 입력
    await page.getByPlaceholder('0').fill('500000')

    // 제출
    await page.getByRole('button', { name: '저장하기' }).click()

    // 성공 토스트 또는 리다이렉트 확인
    await expect(page).toHaveURL('/income')
  })
})
```

#### 지출 관리 플로우

```typescript
// e2e/expense/expense-form.spec.ts
import { test, expect } from '../fixtures/auth'

test.describe('Expense Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/expense/new')
  })

  test('should add collaborator expense', async ({ page }) => {
    // 지출 유형 선택
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: '인건비' }).click()

    // 금액 입력
    await page.getByPlaceholder('0').fill('500000')

    await expect(page.getByRole('button', { name: '저장하기' })).toBeEnabled()
  })

  test('should add other expense', async ({ page }) => {
    // 지출 유형 선택
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: '기타 지출' }).click()

    // 설명 입력
    await page.getByPlaceholder('지출 내용을 입력하세요').fill('장비 구매')

    // 금액 입력
    await page.getByPlaceholder('0').fill('200000')

    await expect(page.getByRole('button', { name: '저장하기' })).toBeEnabled()
  })
})
```

#### 리포트 플로우

```typescript
// e2e/report/report.spec.ts
import { test, expect } from '../fixtures/auth'

test.describe('Report', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/report')
  })

  test('should display annual report', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '연간 리포트' })).toBeVisible()
  })

  test('should navigate between years', async ({ page }) => {
    const currentYear = new Date().getFullYear()

    await expect(page.getByText(`${currentYear}년`)).toBeVisible()

    // 이전 연도로 이동
    await page.getByRole('button').first().click()

    await expect(page.getByText(`${currentYear - 1}년`)).toBeVisible()
  })

  test('should download PDF', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download')

    await page.getByRole('button', { name: /다운로드|PDF/i }).click()

    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('creflow-report')
  })
})
```

#### 설정 플로우

```typescript
// e2e/settings/settings.spec.ts
import { test, expect } from '../fixtures/auth'

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test('should display user account info', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '설정' })).toBeVisible()
    await expect(page.getByText('계정')).toBeVisible()
  })

  test('should add collaborator', async ({ page }) => {
    await page.getByRole('button', { name: '추가' }).click()

    // 협력자 정보 입력
    await page.getByPlaceholder('협력자 이름').fill('김편집')
    await page.getByPlaceholder('예: 편집자').fill('편집자')

    // 정산 방식 선택
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: '고정급' }).click()

    // 금액 입력
    await page.getByPlaceholder('0').fill('500000')

    await page.getByRole('button', { name: '협력자 추가' }).click()

    // 추가된 협력자 확인
    await expect(page.getByText('김편집')).toBeVisible()
  })

  test('should submit feedback', async ({ page }) => {
    // 피드백 유형 선택
    await page.locator('[data-testid="feedback-type"]').click()
    await page.getByRole('option', { name: '기능 제안' }).click()

    // 내용 입력
    await page.getByPlaceholder('피드백 내용을 입력하세요').fill('새로운 기능 제안입니다')

    await page.getByRole('button', { name: '피드백 보내기' }).click()

    // 성공 토스트 확인
    await expect(page.getByText('피드백이 제출되었습니다')).toBeVisible()
  })

  test('should logout', async ({ page }) => {
    await page.getByRole('button', { name: '로그아웃' }).click()

    await expect(page).toHaveURL('/login')
  })
})
```

### 3.4 모바일 반응형 테스트

```typescript
// e2e/responsive/mobile.spec.ts
import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['iPhone 13'] })

test.describe('Mobile Responsiveness', () => {
  test('should display mobile navigation', async ({ page }) => {
    await page.goto('/')

    // 하단 네비게이션 확인
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should navigate using bottom nav', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: '수익' }).click()
    await expect(page).toHaveURL('/income')

    await page.getByRole('link', { name: '지출' }).click()
    await expect(page).toHaveURL('/expense')
  })
})
```

---

## 4. 테스트 커버리지 목표

### 4.1 단위 테스트 (Vitest)

| 영역 | 목표 커버리지 | 우선순위 |
|------|-------------|---------|
| 유틸리티 함수 (calculations, utils) | 90%+ | 높음 |
| 커스텀 훅 | 80%+ | 높음 |
| UI 컴포넌트 | 70%+ | 중간 |
| API 함수 | 60%+ | 중간 |

### 4.2 E2E 테스트 (Playwright)

| 플로우 | 테스트 케이스 수 | 우선순위 |
|-------|----------------|---------|
| 인증 (로그인/로그아웃) | 3-5 | 높음 |
| 온보딩 | 3-4 | 높음 |
| 수익 CRUD | 6-8 | 높음 |
| 지출 CRUD | 6-8 | 높음 |
| 협력자 관리 | 4-5 | 중간 |
| 리포트 & PDF | 3-4 | 중간 |
| 설정 & 피드백 | 4-5 | 낮음 |

---

## 5. CI/CD 통합

### 5.1 GitHub Actions 워크플로우

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm dlx playwright install --with-deps
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 6. 실행 순서

### Phase 1: 환경 설정 (1일)
1. Vitest & Playwright 패키지 설치
2. 설정 파일 생성
3. Mock 설정

### Phase 2: 단위 테스트 (2-3일)
1. calculations.ts 테스트 (최우선)
2. 주요 컴포넌트 테스트
3. 커스텀 훅 테스트

### Phase 3: E2E 테스트 (3-4일)
1. 인증 플로우
2. 수익/지출 CRUD
3. 리포트 & 설정

### Phase 4: CI/CD 통합 (1일)
1. GitHub Actions 설정
2. 커버리지 리포트 연동

---

## 7. 테스트 작성 가이드라인

### 7.1 네이밍 규칙
- 테스트 파일: `*.test.ts` 또는 `*.spec.ts`
- describe: 테스트 대상 (함수명, 컴포넌트명)
- it/test: "should + 동작" 형태

### 7.2 테스트 원칙
- **Arrange-Act-Assert** 패턴 사용
- 각 테스트는 독립적으로 실행 가능해야 함
- 외부 의존성은 Mock 처리
- 사용자 관점에서 테스트 (구현 세부사항 X)

### 7.3 E2E 테스트 원칙
- 실제 사용자 시나리오 기반
- 중요한 비즈니스 플로우 우선
- 네트워크 요청은 실제 API 또는 MSW 사용
- 데이터 정리(cleanup) 철저히

---

*이 플랜을 기반으로 테스트 코드를 단계적으로 구현합니다.*
