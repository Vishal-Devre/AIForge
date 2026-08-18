import { useState, useEffect, useCallback } from 'react'
import { Users, Search, ShieldCheck, Shield, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Badge } from '@/lib/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { usersApi } from '@/lib/api'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/lib/ui/select'
import type { AdminUser, UserStats } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(iso)
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ─── Component ───────────────────────────────────────────────────────────

export function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [usersRes, statsRes] = await Promise.all([
        usersApi.getAll(search || undefined, roleFilter !== 'ALL' ? roleFilter : undefined),
        usersApi.getStats(),
      ])
      setUsers(usersRes.items || [])
      setStats(statsRes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRetry = () => fetchUsers()

  // Client-side search is done server-side via the API
  const filteredUsers = users

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Management"
        description="Manage user access, roles, permissions, and platform superusers"
      />

      {/* Loading State */}
      {loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 w-24 rounded bg-[var(--bg-muted)]" />
                  <div className="h-7 w-12 rounded bg-[var(--bg-muted)] mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="animate-pulse">
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded bg-[var(--bg-muted)]" />
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-[var(--error-border)] bg-[var(--error-light)]">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-[var(--error)] shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--error)]">Failed to load users</p>
              <p className="text-xs text-[var(--text-secondary)]">{error}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={handleRetry}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats & Table — only when data loaded */}
      {!loading && !error && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-[var(--bg-secondary)]">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] font-medium">Total Users</p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats?.total ?? 0}</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                  <Users className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--bg-secondary)]">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] font-medium">Superusers</p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats?.superuser_count ?? 0}</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--bg-secondary)]">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] font-medium">Active Users</p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats?.active_count ?? 0}</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--bg-secondary)]">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] font-medium">Inactive / Suspended</p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats?.inactive_count ?? 0}</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <XCircle className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Table Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Platform Accounts</CardTitle>
                  <CardDescription>View and manage all registered accounts and role authorizations</CardDescription>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                    <Input
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-9 text-xs"
                    />
                  </div>

                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[130px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Roles</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {filteredUsers.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-8 w-8" />}
                  title={search || roleFilter !== 'ALL' ? 'No matching users' : 'No users found'}
                  description={
                    search || roleFilter !== 'ALL'
                      ? 'Try adjusting your search or filters.'
                      : 'No users have registered yet.'
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-primary)] text-xs text-[var(--text-tertiary)] uppercase font-semibold">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Last Active</th>
                        <th className="py-3 px-4">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-primary)] text-sm">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {u.avatar_url ? (
                                <img src={u.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-white font-bold text-xs flex items-center justify-center">
                                  {getInitials(u.full_name)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-[var(--text-primary)]">{u.full_name}</p>
                                <p className="text-xs text-[var(--text-tertiary)]">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {u.is_superuser ? (
                              <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1">
                                <ShieldCheck className="h-3 w-3" /> Superuser
                              </Badge>
                            ) : u.role === 'ADMIN' ? (
                              <Badge variant="primary" className="gap-1">
                                <Shield className="h-3 w-3" /> Admin
                              </Badge>
                            ) : (
                              <Badge variant="outline">Customer</Badge>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                              u.is_active ? 'bg-emerald-500/10 text-emerald-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                u.is_active ? 'bg-emerald-400' : 'bg-red-400'
                              }`} />
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-xs text-[var(--text-secondary)]">
                            {formatRelativeTime(u.updated_at)}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[var(--text-secondary)]">
                            {formatDate(u.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
