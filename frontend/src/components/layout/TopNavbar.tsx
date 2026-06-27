import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Bell, Moon, Sun, HelpCircle, ArrowUpDown, LogIn, User, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback } from '@/lib/ui/avatar'
import { Badge } from '@/lib/ui/badge'
import { Button } from '@/lib/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/lib/ui/dropdown-menu'
import { notifications } from '@/data/dummy'
import { timeAgo } from '@/lib/utils'

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-surface-700/30 bg-surface-950/70 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 md:px-6 gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search deployments, agents, logs..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-800/60 border border-surface-700/30 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/30 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 rounded border border-surface-600/50 bg-surface-800/80 px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="h-4.5 w-4.5" />
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4.5 w-4.5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary-500 text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-primary-500/30">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-[11px] text-primary-400 font-normal cursor-pointer hover:text-primary-300">Mark all read</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-72 overflow-y-auto">
                {notifications.slice(0, 4).map(notif => (
                  <DropdownMenuItem key={notif.id} className={cn('flex flex-col items-start gap-0.5 py-3', !notif.read && 'bg-primary-500/5')}>
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-sm font-medium text-white">{notif.title}</span>
                      {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />}
                    </div>
                    <span className="text-xs text-slate-400">{notif.message}</span>
                    <span className="text-[10px] text-slate-500 mt-1">{timeAgo(notif.timestamp)}</span>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary-400 text-xs font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile / Sign In */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-surface-800/60 transition-colors">
                  <Avatar className="h-8 w-8">
                    {user.avatar_url && <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover rounded-full" />}
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs">
                      {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-white leading-tight">{user.full_name}</span>
                    <span className="text-[10px] text-slate-500 leading-tight capitalize">{user.role}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-400">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4 mr-1.5" /> Sign in
            </Button>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3 animate-slide-down">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-800/60 border border-surface-700/30 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
