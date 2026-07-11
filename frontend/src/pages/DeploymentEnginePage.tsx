import { useState } from 'react'
import {
  Rocket, Globe, AlertTriangle, Timer, GitBranch,
  ExternalLink, MoreHorizontal, RefreshCw, Trash2, Plus,
  Search, ArrowUpRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Input } from '@/lib/ui/input'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/lib/ui/dropdown-menu'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { deployments } from '@/data/dummy'
import { timeAgo, getStatusColor, getStatusBg } from '@/lib/utils'

export function DeploymentEnginePage() {
  const [search, setSearch] = useState('')

  const filtered = deployments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const StatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return Globe
      case 'deploying': return Timer
      case 'failed': return AlertTriangle
      case 'stopped': return Rocket
      default: return Rocket
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Deployment Engine"
        description="Deploy and manage your applications, agents, and services"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <GitBranch className="h-4 w-4" /> Connect Repo
            </Button>
            <Button>
              <Plus className="h-4 w-4" /> New Deployment
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Deployments" value={deployments.length.toString()} icon={<Rocket className="h-5 w-5" />} />
        <StatCard title="Live" value={deployments.filter(d => d.status === 'deployed').length.toString()} icon={<Globe className="h-5 w-5" />} />
        <StatCard title="Failed" value={deployments.filter(d => d.status === 'failed').length.toString()} icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard title="Deploying" value={deployments.filter(d => d.status === 'deploying').length.toString()} icon={<Timer className="h-5 w-5" />} />
      </div>

      {deployments.length > 0 && (
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Search deployments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Rocket className="h-8 w-8" />}
            title="No deployments"
            description="Deploy your first AI Agent."
            action={<Button><GitBranch className="h-4 w-4" /> Connect Repository</Button>}
          />
        ) : (
          filtered.map((dep, i) => {
            const SIcon = StatusIcon(dep.status)
            return (
              <motion.div
                key={dep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="hover:border-[var(--border-accent)] transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`h-10 w-10 rounded-xl ${getStatusBg(dep.status)} flex items-center justify-center shrink-0`}>
                          <SIcon className={`h-5 w-5 ${getStatusColor(dep.status)}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{dep.name}</p>
                            <Badge variant={
                              dep.status === 'deployed' ? 'success' :
                              dep.status === 'deploying' ? 'warning' :
                              dep.status === 'failed' ? 'danger' : 'default'
                            } size="sm" className="capitalize">
                              {dep.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {dep.url && (
                              <a href="#" className="text-xs text-[var(--text-accent)] hover:text-[var(--accent-hover)] flex items-center gap-1">
                                {dep.url} <ArrowUpRight className="h-3 w-3" />
                              </a>
                            )}
                            <span className="text-xs text-[var(--text-tertiary)]">{dep.region}</span>
                            <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">&middot;</span>
                            <span className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                              <GitBranch className="h-3 w-3" /> {dep.branch}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-6 mx-6">
                        <div className="text-right">
                          <p className="text-xs text-[var(--text-tertiary)]">CPU</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{dep.cpu} cores</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[var(--text-tertiary)]">Memory</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{dep.memory} GB</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[var(--text-tertiary)]">Commits</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{dep.commits}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-[var(--text-tertiary)] hidden sm:block">{timeAgo(dep.deployedAt)}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem><ExternalLink className="h-4 w-4" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem><RefreshCw className="h-4 w-4" /> Redeploy</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-[var(--error)]"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
