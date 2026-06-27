import type { Agent, GPUInstance, Deployment, K8sPod, Activity, Notification } from '@/types'

export const agents: Agent[] = [
  { id: 'ag_1', name: 'CodeGenius', model: 'gpt-4o', status: 'running', description: 'Generates production-ready code with full test coverage', deployments: 12, uptime: 86400000 * 7, lastActive: new Date(), gpuUsage: 45, memoryUsage: 2.4, createdAt: new Date('2025-10-01') },
  { id: 'ag_2', name: 'DataSage', model: 'claude-3-opus', status: 'running', description: 'Advanced data analysis and visualization agent', deployments: 8, uptime: 86400000 * 14, lastActive: new Date(), gpuUsage: 78, memoryUsage: 4.1, createdAt: new Date('2025-09-15') },
  { id: 'ag_3', name: 'DevOpsBot', model: 'gpt-4o-mini', status: 'stopped', description: 'Automates CI/CD pipelines and infrastructure management', deployments: 5, uptime: 86400000 * 3, lastActive: new Date(Date.now() - 3600000), gpuUsage: 0, memoryUsage: 0.8, createdAt: new Date('2025-11-01') },
  { id: 'ag_4', name: 'SecuriGuard', model: 'claude-3-haiku', status: 'error', description: 'Real-time security vulnerability scanning and monitoring', deployments: 3, uptime: 86400000, lastActive: new Date(Date.now() - 7200000), gpuUsage: 0, memoryUsage: 1.2, createdAt: new Date('2025-12-01') },
  { id: 'ag_5', name: 'DocuMind', model: 'gpt-4o', status: 'deploying', description: 'Intelligent documentation generator and maintainer', deployments: 2, uptime: 0, lastActive: new Date(Date.now() - 600000), gpuUsage: 0, memoryUsage: 0, createdAt: new Date('2026-01-15') },
]

export const gpuInstances: GPUInstance[] = [
  { id: 'gpu_1', name: 'A100-Node-1', gpuType: 'NVIDIA A100 80GB', vram: 80, vramUsed: 62, status: 'active', temperature: 72, utilization: 68, memoryUtilization: 78, powerDraw: 350, processes: 4, uptime: 86400000 * 12, costPerHour: 3.50 },
  { id: 'gpu_2', name: 'A100-Node-2', gpuType: 'NVIDIA A100 80GB', vram: 80, vramUsed: 45, status: 'active', temperature: 65, utilization: 52, memoryUtilization: 56, powerDraw: 280, processes: 3, uptime: 86400000 * 7, costPerHour: 3.50 },
  { id: 'gpu_3', name: 'H100-Node-1', gpuType: 'NVIDIA H100 80GB', vram: 80, vramUsed: 71, status: 'active', temperature: 78, utilization: 85, memoryUtilization: 89, powerDraw: 420, processes: 6, uptime: 86400000 * 3, costPerHour: 5.00 },
  { id: 'gpu_4', name: 'A100-Node-3', gpuType: 'NVIDIA A100 80GB', vram: 80, vramUsed: 12, status: 'idle', temperature: 42, utilization: 8, memoryUtilization: 15, powerDraw: 120, processes: 1, uptime: 86400000 * 30, costPerHour: 3.50 },
  { id: 'gpu_5', name: 'L40S-Node-1', gpuType: 'NVIDIA L40S 48GB', vram: 48, vramUsed: 38, status: 'active', temperature: 68, utilization: 72, memoryUtilization: 79, powerDraw: 250, processes: 3, uptime: 86400000 * 5, costPerHour: 2.75 },
]

export const deployments: Deployment[] = [
  { id: 'dep_1', name: 'ai-forge-web', type: 'app', status: 'deployed', url: 'https://app.aiforge.dev', region: 'us-east-1', branch: 'main', commits: 142, deployedAt: new Date(Date.now() - 1800000), cpu: 0.5, memory: 0.8 },
  { id: 'dep_2', name: 'codegenius-api', type: 'agent', status: 'deployed', url: 'https://api.aiforge.dev/codegenius', region: 'us-east-1', branch: 'main', commits: 89, deployedAt: new Date(Date.now() - 3600000), cpu: 2.5, memory: 4.2 },
  { id: 'dep_3', name: 'gpu-inference-v2', type: 'gpu', status: 'deploying', region: 'us-west-2', branch: 'feature/gpu-optimization', commits: 34, deployedAt: new Date(Date.now() - 600000), cpu: 0, memory: 0 },
  { id: 'dep_4', name: 'sandbox-runtime', type: 'sandbox', status: 'deployed', url: 'https://sandbox.aiforge.dev', region: 'eu-central-1', branch: 'main', commits: 56, deployedAt: new Date(Date.now() - 7200000), cpu: 1.2, memory: 2.1 },
  { id: 'dep_5', name: 'analytics-dashboard', type: 'app', status: 'failed', region: 'us-east-1', branch: 'feature/analytics', commits: 23, deployedAt: new Date(Date.now() - 300000), cpu: 0, memory: 0 },
  { id: 'dep_6', name: 'monitoring-stack', type: 'app', status: 'deployed', url: 'https://monitor.aiforge.dev', region: 'eu-central-1', branch: 'main', commits: 201, deployedAt: new Date(Date.now() - 10800000), cpu: 0.8, memory: 1.5 },
]

