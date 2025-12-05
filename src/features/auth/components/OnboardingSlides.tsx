'use client'

import { useEffect, useState } from 'react'
import { Plus, Minus } from 'lucide-react'

// 슬라이드 1: 수익 리스트
export function IncomeListSlide() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const incomes = [
    { platform: '유튜브', amount: '₩1,234,000', color: 'bg-red-500' },
    { platform: '숲', amount: '₩567,000', color: 'bg-blue-500' },
    { platform: '치지직', amount: '₩890,000', color: 'bg-emerald-500' },
    { platform: '기타', amount: '₩150,000', color: 'bg-neutral-500' },
    { platform: '광고', amount: '₩2,000,000', color: 'bg-amber-500' },
  ]

  return (
    <div className="w-full h-full bg-card rounded-2xl p-4 lg:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
      <p className="text-sm text-neutral-500 mb-2 lg:mb-3">12월 수익</p>
      <div className="space-y-1.5 lg:space-y-2.5">
        {incomes.map((income, index) => (
          <div
            key={income.platform}
            className={`flex items-center gap-2.5 lg:gap-3 p-2.5 lg:p-3 bg-neutral-50 rounded-lg transition-all duration-500 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className={`w-8 h-8 lg:w-9 lg:h-9 ${income.color} rounded-full flex items-center justify-center`}>
              <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">{income.platform}</p>
            </div>
            <p className="text-sm font-semibold text-blue-600">{income.amount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 슬라이드 2: 협력자 정산
export function CollaboratorSlide() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const expenses = [
    { name: '편집자 김OO', amount: '₩300,000', status: '정산 완료' },
    { name: '썸네일 박OO', amount: '₩150,000', status: '정산 예정' },
    { name: '매니저 이OO', amount: '₩200,000', status: '정산 완료' },
  ]

  return (
    <div className="w-full h-full bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
      <p className="text-sm text-neutral-500 mb-3">팀 정산</p>
      <div className="space-y-3">
        {expenses.map((expense, index) => (
          <div
            key={expense.name}
            className={`flex items-center gap-3 p-3.5 bg-neutral-50 rounded-lg transition-all duration-500 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
              <Minus className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">{expense.name}</p>
              <p className="text-xs text-neutral-500">{expense.status}</p>
            </div>
            <p className="text-sm font-semibold text-red-600">-{expense.amount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 슬라이드 3: 대시보드 순수익
export function DashboardSlide() {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)
  const targetAmount = 3351000

  useEffect(() => {
    const visibleTimer = setTimeout(() => setVisible(true), 100)

    const duration = 1500
    const steps = 60
    const increment = targetAmount / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetAmount) {
        setCount(targetAmount)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => {
      clearTimeout(visibleTimer)
      clearInterval(timer)
    }
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  return (
    <div className="w-full h-full bg-card rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col justify-center">
      <div className={`text-center transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <p className="text-sm text-neutral-500 mb-2">12월 순수익</p>
        <p className="text-4xl lg:text-5xl font-bold text-neutral-900">
          ₩{formatNumber(count)}
        </p>
        <div className="flex items-center justify-center gap-1 mt-3">
          <span className="text-sm text-green-600">↑ 전월 대비</span>
          <span className="text-sm font-semibold text-green-600">+23.5%</span>
        </div>
      </div>

      {/* 미니 수익/지출 카드 */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className={`bg-blue-50 rounded-xl p-4 text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <p className="text-sm text-neutral-500">수익</p>
          <p className="text-lg font-semibold text-blue-600">₩3,801,000</p>
        </div>
        <div className={`bg-red-50 rounded-xl p-4 text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '350ms' }}>
          <p className="text-sm text-neutral-500">지출</p>
          <p className="text-lg font-semibold text-red-600">₩450,000</p>
        </div>
      </div>
    </div>
  )
}

// 슬라이드 4: 로그인 화면
export function LoginSlide() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-full bg-card rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col items-center justify-center">
      <div
        className={`w-20 h-20 lg:w-24 lg:h-24 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <span className="text-3xl lg:text-4xl font-bold text-white">₩</span>
      </div>
      <h1
        className={`text-4xl lg:text-5xl font-bold text-neutral-900 transition-all duration-500 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '150ms' }}
      >
        CreFlow
      </h1>
      <p
        className={`text-neutral-500 text-base lg:text-lg mt-3 transition-all duration-500 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '300ms' }}
      >
        흩어진 수익, 한눈에 정리하세요
      </p>
    </div>
  )
}
