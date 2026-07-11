import { useState } from 'react'
import { Search, LayoutTemplate, Compass, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'

export function AgentTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const templates: any[] = [] // Empty to show empty state

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agent Templates"
        description="Discover and deploy pre-configured AI agents for various use cases"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'featured', 'automation', 'creative', 'analysis'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all cursor-pointer ${
                activeCategory === cat ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-accent)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-transparent hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {cat === 'featured' && <Star className="inline-block w-3 h-3 mr-1" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={<LayoutTemplate className="h-8 w-8" />}
          title="No templates available"
          description="Browse community templates."
          action={<Button><Compass className="h-4 w-4 mr-2" /> Explore Community</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Templates list would go here */}
        </div>
      )}
    </div>
  )
}