export const k8sPods: K8sPod[] = [
  { id: 'pod_1', name: 'aiforge-api-7d8f9c', namespace: 'production', status: 'running', cpu: '250m', memory: '512Mi', restarts: 0, age: '14d', node: 'ip-10-0-1-12' },
  { id: 'pod_2', name: 'aiforge-web-3b4e2a', namespace: 'production', status: 'running', cpu: '150m', memory: '256Mi', restarts: 1, age: '7d', node: 'ip-10-0-1-14' },
  { id: 'pod_3', name: 'codegenius-9f1d8e', namespace: 'agents', status: 'running', cpu: '2', memory: '4Gi', restarts: 2, age: '3d', node: 'ip-10-0-1-08' },
  { id: 'pod_4', name: 'gpu-inference-5a7b3c', namespace: 'gpu', status: 'running', cpu: '4', memory: '32Gi', restarts: 0, age: '5d', node: 'ip-10-0-1-22' },
  { id: 'pod_5', name: 'sandbox-runtime-2d4f6e', namespace: 'sandbox', status: 'running', cpu: '500m', memory: '1Gi', restarts: 3, age: '1d', node: 'ip-10-0-1-18' },
  { id: 'pod_6', name: 'redis-cache-8e1f7a', namespace: 'production', status: 'running', cpu: '100m', memory: '128Mi', restarts: 0, age: '30d', node: 'ip-10-0-1-10' },
  { id: 'pod_7', name: 'postgres-main-4c9d2b', namespace: 'production', status: 'pending', cpu: '500m', memory: '2Gi', restarts: 0, age: '0d', node: 'ip-10-0-1-15' },
]

export const activities: Activity[] = [
  { id: 'act_1', type: 'deployment', message: 'Deployed ai-forge-web to production (us-east-1)', timestamp: new Date(Date.now() - 600000), user: 'Alex Rivera', status: 'success' },
  { id: 'act_2', type: 'agent', message: 'CodeGenius agent auto-scaled to 4 replicas', timestamp: new Date(Date.now() - 1200000), user: 'System', status: 'info' },
  { id: 'act_3', type: 'gpu', message: 'H100-Node-1 GPU utilization exceeded 85% threshold', timestamp: new Date(Date.now() - 2400000), user: 'System', status: 'warning' },
  { id: 'act_4', type: 'deployment', message: 'analytics-dashboard build failed on branch feature/analytics', timestamp: new Date(Date.now() - 3600000), user: 'CI/CD', status: 'error' },
  { id: 'act_5', type: 'sandbox', message: 'Sandbox session timed out after 4 hours (user: sarah@dev.co)', timestamp: new Date(Date.now() - 4800000), user: 'System', status: 'info' },
  { id: 'act_6', type: 'config', message: 'Updated GPU allocation policy for production namespace', timestamp: new Date(Date.now() - 7200000), user: 'Alex Rivera', status: 'success' },
  { id: 'act_7', type: 'alert', message: 'Memory usage on A100-Node-2 above 75% for 15 minutes', timestamp: new Date(Date.now() - 9600000), user: 'Monitor', status: 'warning' },
  { id: 'act_8', type: 'agent', message: 'DataSage agent completed ML training pipeline (accuracy: 94.2%)', timestamp: new Date(Date.now() - 14400000), user: 'System', status: 'success' },
]

export const notifications: Notification[] = [
  { id: 'not_1', title: 'Deployment Successful', message: 'ai-forge-web v2.4.1 deployed to production', type: 'success', read: false, timestamp: new Date(Date.now() - 600000) },
  { id: 'not_2', title: 'High GPU Utilization', message: 'H100-Node-1 at 85% - consider scaling', type: 'warning', read: false, timestamp: new Date(Date.now() - 2400000) },
  { id: 'not_3', title: 'Build Failed', message: 'analytics-dashboard: test suite failed', type: 'error', read: false, timestamp: new Date(Date.now() - 3600000) },
  { id: 'not_4', title: 'New Agent Available', message: 'Llama 4 model is now available for deployment', type: 'info', read: true, timestamp: new Date(Date.now() - 86400000) },
  { id: 'not_5', title: 'Credits Running Low', message: 'You have 8% of your monthly GPU credits remaining', type: 'warning', read: true, timestamp: new Date(Date.now() - 172800000) },
]

export const sidebarItems: { label: string; icon: string; path: string; badge?: string }[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { label: 'Agent Factory', icon: 'Bot', path: '/agents' },
  { label: 'GPU Platform', icon: 'Cpu', path: '/gpu' },
  { label: 'AI Sandbox', icon: 'Terminal', path: '/sandbox' },
  { label: 'Deployment Engine', icon: 'Rocket', path: '/deployments' },
  { label: 'Monitoring', icon: 'Activity', path: '/monitoring' },
  { label: 'Settings', icon: 'Settings', path: '/settings' },
  { label: 'Profile', icon: 'User', path: '/profile' },
]

export const dashboardStats = {
  totalDeployments: 47,
  activeAgents: 3,
  gpuNodes: 5,
  activePods: 24,
  cpuUsage: 62,
  memoryUsage: 71,
  requestsPerMin: 2840,
  errorRate: 0.8,
  avgLatency: 42,
  uptimePercent: 99.97,
}
