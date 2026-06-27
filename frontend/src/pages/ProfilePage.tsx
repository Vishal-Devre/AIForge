import { useState } from 'react'
import {
  User, Mail, Calendar, Shield, CreditCard, MapPin,
  Edit3, Camera, Check
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Badge } from '@/lib/ui/badge'
import { Separator } from '@/lib/ui/separator'
import { Progress } from '@/lib/ui/progress'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar, AvatarFallback } from '@/lib/ui/avatar'

const activityData = [
  { action: 'Deployed primary-forge-web v2.4.1', time: '2 hours ago', type: 'deployment' },
  { action: 'Created agent CodeGenius v3', time: '5 hours ago', type: 'agent' },
  { action: 'Provisioned H100 GPU node', time: '1 day ago', type: 'gpu' },
  { action: 'Updated API rate limits', time: '2 days ago', type: 'config' },
  { action: 'Invited Sarah Chen to team', time: '3 days ago', type: 'team' },
]

export function ProfilePage() {
  const [editing, setEditing] = useState(false)

  const planProgress = 78

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
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">AR</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-3 right-0 h-8 w-8 rounded-full bg-primary-500 border-2 border-surface-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-white">Alex Rivera</h2>
                <p className="text-sm text-slate-400">alex@aiforge.dev</p>
                <Badge variant="primary" className="mt-2">Administrator</Badge>
              </div>

              <Separator className="my-5" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" /> Joined September 2025
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5" /> San Francisco, CA
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Shield className="h-3.5 w-3.5" /> Enterprise Pro Plan
                </div>
              </div>

              <Separator className="my-5" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Monthly Usage</span>
                  <span className="text-white font-medium">{planProgress}%</span>
                </div>
                <Progress value={planProgress} className="h-2" />
                <p className="text-[10px] text-slate-500">25,000 of 32,000 credits used</p>
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
                  {editing ? <Check className="h-4 w-4 text-emerald-400" /> : <Edit3 className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">First Name</label>
                  <Input defaultValue="Alex" disabled={!editing} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Last Name</label>
                  <Input defaultValue="Rivera" disabled={!editing} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-400">Email</label>
                  <Input defaultValue="alex@aiforge.dev" disabled={!editing} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Location</label>
                  <Input defaultValue="San Francisco, CA" disabled={!editing} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Job Title</label>
                  <Input defaultValue="Founder & CEO" disabled={!editing} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {activityData.map((act, i) => (
                  <div key={i} className="flex gap-3 pb-4 last:pb-0 relative">
                    {i < activityData.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-px bg-surface-700/30" />
                    )}
                    <div className={`h-5 w-5 rounded-full border-2 ${
                      act.type === 'deployment' ? 'border-emerald-500 bg-emerald-500/20' :
                      act.type === 'agent' ? 'border-primary-500 bg-primary-500/20' :
                      act.type === 'gpu' ? 'border-amber-500 bg-amber-500/20' :
                      'border-slate-500 bg-slate-500/20'
                    }`} />
                    <div>
                      <p className="text-sm text-slate-300">{act.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
