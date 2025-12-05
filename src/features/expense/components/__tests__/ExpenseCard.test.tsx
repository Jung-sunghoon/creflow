import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExpenseCard } from '../ExpenseCard'
import type { Expense } from '@/shared/types'

const mockExpense: Expense = {
  id: '1',
  user_id: 'user-1',
  type: 'other',
  description: '장비 구매',
  amount: 200000,
  date: '2024-01-20',
  is_paid: false,
  collaborator_id: null,
  memo: null,
  created_at: '2024-01-20T00:00:00Z',
}

const mockCollaboratorExpense: Expense = {
  id: '2',
  user_id: 'user-1',
  type: 'collaborator',
  description: '편집자 김편집',
  amount: 500000,
  date: '2024-01-25',
  is_paid: true,
  collaborator_id: 'collab-1',
  memo: null,
  created_at: '2024-01-25T00:00:00Z',
}

describe('ExpenseCard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should render expense description', () => {
    render(<ExpenseCard expense={mockExpense} />)

    expect(screen.getByText('장비 구매')).toBeInTheDocument()
  })

  it('should render expense amount with minus sign', () => {
    render(<ExpenseCard expense={mockExpense} />)

    expect(screen.getByText('-₩200,000')).toBeInTheDocument()
  })

  it('should display date formatted', () => {
    render(<ExpenseCard expense={mockExpense} />)

    expect(screen.getByText(/1\/20/)).toBeInTheDocument()
  })

  it('should show "예정" badge for unpaid expense', () => {
    render(<ExpenseCard expense={mockExpense} />)

    expect(screen.getByText('예정')).toBeInTheDocument()
  })

  it('should show "지급완료" badge for paid expense', () => {
    render(<ExpenseCard expense={mockCollaboratorExpense} />)

    expect(screen.getByText('지급완료')).toBeInTheDocument()
  })

  it('should call onTogglePaid when badge clicked', () => {
    const handleToggle = vi.fn()
    render(<ExpenseCard expense={mockExpense} onTogglePaid={handleToggle} />)

    const badge = screen.getByText('예정')
    fireEvent.click(badge)

    expect(handleToggle).toHaveBeenCalledWith(true) // !expense.is_paid
  })

  it('should toggle paid status from paid to unpaid', () => {
    const handleToggle = vi.fn()
    render(<ExpenseCard expense={mockCollaboratorExpense} onTogglePaid={handleToggle} />)

    const badge = screen.getByText('지급완료')
    fireEvent.click(badge)

    expect(handleToggle).toHaveBeenCalledWith(false) // !expense.is_paid
  })

  it('should display collaborator icon for collaborator expense', () => {
    render(<ExpenseCard expense={mockCollaboratorExpense} />)

    expect(screen.getByText('👤')).toBeInTheDocument()
  })

  it('should display package icon for other expense', () => {
    render(<ExpenseCard expense={mockExpense} />)

    expect(screen.getByText('📦')).toBeInTheDocument()
  })

  it('should show default description for collaborator type without description', () => {
    const expenseNoDesc = { ...mockCollaboratorExpense, description: null }
    render(<ExpenseCard expense={expenseNoDesc} />)

    // sr-only span과 실제 텍스트 둘 다 있으므로 getAllByText 사용
    const elements = screen.getAllByText('인건비')
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })

  it('should show default description for other type without description', () => {
    const expenseNoDesc = { ...mockExpense, description: null }
    render(<ExpenseCard expense={expenseNoDesc} />)

    // sr-only span과 실제 텍스트 둘 다 있으므로 getAllByText 사용
    const elements = screen.getAllByText('기타 지출')
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })

  it('should call onEdit when edit button clicked', () => {
    const handleEdit = vi.fn()
    render(<ExpenseCard expense={mockExpense} onEdit={handleEdit} />)

    const editButton = screen.getAllByRole('button')[0]
    fireEvent.click(editButton)

    expect(handleEdit).toHaveBeenCalledTimes(1)
  })

  it('should call onDelete when delete confirmed', async () => {
    const handleDelete = vi.fn()

    render(<ExpenseCard expense={mockExpense} onDelete={handleDelete} />)

    // 삭제 버튼(트리거) 클릭하여 다이얼로그 열기
    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)

    // 다이얼로그의 "삭제" 확인 버튼 클릭
    const confirmButton = await screen.findByRole('button', { name: '삭제' })
    fireEvent.click(confirmButton)

    expect(handleDelete).toHaveBeenCalledTimes(1)
  })

  it('should not call onDelete when delete cancelled', async () => {
    const handleDelete = vi.fn()

    render(<ExpenseCard expense={mockExpense} onDelete={handleDelete} />)

    // 삭제 버튼(트리거) 클릭하여 다이얼로그 열기
    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)

    // 다이얼로그의 "취소" 버튼 클릭
    const cancelButton = await screen.findByRole('button', { name: '취소' })
    fireEvent.click(cancelButton)

    expect(handleDelete).not.toHaveBeenCalled()
  })
})
