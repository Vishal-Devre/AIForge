import { useState } from 'react'
import {
  Activity, AlertTriangle, Gauge,
  Globe, Clock, Bell, Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'

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
        <StatCard title="System Health" value="—" icon={<Activity className="h-5 w-5" />} />
        <StatCard title="Avg Latency" value="—" icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Requests/min" value="0" icon={<Globe className="h-5 w-5" />} />
        <StatCard title="Error Rate" value="0%" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <EmptyState
        icon={<Activity className="h-8 w-8" />}
        title="No monitoring data"
        description="Monitoring data will appear here once services are deployed and start receiving traffic."
        action={<Button variant="outline"><Bell className="h-4 w-4" /> Configure Alerts</Button>}
      />
    </div>
  )
}
