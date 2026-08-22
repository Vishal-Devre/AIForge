import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bot, Plus, Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { SearchBar } from '@/components/shared/SearchBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { EmptyState } from '@/components/shared/EmptyState'
import { agentsApi } from '@/lib/api'
import type { Agent, AgentStatus } from '@/types'

const statusColors: Record<AgentStatus, string> = {
  DRAFT: 'text-[var(--text-tertiary)]',
  READY: 'text-[var(--info)]',
  DEPLOYED: 'text-[var(--success)]',
  ARCHIVED: 'text-[var(--error)]',
}

function statusIndicatorColor(status: AgentStatus): string {
  const map: Record<AgentStatus, string> = {
    DRAFT: 'idle',
    READY: 'pending',
    DEPLOYED: 'deployed',
    ARCHIVED: 'stopped',
  }
  return map[status]
}

export function AgentFactoryPage() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    agentsApi.getMyAgents(0, 100)
      .then(res => setAgents(res?.items || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load agents'))
      .finally(() => setLoading(false))
  }, [])

  const filteredAgents = (agents || []).filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || a.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agent Factory"
        description="Deploy, manage, and monitor your AI agents"
        actions={
          <Button onClick={() => navigate('/create-agent')}>
            <Plus className="h-4 w-4" /> New Agent
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          className="w-full sm:w-72"
          placeholder="Search agents..."
          ariaLabel="Search agents"
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="flex gap-2">
          {['all', 'DRAFT', 'READY', 'DEPLOYED', 'ARCHIVED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize cursor-pointer ${
                filter === f ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-accent)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-transparent hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {f === 'all' ? 'All' : f.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-64 animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-[var(--bg-muted)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--bg-muted)]" />
                <div className="h-3 w-1/2 rounded bg-[var(--bg-muted)]" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="border-[var(--error-border)] bg-[var(--error-light)]">
          <CardContent className="p-4 text-sm text-[var(--error)]">{error}</CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!loading && !error && filteredAgents.length === 0 && (
        <EmptyState
          icon={<Bot className="h-8 w-8" />}
          title={searchQuery || filter !== 'all' ? 'No matching agents' : 'No agents yet'}
          description={searchQuery || filter !== 'all' ? 'Try adjusting your search or filters.' : 'Create your first AI Agent.'}
          action={!searchQuery && filter === 'all' ? <Button onClick={() => navigate('/create-agent')}><Plus className="h-4 w-4" /> Create Agent</Button> : undefined}
        />
      )}

      {/* Agent Grid */}
      {!loading && !error && filteredAgents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAgents.map((agent, i) => (
            <Card
              key={agent.id}
              className="group hover:border-[var(--border-accent)] transition-all duration-300 h-full flex flex-col cursor-pointer"
              onClick={() => navigate(`/agents/${agent.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      agent.status === 'DEPLOYED' ? 'bg-[var(--success-light)]' :
                      agent.status === 'ARCHIVED' ? 'bg-[var(--error-light)]' :
                      agent.status === 'READY' ? 'bg-[var(--info-light)]' :
                      'bg-[var(--bg-muted)]'
                    }`}>
                      <Bot className={`h-5 w-5 ${
                        agent.status === 'DEPLOYED' ? 'text-[var(--success)]' :
                        agent.status === 'ARCHIVED' ? 'text-[var(--error)]' :
                        agent.status === 'READY' ? 'text-[var(--info)]' :
                        'text-[var(--text-tertiary)]'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <CardDescription className="text-xs">{agent.model}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={agent.status === 'DEPLOYED' ? 'success' : agent.status === 'ARCHIVED' ? 'danger' : 'default'} size="sm" className="capitalize">
                    {agent.status.toLowerCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1 line-clamp-2">
                  {agent.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <StatusIndicator status={statusIndicatorColor(agent.status)} />
                    <span className={`capitalize font-medium ${statusColors[agent.status]}`}>
                      {agent.status.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(agent.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
