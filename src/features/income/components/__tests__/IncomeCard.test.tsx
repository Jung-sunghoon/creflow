import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IncomeCard, CampaignCard } from '../IncomeCard'
import type { Income, Campaign } from '@/shared/types'

const mockIncome: Income = {
  id: '1',
  user_id: 'user-1',
  type: 'platform',
  source: 'youtube',
  input_method: 'direct',
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

const mockCampaign: Campaign = {
  id: '1',
  user_id: 'user-1',
  brand_name: '테스트 브랜드',
  amount: 500000,
  contract_date: '2024-01-01',
  payment_date: '2024-01-31',
  is_paid: false,
  memo: null,
  created_at: '2024-01-01T00:00:00Z',
}

describe('IncomeCard', () => {
  it('should render income amount formatted as currency', () => {
    render(<IncomeCard income={mockIncome} />)

    expect(screen.getByText('₩1,500,000')).toBeInTheDocument()
  })

  it('should display platform name for platform income', () => {
    render(<IncomeCard income={mockIncome} />)

    expect(screen.getByText('유튜브')).toBeInTheDocument()
  })

  it('should display input method', () => {
    render(<IncomeCard income={mockIncome} />)

    expect(screen.getByText(/직접 입력/)).toBeInTheDocument()
  })

  it('should display date formatted', () => {
    render(<IncomeCard income={mockIncome} />)

    expect(screen.getByText(/1\/15/)).toBeInTheDocument()
  })

  it('should call onEdit when edit button clicked', () => {
    const handleEdit = vi.fn()
    render(<IncomeCard income={mockIncome} onEdit={handleEdit} />)

    // Edit button should be visible (in group-hover, but we can still click it)
    const editButton = screen.getAllByRole('button')[0]
    fireEvent.click(editButton)

    expect(handleEdit).toHaveBeenCalledTimes(1)
  })

  it('should call onDelete when delete confirmed', () => {
    const handleDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<IncomeCard income={mockIncome} onDelete={handleDelete} />)

    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledTimes(1)
  })

  it('should not call onDelete when delete cancelled', () => {
    const handleDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<IncomeCard income={mockIncome} onDelete={handleDelete} />)

    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)

    expect(handleDelete).not.toHaveBeenCalled()
  })

  it('should display different icon for calculated input method', () => {
    const calculatedIncome = { ...mockIncome, input_method: 'calculated' as const }
    render(<IncomeCard income={calculatedIncome} />)

    expect(screen.getByText(/자동 계산/)).toBeInTheDocument()
  })
})

describe('CampaignCard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should render brand name', () => {
    render(<CampaignCard campaign={mockCampaign} />)

    expect(screen.getByText('테스트 브랜드')).toBeInTheDocument()
  })

  it('should render campaign amount formatted as currency', () => {
    render(<CampaignCard campaign={mockCampaign} />)

    expect(screen.getByText('₩500,000')).toBeInTheDocument()
  })

  it('should display payment date', () => {
    render(<CampaignCard campaign={mockCampaign} />)

    expect(screen.getByText(/1\/31/)).toBeInTheDocument()
  })

  it('should show "예정" badge for unpaid campaign', () => {
    render(<CampaignCard campaign={mockCampaign} />)

    expect(screen.getByText('예정')).toBeInTheDocument()
  })

  it('should show "입금완료" badge for paid campaign', () => {
    const paidCampaign = { ...mockCampaign, is_paid: true }
    render(<CampaignCard campaign={paidCampaign} />)

    expect(screen.getByText('입금완료')).toBeInTheDocument()
  })

  it('should call onTogglePaid when badge clicked', () => {
    const handleToggle = vi.fn()
    render(<CampaignCard campaign={mockCampaign} onTogglePaid={handleToggle} />)

    const badge = screen.getByText('예정')
    fireEvent.click(badge)

    expect(handleToggle).toHaveBeenCalledWith(true) // !campaign.is_paid
  })

  it('should toggle paid status correctly', () => {
    const handleToggle = vi.fn()
    const paidCampaign = { ...mockCampaign, is_paid: true }
    render(<CampaignCard campaign={paidCampaign} onTogglePaid={handleToggle} />)

    const badge = screen.getByText('입금완료')
    fireEvent.click(badge)

    expect(handleToggle).toHaveBeenCalledWith(false) // !campaign.is_paid
  })

  it('should call onEdit when edit button clicked', () => {
    const handleEdit = vi.fn()
    render(<CampaignCard campaign={mockCampaign} onEdit={handleEdit} />)

    const editButton = screen.getAllByRole('button')[0]
    fireEvent.click(editButton)

    expect(handleEdit).toHaveBeenCalledTimes(1)
  })

  it('should call onDelete when delete confirmed', () => {
    const handleDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<CampaignCard campaign={mockCampaign} onDelete={handleDelete} />)

    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledTimes(1)
  })

  it('should show "-" when payment date is null', () => {
    const campaignNoDate = { ...mockCampaign, payment_date: null }
    render(<CampaignCard campaign={campaignNoDate} />)

    expect(screen.getByText('-')).toBeInTheDocument()
  })
})
