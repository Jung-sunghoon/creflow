'use client'

import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'
import { PLATFORMS } from '@/shared/lib/constants'
import type { PlatformType } from '@/shared/types'

interface PlatformStepProps {
  selectedPlatforms: PlatformType[]
  onToggle: (platform: PlatformType) => void
}

const availablePlatforms: PlatformType[] = ['youtube', 'soop', 'chzzk', 'instagram', 'tiktok']

export function PlatformStep({ selectedPlatforms, onToggle }: PlatformStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">활동 중인 플랫폼</h2>
        <p className="text-sm text-muted-foreground">
          수익을 관리할 플랫폼을 선택해주세요
        </p>
      </div>

      <div className="space-y-3">
        {availablePlatforms.map((platform) => {
          const info = PLATFORMS[platform]
          const isChecked = selectedPlatforms.includes(platform)

          return (
            <label
              key={platform}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onToggle(platform)}
              />
              <span className="text-sm font-medium text-foreground">
                {info.label}
              </span>
            </label>
          )
        })}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        나중에 설정에서 변경할 수 있어요
      </p>
    </div>
  )
}
