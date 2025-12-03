'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { CollaboratorCard } from '@/features/collaborator/components/CollaboratorCard'
import { CollaboratorForm } from '@/features/collaborator/components/CollaboratorForm'
import { useCollaborators, useDeleteCollaborator } from '@/features/collaborator/hooks/useCollaborator'
import { toast } from 'sonner'

export function CollaboratorSettings() {
  const { data: collaborators = [], isLoading } = useCollaborators()
  const deleteCollaborator = useDeleteCollaborator()
  const [showForm, setShowForm] = useState(false)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${name} 협력자를 삭제하시겠습니까?`)) return

    try {
      await deleteCollaborator.mutateAsync(id)
      toast.success('협력자가 삭제되었습니다')
    } catch (error) {
      toast.error('삭제에 실패했습니다')
      console.error(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">협력자 관리</h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-1" />
          추가
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-white border-0 shadow-sm">
          <CollaboratorForm onSuccess={() => setShowForm(false)} />
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : collaborators.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          등록된 협력자가 없습니다
        </p>
      ) : (
        <div className="space-y-3">
          {collaborators.map((collaborator) => (
            <CollaboratorCard
              key={collaborator.id}
              collaborator={collaborator}
              onDelete={() => handleDelete(collaborator.id, collaborator.name)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
