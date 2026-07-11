import { useState } from 'react'
import { Bot, Save, ArrowRight, Cpu, Network } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'

export function CreateAgentPage() {
  const [agentName, setAgentName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="space-y-8">
      <PageHeader
        title="Create Agent"
        description="Configure and deploy a new AI agent"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>
              <Save className="h-4 w-4 mr-2" /> Save & Deploy
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
              <CardDescription>Basic information about your agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">Agent Name</label>
                <Input
                  placeholder="e.g. Customer Support Bot"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">Description</label>
                <Input
                  placeholder="What does this agent do?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Selection</CardTitle>
              <CardDescription>Choose the underlying foundation model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['GPT-4o', 'Claude 3.5 Sonnet', 'Llama 3 (8B)', 'Mistral Large'].map(model => (
                  <div key={model} className="p-4 rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] cursor-pointer transition-colors flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center shrink-0">
                      <Cpu className="h-4 w-4 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{model}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">Provider: OpenAI/Anthropic/Meta</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
              <CardDescription>Review your settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)]">
                <div className="h-8 w-8 rounded-lg bg-[var(--accent-light)] border border-[var(--border-accent)] flex items-center justify-center">
                  <Bot className="h-4 w-4 text-[var(--accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{agentName || 'Unnamed Agent'}</p>
                  <p className="text-xs text-[var(--text-tertiary)] truncate">{description || 'No description provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">Model</span>
                <span className="text-[var(--text-primary)] font-medium">Not selected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">Environment</span>
                <span className="text-[var(--text-primary)] font-medium">Production</span>
              </div>
              
              <Button className="w-full mt-4">
                Deploy Agent <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
