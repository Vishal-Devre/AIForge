import type { Agent, GPUInstance, Deployment, K8sPod, Activity, Notification } from '@/types'

export const agents: Agent[] = []
export const gpuInstances: GPUInstance[] = []
export const deployments: Deployment[] = []
export const k8sPods: K8sPod[] = []
export const activities: Activity[] = []
export const notifications: Notification[] = []

export interface SidebarNavItem {
  label: string
  icon: string
  path: string
  section: 'Workspace' | 'Administration'
  requireSuperuser?: boolean
  requireCustomerOnly?: boolean
  dividerAfter?: boolean
}

export const sidebarItems: SidebarNavItem[] = [
  // Section 1: Core Navigation (Both Admin & Customer)
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/', section: 'Workspace' },
  { label: 'Agents', icon: 'Bot', path: '/agents', section: 'Workspace' },
  { label: 'Deployments', icon: 'Rocket', path: '/my-deployments', section: 'Workspace' },
  { label: 'AI Sandbox', icon: 'Terminal', path: '/sandbox', section: 'Workspace' },

  // Section 2: Admin & Superuser Tools (Only for vishaldevre898@gmail.com / Superuser)
  { label: 'Users', icon: 'Users', path: '/users', section: 'Administration', requireSuperuser: true },
  { label: 'Monitoring', icon: 'Activity', path: '/monitoring', section: 'Administration', requireSuperuser: true },
  { label: 'GPU Platform', icon: 'Cpu', path: '/gpu', section: 'Administration', requireSuperuser: true },
  { label: 'Analytics', icon: 'BarChart3', path: '/analytics', section: 'Administration', requireSuperuser: true },
  { label: 'Billing Management', icon: 'CreditCard', path: '/billing-management', section: 'Administration', requireSuperuser: true },
  { label: 'Platform Settings', icon: 'Sliders', path: '/settings', section: 'Administration', requireSuperuser: true },

  // Customer Only Billing (Regular User)
  { label: 'Billing', icon: 'CreditCard', path: '/billing', section: 'Workspace', requireCustomerOnly: true },
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
