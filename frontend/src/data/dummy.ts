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
  requireSuperuser?: boolean
  requireCustomerOnly?: boolean
  dividerAfter?: boolean
}

export const sidebarItems: SidebarNavItem[] = [
  // Section 1: Core Navigation (Both Admin & Customer)
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { label: 'Agents', icon: 'Bot', path: '/agents' },
  { label: 'Deployments', icon: 'Rocket', path: '/my-deployments' },
  { label: 'AI Sandbox', icon: 'Terminal', path: '/sandbox', dividerAfter: true },

  // Section 2: Admin & Superuser Tools (Only for vishaldevre898@gmail.com / Superuser)
  { label: 'Users', icon: 'Users', path: '/users', requireSuperuser: true },
  { label: 'Monitoring', icon: 'Activity', path: '/monitoring', requireSuperuser: true },
  { label: 'GPU Platform', icon: 'Cpu', path: '/gpu', requireSuperuser: true },
  { label: 'Analytics', icon: 'BarChart3', path: '/analytics', requireSuperuser: true },
  { label: 'Billing Management', icon: 'CreditCard', path: '/billing-management', requireSuperuser: true },
  { label: 'Platform Settings', icon: 'Sliders', path: '/settings', requireSuperuser: true, dividerAfter: true },

  // Customer Only Billing (Regular User)
  { label: 'Billing', icon: 'CreditCard', path: '/billing', requireCustomerOnly: true },

  // Section 3: Profile & Settings (Both Admin & Customer)
  { label: 'Profile', icon: 'User', path: '/profile' },
  { label: 'Account Settings', icon: 'Settings', path: '/account' },
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
