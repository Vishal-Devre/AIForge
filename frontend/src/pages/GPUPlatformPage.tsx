import { Cpu, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/lib/ui/button'
import { HardDrive, Activity } from 'lucide-react'

export function GPUPlatformPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="GPU Platform"
        description="Manage GPU instances and monitor compute resources"
        actions={
          <Button disabled>
            <Plus className="h-4 w-4" /> Provision GPU
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total VRAM" value="0 GB" icon={<HardDrive className="h-5 w-5" />} />
        <StatCard title="VRAM Used" value="0 GB" icon={<HardDrive className="h-5 w-5" />} />
        <StatCard title="Avg Utilization" value="0%" icon={<Activity className="h-5 w-5" />} />
        <StatCard title="Active Nodes" value="0" icon={<Cpu className="h-5 w-5" />} />
      </div>

      <EmptyState
        icon={<Cpu className="h-8 w-8" />}
        title="No GPU instances"
        description="Provision your first GPU node to start running compute workloads."
        action={<Button disabled><Plus className="h-4 w-4" /> Provision GPU</Button>}
      />
    </div>
  )
}
