import { useState } from 'react'
import {
  Activity, AlertTriangle, TrendingUp, TrendingDown, Gauge,
  Cpu, HardDrive, Globe, Clock, Search, Bell, Filter
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Input } from '@/lib/ui/input'
import { Progress } from '@/lib/ui/progress'
import { Separator } from '@/lib/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/lib/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { MetricBar } from '@/components/shared/MetricBar'
import { agents, gpuInstances, k8sPods, activities, dashboardStats } from '@/data/dummy'
import { getStatusColor, getStatusBg, timeAgo } from '@/lib/utils'

const alerts = [
  { id: 'al_1', severity: 'critical', title: 'GPU Node H100-Node-1 Temperature Critical', message: 'Temperature reached 82°C, automatic throttling initiated', time: '5m ago', status: 'active' },
  { id: 'al_2', severity: 'warning', title: 'Memory Pressure on A100-Node-2', message: 'Memory utilization at 78% for over 15 minutes', time: '23m ago', status: 'active' },
  { id: 'al_3', severity: 'info', title: 'Deployment Queue Processing', message: '3 deployments waiting in queue, estimated time: 2 minutes', time: '1h ago', status: 'resolved' },
  { id: 'al_4', severity: 'warning', title: 'API Latency Spike Detected', message: 'p99 latency spiked to 340ms for 5 minutes', time: '2h ago', status: 'resolved' },
]

export function MonitoringPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')

  return (
    <div className="space-y-8">
      <PageHeader
        title="Monitoring"
        description="Real-time observability across your entire infrastructure"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" /> Alert Rules
            </Button>
            <div className="flex rounded-lg bg-surface-800/60 border border-surface-700/30 p-0.5">
              {['15m', '1h', '6h', '24h', '7d'].map(t => (
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
          </div>
        }
      />

      {/* System Health */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="System Health" value="98.2%" icon={<Activity className="h-5 w-5" />} trend={{ value: 0.5, positive: true }} />
        <StatCard title="Avg Latency" value={`${dashboardStats.avgLatency}ms`} icon={<Clock className="h-5 w-5" />} trend={{ value: 8, positive: false }} />
        <StatCard title="Requests/min" value={`${dashboardStats.requestsPerMin}`} icon={<Globe className="h-5 w-5" />} trend={{ value: 12, positive: true }} />
        <StatCard title="Error Rate" value={`${dashboardStats.errorRate}%`} icon={<AlertTriangle className="h-5 w-5" />} trend={{ value: 0.2, positive: true }} />
        <StatCard title="Active Alerts" value={alerts.filter(a => a.status === 'active').length.toString()} icon={<Bell className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CPU / Memory Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>CPU, Memory, and Network over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <MetricBar label="CPU Usage" value={dashboardStats.cpuUsage} />
              <MetricBar label="Memory Usage" value={dashboardStats.memoryUsage} />
              <MetricBar label="Disk I/O" value={45} />
              <MetricBar label="Network In/Out" value={62} />
            </div>

            <Separator className="my-5" />

            <div className="grid grid-cols-3 gap-4">
              {gpuInstances.slice(0, 3).map(gpu => (
                <div key={gpu.id} className="text-center p-3 rounded-lg bg-surface-800/30 border border-surface-700/20">
                  <p className="text-xs text-slate-400 truncate">{gpu.name}</p>
                  <p className={`text-lg font-bold mt-1 ${getStatusColor(gpu.status)}`}>{gpu.utilization}%</p>
                  <p className="text-[10px] text-slate-500">{gpu.temperature}°C / {gpu.powerDraw}W</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Alerts</CardTitle>
              <Button variant="ghost" size="icon-sm"><Filter className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="p-3 rounded-lg bg-surface-800/30 border border-surface-700/20 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-400' :
                      alert.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                    }`} />
                    <span className={`text-xs font-medium capitalize ${
                      alert.severity === 'critical' ? 'text-red-400' :
                      alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                    }`}>{alert.severity}</span>
                    <Badge variant={alert.status === 'active' ? 'warning' : 'success'} size="sm" className="ml-auto">
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-white">{alert.title}</p>
                  <p className="text-[10px] text-slate-500">{alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Health */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
          <CardDescription>Status of all running services and endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'API Gateway', status: 'healthy', uptime: '99.99%', latency: '12ms' },
              { name: 'Agent Runtime', status: 'healthy', uptime: '99.97%', latency: '45ms' },
              { name: 'GPU Inference', status: 'healthy', uptime: '99.95%', latency: '28ms' },
              { name: 'Sandbox Service', status: 'degraded', uptime: '98.2%', latency: '120ms' },
              { name: 'Database Cluster', status: 'healthy', uptime: '100%', latency: '3ms' },
              { name: 'Cache Layer', status: 'healthy', uptime: '100%', latency: '1ms' },
              { name: 'Deployment API', status: 'healthy', uptime: '99.99%', latency: '8ms' },
              { name: 'Monitoring Stack', status: 'healthy', uptime: '99.99%', latency: '5ms' },
            ].map(svc => (
              <div key={svc.name} className="p-4 rounded-xl bg-surface-800/30 border border-surface-700/20 hover:border-surface-700/40 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIndicator status={svc.status === 'healthy' ? 'running' : 'warning'} />
                  <span className="text-sm font-medium text-white">{svc.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${svc.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>{svc.uptime}</span>
                  <span className="text-slate-500">{svc.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
