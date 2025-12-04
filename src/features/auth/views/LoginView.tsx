'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GoogleLoginButton } from '../components/GoogleLoginButton'
import { IncomeListSlide, CollaboratorSlide, DashboardSlide, LoginSlide } from '../components/OnboardingSlides'

const slides = [
  {
    title: '플랫폼 수익, 광고 수익\n한 곳에',
    component: IncomeListSlide,
  },
  {
    title: '팀 정산까지\n깔끔하게',
    component: CollaboratorSlide,
  },
  {
    title: '이번 달 순수익,\n바로 확인',
    component: DashboardSlide,
  },
  {
    title: '',
    component: LoginSlide,
  },
]

export function LoginView() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [fadeIn, setFadeIn] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const isFirstSlide = currentSlide === 0
  const isLastSlide = currentSlide === slides.length - 1

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (isAnimating) return
    if (direction === 'prev' && currentSlide === 0) return
    if (direction === 'next' && currentSlide === slides.length - 1) return

    setIsAnimating(true)
    setFadeIn(false)

    setTimeout(() => {
      if (direction === 'next') {
        setCurrentSlide(currentSlide + 1)
      } else {
        setCurrentSlide(currentSlide - 1)
      }
      setFadeIn(true)
      setIsAnimating(false)
    }, 200)
  }

  // 스와이프 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        handleNavigate('next')
      } else {
        handleNavigate('prev')
      }
    }
    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleDotClick = (index: number) => {
    if (isAnimating || index === currentSlide) return

    setIsAnimating(true)
    setFadeIn(false)

    setTimeout(() => {
      setCurrentSlide(index)
      setFadeIn(true)
      setIsAnimating(false)
    }, 200)
  }

  const SlideComponent = slides[currentSlide].component

  return (
    <div
      className="min-h-screen flex flex-col relative bg-linear-to-b from-white via-white to-neutral-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 화살표 네비게이션 - md 이상에서만 표시 */}
      {!isFirstSlide && (
        <div className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2 z-10">
          <button
            onClick={() => handleNavigate('prev')}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-400" aria-hidden="true" />
          </button>
        </div>
      )}

      {!isLastSlide && (
        <div className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 z-10">
          <button
            onClick={() => handleNavigate('next')}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* 슬라이드 영역 */}
      <div className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-300 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* 미니 UI 영역 */}
        <div className="w-full max-w-sm lg:max-w-lg h-80 lg:h-96 mb-8 animate-float">
          <SlideComponent key={currentSlide} />
        </div>

        {/* 텍스트 또는 로그인 버튼 */}
        {isLastSlide ? (
          <div className="w-full max-w-sm space-y-4">
            <GoogleLoginButton />
            <p className="text-xs text-center text-neutral-500">
              로그인하면{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-700"
              >
                이용약관
              </a>
              과{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-700"
              >
                개인정보처리방침
              </a>
              에 동의하게 됩니다.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 whitespace-pre-line leading-tight">
              {slides[currentSlide].title}
            </h1>
          </div>
        )}
      </div>

      {/* 하단 Dot Indicator */}
      <div className="px-6 pb-12">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? 'bg-neutral-900 w-6' : 'bg-neutral-300 w-2'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
              aria-current={index === currentSlide ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
