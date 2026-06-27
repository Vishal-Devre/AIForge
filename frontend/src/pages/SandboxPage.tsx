import { useState } from 'react'
import {
  Terminal, Play, Square, Clock, HardDrive, Cpu,
  Copy, Download, Trash2, Plus, ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Progress } from '@/lib/ui/progress'
import { Separator } from '@/lib/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/lib/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'

const sessions = [
  { id: 's1', name: 'training-pipeline', runtime: '4h 23m', status: 'active', cpu: 45, memory: 2.8, gpu: 'A100-80GB', image: 'nvidia/cuda:12.4-devel' },
  { id: 's2', name: 'data-processing', runtime: '1h 15m', status: 'active', cpu: 28, memory: 1.5, gpu: 'None', image: 'python:3.12-slim' },
  { id: 's3', name: 'model-evaluation', runtime: '0m', status: 'stopped', cpu: 0, memory: 0, gpu: 'None', image: 'pytorch/pytorch:latest' },
]

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
        <StatCard title="Active Sessions" value="2" icon={<Terminal className="h-5 w-5" />} />
        <StatCard title="Total Sessions" value="47" icon={<Terminal className="h-5 w-5" />} trend={{ value: 15, positive: true }} />
        <StatCard title="Compute Used" value="2,340 hrs" icon={<Cpu className="h-5 w-5" />} />
        <StatCard title="Storage Used" value="1.2 TB" icon={<HardDrive className="h-5 w-5" />} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="environments">Environments</TabsTrigger>
          <TabsTrigger value="saved">Saved Images</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          {sessions.filter(s => s.status === 'active').length === 0 ? (
            <EmptyState
              icon={<Terminal className="h-8 w-8" />}
              title="No active sessions"
              description="Start a sandbox session to begin working in an isolated environment"
              action={<Button><Play className="h-4 w-4" /> Start Session</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {sessions.filter(s => s.status === 'active').map(session => (
                <Card key={session.id} className="hover:border-emerald-500/20 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Terminal className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{session.name}</p>
                            <Badge variant="success" size="sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                              Active
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{session.image}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {session.runtime}</span>
                          <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> {session.cpu}%</span>
                          <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> {session.memory}GB</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon-sm"><Copy className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon-sm"><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon-sm" className="text-red-400 hover:text-red-300"><Square className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-4">
                      <Progress value={session.cpu} className="h-1 flex-1" />
                      <Progress value={(session.memory / 8) * 100} className="h-1 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="environments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {environments.map(env => (
              <Card key={env.name} className="hover:border-primary-500/20 transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white">{env.name}</p>
                        <Badge variant="primary" size="sm">{env.tag}</Badge>
                      </div>
                      <p className="text-xs text-slate-400">{env.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors mt-1 shrink-0" />
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
