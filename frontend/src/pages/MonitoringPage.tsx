import { useState } from 'react'
import {
  Activity, AlertTriangle, Gauge,
  Cpu, Globe, Clock, Bell, Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { MetricBar } from '@/components/shared/MetricBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { dashboardStats } from '@/data/dummy'

export function MonitoringPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')

  const hasMetrics = dashboardStats.cpuUsage > 0 || dashboardStats.memoryUsage > 0

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
            <div className="flex rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)] p-0.5">
              {['15m', '1h', '6h', '24h', '7d'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTimeframe(t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedTimeframe === t ? 'bg-[var(--border-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="System Health" value={hasMetrics ? '98.2%' : '—'} icon={<Activity className="h-5 w-5" />} />
        <StatCard title="Avg Latency" value={dashboardStats.avgLatency > 0 ? `${dashboardStats.avgLatency}ms` : '—'} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Requests/min" value={dashboardStats.requestsPerMin > 0 ? `${dashboardStats.requestsPerMin}` : '0'} icon={<Globe className="h-5 w-5" />} />
        <StatCard title="Error Rate" value={dashboardStats.errorRate > 0 ? `${dashboardStats.errorRate}%` : '0%'} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      {!hasMetrics ? (
        <EmptyState
          icon={<Activity className="h-8 w-8" />}
          title="No monitoring data"
          description="Monitoring data will appear here once you deploy services and start receiving traffic"
          action={<Button variant="outline"><Bell className="h-4 w-4" /> Configure Alerts</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
              <CardDescription>CPU, Memory, and Network over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <MetricBar label="CPU Usage" value={dashboardStats.cpuUsage} />
                <MetricBar label="Memory Usage" value={dashboardStats.memoryUsage} />
                <MetricBar label="Disk I/O" value={0} />
                <MetricBar label="Network In/Out" value={0} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Alerts</CardTitle>
                <Button variant="ghost" size="icon-sm"><Filter className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">No active alerts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Health */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
          <CardDescription>Status of all running services and endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'API Gateway', status: 'healthy', uptime: '—', latency: '—' },
              { name: 'Agent Runtime', status: 'healthy', uptime: '—', latency: '—' },
              { name: 'GPU Inference', status: 'healthy', uptime: '—', latency: '—' },
              { name: 'Sandbox Service', status: 'healthy', uptime: '—', latency: '—' },
            ].map(svc => (
              <div key={svc.name} className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-primary)] hover:border-[var(--border-strong)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIndicator status="running" />
                  <span className="text-sm font-medium text-[var(--text-primary)]">{svc.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">{svc.uptime}</span>
                  <span className="text-[var(--text-tertiary)]">{svc.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
