'use client'

import { X } from 'lucide-react'

export function CloseButton() {
  return (
    <button
      onClick={() => window.close()}
      className="p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
      aria-label="닫기"
    >
      <X className="w-5 h-5 text-neutral-500" />
    </button>
  )
}
