import { useState } from 'react'
import {
  Bot, Play, Square, Plus, Search, MoreHorizontal, ExternalLink,
  ChevronRight, Clock, Cpu, HardDrive, Layers
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Input } from '@/lib/ui/input'
import { Progress } from '@/lib/ui/progress'
import { Separator } from '@/lib/ui/separator'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/lib/ui/dropdown-menu'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { EmptyState } from '@/components/shared/EmptyState'
import { agents } from '@/data/dummy'
import { formatDuration, getStatusColor } from '@/lib/utils'

export function AgentFactoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || a.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agent Factory"
        description="Deploy, manage, and monitor your AI agents"
        actions={
          <Button>
            <Plus className="h-4 w-4" /> New Agent
          </Button>
        }
      />

      {/* Filters */}
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
        <div className="flex gap-2">
          {['all', 'running', 'stopped', 'error', 'deploying'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize cursor-pointer ${
                filter === f ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-accent)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-transparent hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      {filteredAgents.length === 0 ? (
        <EmptyState
          icon={<Bot className="h-8 w-8" />}
          title="No agents yet"
          description="Create your first AI Agent."
          action={<Button><Plus className="h-4 w-4" /> Create Agent</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group hover:border-[var(--border-accent)] transition-all duration-300 h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        agent.status === 'running' ? 'bg-[var(--success-light)]' :
                        agent.status === 'error' ? 'bg-[var(--error-light)]' :
                        agent.status === 'deploying' ? 'bg-[var(--warning-light)]' : 'bg-[var(--bg-muted)]'
                      }`}>
                        <Bot className={`h-5 w-5 ${
                          agent.status === 'running' ? 'text-[var(--success)]' :
                          agent.status === 'error' ? 'text-[var(--error)]' :
                          agent.status === 'deploying' ? 'text-[var(--warning)]' : 'text-[var(--text-tertiary)]'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <CardDescription className="text-xs">{agent.model}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem><Play className="h-4 w-4" /> Start</DropdownMenuItem>
                        <DropdownMenuItem><Square className="h-4 w-4" /> Stop</DropdownMenuItem>
                        <DropdownMenuItem><ExternalLink className="h-4 w-4" /> View Logs</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[var(--error)]">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1">{agent.description}</p>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-tertiary)]">GPU Usage</span>
                      <span className="text-[var(--text-secondary)]">{agent.gpuUsage}%</span>
                    </div>
                    <Progress value={agent.gpuUsage} className="h-1.5" />

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-tertiary)]">Memory</span>
                      <span className="text-[var(--text-secondary)]">{agent.memoryUsage} GB</span>
                    </div>
                    <Progress value={(agent.memoryUsage / 8) * 100} className="h-1.5" />
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <StatusIndicator status={agent.status} />
                      <span className={`capitalize ${getStatusColor(agent.status)}`}>{agent.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
                      <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {agent.deployments}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDuration(agent.uptime)}</span>
                    </div>
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
