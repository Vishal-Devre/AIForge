import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Cpu, HardDrive, Globe, Bot, Rocket, AlertTriangle,
  ChevronRight, Play, Plus, ArrowUpRight, Container, GitBranch,
  Layers, Timer, Gauge, Terminal, Settings
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Progress } from '@/lib/ui/progress'
import { Separator } from '@/lib/ui/separator'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { MetricBar } from '@/components/shared/MetricBar'
import { agents, gpuInstances, deployments, k8sPods, activities, dashboardStats } from '@/data/dummy'
import { formatNumber, formatBytes, formatDuration, timeAgo, getStatusColor, getStatusBg } from '@/lib/utils'

function DashboardPage() {
  const navigate = useNavigate()
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your AI infrastructure at a glance"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-surface-800/60 border border-surface-700/30 p-0.5">
              {['1h', '6h', '24h', '7d'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTimeframe(t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedTimeframe === t ? 'bg-surface-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={() => navigate('/deployments')}>
              <Rocket className="h-4 w-4" /> New Deployment
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard
            title="Total Deployments"
            value={dashboardStats.totalDeployments}
            icon={<Rocket className="h-5 w-5" />}
            trend={{ value: 12, positive: true }}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard
            title="Active Agents"
            value={dashboardStats.activeAgents}
            icon={<Bot className="h-5 w-5" />}
            description={`${agents.filter(a => a.status === 'running').length} running`}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard
            title="GPU Nodes"
            value={dashboardStats.gpuNodes}
            icon={<Cpu className="h-5 w-5" />}
            trend={{ value: 2, positive: true }}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard
            title="Uptime"
            value={`${dashboardStats.uptimePercent}%`}
            icon={<Activity className="h-5 w-5" />}
            description="Last 30 days"
          />
        </motion.div>
      </div>

      {/* Resource Overview + GPU */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Usage */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resource Overview</CardTitle>
                  <CardDescription>Cluster-wide CPU, memory and network usage</CardDescription>
                </div>
                <Badge variant="info" size="sm">
                  <Gauge className="h-3 w-3 mr-1" /> Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <MetricBar label="CPU Usage" value={dashboardStats.cpuUsage} unit="%" />
                <MetricBar label="Memory Usage" value={dashboardStats.memoryUsage} unit="%" />
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="rounded-lg bg-surface-800/40 border border-surface-700/30 p-3">
                    <p className="text-xs text-slate-400 mb-1">Requests/min</p>
                    <p className="text-lg font-bold text-white">{formatNumber(dashboardStats.requestsPerMin)}</p>
                  </div>
                  <div className="rounded-lg bg-surface-800/40 border border-surface-700/30 p-3">
                    <p className="text-xs text-slate-400 mb-1">Avg Latency</p>
                    <p className="text-lg font-bold text-white">{dashboardStats.avgLatency}ms</p>
                  </div>
                  <div className="rounded-lg bg-surface-800/40 border border-surface-700/30 p-3">
                    <p className="text-xs text-slate-400 mb-1">Error Rate</p>
                    <p className="text-lg font-bold text-white">{dashboardStats.errorRate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* GPU Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GPU Status</CardTitle>
                <Button variant="ghost" size="icon-sm" onClick={() => navigate('/gpu')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gpuInstances.slice(0, 3).map(gpu => (
                  <div key={gpu.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-800/40 transition-colors">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      gpu.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      gpu.status === 'idle' ? 'bg-slate-500/10 text-slate-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      <Cpu className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{gpu.name}</span>
                        <StatusIndicator status={gpu.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{gpu.gpuType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{gpu.utilization}%</p>
                      <p className="text-xs text-slate-500">{gpu.temperature}°C</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Running Agents + Recent Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Running Agents */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Running Agents</CardTitle>
                  <CardDescription>Actively deployed AI agents</CardDescription>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => navigate('/agents')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {agents.filter(a => a.status === 'running').map(agent => (
                  <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/30 border border-surface-700/20 hover:border-surface-700/40 transition-all">
                    <div className="h-9 w-9 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <Bot className="h-4.5 w-4.5 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{agent.name}</span>
                        <Badge variant="success" size="sm">{agent.model}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Uptime: {formatDuration(agent.uptime)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{agent.deployments} deploys</p>
                      <Progress value={agent.gpuUsage} className="h-1 mt-1.5 w-16 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Deployments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Deployments</CardTitle>
                  <CardDescription>Latest deployments across all services</CardDescription>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => navigate('/deployments')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {deployments.slice(0, 4).map(dep => {
                  const statusColor = dep.status === 'deployed' ? 'text-emerald-400' : dep.status === 'deploying' ? 'text-amber-400' : 'text-red-400'
                  const StatusIcon = dep.status === 'deployed' ? Globe : dep.status === 'deploying' ? Timer : AlertTriangle
                  return (
                    <div key={dep.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-800/30 transition-colors">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getStatusBg(dep.status)}`}>
                        <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{dep.name}</p>
                        <p className="text-xs text-slate-500">{dep.region} &middot; {dep.branch}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-medium capitalize ${statusColor}`}>{dep.status}</p>
                        <p className="text-[10px] text-slate-500">{timeAgo(dep.deployedAt)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Kubernetes + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* K8s Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kubernetes Cluster</CardTitle>
                  <CardDescription>Pod status across all namespaces</CardDescription>
                </div>
                <Badge variant="success" size="sm">
                  <Container className="h-3 w-3 mr-1" /> {k8sPods.filter(p => p.status === 'running').length}/{k8sPods.length} running
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-700/30">
                      <th className="text-left py-2.5 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="text-left py-2.5 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Namespace</th>
                      <th className="text-left py-2.5 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="text-left py-2.5 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">CPU</th>
                      <th className="text-left py-2.5 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Memory</th>
                      <th className="text-left py-2.5 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Restarts</th>
                      <th className="text-left py-2.5 px-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {k8sPods.map(pod => (
                      <tr key={pod.id} className="border-b border-surface-700/10 hover:bg-surface-800/20 transition-colors">
                        <td className="py-3 px-2"><span className="text-white font-mono text-xs">{pod.name}</span></td>
                        <td className="py-3 px-2"><span className="text-slate-400 text-xs">{pod.namespace}</span></td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1.5">
                            <StatusIndicator status={pod.status} />
                            <span className={`text-xs capitalize ${getStatusColor(pod.status)}`}>{pod.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2"><span className="text-xs text-slate-300 font-mono">{pod.cpu}</span></td>
                        <td className="py-3 px-2"><span className="text-xs text-slate-300 font-mono">{pod.memory}</span></td>
                        <td className="py-3 px-2"><span className="text-xs text-slate-300">{pod.restarts}</span></td>
                        <td className="py-3 px-2"><span className="text-xs text-slate-400">{pod.age}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {activities.slice(0, 6).map((act, i) => {
                  const iconMap = {
                    deployment: Rocket, agent: Bot, gpu: Cpu, sandbox: Terminal, alert: AlertTriangle, config: Settings
                  }
                  const ActIcon = iconMap[act.type] || Activity
                  const colorMap = {
                    success: 'text-emerald-400', error: 'text-red-400', warning: 'text-amber-400', info: 'text-blue-400'
                  }
                  const bgMap = {
                    success: 'bg-emerald-500/10', error: 'bg-red-500/10', warning: 'bg-amber-500/10', info: 'bg-blue-500/10'
                  }
                  return (
                    <div key={act.id} className="flex gap-3 pb-4 last:pb-0 relative">
                      {i < activities.slice(0, 6).length - 1 && (
                        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-surface-700/30" />
                      )}
                      <div className={`h-9 w-9 rounded-lg shrink-0 ${bgMap[act.status as keyof typeof bgMap] || 'bg-surface-800'} flex items-center justify-center`}>
                        <ActIcon className={`h-4 w-4 ${colorMap[act.status as keyof typeof colorMap] || 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className={`text-xs ${colorMap[act.status as keyof typeof colorMap] || 'text-slate-300'}`}>{act.message}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-500">{act.user}</span>
                          <span className="text-[10px] text-slate-500">&middot;</span>
                          <span className="text-[10px] text-slate-500">{timeAgo(act.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common operations to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Bot, label: 'Create Agent', desc: 'Deploy a new AI agent', path: '/agents', color: 'text-primary-400' },
                { icon: Cpu, label: 'Provision GPU', desc: 'Allocate GPU instance', path: '/gpu', color: 'text-emerald-400' },
                { icon: Terminal, label: 'Open Sandbox', desc: 'Start a sandbox session', path: '/sandbox', color: 'text-amber-400' },
                { icon: GitBranch, label: 'Deploy from Git', desc: 'Connect & deploy repo', path: '/deployments', color: 'text-blue-400' },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-800/30 border border-surface-700/20 hover:border-primary-500/20 hover:bg-surface-800/60 transition-all duration-200 group text-center"
                >
                  <div className="h-10 w-10 rounded-xl bg-surface-800/80 border border-surface-700/30 flex items-center justify-center group-hover:border-primary-500/30 group-hover:bg-primary-500/10 transition-all">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
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
