'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

const themes = [
  { value: 'light', label: '라이트', icon: Sun },
  { value: 'dark', label: '다크', icon: Moon },
  { value: 'system', label: '시스템', icon: Monitor },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex gap-2">
        {themes.map(({ value, label }) => (
          <button
            key={value}
            className="flex-1 py-2 px-3 rounded-lg text-sm bg-muted"
            disabled
          >
            {label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 ${
            theme === value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
          aria-pressed={theme === value}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
