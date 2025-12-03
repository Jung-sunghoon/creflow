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

  it('should calculate partner tier income correctly', () => {
    const result = calculateSoopIncome(1000, 'partner')

    expect(result.commissionRate).toBe(20)
    expect(result.netAmount).toBeGreaterThan(
      calculateSoopIncome(1000, 'best').netAmount
    )
  })

  it('should apply custom commission rate', () => {
    const result = calculateSoopIncome(1000, 'normal', 25)

    expect(result.commissionRate).toBe(25)
  })

  it('should apply withholding tax (3.3%)', () => {
    const result = calculateSoopIncome(1000, 'normal')
    // 원천징수가 적용되어야 함
    expect(result.withholdingTax).toBeGreaterThan(0)
  })
})

describe('calculateChzzkIncome', () => {
  it('should calculate rookie tier income correctly', () => {
    const result = calculateChzzkIncome(100000, 'rookie')

    expect(result.rawAmount).toBe(100000) // 치즈 1개 = 1원
    expect(result.commissionRate).toBe(35)
  })

  it('should calculate pro tier income correctly', () => {
    const result = calculateChzzkIncome(100000, 'pro')

    expect(result.commissionRate).toBe(25)
    expect(result.netAmount).toBeGreaterThan(
      calculateChzzkIncome(100000, 'rookie').netAmount
    )
  })

  it('should calculate partner tier income correctly', () => {
    const result = calculateChzzkIncome(100000, 'partner')

    expect(result.commissionRate).toBe(20)
    expect(result.netAmount).toBeGreaterThan(
      calculateChzzkIncome(100000, 'pro').netAmount
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

  it('should return 0 when empty', () => {
    const total = calculateTotalIncome([], [])
    expect(total).toBe(0)
  })

  it('should only include platform type incomes', () => {
    const incomes = [
      { id: '1', type: 'platform', amount: 100000 },
      { id: '2', type: 'ad', amount: 50000 }, // ad type should be excluded
    ]

    const total = calculateTotalIncome(incomes as any, [])

    expect(total).toBe(100000)
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

  it('should return 0 when no paid expenses', () => {
    const expenses = [
      { id: '1', is_paid: false, amount: 50000 },
    ]

    const total = calculateTotalExpense(expenses as any)

    expect(total).toBe(0)
  })
})

describe('calculateNetIncome', () => {
  it('should return income minus expense', () => {
    expect(calculateNetIncome(500000, 200000)).toBe(300000)
  })

  it('should handle negative result', () => {
    expect(calculateNetIncome(100000, 150000)).toBe(-50000)
  })

  it('should handle zero values', () => {
    expect(calculateNetIncome(0, 0)).toBe(0)
    expect(calculateNetIncome(100000, 0)).toBe(100000)
    expect(calculateNetIncome(0, 100000)).toBe(-100000)
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

  it('should handle decimal precision', () => {
    const result = calculateChangeRate(1150000, 1000000)
    expect(result).toBe(15) // 15.0%
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

  it('should handle null values', () => {
    const collaborator = {
      payment_type: 'fixed' as const,
      base_amount: null,
      percentage: null,
    }

    expect(calculateCollaboratorExpense(collaborator as any, 1000000)).toBe(0)
  })
})

describe('formatCurrency', () => {
  it('should format Korean Won correctly', () => {
    expect(formatCurrency(1234567)).toBe('₩1,234,567')
    expect(formatCurrency(0)).toBe('₩0')
  })

  it('should handle negative values', () => {
    expect(formatCurrency(-1234567)).toBe('-₩1,234,567')
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

  it('should use currency format for small numbers', () => {
    expect(formatCurrencyCompact(9999)).toBe('₩9,999')
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

  it('should handle zero', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })
})
