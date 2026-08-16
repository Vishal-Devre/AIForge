import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bot, Save, ArrowRight, Cpu, FileText, Layers, Globe, Lock,
  Sparkles, ChevronRight, Thermometer, AlertCircle, CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Badge } from '@/lib/ui/badge'
import { Separator } from '@/lib/ui/separator'
import { Switch } from '@/lib/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui/select'
import { PageHeader } from '@/components/layout/PageHeader'
import { agentsApi } from '@/lib/api'
import type { Provider, Visibility } from '@/types'

// ─── Constants ───────────────────────────────────────────────────────────

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

const templateSystemPrompts: { name: string; prompt: string }[] = [
  {
    name: 'Customer Support',
    prompt: 'You are a helpful customer support agent. Answer questions accurately and politely. If you don\'t know the answer, say so and offer to escalate to a human agent.',
  },
  {
    name: 'Code Reviewer',
    prompt: 'You are an expert senior software engineer. Review code for bugs, security vulnerabilities, performance issues, and style. Provide actionable feedback with code examples.',
  },
  {
    name: 'Creative Writer',
    prompt: 'You are a creative writing assistant. Help users craft engaging stories, poems, and narratives. Use vivid imagery and emotional depth. Adapt to the user\'s preferred genre.',
  },
  {
    name: 'Data Analyst',
    prompt: 'You are a data analysis expert. Help users understand their data, suggest visualizations, and derive insights. Explain statistical concepts in plain language.',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────

export function CreateAgentPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [provider, setProvider] = useState<Provider>('OPENAI')
  const [model, setModel] = useState(providerModels.OPENAI[0])
  const [systemPrompt, setSystemPrompt] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)
  const [visibility, setVisibility] = useState<Visibility>('PRIVATE')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update model when provider changes
  const handleProviderChange = (p: Provider) => {
    setProvider(p)
    setModel(providerModels[p][0])
  }

  const handleApplyTemplate = (prompt: string) => {
    setSystemPrompt(prompt)
  }

  const canProceedStep1 = name.trim().length > 0 && model.trim().length > 0

  const handleCreate = async () => {
    if (!canProceedStep1) return
    setSaving(true)
    setError(null)
    try {
      const agent = await agentsApi.create({
        name: name.trim(),
        description: description.trim() || null,
        provider,
        model: model.trim(),
        system_prompt: systemPrompt.trim() || null,
        temperature,
        max_tokens: maxTokens || null,
        visibility,
      })
      navigate(`/agents/${agent.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Create Agent"
        description="Configure and deploy a new AI agent"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/agents')}>Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={!canProceedStep1 || saving}
            >
              {saving ? (
                <>Creating...</>
              ) : (
                <><Save className="h-4 w-4 mr-1.5" /> Create Agent</>
              )}
            </Button>
          </div>
        }
      />

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                step === s
                  ? 'bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-accent)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === s ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-muted)]'
              }`}>
                {s}
              </span>
              {s === 1 ? 'Basic Info' : s === 2 ? 'System Prompt' : 'Review'}
            </button>
            {s < 3 && <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)]" />}
          </div>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <Card className="border-[var(--error-border)] bg-[var(--error-light)]">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-[var(--error)] shrink-0" />
            <p className="text-sm text-[var(--error)]">{error}</p>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--accent)]" />
                Basic Information
              </CardTitle>
              <CardDescription>Give your agent a name and purpose</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Agent Name <span className="text-[var(--error)]">*</span>
                </label>
                <Input
                  placeholder="e.g. Customer Support Bot"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Description</label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all resize-y"
                  placeholder="What does this agent do? (optional)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[var(--accent)]" />
                Model Selection
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
                      onClick={() => handleProviderChange(p)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left ${
                        provider === p
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
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providerModels[provider].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Temperature <span className="text-[var(--text-tertiary)]">({temperature.toFixed(1)})</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
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
                  value={maxTokens}
                  onChange={e => setMaxTokens(parseInt(e.target.value) || 4096)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* System Prompt Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                  System Prompt
                </CardTitle>
                <CardDescription>
                  Define the base personality, instructions, and behavior of your agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-[300px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-4 py-3 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all resize-y leading-relaxed"
                  placeholder="You are a helpful assistant that..."
                  value={systemPrompt}
                  onChange={e => setSystemPrompt(e.target.value)}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {systemPrompt.length.toLocaleString()} characters
                  </span>
                  {systemPrompt.length > 100000 && (
                    <span className="text-[10px] text-[var(--error)]">Exceeds recommended 100K limit</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Templates sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--accent)]" />
                  Quick Templates
                </CardTitle>
                <CardDescription>Start from a pre-written prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {templateSystemPrompts.map(t => (
                  <button
                    key={t.name}
                    onClick={() => handleApplyTemplate(t.prompt)}
                    className="w-full text-left p-3 rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--accent-light)] transition-all cursor-pointer"
                  >
                    <p className="text-xs font-medium text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5 line-clamp-2">{t.prompt}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                  Review Configuration
                </CardTitle>
                <CardDescription>Review your settings before creating the agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)]">Name</span>
                    <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">{name || 'Unnamed'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)]">Model</span>
                    <p className="text-sm font-mono text-[var(--text-primary)] mt-0.5">{model}</p>
                  </div>
                </div>
                {description && (
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)]">Description</span>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>
                  </div>
                )}
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)]">Temperature</span>
                    <p className="text-sm text-[var(--text-primary)] mt-0.5">{temperature.toFixed(1)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)]">Max Tokens</span>
                    <p className="text-sm text-[var(--text-primary)] mt-0.5">{maxTokens.toLocaleString()}</p>
                  </div>
                </div>
                {systemPrompt && (
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)]">System Prompt</span>
                    <pre className="mt-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-muted)] rounded-lg p-3 max-h-32 overflow-y-auto font-mono">
                      {systemPrompt}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {visibility === 'PUBLIC' ? (
                      <><Globe className="h-4 w-4 text-[var(--info)]" /><span className="text-sm">Public</span></>
                    ) : (
                      <><Lock className="h-4 w-4 text-[var(--text-tertiary)]" /><span className="text-sm">Private</span></>
                    )}
                  </div>
                  <Switch
                    checked={visibility === 'PUBLIC'}
                    onCheckedChange={c => setVisibility(c ? 'PUBLIC' : 'PRIVATE')}
                  />
                </div>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-2">
                  {visibility === 'PUBLIC'
                    ? 'Anyone can discover and use this agent'
                    : 'Only you can see and use this agent'}
                </p>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={handleCreate} disabled={!canProceedStep1 || saving}>
              {saving ? 'Creating...' : <><Sparkles className="h-4 w-4 mr-2" /> Create Agent</>}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        {step < 3 ? (
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 ? !canProceedStep1 : false}
          >
            Next <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={!canProceedStep1 || saving}>
            {saving ? 'Creating...' : <><Sparkles className="h-4 w-4 mr-1.5" /> Create Agent</>}
          </Button>
        )}
      </div>
    </div>
  )
}
