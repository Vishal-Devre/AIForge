import type { KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import './SearchBar.css'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  disabled = false,
  className,
}: SearchBarProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch && !disabled) {
      e.preventDefault()
      onSearch(value)
    }
  }

  return (
    <div
      className={cn(
        'search-bar',
        disabled && 'search-bar--disabled',
        className,
      )}
    >
      {onSearch ? (
        <button
          type="button"
          onClick={() => onSearch(value)}
          disabled={disabled}
          aria-label="Submit search"
          tabIndex={disabled ? -1 : 0}
          className="search-bar-icon-btn"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <span className="search-bar-icon">
          <Search className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
      <input
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        enterKeyHint="search"
        className="search-bar-input"
      />
    </div>
  )
}
