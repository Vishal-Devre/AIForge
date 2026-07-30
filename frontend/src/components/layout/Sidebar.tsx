import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Bot, PlusCircle, LayoutTemplate, Rocket, Terminal,
  Users, Activity, Cpu, BarChart3, CreditCard, Sliders, User, Settings,
  ChevronLeft, PanelLeftClose, PanelLeft, Zap, LogIn, LogOut, Sun, Moon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useRole } from '@/hooks/useRole'
import { sidebarItems } from '@/data/dummy'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Bot,
  PlusCircle,
  LayoutTemplate,
  Rocket,
  Terminal,
  Users,
  Activity,
  Cpu,
  BarChart3,
  CreditCard,
  Sliders,
  User,
  Settings,
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { isAdmin } = useRole()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
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

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const filteredItems = sidebarItems.filter(item => {
    if (item.requireSuperuser && !isAdmin) return false
    if (item.requireCustomerOnly && isAdmin) return false
    return true
  })

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-[var(--border-primary)]',
        collapsed && 'justify-center px-3'
      )}>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-[var(--shadow-accent)] shrink-0">
          <Zap className="h-4 w-4 text-[var(--text-on-accent)]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight">AIForge</span>
            <span className="text-[10px] text-[var(--text-tertiary)] font-medium">AI Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          const active = isActive(item.path)
          const showDivider = item.dividerAfter && isAdmin

          return (
            <div key={item.path} className="space-y-1">
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative border cursor-pointer',
                  collapsed && 'justify-center px-2',
                  theme === 'dark'
                    ? active
                      ? 'sidebar-btn-active'
                      : 'sidebar-btn-default'
                    : active
                      ? 'text-[var(--text-primary)] bg-[var(--accent-light)] border-[var(--border-accent)] shadow-sm'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border-transparent'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  'h-4.5 w-4.5 shrink-0 transition-colors sidebar-icon',
                  theme !== 'dark' && (active ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]')
                )} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {active && theme !== 'dark' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[var(--accent)] shadow-sm shadow-[var(--accent-medium)]" />
                )}
              </button>
              {showDivider && (
                <div className="my-2.5 px-2">
                  <div className="border-t border-[var(--border-primary)] opacity-50" />
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom Section: Theme + Profile */}
      <div className={cn(
        'px-3 py-3 border-t space-y-2',
        theme === 'dark' ? 'sidebar-dark-border' : 'border-[var(--border-primary)]',
        collapsed && 'px-2'
      )}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer',
            theme === 'dark' ? 'sidebar-btn-default' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border-transparent',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 shrink-0 sidebar-icon" />
          ) : (
            <Moon className="h-4.5 w-4.5 shrink-0 text-[var(--info)]" />
          )}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Profile / Sign In */}
        {isAuthenticated && user ? (
          <div className={cn(
            'flex items-center gap-3 p-2 rounded-xl transition-colors',
            theme === 'dark' ? 'hover:bg-[#1B1B20]' : 'hover:bg-[var(--bg-tertiary)]',
            collapsed && 'justify-center p-2'
          )}>
            <button
              onClick={() => navigate('/profile')}
              className={cn(
                'flex items-center gap-3 flex-1 min-w-0',
                collapsed && 'justify-center'
              )}
              title={collapsed ? user.full_name : undefined}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-xs font-bold text-[var(--text-on-accent)] shrink-0 overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                ) : (
                  user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
                )}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className={cn("text-sm font-medium truncate", theme === 'dark' ? 'text-white' : 'text-[var(--text-primary)]')}>{user.full_name}</p>
                  <p className={cn("text-[10px] truncate", theme === 'dark' ? 'text-[#7A7A80]' : 'text-[var(--text-tertiary)]')}>{user.email}</p>
                </div>
              )}
            </button>
            {!collapsed && (
              <button
                onClick={handleLogout}
                className={cn(
                  "p-1.5 rounded-md transition-colors shrink-0 border",
                  theme === 'dark' ? 'sidebar-btn-default border-transparent' : 'text-[var(--text-tertiary)] hover:text-[var(--error)] hover:bg-[var(--error-light)] border-transparent'
                )}
                title="Sign out"
              >
                <LogOut className={cn("h-4 w-4", theme === 'dark' ? 'sidebar-icon' : '')} />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border cursor-pointer',
              theme === 'dark' ? 'sidebar-btn-default' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border-transparent',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Sign in' : undefined}
          >
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 border", theme === 'dark' ? 'bg-[#1B1B20] border-[#3A3A40]' : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)]')}>
              <LogIn className={cn("h-4 w-4", theme === 'dark' ? 'sidebar-icon' : '')} />
            </div>
            {!collapsed && <span>Sign in</span>}
          </button>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'hidden md:flex items-center justify-center py-3 border-t transition-colors cursor-pointer',
          theme === 'dark' 
            ? 'sidebar-dark-border sidebar-btn-default' 
            : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]',
          collapsed && 'px-2'
        )}
      >
        {collapsed 
          ? <PanelLeft className={cn("h-4 w-4", theme === 'dark' ? 'sidebar-icon' : '')} /> 
          : <PanelLeftClose className={cn("h-4 w-4", theme === 'dark' ? 'sidebar-icon' : '')} />
        }
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[var(--surface-overlay)] backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-2.5 left-4 z-50 md:hidden h-8 w-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] shadow-xl cursor-pointer"
      >
        {mobileOpen ? <ChevronLeft className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen backdrop-blur-xl border-r flex flex-col transition-all duration-300 ease-in-out',
          theme === 'dark' ? 'sidebar-dark-bg sidebar-dark-border' : 'bg-[var(--bg-primary)] border-[var(--border-primary)]',
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
