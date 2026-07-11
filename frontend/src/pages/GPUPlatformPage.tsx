import { useState } from 'react'
import {
  Cpu, Plus, Thermometer, Zap, HardDrive, Activity, Gauge,
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
import { EmptyState } from '@/components/shared/EmptyState'
import { gpuInstances } from '@/data/dummy'
import { formatDuration, getStatusColor } from '@/lib/utils'

export function GPUPlatformPage() {
  const [filter, setFilter] = useState('all')

  const filtered = gpuInstances.filter(g => filter === 'all' || g.status === filter)

  const totalVram = gpuInstances.reduce((sum, g) => sum + g.vram, 0)
  const totalVramUsed = gpuInstances.reduce((sum, g) => sum + g.vramUsed, 0)
  const avgUtilization = gpuInstances.length > 0
    ? Math.round(gpuInstances.reduce((sum, g) => sum + g.utilization, 0) / gpuInstances.length)
    : 0

  return (
    <div className="space-y-8">
      <PageHeader
        title="GPU Platform"
        description="Manage GPU instances and monitor compute resources"
        actions={
          <Button>
            <Plus className="h-4 w-4" /> Provision GPU
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total VRAM" value={totalVram > 0 ? `${totalVram}GB` : '0'} icon={<HardDrive className="h-5 w-5" />} />
        <StatCard title="VRAM Used" value={totalVramUsed > 0 ? `${totalVramUsed}GB` : '0'} icon={<HardDrive className="h-5 w-5" />} />
        <StatCard title="Avg Utilization" value={`${avgUtilization}%`} icon={<Activity className="h-5 w-5" />} />
        <StatCard title="Active Nodes" value={gpuInstances.filter(g => g.status === 'active').length.toString()} icon={<Cpu className="h-5 w-5" />}
          description={`${gpuInstances.length} total`} />
      </div>

      {gpuInstances.length === 0 ? (
        <EmptyState
          icon={<Cpu className="h-8 w-8" />}
          title="No GPU instances"
          description="Provision your first GPU node to start running compute workloads"
          action={<Button><Plus className="h-4 w-4" /> Provision GPU</Button>}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {['all', 'active', 'idle', 'error', 'provisioning'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  filter === f ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-accent)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-transparent hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((gpu, i) => (
              <motion.div
                key={gpu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:border-[var(--border-accent)] transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          gpu.status === 'active' ? 'bg-[var(--success-light)]' :
                          gpu.status === 'idle' ? 'bg-[var(--info-light)]' : 'bg-[var(--error-light)]'
                        }`}>
                          <Cpu className={`h-6 w-6 ${
                            gpu.status === 'active' ? 'text-[var(--success)]' :
                            gpu.status === 'idle' ? 'text-[var(--info)]' : 'text-[var(--error)]'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{gpu.name}</CardTitle>
                            <StatusIndicator status={gpu.status} />
                          </div>
                          <CardDescription className="text-xs">{gpu.gpuType}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={gpu.status === 'active' ? 'success' : gpu.status === 'idle' ? 'default' : 'danger'} size="sm" className="capitalize">
                        {gpu.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)] p-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-1">
                          <Gauge className="h-3 w-3" /> Utilization
                        </div>
                        <p className="text-lg font-bold text-[var(--text-primary)]">{gpu.utilization}%</p>
                        <Progress value={gpu.utilization} className="h-1 mt-2" />
                      </div>
                      <div className="rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)] p-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-1">
                          <HardDrive className="h-3 w-3" /> VRAM
                        </div>
                        <p className="text-lg font-bold text-[var(--text-primary)]">{gpu.vramUsed}/{gpu.vram}GB</p>
                        <Progress value={(gpu.vramUsed / gpu.vram) * 100} className="h-1 mt-2" />
                      </div>
                      <div className="rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)] p-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-1">
                          <Thermometer className="h-3 w-3" /> Temperature
                        </div>
                        <p className="text-lg font-bold text-[var(--text-primary)]">{gpu.temperature}°C</p>
                        <Progress value={gpu.temperature} className="h-1 mt-2" />
                      </div>
                      <div className="rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)] p-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-1">
                          <Zap className="h-3 w-3" /> Power
                        </div>
                        <p className="text-lg font-bold text-[var(--text-primary)]">{gpu.powerDraw}W</p>
                        <Progress value={(gpu.powerDraw / 500) * 100} className="h-1 mt-2" />
                      </div>
                    </div>

                    <Separator className="mb-4" />

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
                        <span>{gpu.processes} processes</span>
                        <span>Uptime: {formatDuration(gpu.uptime)}</span>
                      </div>
                      <span className="text-[var(--accent)] font-medium">${gpu.costPerHour}/hr</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
