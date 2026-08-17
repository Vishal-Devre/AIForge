import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bot, Plus, Search, MoreHorizontal, ExternalLink, Trash2, Globe,
  Clock, Star, ArrowUpDown, AlertCircle, Edit3,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Badge } from '@/lib/ui/badge'
import { Separator } from '@/lib/ui/separator'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/lib/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/lib/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/lib/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { EmptyState } from '@/components/shared/EmptyState'
import { agentsApi } from '@/lib/api'
import type { Agent, AgentStatus, Provider } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────

const providerLabel: Record<Provider, string> = {
  OPENAI: 'OpenAI',
  ANTHROPIC: 'Anthropic',
  GOOGLE: 'Google',
  GROQ: 'Groq',
  OLLAMA: 'Ollama',
}

const providerColors: Record<Provider, string> = {
  OPENAI: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  ANTHROPIC: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  GOOGLE: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  GROQ: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  OLLAMA: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
}

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

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

// ─── Agent Card ──────────────────────────────────────────────────────────

function AgentCard({
  agent,
  index,
  onView,
  onEdit,
  onDelete,
}: {
  agent: Agent
  index: number
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (agent: Agent) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="group hover:border-[var(--border-accent)] transition-all duration-300 h-full flex flex-col cursor-pointer"
        onClick={() => onView(agent.id)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
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
              <div className="min-w-0">
                <CardTitle className="text-base truncate">{agent.name}</CardTitle>
                <CardDescription className="text-xs truncate">{agent.model}</CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={e => { e.stopPropagation(); onView(agent.id) }}>
                  <ExternalLink className="h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); onEdit(agent.id) }}>
                  <Edit3 className="h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[var(--error)]"
                  onClick={e => { e.stopPropagation(); onDelete(agent) }}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1 line-clamp-2">
            {agent.description || 'No description'}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${providerColors[agent.provider]}`}>
              {providerLabel[agent.provider]}
            </Badge>
            {agent.visibility === 'PUBLIC' && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-[var(--info)] border-[var(--info-border)] bg-[var(--info-light)]">
                <Globe className="h-3 w-3 mr-0.5" /> Public
              </Badge>
            )}
          </div>

          <Separator className="mb-4" />

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <StatusIndicator status={statusIndicatorColor(agent.status)} />
              <span className={`capitalize font-medium ${statusColors[agent.status]}`}>
                {agent.status.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
              <Clock className="h-3 w-3" />
              <span>{formatDate(agent.updated_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border-primary)]">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={e => { e.stopPropagation(); onEdit(agent.id) }}
            >
              <Edit3 className="h-3 w-3 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-[var(--text-secondary)]"
              onClick={e => { e.stopPropagation(); onView(agent.id) }}
            >
              <ExternalLink className="h-3 w-3 mr-1" /> View
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── My Agents Tab ───────────────────────────────────────────────────────

function MyAgentsTab() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [deleteTarget, setDeleteTarget] = useState<Agent | null>(null)
  const navigate = useNavigate()

  const fetchAgents = async () => {
    setLoading(true)
    setError(null)
    try {
      const filter = statusFilter !== 'all' ? statusFilter : undefined
      const result = await agentsApi.getMyAgents(0, 100, filter)
      setAgents(result?.items || [])
      setTotal(result?.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAgents() }, [statusFilter])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await agentsApi.delete(deleteTarget.id)
      setAgents(prev => prev.filter(a => a.id !== deleteTarget.id))
      setTotal(prev => prev - 1)
      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete agent:', err)
    }
  }

  const filteredAgents = (agents || []).filter(a => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      a.name.toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      a.model.toLowerCase().includes(q) ||
      a.provider.toLowerCase().includes(q)
    )
  })

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter chips */}
          {['all', 'DRAFT', 'READY', 'DEPLOYED', 'ARCHIVED'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize cursor-pointer ${
                statusFilter === f
                  ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-accent)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-transparent hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {f === 'all' ? 'All' : f.toLowerCase()}
            </button>
          ))}
          {/* Sort toggle */}
          <button
            onClick={() => setSortOrder(s => s === 'newest' ? 'oldest' : 'newest')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-transparent hover:bg-[var(--bg-tertiary)]"
            title={`Sorted by ${sortOrder}`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
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
                <div className="h-3 w-full rounded bg-[var(--bg-muted)]" />
                <div className="h-3 w-2/3 rounded bg-[var(--bg-muted)]" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="border-[var(--error-border)] bg-[var(--error-light)]">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-[var(--error)] shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--error)]">Failed to load agents</p>
              <p className="text-xs text-[var(--text-secondary)]">{error}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={fetchAgents}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty state */}
      {!loading && !error && sortedAgents.length === 0 && (
        <EmptyState
          icon={<Bot className="h-8 w-8" />}
          title={searchQuery || statusFilter !== 'all' ? 'No matching agents' : 'No agents yet'}
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Create your first AI agent to get started.'
          }
          action={
            !searchQuery && statusFilter === 'all' ? (
              <Button onClick={() => navigate('/create-agent')}>
                <Plus className="h-4 w-4" /> Create Agent
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Agent grid */}
      {!loading && !error && sortedAgents.length > 0 && (
        <>
          <p className="text-xs text-[var(--text-tertiary)]">
            Showing {sortedAgents.length} of {total} agent{total !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedAgents.map((agent, i) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={i}
                onView={id => navigate(`/agents/${id}`)}
                onEdit={id => navigate(`/agents/${id}/edit`)}
                onDelete={a => setDeleteTarget(a)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Marketplace Tab ─────────────────────────────────────────────────────

function MarketplaceTab() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    agentsApi.getPublic(0, 50)
      .then(res => setAgents(res.items))
      .catch(() => {}) // Silently fail — marketplace is a nice-to-have
      .finally(() => setLoading(false))
  }, [])

  const filteredAgents = (agents || []).filter(a => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      a.name.toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      a.model.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
        <Input
          placeholder="Search marketplace..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="h-48 animate-pulse">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--bg-muted)]" />
                <div className="h-4 w-2/3 rounded bg-[var(--bg-muted)]" />
                <div className="h-3 w-full rounded bg-[var(--bg-muted)]" />
                <div className="h-3 w-1/2 rounded bg-[var(--bg-muted)]" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredAgents.length === 0 && (
        <EmptyState
          icon={<Globe className="h-8 w-8" />}
          title={searchQuery ? 'No matching agents' : 'Marketplace is empty'}
          description={
            searchQuery
              ? 'Try a different search term.'
              : 'No public agents have been shared yet. Be the first!'
          }
        />
      )}

      {!loading && filteredAgents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className="group hover:border-[var(--border-accent)] transition-all duration-300 h-full flex flex-col cursor-pointer"
                onClick={() => navigate(`/agents/${agent.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center shrink-0">
                      <Globe className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{agent.name}</CardTitle>
                      <CardDescription className="text-xs truncate">{agent.model}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1 line-clamp-2">
                    {agent.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-tertiary)]">
                      {providerLabel[agent.provider]}
                    </span>
                    <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                      <Star className="h-3 w-3" />
                      Clone to use
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Agents Page ────────────────────────────────────────────────────

export function AgentsPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agents"
        description="Create, manage, and discover AI agents"
        actions={
          <Button onClick={() => navigate('/create-agent')}>
            <Plus className="h-4 w-4" /> New Agent
          </Button>
        }
      />

      <Tabs defaultValue="my-agents" className="w-full">
        <TabsList>
          <TabsTrigger value="my-agents">
            <Bot className="h-4 w-4 mr-1.5" /> My Agents
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            <Globe className="h-4 w-4 mr-1.5" /> Marketplace
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-agents">
          <MyAgentsTab />
        </TabsContent>
        <TabsContent value="marketplace">
          <MarketplaceTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
