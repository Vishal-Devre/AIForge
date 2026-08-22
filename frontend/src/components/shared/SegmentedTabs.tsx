import { useRef } from 'react'
import { cn } from '@/lib/utils'
import './SegmentedTabs.css'

export interface SegmentedTabOption {
  value: string
  label: string
}

export interface SegmentedTabsProps {
  options: SegmentedTabOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
  className?: string
}

/**
 * Pill-style segmented control (single-select) — replaces dropdowns for
 * small, fixed option sets. Fully controlled; arrow keys move selection.
 */
export function SegmentedTabs({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = options.length - 1
    let next: number | null = null

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last

    if (next !== null) {
      e.preventDefault()
      onChange(options[next].value)
      tabRefs.current[next]?.focus()
    }
  }

  return (
    <div className={cn('seg-tabs', className)} role="tablist" aria-label={ariaLabel}>
      {options.map((option, i) => (
        <button
          key={option.value}
          ref={el => { tabRefs.current[i] = el }}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          tabIndex={value === option.value ? 0 : -1}
          className={cn('seg-tabs__tab', value === option.value && 'is-active')}
          onClick={() => onChange(option.value)}
          onKeyDown={e => handleKeyDown(e, i)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
