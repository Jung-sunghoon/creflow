'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { PlatformIncomeForm } from '../components/PlatformIncomeForm'
import { CampaignForm } from '../components/CampaignForm'

type IncomeTab = 'platform' | 'campaign'

export function IncomeFormView() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<IncomeTab>('platform')

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => router.back()}
            className="mr-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="뒤로 가기"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <h1 className="text-lg font-semibold">수익 등록</h1>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b" role="tablist">
        <button
          onClick={() => setActiveTab('platform')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
            activeTab === 'platform'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
          role="tab"
          aria-selected={activeTab === 'platform'}
        >
          플랫폼 수익
        </button>
        <button
          onClick={() => setActiveTab('campaign')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
            activeTab === 'campaign'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
          role="tab"
          aria-selected={activeTab === 'campaign'}
        >
          광고/협찬
        </button>
      </div>

      {/* 폼 */}
      <div className="p-4">
        {activeTab === 'platform' ? <PlatformIncomeForm /> : <CampaignForm />}
      </div>
    </div>
  )
}
