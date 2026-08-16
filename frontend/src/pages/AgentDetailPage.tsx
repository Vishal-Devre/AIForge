import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Bot, ArrowLeft, Globe, Lock, Clock, Edit3, Trash2, Save, X,
  Cpu, Layers, FileText, AlertCircle, CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Badge } from '@/lib/ui/badge'
import { Input } from '@/lib/ui/input'
import { Separator } from '@/lib/ui/separator'
import { Switch } from '@/lib/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/lib/ui/dialog'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/lib/ui/tooltip'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { agentsApi } from '@/lib/api'
import type { Agent, AgentStatus, Provider, Visibility } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────

const providerLabel: Record<Provider, string> = {
  OPENAI: 'OpenAI',
  ANTHROPIC: 'Anthropic',
  GOOGLE: 'Google',
  GROQ: 'Groq',
  OLLAMA: 'Ollama',
}

const providerModels: Record<Provider, string[]> = {
  OPENAI: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  ANTHROPIC: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  GOOGLE: ['gemini-pro', 'gemini-ultra'],
  GROQ: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768'],
  OLLAMA: ['llama3.2:3b', 'llama3.2:1b', 'mistral:7b'],
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
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Edit form state
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formProvider, setFormProvider] = useState<Provider>('OPENAI')
  const [formModel, setFormModel] = useState('')
  const [formSystemPrompt, setFormSystemPrompt] = useState('')
  const [formTemperature, setFormTemperature] = useState(0.7)
  const [formMaxTokens, setFormMaxTokens] = useState(4096)
  const [formVisibility, setFormVisibility] = useState<Visibility>('PRIVATE')
  const [formStatus, setFormStatus] = useState<AgentStatus>('DRAFT')

  useEffect(() => {
    if (!agentId) return
    setLoading(true)
    agentsApi.getById(agentId)
      .then(data => {
        setAgent(data)
        // Populate form
        setFormName(data.name)
        setFormDescription(data.description || '')
        setFormProvider(data.provider)
        setFormModel(data.model)
        setFormSystemPrompt(data.system_prompt || '')
        setFormTemperature(data.temperature)
        setFormMaxTokens(data.max_tokens || 4096)
        setFormVisibility(data.visibility)
        setFormStatus(data.status)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load agent'))
      .finally(() => setLoading(false))
  }, [agentId])

  const handleSave = async () => {
    if (!agent) return
    setSaving(true)
    try {
      const updated = await agentsApi.update(agent.id, {
        name: formName,
        description: formDescription || null,
        provider: formProvider,
        model: formModel,
        system_prompt: formSystemPrompt || null,
        temperature: formTemperature,
        max_tokens: formMaxTokens || null,
        visibility: formVisibility,
        status: formStatus,
      })
      setAgent(updated)
      setEditing(false)
    } catch (err) {
      console.error('Failed to update agent:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!agent) return
    try {
      await agentsApi.delete(agent.id)
      navigate('/agents')
    } catch (err) {
      console.error('Failed to delete agent:', err)
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
          {!editing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Edit3 className="h-4 w-4 mr-1.5" /> Edit
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
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => {
                // Reset form to current agent values
                setFormName(agent.name)
                setFormDescription(agent.description || '')
                setFormProvider(agent.provider)
                setFormModel(agent.model)
                setFormSystemPrompt(agent.system_prompt || '')
                setFormTemperature(agent.temperature)
                setFormMaxTokens(agent.max_tokens || 4096)
                setFormVisibility(agent.visibility)
                setFormStatus(agent.status)
                setEditing(false)
              }}>
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>Saving...</>
                ) : (
                  <><Save className="h-4 w-4 mr-1.5" /> Save</>
                )}
              </Button>
            </>
          )}
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
              {editing ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-secondary)]">Name</label>
                    <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Agent name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-secondary)]">Description</label>
                    <textarea
                      className="w-full min-h-[80px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all resize-y"
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      placeholder="What does this agent do?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-secondary)]">System Prompt</label>
                    <textarea
                      className="w-full min-h-[150px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all resize-y"
                      value={formSystemPrompt}
                      onChange={e => setFormSystemPrompt(e.target.value)}
                      placeholder="You are a helpful assistant..."
                    />
                  </div>
                </>
              ) : (
                <>
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
                </>
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
              {editing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[var(--text-secondary)]">Provider</label>
                      <Select value={formProvider} onValueChange={v => { setFormProvider(v as Provider); setFormModel(providerModels[v as Provider]?.[0] || '') }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(providerModels) as Provider[]).map(p => (
                            <SelectItem key={p} value={p}>{providerLabel[p]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[var(--text-secondary)]">Model</label>
                      <Select value={formModel} onValueChange={v => setFormModel(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {providerModels[formProvider].map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[var(--text-secondary)]">
                        Temperature <span className="text-[var(--text-tertiary)]">({formTemperature.toFixed(1)})</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={formTemperature}
                        onChange={e => setFormTemperature(parseFloat(e.target.value))}
                        className="w-full accent-[var(--accent)]"
                      />
                      <div className="flex justify-between text-[10px] text-[var(--text-tertiary)]">
                        <span>Precise (0.0)</span>
                        <span>Creative (2.0)</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[var(--text-secondary)]">Max Tokens</label>
                      <Input
                        type="number"
                        min={1}
                        max={1048576}
                        value={formMaxTokens}
                        onChange={e => setFormMaxTokens(parseInt(e.target.value) || 4096)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
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
              {editing ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-secondary)]">Status</label>
                    <Select value={formStatus} onValueChange={v => setFormStatus(v as AgentStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['DRAFT', 'READY', 'DEPLOYED', 'ARCHIVED'] as AgentStatus[]).map(s => (
                          <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Public visibility</span>
                    <Switch
                      checked={formVisibility === 'PUBLIC'}
                      onCheckedChange={c => setFormVisibility(c ? 'PUBLIC' : 'PRIVATE')}
                    />
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
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
