import { useState } from 'react'
import {
  Terminal, Play, Square, Clock, HardDrive, Cpu,
  Copy, Download, Plus, ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/lib/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'

const environments = [
  { name: 'Python 3.12 + CUDA', desc: 'Complete ML stack with PyTorch, TensorFlow, JAX', tag: 'ML/AI' },
  { name: 'Node.js 22 + TypeScript', desc: 'Runtime with TypeScript, ESLint, and build tools', tag: 'Web' },
  { name: 'Go 1.22 + Docker', desc: 'Go development environment with Docker-in-Docker', tag: 'Backend' },
  { name: 'Rust + CUDA', desc: 'Rust toolchain with GPU compute support', tag: 'Systems' },
]

export function SandboxPage() {
  const [activeTab, setActiveTab] = useState('sessions')

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Sandbox"
        description="Secure, isolated environments for AI development and experimentation"
        actions={
          <Button>
            <Plus className="h-4 w-4" /> New Session
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Sessions" value="0" icon={<Terminal className="h-5 w-5" />} />
        <StatCard title="Total Sessions" value="0" icon={<Terminal className="h-5 w-5" />} />
        <StatCard title="Compute Used" value="0 hrs" icon={<Cpu className="h-5 w-5" />} />
        <StatCard title="Storage Used" value="0 GB" icon={<HardDrive className="h-5 w-5" />} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="environments">Environments</TabsTrigger>
          <TabsTrigger value="saved">Saved Images</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <EmptyState
            icon={<Terminal className="h-8 w-8" />}
            title="No active sessions"
            description="Start a sandbox session to begin working in an isolated environment"
            action={<Button><Play className="h-4 w-4" /> Start Session</Button>}
          />
        </TabsContent>

        <TabsContent value="environments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {environments.map(env => (
              <Card key={env.name} className="hover:border-[var(--border-accent)] transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{env.name}</p>
                        <Badge variant="primary" size="sm">{env.tag}</Badge>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{env.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors mt-1 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <EmptyState
            icon={<HardDrive className="h-8 w-8" />}
            title="No saved images"
            description="Save your sandbox environments as custom images for future use"
            action={<Button variant="outline"><Download className="h-4 w-4" /> Browse Image Registry</Button>}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
