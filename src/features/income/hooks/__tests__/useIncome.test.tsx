import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useIncomes,
  useIncome,
  useCampaigns,
  useCampaign,
  useCreateIncome,
  useDeleteIncome,
  useUpdateCampaignStatus,
} from '../useIncome'

// Mock API functions
vi.mock('../../api/income', () => ({
  getIncomes: vi.fn(),
  getIncome: vi.fn(),
  getCampaigns: vi.fn(),
  getCampaign: vi.fn(),
  createIncome: vi.fn(),
  updateIncome: vi.fn(),
  deleteIncome: vi.fn(),
  updateCampaignStatus: vi.fn(),
  updateCampaign: vi.fn(),
  deleteCampaign: vi.fn(),
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

describe('useIncomes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch incomes for authenticated user', async () => {
    const mockIncomes = [
      { id: '1', amount: 100000, type: 'platform' },
      { id: '2', amount: 200000, type: 'platform' },
    ]

    const { getIncomes } = await import('../../api/income')
    vi.mocked(getIncomes).mockResolvedValue(mockIncomes as any)

    const { result } = renderHook(() => useIncomes('2024-01'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockIncomes)
    expect(getIncomes).toHaveBeenCalledWith('test-user-id', '2024-01')
  })

  it('should return empty array when no incomes', async () => {
    const { getIncomes } = await import('../../api/income')
    vi.mocked(getIncomes).mockResolvedValue([])

    const { result } = renderHook(() => useIncomes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
  })
})

describe('useIncome', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch single income by id', async () => {
    const mockIncome = { id: '1', amount: 150000, type: 'platform' }

    const { getIncome } = await import('../../api/income')
    vi.mocked(getIncome).mockResolvedValue(mockIncome as any)

    const { result } = renderHook(() => useIncome('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockIncome)
    expect(getIncome).toHaveBeenCalledWith('1')
  })

  it('should not fetch when id is empty', async () => {
    const { getIncome } = await import('../../api/income')

    const { result } = renderHook(() => useIncome(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(getIncome).not.toHaveBeenCalled()
  })
})

describe('useCampaigns', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch campaigns for authenticated user', async () => {
    const mockCampaigns = [
      { id: '1', brand_name: '브랜드A', amount: 500000 },
      { id: '2', brand_name: '브랜드B', amount: 300000 },
    ]

    const { getCampaigns } = await import('../../api/income')
    vi.mocked(getCampaigns).mockResolvedValue(mockCampaigns as any)

    const { result } = renderHook(() => useCampaigns('2024-01'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockCampaigns)
  })
})

describe('useCampaign', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch single campaign by id', async () => {
    const mockCampaign = { id: '1', brand_name: '테스트', amount: 100000 }

    const { getCampaign } = await import('../../api/income')
    vi.mocked(getCampaign).mockResolvedValue(mockCampaign as any)

    const { result } = renderHook(() => useCampaign('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockCampaign)
  })
})

describe('useCreateIncome', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create income for authenticated user', async () => {
    const mockCreated = { id: 'new-1', amount: 100000 }
    const inputData = { type: 'platform' as const, source: 'youtube' as const, amount: 100000 }

    const { createIncome } = await import('../../api/income')
    vi.mocked(createIncome).mockResolvedValue(mockCreated as any)

    const { result } = renderHook(() => useCreateIncome(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(inputData as any)

    expect(createIncome).toHaveBeenCalledWith('test-user-id', inputData)
  })
})

describe('useDeleteIncome', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete income by id', async () => {
    const { deleteIncome } = await import('../../api/income')
    vi.mocked(deleteIncome).mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteIncome(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync('1')

    expect(deleteIncome).toHaveBeenCalledWith('1')
  })
})

describe('useUpdateCampaignStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update campaign status', async () => {
    const { updateCampaignStatus } = await import('../../api/income')
    vi.mocked(updateCampaignStatus).mockResolvedValue({ id: '1', is_paid: true } as any)

    const { result } = renderHook(() => useUpdateCampaignStatus(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ id: '1', isPaid: true })

    expect(updateCampaignStatus).toHaveBeenCalledWith('1', true)
  })
})
