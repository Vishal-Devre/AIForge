import { useNavigate } from 'react-router-dom'
import {
  Activity, Cpu, Bot, Rocket,
  ChevronRight, Plus, Terminal, GitBranch,
  Layers, Gauge, Sparkles, ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { agents, gpuInstances, deployments, dashboardStats } from '@/data/dummy'

function DashboardPage() {
  const navigate = useNavigate()

  const hasData = agents.length > 0 || deployments.length > 0 || gpuInstances.length > 0

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your AI infrastructure at a glance"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard title="Deployments" value={dashboardStats.totalDeployments} icon={<Rocket className="h-5 w-5" />} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Agents" value={dashboardStats.activeAgents} icon={<Bot className="h-5 w-5" />} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard title="GPU Nodes" value={dashboardStats.gpuNodes} icon={<Cpu className="h-5 w-5" />} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Uptime" value={dashboardStats.uptimePercent > 0 ? `${dashboardStats.uptimePercent}%` : '—'} icon={<Activity className="h-5 w-5" />} />
        </motion.div>
      </div>

      {!hasData ? (
        /* Welcome State */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-dashed border-[var(--border-primary)]">
            <CardContent className="py-16">
              <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-medium)] border border-[var(--border-accent)] flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-[var(--accent)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Welcome to AIForge</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
                  Your unified AI infrastructure platform. Deploy agents, manage GPU clusters,
                  and monitor everything from one place. Get started by creating your first resource.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button onClick={() => navigate('/agents')}>
                    <Bot className="h-4 w-4" /> Create Agent
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/deployments')}>
                    <GitBranch className="h-4 w-4" /> Deploy from Git
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Data view — shows when there's actual data */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Agents</CardTitle>
                  <Button variant="ghost" size="icon-sm" onClick={() => navigate('/agents')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {agents.filter(a => a.status === 'running').length === 0 ? (
                  <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">No running agents</p>
                ) : (
                  <div className="space-y-2">
                    {agents.filter(a => a.status === 'running').slice(0, 3).map(agent => (
                      <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)]">
                        <div className="h-9 w-9 rounded-lg bg-[var(--accent-light)] border border-[var(--border-accent)] flex items-center justify-center">
                          <Bot className="h-4.5 w-4.5 text-[var(--accent)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{agent.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{agent.model}</p>
                        </div>
                        <Badge variant="success" size="sm">Running</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Deployments</CardTitle>
                  <Button variant="ghost" size="icon-sm" onClick={() => navigate('/deployments')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {deployments.length === 0 ? (
                  <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">No deployments yet</p>
                ) : (
                  <div className="space-y-2">
                    {deployments.slice(0, 4).map(dep => (
                      <div key={dep.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--bg-muted)] transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-[var(--success-light)] flex items-center justify-center">
                          <Rocket className="h-4 w-4 text-[var(--success)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{dep.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{dep.region}</p>
                        </div>
                        <Badge variant={dep.status === 'deployed' ? 'success' : 'warning'} size="sm" className="capitalize">
                          {dep.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Actions — always visible */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common operations to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Bot, label: 'Create Agent', desc: 'Deploy a new AI agent', path: '/agents', color: 'text-[var(--accent)]' },
                { icon: Cpu, label: 'Provision GPU', desc: 'Allocate GPU instance', path: '/gpu', color: 'text-[var(--success)]' },
                { icon: Terminal, label: 'Open Sandbox', desc: 'Start a sandbox session', path: '/sandbox', color: 'text-[var(--warning)]' },
                { icon: GitBranch, label: 'Deploy from Git', desc: 'Connect & deploy repo', path: '/deployments', color: 'text-[var(--info)]' },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-tertiary)] transition-all duration-200 group text-center cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center group-hover:border-[var(--border-accent)] group-hover:bg-[var(--accent-light)] transition-all">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{action.label}</p>
                    <p className="text-xs text-[var(--text-tertiary)] hidden sm:block">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export { DashboardPage }
