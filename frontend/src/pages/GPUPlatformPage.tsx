import { useState } from 'react'
import {
  Cpu, Plus, Thermometer, Zap, HardDrive, Activity, Gauge,
  MoreHorizontal, Play, Square, ExternalLink
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Progress } from '@/lib/ui/progress'
import { Separator } from '@/lib/ui/separator'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/lib/ui/dropdown-menu'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { gpuInstances } from '@/data/dummy'
import { formatDuration, getStatusColor } from '@/lib/utils'

export function GPUPlatformPage() {
  const [filter, setFilter] = useState('all')

  const filtered = gpuInstances.filter(g => filter === 'all' || g.status === filter)

  const totalVram = gpuInstances.reduce((sum, g) => sum + g.vram, 0)
  const totalVramUsed = gpuInstances.reduce((sum, g) => sum + g.vramUsed, 0)
  const avgUtilization = Math.round(gpuInstances.reduce((sum, g) => sum + g.utilization, 0) / gpuInstances.length)

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total VRAM" value={`${totalVram}GB`} icon={<HardDrive className="h-5 w-5" />} />
        <StatCard title="VRAM Used" value={`${totalVramUsed}GB`} icon={<HardDrive className="h-5 w-5" />}
          trend={{ value: Math.round((totalVramUsed / totalVram) * 100), positive: false }} />
        <StatCard title="Avg Utilization" value={`${avgUtilization}%`} icon={<Activity className="h-5 w-5" />} />
        <StatCard title="Active Nodes" value={gpuInstances.filter(g => g.status === 'active').length.toString()} icon={<Cpu className="h-5 w-5" />}
          description={`${gpuInstances.length} total`} />
      </div>

      {/* GPU Cards */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'idle', 'error', 'provisioning'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
              filter === f ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20' : 'text-slate-400 hover:text-white border border-transparent hover:bg-surface-800/40'
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
            <Card className="hover:border-primary-500/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      gpu.status === 'active' ? 'bg-emerald-500/10' :
                      gpu.status === 'idle' ? 'bg-slate-500/10' : 'bg-red-500/10'
                    }`}>
                      <Cpu className={`h-6 w-6 ${
                        gpu.status === 'active' ? 'text-emerald-400' :
                        gpu.status === 'idle' ? 'text-slate-400' : 'text-red-400'
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
                  <div className="rounded-lg bg-surface-800/40 border border-surface-700/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Gauge className="h-3 w-3" /> Utilization
                    </div>
                    <p className="text-lg font-bold text-white">{gpu.utilization}%</p>
                    <Progress value={gpu.utilization} className="h-1 mt-2" />
                  </div>
                  <div className="rounded-lg bg-surface-800/40 border border-surface-700/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <HardDrive className="h-3 w-3" /> VRAM
                    </div>
                    <p className="text-lg font-bold text-white">{gpu.vramUsed}/{gpu.vram}GB</p>
                    <Progress value={(gpu.vramUsed / gpu.vram) * 100} className="h-1 mt-2" />
                  </div>
                  <div className="rounded-lg bg-surface-800/40 border border-surface-700/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Thermometer className="h-3 w-3" /> Temperature
                    </div>
                    <p className="text-lg font-bold text-white">{gpu.temperature}°C</p>
                    <Progress value={(gpu.temperature / 100) * 100} className="h-1 mt-2" />
                  </div>
                  <div className="rounded-lg bg-surface-800/40 border border-surface-700/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Zap className="h-3 w-3" /> Power
                    </div>
                    <p className="text-lg font-bold text-white">{gpu.powerDraw}W</p>
                    <Progress value={(gpu.powerDraw / 500) * 100} className="h-1 mt-2" />
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span>{gpu.processes} processes</span>
                    <span>Uptime: {formatDuration(gpu.uptime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-primary-300 font-medium">${gpu.costPerHour}/hr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
