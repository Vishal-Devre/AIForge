import type { Agent, GPUInstance, Deployment, K8sPod, Activity, Notification } from '@/types'

export const agents: Agent[] = []

export const gpuInstances: GPUInstance[] = []

export const deployments: Deployment[] = []

export const k8sPods: K8sPod[] = []

export const activities: Activity[] = []

export const notifications: Notification[] = []

export const sidebarItems: { label: string; icon: string; path: string; requireSuperuser?: boolean; requireCustomer?: boolean }[] = [
  // Shared / Admin + Customer
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  
  // Admin Only
  { label: 'Agent Factory', icon: 'Bot', path: '/agents', requireSuperuser: true },
  { label: 'GPU Platform', icon: 'Cpu', path: '/gpu', requireSuperuser: true },
  { label: 'AI Sandbox', icon: 'Terminal', path: '/sandbox', requireSuperuser: true },
  { label: 'Deployment Engine', icon: 'Rocket', path: '/deployments', requireSuperuser: true },
  { label: 'Monitoring', icon: 'Activity', path: '/monitoring', requireSuperuser: true },

  // Customer specific items (accessible by Admin too unless explicitly restricted)
  { label: 'My Agents', icon: 'Bot', path: '/my-agents', requireCustomer: true },
  { label: 'Create Agent', icon: 'Terminal', path: '/create-agent', requireCustomer: true },
  { label: 'Agent Templates', icon: 'LayoutDashboard', path: '/templates', requireCustomer: true },
  { label: 'My Deployments', icon: 'Rocket', path: '/my-deployments', requireCustomer: true },
  { label: 'Billing', icon: 'Activity', path: '/billing', requireCustomer: true },
  { label: 'Profile', icon: 'User', path: '/profile', requireCustomer: true },
  { label: 'Account Settings', icon: 'Settings', path: '/account', requireCustomer: true },
]

export const dashboardStats = {
  totalDeployments: 0,
  activeAgents: 0,
  gpuNodes: 0,
  activePods: 0,
  cpuUsage: 0,
  memoryUsage: 0,
  requestsPerMin: 0,
  errorRate: 0,
  avgLatency: 0,
  uptimePercent: 0,
}
