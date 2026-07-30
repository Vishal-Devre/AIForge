import { useState } from 'react'
import { Users, UserPlus, Search, Shield, ShieldCheck, Mail, MoreVertical, Trash2, Edit, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Badge } from '@/lib/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'

interface PlatformUser {
  id: string
  name: string
  email: string
  role: 'SUPERUSER' | 'ADMIN' | 'CUSTOMER'
  status: 'Active' | 'Pending' | 'Suspended'
  lastActive: string
  joinedDate: string
}

const mockUsers: PlatformUser[] = [
  {
    id: 'usr-1',
    name: 'Vishal Devre',
    email: 'vishaldevre898@gmail.com',
    role: 'SUPERUSER',
    status: 'Active',
    lastActive: 'Just now',
    joinedDate: '2025-01-10',
  },
  {
    id: 'usr-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@aiforge.dev',
    role: 'ADMIN',
    status: 'Active',
    lastActive: '12 mins ago',
    joinedDate: '2025-02-01',
  },
  {
    id: 'usr-3',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    role: 'CUSTOMER',
    status: 'Active',
    lastActive: '2 hours ago',
    joinedDate: '2025-03-15',
  },
  {
    id: 'usr-4',
    name: 'Marcus Vance',
    email: 'marcus.v@innovate.co',
    role: 'CUSTOMER',
    status: 'Pending',
    lastActive: '1 day ago',
    joinedDate: '2025-04-02',
  },
  {
    id: 'usr-5',
    name: 'Elena Rostova',
    email: 'elena@cybernet.ai',
    role: 'CUSTOMER',
    status: 'Suspended',
    lastActive: '5 days ago',
    joinedDate: '2025-02-20',
  },
]

export function UserManagementPage() {
  const [users, setUsers] = useState<PlatformUser[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Management"
        description="Manage user access, roles, permissions, and platform superusers"
      >
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Add New User
        </Button>
      </PageHeader>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-tertiary)] font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{users.length}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-tertiary)] font-medium">Superusers / Admins</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {users.filter(u => u.role === 'SUPERUSER' || u.role === 'ADMIN').length}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-tertiary)] font-medium">Active Customers</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {users.filter(u => u.status === 'Active' && u.role === 'CUSTOMER').length}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-tertiary)] font-medium">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {users.filter(u => u.status === 'Pending').length}
              </h3>
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-9 px-3 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPERUSER">Superuser</option>
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-primary)] text-xs text-[var(--text-tertiary)] uppercase font-semibold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)] text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-white font-bold text-xs flex items-center justify-center">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{u.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {u.role === 'SUPERUSER' ? (
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
                        u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                        u.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-400' :
                          u.status === 'Pending' ? 'bg-amber-400' :
                          'bg-red-400'
                        }`} />
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-[var(--text-secondary)]">{u.lastActive}</td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-secondary)]">{u.joinedDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {u.role !== 'SUPERUSER' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
