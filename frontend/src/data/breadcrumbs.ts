export interface BreadcrumbEntry {
  label: string
  parent?: string
}

export const breadcrumbConfig: Record<string, BreadcrumbEntry> = {
  '/': { label: 'Dashboard' },
  '/agents': { label: 'Agents' },
  '/my-agents': { label: 'My Agents', parent: '/agents' },
  '/create-agent': { label: 'Create Agent', parent: '/agents' },
  '/templates': { label: 'Templates', parent: '/agents' },
  '/my-deployments': { label: 'Deployments' },
  '/sandbox': { label: 'AI Sandbox' },
  '/users': { label: 'Users' },
  '/monitoring': { label: 'Monitoring' },
  '/gpu': { label: 'GPU Platform' },
  '/analytics': { label: 'Analytics' },
  '/billing-management': { label: 'Billing Management' },
  '/billing': { label: 'Billing' },
  '/settings': { label: 'Platform Settings' },
  '/profile': { label: 'Profile' },
  '/account': { label: 'Account Settings' },
  '/login': { label: 'Login' },
  '/register': { label: 'Register' },
}

export function getBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const crumbs: { label: string; path: string }[] = []
  let current = pathname

  while (current) {
    const entry = breadcrumbConfig[current]
    if (entry) {
      crumbs.unshift({ label: entry.label, path: current })
      current = entry.parent ?? ''
    } else {
      const idx = current.lastIndexOf('/')
      if (idx <= 0) {
        if (current !== '/') {
          current = '/'
          continue
        }
        break
      }
      current = current.substring(0, idx)
    }
  }

  return crumbs
}
