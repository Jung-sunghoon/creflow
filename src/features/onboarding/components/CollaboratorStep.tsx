'use client'

import { Button } from '@/shared/components/ui/button'
import { Users } from 'lucide-react'

interface CollaboratorStepProps {
  onAddCollaborator: () => void
  onSkip: () => void
}

export function CollaboratorStep({ onAddCollaborator, onSkip }: CollaboratorStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">함께 일하는 분</h2>
        <p className="text-sm text-muted-foreground">
          편집자, 썸네일러 등 협력자가 있으신가요?
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          협력자를 등록하면 인건비를 관리하고<br />
          순수익을 정확하게 계산할 수 있어요
        </p>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={onAddCollaborator}
        >
          협력자 추가하기
        </Button>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={onSkip}
        >
          나중에 할게요
        </Button>
      </div>
    </div>
  )
}
