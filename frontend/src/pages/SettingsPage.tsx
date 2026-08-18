import { useState } from 'react'
import {
  Settings, Bell, Shield, CreditCard, Key, Users,
  ChevronRight, Save, LogOut
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Switch } from '@/lib/ui/switch'
import { Separator } from '@/lib/ui/separator'
import { Tabs, TabsContent } from '@/lib/ui/tabs'
import { Badge } from '@/lib/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/lib/ui/select'

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
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('general')
  const [saved, setSaved] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
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
                      ? 'text-[var(--text-primary)] bg-[var(--accent-light)] border border-[var(--border-accent)]'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-transparent'
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
                      <p className="text-sm font-medium text-[var(--text-primary)]">Theme</p>
                      <p className="text-xs text-[var(--text-secondary)]">Toggle between dark and light mode</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-[var(--warning)]' : 'text-[var(--text-tertiary)]'}`} />
                      <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                      <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-[var(--info)]' : 'text-[var(--text-tertiary)]'}`} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Platform Name</label>
                    <Input defaultValue="AIForge" />
                  </div>

                  <Button onClick={handleSave} className={saved ? 'bg-[var(--success)]' : ''}>
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
                    { label: 'Agent Status Updates', desc: 'When agents change status' },
                    { label: 'Deployment Health Alerts', desc: 'When deployments succeed or fail' },
                    { label: 'Billing & Usage Alerts', desc: 'When credits are running low' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
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
                      <p className="text-sm font-medium text-[var(--text-primary)]">Two-Factor Authentication</p>
                      <p className="text-xs text-[var(--text-secondary)]">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Session Timeout</p>
                      <p className="text-xs text-[var(--text-secondary)]">Auto-logout after inactivity</p>
                    </div>
                    <Select defaultValue="30m">
                      <SelectTrigger className="w-[160px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30m">30 minutes</SelectItem>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="4h">4 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Update Password</p>
                      <p className="text-xs text-[var(--text-secondary)]">Change your account password</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                    >
                      {showPasswordFields ? 'Cancel' : 'Update'}
                    </Button>
                  </div>
                  {showPasswordFields && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">Current Password</label>
                        <Input type="password" placeholder="Enter current password" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">New Password</label>
                        <Input type="password" placeholder="Enter new password" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">Confirm New Password</label>
                        <Input type="password" placeholder="Confirm new password" />
                      </div>
                      <Button size="sm" onClick={handleSave}>Save Password</Button>
                    </div>
                  )}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Current Plan</p>
                      <p className="text-xs text-[var(--text-secondary)]">Free Tier</p>
                    </div>
                    <Badge variant="outline">$0/mo</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API keys for programmatic access</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={<Key className="h-8 w-8" />}
                    title="No API keys yet"
                    description="Generate API keys for programmatic access to the platform."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage access for your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={<Users className="h-8 w-8" />}
                    title="No team members yet"
                    description="Invite team members to collaborate on agents and deployments."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sign Out */}
            <div className="mt-8 pt-6 border-t border-[var(--border-primary)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Sign Out</p>
                  <p className="text-xs text-[var(--text-secondary)]">Sign out of your account on this device</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="text-[var(--error)] border-[var(--error-border)] hover:bg-[var(--error-light)] hover:text-[var(--error)]">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
