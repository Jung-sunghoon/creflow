import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useExpenses,
  useExpense,
  useCreateExpense,
  useDeleteExpense,
  useUpdateExpenseStatus,
} from '../useExpense'

// Mock API functions
vi.mock('../../api/expense', () => ({
  getExpenses: vi.fn(),
  getExpense: vi.fn(),
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
  updateExpenseStatus: vi.fn(),
}))

// Mock Supabase - 인증된 사용자
vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useExpenses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch expenses for authenticated user', async () => {
    const mockExpenses = [
      { id: '1', amount: 50000, type: 'other', description: '장비' },
      { id: '2', amount: 100000, type: 'collaborator', description: '편집자' },
    ]

    const { getExpenses } = await import('../../api/expense')
    vi.mocked(getExpenses).mockResolvedValue(mockExpenses as any)

    const { result } = renderHook(() => useExpenses('2024-01'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockExpenses)
    expect(getExpenses).toHaveBeenCalledWith('test-user-id', '2024-01')
  })

  it('should return empty array when no expenses', async () => {
    const { getExpenses } = await import('../../api/expense')
    vi.mocked(getExpenses).mockResolvedValue([])

    const { result } = renderHook(() => useExpenses(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
  })
})

describe('useExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch single expense by id', async () => {
    const mockExpense = { id: '1', amount: 50000, type: 'other' }

    const { getExpense } = await import('../../api/expense')
    vi.mocked(getExpense).mockResolvedValue(mockExpense as any)

    const { result } = renderHook(() => useExpense('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockExpense)
    expect(getExpense).toHaveBeenCalledWith('1')
  })

  it('should not fetch when id is empty', async () => {
    const { getExpense } = await import('../../api/expense')

    const { result } = renderHook(() => useExpense(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(getExpense).not.toHaveBeenCalled()
  })
})

describe('useCreateExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create expense for authenticated user', async () => {
    const mockCreated = { id: 'new-1', amount: 50000 }
    const inputData = { type: 'other' as const, amount: 50000, description: '테스트' }

    const { createExpense } = await import('../../api/expense')
    vi.mocked(createExpense).mockResolvedValue(mockCreated as any)

    const { result } = renderHook(() => useCreateExpense(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(inputData as any)

    expect(createExpense).toHaveBeenCalledWith('test-user-id', inputData)
  })
})

describe('useDeleteExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete expense by id', async () => {
    const { deleteExpense } = await import('../../api/expense')
    vi.mocked(deleteExpense).mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteExpense(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync('1')

    expect(deleteExpense).toHaveBeenCalledWith('1')
  })
})

describe('useUpdateExpenseStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update expense status to paid', async () => {
    const { updateExpenseStatus } = await import('../../api/expense')
    vi.mocked(updateExpenseStatus).mockResolvedValue({ id: '1', is_paid: true } as any)

    const { result } = renderHook(() => useUpdateExpenseStatus(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ id: '1', isPaid: true })

    expect(updateExpenseStatus).toHaveBeenCalledWith('1', true)
  })

  it('should update expense status to unpaid', async () => {
    const { updateExpenseStatus } = await import('../../api/expense')
    vi.mocked(updateExpenseStatus).mockResolvedValue({ id: '1', is_paid: false } as any)

    const { result } = renderHook(() => useUpdateExpenseStatus(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ id: '1', isPaid: false })

    expect(updateExpenseStatus).toHaveBeenCalledWith('1', false)
  })
})
