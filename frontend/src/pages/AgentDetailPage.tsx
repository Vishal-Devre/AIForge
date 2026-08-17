import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Bot, ArrowLeft, Globe, Lock, Clock, Edit3, Trash2,
  Cpu, Layers, FileText, AlertCircle, CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Separator } from '@/lib/ui/separator'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/lib/ui/dialog'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { agentsApi } from '@/lib/api'
import { useToast } from '@/lib/ui/toast'
import type { Agent, AgentStatus, Provider } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────

const providerLabel: Record<Provider, string> = {
  OPENAI: 'OpenAI',
  ANTHROPIC: 'Anthropic',
  GOOGLE: 'Google',
  GROQ: 'Groq',
  OLLAMA: 'Ollama',
}

const statusColors: Record<AgentStatus, string> = {
  DRAFT: 'text-[var(--text-tertiary)]',
  READY: 'text-[var(--info)]',
  DEPLOYED: 'text-[var(--success)]',
  ARCHIVED: 'text-[var(--error)]',
}

const statusBgColors: Record<AgentStatus, string> = {
  DRAFT: 'bg-[var(--bg-muted)]',
  READY: 'bg-[var(--info-light)]',
  DEPLOYED: 'bg-[var(--success-light)]',
  ARCHIVED: 'bg-[var(--error-light)]',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Detail Page ─────────────────────────────────────────────────────────

export function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (!agentId) return
    setLoading(true)
    agentsApi.getById(agentId)
      .then(data => setAgent(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load agent'))
      .finally(() => setLoading(false))
  }, [agentId])

  const handleDelete = async () => {
    if (!agent) return
    try {
      await agentsApi.delete(agent.id)
      addToast({ type: 'success', title: 'Agent deleted', message: `${agent.name} was removed.` })
      navigate('/agents')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete agent.'
      addToast({ type: 'error', title: 'Delete failed', message })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-8 w-48 rounded bg-[var(--bg-muted)] animate-pulse" />
        <div className="h-4 w-72 rounded bg-[var(--bg-muted)] animate-pulse" />
        <Card className="animate-pulse">
          <CardContent className="p-8 space-y-6">
            <div className="h-6 w-32 rounded bg-[var(--bg-muted)]" />
            <div className="h-4 w-full rounded bg-[var(--bg-muted)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--bg-muted)]" />
            <div className="h-4 w-1/2 rounded bg-[var(--bg-muted)]" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-[var(--error-border)] bg-[var(--error-light)]">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertCircle className="h-6 w-6 text-[var(--error)] shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--error)]">Agent not found</h3>
              <p className="text-sm text-[var(--text-secondary)]">{error || 'The agent you are looking for does not exist or has been removed.'}</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/agents')} className="ml-auto">
              Back to Agents
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/agents')}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Agents
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${statusBgColors[agent.status]}`}>
            <Bot className={`h-7 w-7 ${statusColors[agent.status]}`} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] truncate">{agent.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-[11px]">{agent.model}</Badge>
              <div className="flex items-center gap-1">
                <StatusIndicator status={
                  agent.status === 'DEPLOYED' ? 'deployed' :
                  agent.status === 'READY' ? 'pending' :
                  agent.status === 'ARCHIVED' ? 'stopped' : 'idle'
                } />
                <span className={`text-xs font-medium capitalize ${statusColors[agent.status]}`}>
                  {agent.status.toLowerCase()}
                </span>
              </div>
              {agent.visibility === 'PUBLIC' ? (
                <Badge variant="outline" className="text-[11px] text-[var(--info)] border-[var(--info-border)] bg-[var(--info-light)]">
                  <Globe className="h-3 w-3 mr-0.5" /> Public
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[11px] text-[var(--text-tertiary)]">
                  <Lock className="h-3 w-3 mr-0.5" /> Private
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => navigate(`/agents/${agent.id}/edit`)}>
            <Edit3 className="h-4 w-4 mr-1.5" /> Edit Agent
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1.5" /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Agent</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete <strong>{agent.name}</strong>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column — config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--accent)]" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs text-[var(--text-tertiary)]">Name</span>
                <p className="text-sm text-[var(--text-primary)] font-medium mt-0.5">{agent.name}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--text-tertiary)]">Description</span>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {agent.description || <span className="italic">No description</span>}
                </p>
              </div>
              {agent.system_prompt && (
                <div>
                  <span className="text-xs text-[var(--text-tertiary)]">System Prompt</span>
                  <pre className="mt-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-muted)] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono">
                    {agent.system_prompt}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[var(--accent)]" />
                Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-[var(--text-tertiary)]">Provider</span>
                  <p className="text-sm text-[var(--text-primary)] font-medium mt-0.5">{providerLabel[agent.provider]}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-tertiary)]">Model</span>
                  <p className="text-sm text-[var(--text-primary)] font-medium mt-0.5 font-mono">{agent.model}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-[var(--text-tertiary)]">Temperature</span>
                  <p className="text-sm text-[var(--text-primary)] font-medium mt-0.5">{agent.temperature.toFixed(1)}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-tertiary)]">Max Tokens</span>
                  <p className="text-sm text-[var(--text-primary)] font-medium mt-0.5">{agent.max_tokens?.toLocaleString() || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side column — status & meta */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-[var(--accent)]" />
                Status & Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Status</span>
                <div className="flex items-center gap-1.5">
                  <StatusIndicator status={
                    agent.status === 'DEPLOYED' ? 'deployed' :
                    agent.status === 'READY' ? 'pending' :
                    agent.status === 'ARCHIVED' ? 'stopped' : 'idle'
                  } />
                  <span className={`text-sm font-medium capitalize ${statusColors[agent.status]}`}>
                    {agent.status.toLowerCase()}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Visibility</span>
                <div className="flex items-center gap-1.5">
                  {agent.visibility === 'PUBLIC' ? (
                    <><Globe className="h-3.5 w-3.5 text-[var(--info)]" /><span className="text-sm text-[var(--info)]">Public</span></>
                  ) : (
                    <><Lock className="h-3.5 w-3.5 text-[var(--text-tertiary)]" /><span className="text-sm text-[var(--text-tertiary)]">Private</span></>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--accent)]" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Created</span>
                <span className="text-xs text-[var(--text-secondary)]">{formatDate(agent.created_at)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Updated</span>
                <span className="text-xs text-[var(--text-secondary)]">{formatDate(agent.updated_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/sandbox?agent=${agent.id}`)}
              >
                <Bot className="h-4 w-4 mr-2" /> Test in Sandbox
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={agent.status !== 'READY' && agent.status !== 'DEPLOYED'}
              >
                <Layers className="h-4 w-4 mr-2" /> Deploy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
