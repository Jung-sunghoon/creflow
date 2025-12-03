'use client'

import { Component, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <span className="text-4xl mb-4 block">😵</span>
            <h2 className="text-lg font-semibold mb-2">문제가 발생했습니다</h2>
            <p className="text-sm text-muted-foreground mb-6">
              죄송합니다. 예상치 못한 오류가 발생했습니다.
              다시 시도해 주세요.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry}>다시 시도</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                새로고침
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({
  title = '오류가 발생했습니다',
  message = '데이터를 불러오는데 실패했습니다',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-3xl mb-4">⚠️</span>
      <h3 className="text-base font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
