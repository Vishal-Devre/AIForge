export interface Agent {
  id: string
  name: string
  model: string
  status: 'running' | 'stopped' | 'error' | 'deploying'
  description: string
  deployments: number
  uptime: number
  lastActive: Date
  gpuUsage: number
  memoryUsage: number
  createdAt: Date
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

export interface UserProfile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  role: string
  provider: string
  is_active: boolean
  created_at: string
  updated_at: string
}
