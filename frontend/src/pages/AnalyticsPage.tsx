import { useState } from 'react'
import { BarChart3, TrendingUp, Cpu, Activity, Zap, Users, DollarSign, Clock, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics & Usage"
        description="Comprehensive insights into system performance, token usage, API traffic, and GPU utilization"
      >
        <div className="flex items-center gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.toUpperCase()}
            </Button>
          ))}
        </div>
      </PageHeader>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)] font-medium">Total API Invocations</span>
              <div className="h-8 w-8 rounded-lg bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-3">2.84M</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +14.2% vs previous period
            </p>
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
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-3">412.9M</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +8.7% tokens/sec throughput
            </p>
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
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-3">184 ms</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> -12ms latency improvement
            </p>
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
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-3">$1,420.50</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Within allocated budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inference Throughput & Demand</CardTitle>
            <CardDescription>Real-time requests and token generation over time ({timeRange})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-end justify-between gap-2 pt-8 pb-2 px-2 border-b border-[var(--border-primary)]">
              {[45, 62, 58, 80, 95, 72, 88, 64, 91, 100, 85, 78, 92, 60, 75].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    style={{ height: `${val}%` }}
                    className="w-full bg-gradient-to-t from-[var(--accent)] to-cyan-400 rounded-t transition-all group-hover:opacity-80"
                  />
                  <span className="text-[10px] text-[var(--text-tertiary)]">D{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" /> Active Model Requests
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Token Stream Volume
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Model distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Model Distribution</CardTitle>
            <CardDescription>Inference load by AI model family</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'LLaMA-3.3 70B Instruct', share: '45%', color: 'bg-purple-500' },
              { name: 'DeepSeek R1 Distill', share: '30%', color: 'bg-cyan-500' },
              { name: 'Mistral Large 2', share: '15%', color: 'bg-amber-500' },
              { name: 'Qwen 2.5 Coder', share: '10%', color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                  <span className="text-[var(--text-tertiary)]">{item.share}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
