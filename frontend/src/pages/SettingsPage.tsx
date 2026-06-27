import { useState } from 'react'
import {
  Settings, Bell, Shield, CreditCard, Key, Users, Globe,
  Palette, Terminal, HardDrive, ChevronRight, Moon, Sun,
  Save
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Switch } from '@/lib/ui/switch'
import { Separator } from '@/lib/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/lib/ui/tabs'
import { Badge } from '@/lib/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { useTheme } from '@/context/ThemeContext'

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'team', label: 'Team', icon: Users },
]

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and platform preferences"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            {sections.map(s => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? 'text-white bg-primary-500/15 border border-primary-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-surface-800/60 border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{s.label}</span>
                  {activeSection === s.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your platform preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Theme</p>
                      <p className="text-xs text-slate-400">Toggle between dark and light mode</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                      <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-slate-500'}`} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Platform Name</label>
                    <Input defaultValue="AIForge" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Default Region</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <select className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-800/60 border border-surface-700/30 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 appearance-none">
                        <option>us-east-1 (N. Virginia)</option>
                        <option>us-west-2 (Oregon)</option>
                        <option>eu-central-1 (Frankfurt)</option>
                        <option>ap-southeast-1 (Singapore)</option>
                      </select>
                    </div>
                  </div>

                  <Button onClick={handleSave} className={saved ? 'bg-emerald-500' : ''}>
                    {saved ? 'Saved!' : <><Save className="h-4 w-4" /> Save Changes</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how and when you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    { label: 'Deployment Notifications', desc: 'When deployments succeed or fail' },
                    { label: 'GPU Usage Alerts', desc: 'When GPU utilization exceeds thresholds' },
                    { label: 'Security Alerts', desc: 'When security events are detected' },
                    { label: 'Billing Alerts', desc: 'When credits are running low' },
                    { label: 'Weekly Reports', desc: 'Receive weekly usage summaries' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-400">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Session Timeout</p>
                      <p className="text-xs text-slate-400">Auto-logout after inactivity</p>
                    </div>
                    <select className="h-9 rounded-lg bg-surface-800/60 border border-surface-700/30 text-sm text-white px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                  <Separator />
                  <Button variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10">Change Password</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Credits</CardTitle>
                  <CardDescription>Manage your subscription and usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-surface-800/40 border border-surface-700/30">
                      <p className="text-xs text-slate-400">Compute Credits</p>
                      <p className="text-2xl font-bold text-white mt-1">25,000</p>
                      <p className="text-xs text-slate-500 mt-1">Remaining this month</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-800/40 border border-surface-700/30">
                      <p className="text-xs text-slate-400">GPU Credits</p>
                      <p className="text-2xl font-bold text-white mt-1">1,000</p>
                      <p className="text-xs text-slate-500 mt-1">Dedicated GPU hours</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Current Plan</p>
                      <p className="text-xs text-slate-400">Enterprise Pro</p>
                    </div>
                    <Badge variant="primary">$299/mo</Badge>
                  </div>
                  <Button variant="outline">View Billing History</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API keys for programmatic access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Production API Key', key: 'af_pk_live_xxxx...xxxx', created: '2 months ago' },
                    { name: 'Development Key', key: 'af_pk_test_xxxx...xxxx', created: '1 week ago' },
                    { name: 'CI/CD Pipeline Key', key: 'af_pk_ci_xxxx...xxxx', created: '3 days ago' },
                  ].map(k => (
                    <div key={k.name} className="flex items-center justify-between p-3 rounded-lg bg-surface-800/30 border border-surface-700/20">
                      <div>
                        <p className="text-sm font-medium text-white">{k.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{k.key}</p>
                        <p className="text-[10px] text-slate-500">Created {k.created}</p>
                      </div>
                      <Button variant="ghost" size="sm">Revoke</Button>
                    </div>
                  ))}
                  <Button variant="outline"><Key className="h-4 w-4" /> Generate New Key</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage access for your team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Alex Rivera', email: 'alex@aiforge.dev', role: 'Admin', status: 'active' },
                    { name: 'Sarah Chen', email: 'sarah@aiforge.dev', role: 'Developer', status: 'active' },
                    { name: 'Marcus Kim', email: 'marcus@aiforge.dev', role: 'Developer', status: 'active' },
                    { name: 'Priya Patel', email: 'priya@aiforge.dev', role: 'Viewer', status: 'pending' },
                  ].map(member => (
                    <div key={member.email} className="flex items-center justify-between p-3 rounded-lg bg-surface-800/30 border border-surface-700/20">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{member.role}</span>
                        <Badge variant={member.status === 'active' ? 'success' : 'warning'} size="sm">{member.status}</Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline"><Users className="h-4 w-4" /> Invite Member</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
