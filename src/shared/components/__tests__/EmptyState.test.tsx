import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from '../common/EmptyState'

describe('EmptyState', () => {
  it('should render title', () => {
    render(<EmptyState title="데이터가 없습니다" />)

    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument()
  })

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

  it('should render custom icon', () => {
    render(<EmptyState title="테스트" icon="🎉" />)

    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  it('should render default icon when not provided', () => {
    render(<EmptyState title="테스트" />)

    expect(screen.getByText('📭')).toBeInTheDocument()
  })

  it('should render action button with link', () => {
    render(
      <EmptyState
        title="수익이 없습니다"
        actionLabel="수익 등록하기"
        actionHref="/income/new"
      />
    )

    const link = screen.getByRole('link', { name: '수익 등록하기' })
    expect(link).toHaveAttribute('href', '/income/new')
  })

  it('should render action button with onClick handler', () => {
    const handleClick = vi.fn()

    render(
      <EmptyState
        title="테스트"
        actionLabel="액션 버튼"
        onAction={handleClick}
      />
    )

    const button = screen.getByRole('button', { name: '액션 버튼' })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not render action button without actionLabel', () => {
    render(<EmptyState title="테스트" actionHref="/test" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should not render description when not provided', () => {
    render(<EmptyState title="테스트" />)

    const description = screen.queryByText('새로운 데이터를 추가해보세요')
    expect(description).not.toBeInTheDocument()
  })
})
