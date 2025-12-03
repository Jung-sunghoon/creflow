'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { createClient } from '@/shared/lib/supabase/client'
import { PlatformStep } from '../components/PlatformStep'
import { TierStep } from '../components/TierStep'
import { CollaboratorStep } from '../components/CollaboratorStep'
import { CompleteStep } from '../components/CompleteStep'
import type { PlatformType, SoopTier, ChzzkTier } from '@/shared/types'

type Step = 'platform' | 'tier' | 'collaborator' | 'complete'

interface TierSettings {
  soop?: SoopTier
  chzzk?: ChzzkTier
}

export function OnboardingView() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('platform')
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([])
  const [tierSettings, setTierSettings] = useState<TierSettings>({})
  const [isLoading, setIsLoading] = useState(false)

  const handlePlatformToggle = (platform: PlatformType) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const handleTierChange = (platform: 'soop' | 'chzzk', tier: SoopTier | ChzzkTier) => {
    setTierSettings((prev) => ({
      ...prev,
      [platform]: tier,
    }))
  }

  const handleNextFromPlatform = () => {
    if (selectedPlatforms.length === 0) return
    setStep('tier')
  }

  const handleNextFromTier = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // 플랫폼 설정 저장
      const platformsToInsert = selectedPlatforms.map((platform) => ({
        user_id: user.id,
        type: platform,
        tier: platform === 'soop' ? tierSettings.soop : platform === 'chzzk' ? tierSettings.chzzk : null,
        is_active: true,
      }))

      const { error } = await supabase.from('platforms').insert(platformsToInsert)

      if (error) {
        console.error('플랫폼 저장 오류:', error)
        // 에러가 나도 일단 진행
      }

      setStep('collaborator')
    } catch (error) {
      console.error('온보딩 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCollaborator = () => {
    // TODO: 협력자 추가 모달/페이지
    setStep('complete')
  }

  const handleSkipCollaborator = () => {
    setStep('complete')
  }

  const handleComplete = () => {
    router.push('/')
  }

  const handleBack = () => {
    switch (step) {
      case 'tier':
        setStep('platform')
        break
      case 'collaborator':
        setStep('tier')
        break
      case 'complete':
        setStep('collaborator')
        break
    }
  }

  const canGoBack = step !== 'platform'
  const canGoNext = step === 'platform' && selectedPlatforms.length > 0

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 진행 바 */}
      <div className="px-4 py-3">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width:
                step === 'platform'
                  ? '25%'
                  : step === 'tier'
                  ? '50%'
                  : step === 'collaborator'
                  ? '75%'
                  : '100%',
            }}
          />
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 px-4 py-6 max-w-sm mx-auto w-full">
        {step === 'platform' && (
          <PlatformStep
            selectedPlatforms={selectedPlatforms}
            onToggle={handlePlatformToggle}
          />
        )}

        {step === 'tier' && (
          <TierStep
            selectedPlatforms={selectedPlatforms}
            tierSettings={tierSettings}
            onTierChange={handleTierChange}
          />
        )}

        {step === 'collaborator' && (
          <CollaboratorStep
            onAddCollaborator={handleAddCollaborator}
            onSkip={handleSkipCollaborator}
          />
        )}

        {step === 'complete' && <CompleteStep onComplete={handleComplete} />}
      </div>

      {/* 하단 버튼 */}
      {step !== 'collaborator' && step !== 'complete' && (
        <div className="px-4 py-4 border-t border-border">
          <div className="max-w-sm mx-auto flex gap-3">
            {canGoBack && (
              <Button variant="outline" className="flex-1" onClick={handleBack}>
                이전
              </Button>
            )}
            <Button
              className="flex-1"
              disabled={!canGoNext && step === 'platform'}
              onClick={step === 'platform' ? handleNextFromPlatform : handleNextFromTier}
            >
              {isLoading ? '저장 중...' : '다음'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
