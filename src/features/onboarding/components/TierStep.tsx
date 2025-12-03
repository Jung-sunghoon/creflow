'use client'

import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  PLATFORMS,
  SOOP_TIERS,
  CHZZK_TIERS,
} from '@/shared/lib/constants'
import type { PlatformType, SoopTier, ChzzkTier } from '@/shared/types'

interface TierSettings {
  soop?: SoopTier
  chzzk?: ChzzkTier
}

interface TierStepProps {
  selectedPlatforms: PlatformType[]
  tierSettings: TierSettings
  onTierChange: (platform: 'soop' | 'chzzk', tier: SoopTier | ChzzkTier) => void
}

export function TierStep({
  selectedPlatforms,
  tierSettings,
  onTierChange,
}: TierStepProps) {
  const hasSoop = selectedPlatforms.includes('soop')
  const hasChzzk = selectedPlatforms.includes('chzzk')
  const hasYoutube = selectedPlatforms.includes('youtube')

  // 등급 설정이 필요한 플랫폼이 없으면
  if (!hasSoop && !hasChzzk) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">플랫폼 설정</h2>
          <p className="text-sm text-muted-foreground">
            선택한 플랫폼은 등급 설정이 필요 없어요
          </p>
        </div>

        {hasYoutube && (
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-sm font-medium text-foreground">유튜브</p>
            <p className="text-xs text-muted-foreground mt-1">
              수익 유형별로 자동 적용됩니다
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• 광고: 55% 수령</li>
              <li>• 슈퍼챗/멤버십: 70% 수령</li>
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">플랫폼 등급 설정</h2>
        <p className="text-sm text-muted-foreground">
          정확한 수익 계산을 위해 등급을 선택해주세요
        </p>
      </div>

      <div className="space-y-4">
        {hasSoop && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {PLATFORMS.soop.label}
            </Label>
            <Select
              value={tierSettings.soop}
              onValueChange={(value) => onTierChange('soop', value as SoopTier)}
            >
              <SelectTrigger>
                <SelectValue placeholder="등급을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SOOP_TIERS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {hasChzzk && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {PLATFORMS.chzzk.label}
            </Label>
            <Select
              value={tierSettings.chzzk}
              onValueChange={(value) => onTierChange('chzzk', value as ChzzkTier)}
            >
              <SelectTrigger>
                <SelectValue placeholder="등급을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHZZK_TIERS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {hasYoutube && (
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-sm font-medium text-foreground">유튜브</p>
            <p className="text-xs text-muted-foreground mt-1">
              수익 유형별로 자동 적용됩니다
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        나중에 설정에서 변경할 수 있어요
      </p>
    </div>
  )
}
