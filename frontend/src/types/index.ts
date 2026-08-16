// ---- Backend-matching Agent types ----

export type Provider = 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'GROQ' | 'OLLAMA'
export type AgentStatus = 'DRAFT' | 'READY' | 'DEPLOYED' | 'ARCHIVED'
export type Visibility = 'PRIVATE' | 'PUBLIC'

export interface Agent {
  id: string
  owner_id: string
  name: string
  description: string | null
  provider: Provider
  model: string
  system_prompt: string | null
  temperature: number
  max_tokens: number | null
  visibility: Visibility
  status: AgentStatus
  created_at: string
  updated_at: string
}

export interface AgentCreatePayload {
  name: string
  description?: string | null
  provider?: Provider
  model: string
  system_prompt?: string | null
  temperature?: number
  max_tokens?: number | null
  visibility?: Visibility
}

export interface AgentUpdatePayload {
  name?: string
  description?: string | null
  provider?: Provider
  model?: string
  system_prompt?: string | null
  temperature?: number
  max_tokens?: number | null
  visibility?: Visibility
  status?: AgentStatus
}

export interface AgentListResponse {
  items: Agent[]
  total: number
}

export interface GPUInstance {
  id: string
  name: string
  gpuType: string
  vram: number
  vramUsed: number
  status: 'active' | 'idle' | 'error' | 'provisioning'
  temperature: number
  utilization: number
  memoryUtilization: number
  powerDraw: number
  processes: number
  uptime: number
  costPerHour: number
}

export interface Deployment {
  id: string
  name: string
  type: 'agent' | 'gpu' | 'app' | 'sandbox'
  status: 'deployed' | 'deploying' | 'failed' | 'stopped'
  url?: string
  region: string
  branch: string
  commits: number
  deployedAt: Date
  cpu: number
  memory: number
}

export interface K8sPod {
  id: string
  name: string
  namespace: string
  status: 'running' | 'pending' | 'failed' | 'succeeded'
  cpu: string
  memory: string
  restarts: number
  age: string
  node: string
}

export interface MonitorMetric {
  timestamp: Date
  cpu: number
  memory: number
  requests: number
  latency: number
  errors: number
}

export interface Activity {
  id: string
  type: 'deployment' | 'agent' | 'gpu' | 'sandbox' | 'alert' | 'config'
  message: string
  timestamp: Date
  user: string
  status?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: Date
}

export interface SidebarItem {
  label: string
  icon: string
  path: string
  badge?: number
  children?: { label: string; path: string }[]
}

export type ThemeMode = 'dark' | 'light'

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'TEAM_MEMBER' | 'ORGANIZATION_OWNER'

export interface UserProfile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  role: UserRole
  is_superuser: boolean
  provider: string
  is_active: boolean
  created_at: string
  updated_at: string
}
