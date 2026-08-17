import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Bot, ArrowLeft, Save, Cpu, FileText, Globe, Lock,
  AlertCircle, Layers,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Separator } from '@/lib/ui/separator'
import { Switch } from '@/lib/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui/select'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { agentsApi } from '@/lib/api'
import { useToast } from '@/lib/ui/toast'
import type { Agent, AgentStatus, AgentUpdatePayload, Provider, Visibility } from '@/types'

// ─── Constants (mirrors CreateAgentPage) ──────────────────────────────────

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

const providers: Provider[] = ['OPENAI', 'ANTHROPIC', 'GOOGLE', 'GROQ', 'OLLAMA']

const statusColors: Record<AgentStatus, string> = {
  DRAFT: 'text-[var(--text-tertiary)]',
  READY: 'text-[var(--info)]',
  DEPLOYED: 'text-[var(--success)]',
  ARCHIVED: 'text-[var(--error)]',
}

// ─── Page ─────────────────────────────────────────────────────────────────

export function EditAgentPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()

  // Agent record as loaded from the server (the comparison baseline)
  const [agent, setAgent] = useState<Agent | null>(null)

  // Loading / error states for the initial fetch
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Editable form state (only the user-editable fields)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formProvider, setFormProvider] = useState<Provider>('OPENAI')
  const [formModel, setFormModel] = useState('')
  const [formSystemPrompt, setFormSystemPrompt] = useState('')
  const [formTemperature, setFormTemperature] = useState(0.7)
  const [formMaxTokens, setFormMaxTokens] = useState<number>(4096)
  const [formVisibility, setFormVisibility] = useState<Visibility>('PRIVATE')

  // Save state + UI error
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch the agent on mount and pre-populate the form
  useEffect(() => {
    if (!agentId) return
    setLoading(true)
    setLoadError(null)
    agentsApi.getById(agentId)
      .then(data => {
        setAgent(data)
        setFormName(data.name)
        setFormDescription(data.description || '')
        setFormProvider(data.provider)
        setFormModel(data.model)
        setFormSystemPrompt(data.system_prompt || '')
        setFormTemperature(data.temperature)
        setFormMaxTokens(data.max_tokens ?? 4096)
        setFormVisibility(data.visibility)
      })
      .catch(err => {
        setLoadError(err instanceof Error ? err.message : 'Failed to load agent')
      })
      .finally(() => setLoading(false))
  }, [agentId])

  const handleProviderChange = (p: Provider) => {
    setFormProvider(p)
    setFormModel(providerModels[p][0])
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  const validateForm = (): string | null => {
    const trimmedName = formName.trim()
    if (!trimmedName) return 'Name is required.'
    if (trimmedName.length > 255) return 'Name must be 255 characters or fewer.'
    if (!formModel.trim()) return 'Model is required.'
    if (formModel.trim().length > 255) return 'Model must be 255 characters or fewer.'
    if (formDescription.length > 5000) return 'Description must be 5000 characters or fewer.'
    if (formSystemPrompt.length > 100000) return 'System prompt must be 100,000 characters or fewer.'
    if (isNaN(formTemperature) || formTemperature < 0.0 || formTemperature > 2.0) {
      return 'Temperature must be between 0.0 and 2.0.'
    }
    if (formMaxTokens !== null && (isNaN(formMaxTokens) || formMaxTokens < 1 || formMaxTokens > 1048576)) {
      return 'Max tokens must be an integer between 1 and 1,048,576.'
    }
    return null
  }

  // ─── Save ────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!agent) return

    // 1) Client-side validation — keep the form open and surface the error
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      addToast({ type: 'error', title: 'Validation failed', message: validationError })
      return
    }

    setSaving(true)
    setError(null)

    // 2) Build a partial payload containing ONLY changed editable fields
    //    Server-managed fields (id, owner_id, status, timestamps) are never
    //    included, so they can never be modified via this path.
    const payload: AgentUpdatePayload = {}
    if (formName.trim() !== agent.name) payload.name = formName.trim()
    const nextDescription = formDescription.trim() || null
    if (nextDescription !== agent.description) payload.description = nextDescription
    if (formProvider !== agent.provider) payload.provider = formProvider
    if (formModel.trim() !== agent.model) payload.model = formModel.trim()
    const nextSystemPrompt = formSystemPrompt.trim() || null
    if (nextSystemPrompt !== agent.system_prompt) payload.system_prompt = nextSystemPrompt
    if (formTemperature !== agent.temperature) payload.temperature = formTemperature
    const nextMaxTokens = formMaxTokens || null
    if (nextMaxTokens !== agent.max_tokens) payload.max_tokens = nextMaxTokens
    if (formVisibility !== agent.visibility) payload.visibility = formVisibility

    // 3) If nothing changed, don't round-trip to the server
    if (Object.keys(payload).length === 0) {
      setSaving(false)
      addToast({ type: 'info', title: 'No changes', message: 'Nothing was modified.' })
      navigate(`/agents/${agent.id}`)
      return
    }

    try {
      // 4) PATCH /api/v1/agents/{agent_id} via the existing API client
      const updated = await agentsApi.update(agent.id, payload)
      setAgent(updated)

      // 5) On success: toast + navigate back to read-only details page,
      //    which will freshly fetch and display the persisted values.
      addToast({ type: 'success', title: 'Agent updated', message: `${updated.name} was saved successfully.` })
      navigate(`/agents/${updated.id}`)
    } catch (err) {
      // 6) On failure: keep the form open with a clear, useful error.
      //    Handle 401 / 403 / 404 / 422 / network — the existing API client
      //    normalizes them all to a thrown Error with a useful message.
      const message = err instanceof Error ? err.message : 'Failed to update agent.'
      setError(message)
      addToast({ type: 'error', title: 'Update failed', message })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Discard unsaved changes — make NO PATCH request — return to the previous page
    if (agent) {
      navigate(`/agents/${agent.id}`)
    } else {
      navigate('/agents')
    }
  }

  // ─── Loading state ───────────────────────────────────────────────────────

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

  // ─── Error state (agent not found / not owned by current user) ───────────

  if (loadError || !agent) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-[var(--error-border)] bg-[var(--error-light)]">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertCircle className="h-6 w-6 text-[var(--error)] shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--error)]">Agent not found</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {loadError || 'The agent you are looking for does not exist or you do not have permission to edit it.'}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/agents')} className="ml-auto">
              Back to Agents
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── Edit form ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={handleCancel}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Agent
      </button>

      <PageHeader
        title="Edit Agent"
        description={`Update configuration for "${agent.name}"`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>Saving...</>
              ) : (
                <><Save className="h-4 w-4 mr-1.5" /> Save Changes</>
              )}
            </Button>
          </div>
        }
      />

      {/* Error banner (PATCH / validation failures) */}
      {error && (
        <Card className="border-[var(--error-border)] bg-[var(--error-light)]">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-[var(--error)] shrink-0" />
            <p className="text-sm text-[var(--error)] break-words">{error}</p>
          </CardContent>
        </Card>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main column — editable config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--accent)]" />
                Basic Information
              </CardTitle>
              <CardDescription>Name and describe your agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Agent Name <span className="text-[var(--error)]">*</span>
                </label>
                <Input
                  placeholder="e.g. Customer Support Bot"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Description</label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all resize-y"
                  placeholder="What does this agent do? (optional)"
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">System Prompt</label>
                <textarea
                  className="w-full min-h-[180px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all resize-y leading-relaxed"
                  placeholder="You are a helpful assistant that..."
                  value={formSystemPrompt}
                  onChange={e => setFormSystemPrompt(e.target.value)}
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {formSystemPrompt.length.toLocaleString()} characters
                  </span>
                  {formSystemPrompt.length > 100000 && (
                    <span className="text-[10px] text-[var(--error)]">Exceeds recommended 100K limit</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[var(--accent)]" />
                Model Configuration
              </CardTitle>
              <CardDescription>Choose the AI foundation model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {providers.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleProviderChange(p)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left ${
                        formProvider === p
                          ? 'border-[var(--border-accent)] bg-[var(--accent-light)] text-[var(--accent)]'
                          : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {providerLabel[p]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Model <span className="text-[var(--error)]">*</span>
                </label>
                <Select value={formModel} onValueChange={setFormModel}>
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

              <Separator />

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
            </CardContent>
          </Card>
        </div>

        {/* Side column — visibility & status (read-only) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-[var(--accent)]" />
                Status & Visibility
              </CardTitle>
              <CardDescription>Control who can see this agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status is read-only — never editable via this endpoint */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Status</label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-muted)]">
                  <StatusIndicator status={
                    agent.status === 'DEPLOYED' ? 'deployed' :
                    agent.status === 'READY' ? 'pending' :
                    agent.status === 'ARCHIVED' ? 'stopped' : 'idle'
                  } />
                  <span className={`text-sm font-medium capitalize ${statusColors[agent.status]}`}>
                    {agent.status.toLowerCase()}
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] ml-auto">Read-only</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {formVisibility === 'PUBLIC' ? (
                    <><Globe className="h-4 w-4 text-[var(--info)]" /><span className="text-sm">Public</span></>
                  ) : (
                    <><Lock className="h-4 w-4 text-[var(--text-tertiary)]" /><span className="text-sm">Private</span></>
                  )}
                </div>
                <Switch
                  checked={formVisibility === 'PUBLIC'}
                  onCheckedChange={c => setFormVisibility(c ? 'PUBLIC' : 'PRIVATE')}
                />
              </div>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                {formVisibility === 'PUBLIC'
                  ? 'Anyone can discover and use this agent.'
                  : 'Only you can see and use this agent.'}
              </p>
            </CardContent>
          </Card>

          {/* Identity (read-only) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-[var(--accent)]" />
                Identity
              </CardTitle>
              <CardDescription>Fields that can't be edited</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-xs text-[var(--text-tertiary)]">Agent ID</span>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono break-all">{agent.id}</p>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-[var(--text-tertiary)]">Owner ID</span>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono break-all">{agent.owner_id}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Created</span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {new Date(agent.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)]">Updated</span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {new Date(agent.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Sticky action buttons on small screens — sticky on small */}
          <Card className="lg:sticky lg:bottom-4">
            <CardContent className="p-4 space-y-2">
              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>Saving...</>
                ) : (
                  <><Save className="h-4 w-4 mr-1.5" /> Save Changes</>
                )}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
