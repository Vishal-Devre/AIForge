import { useState } from 'react'
import {
  User, Mail, Calendar, Shield,
  Edit3, Camera, Check
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Badge } from '@/lib/ui/badge'
import { Separator } from '@/lib/ui/separator'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar, AvatarFallback } from '@/lib/ui/avatar'
import { useAuth } from '@/context/AuthContext'

export function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  const nameParts = user?.full_name?.split(' ') || ['', '']

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Manage your personal information" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 mb-4">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-[var(--text-on-accent)]">{initials}</AvatarFallback>
                    )}
                  </Avatar>
                  <button className="absolute bottom-3 right-0 h-8 w-8 rounded-full bg-[var(--accent)] border-2 border-[var(--bg-primary)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-4 w-4 text-[var(--text-on-accent)]" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{user?.full_name || 'User'}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{user?.email || '—'}</p>
                <Badge variant="primary" className="mt-2 capitalize">{user?.role || 'user'}</Badge>
              </div>

              <Separator className="my-5" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Calendar className="h-3.5 w-3.5" /> Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Shield className="h-3.5 w-3.5" /> Provider: {user?.provider || '—'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditing(!editing)}>
                  {editing ? <Check className="h-4 w-4 text-[var(--success)]" /> : <Edit3 className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">First Name</label>
                  <Input defaultValue={nameParts[0] || ''} disabled={!editing} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Last Name</label>
                  <Input defaultValue={nameParts.slice(1).join(' ') || ''} disabled={!editing} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Email</label>
                  <Input defaultValue={user?.email || ''} disabled={!editing} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
