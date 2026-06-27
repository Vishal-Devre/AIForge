import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Bot, Cpu, Terminal, Rocket, Activity, Settings, User,
  ChevronLeft, PanelLeftClose, PanelLeft, Zap, LogIn, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { sidebarItems } from '@/data/dummy'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Bot, Cpu, Terminal, Rocket, Activity, Settings, User,
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-surface-700/30',
        collapsed && 'justify-center px-3'
      )}>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 shrink-0">
          <Zap className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight">AIForge</span>
            <span className="text-[10px] text-slate-500 font-medium">Enterprise Platform</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setMobileOpen(false)
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                collapsed && 'justify-center px-2',
                active
                  ? 'text-white bg-primary-500/15 border border-primary-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-surface-800/60 border border-transparent'
              )}
            >
              <Icon className={cn(
                'h-4.5 w-4.5 shrink-0 transition-colors',
                active ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'
              )} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-primary-500/20 text-primary-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {active && (
                <span className={cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50',
                  collapsed && 'left-0'
                )} />
              )}
            </button>
          )
        })}
      </nav>

      <div className={cn(
        'px-4 py-4 border-t border-surface-700/30',
        collapsed && 'px-3'
      )}>
        {user ? (
          <div className={cn(
            'flex items-center gap-3',
            collapsed && 'justify-center'
          )}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
              ) : (
                user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-surface-800 rounded-md transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className={cn(
              'flex items-center gap-3 w-full text-slate-400 hover:text-white transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <div className="h-8 w-8 rounded-full bg-surface-800 border border-surface-700/50 flex items-center justify-center shrink-0">
              <LogIn className="h-4 w-4" />
            </div>
            {!collapsed && (
              <span className="text-sm font-medium">Sign in</span>
            )}
          </button>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'hidden md:flex items-center justify-center py-3 border-t border-surface-700/30 text-slate-500 hover:text-white hover:bg-surface-800/40 transition-colors',
          collapsed && 'px-2'
        )}
      >
        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 rounded-xl bg-surface-900 border border-surface-700/50 flex items-center justify-center text-white shadow-xl"
      >
        {mobileOpen ? <ChevronLeft className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-surface-950/90 backdrop-blur-xl border-r border-surface-700/30 flex flex-col transition-all duration-300 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-60',
          'md:relative',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
