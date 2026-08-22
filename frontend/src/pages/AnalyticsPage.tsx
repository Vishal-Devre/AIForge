import { useState } from 'react'
import { BarChart3, TrendingUp, Zap, Clock, DollarSign, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { SegmentedTabs } from '@/components/shared/SegmentedTabs'

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics & Usage"
        description="Comprehensive insights into system performance, token usage, API traffic, and GPU utilization"
        actions={
          <SegmentedTabs
            ariaLabel="Analytics time range"
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { value: '24h', label: '24H' },
              { value: '7d', label: '7D' },
              { value: '30d', label: '30D' },
              { value: '90d', label: '90D' },
            ]}
          />
        }
      />

      {/* KPI Cards — real data not yet available */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)] font-medium">Total API Invocations</span>
              <div className="h-8 w-8 rounded-lg bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-3">—</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Not yet available</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)] font-medium">Token Consumption</span>
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-3">—</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Not yet available</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)] font-medium">Avg Latency</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-3">—</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Not yet available</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)] font-medium">Estimated Platform Cost</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-3">—</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Not yet available</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty state — analytics data not yet implemented */}
      <EmptyState
        icon={<BarChart3 className="h-8 w-8" />}
        title="Analytics data not yet available"
        description="API usage metrics, token consumption, and cost analytics will appear here once the analytics backend is connected."
      />
    </div>
  )
}
