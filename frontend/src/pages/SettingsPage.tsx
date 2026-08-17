import { useState } from 'react'
import {
  Settings, Bell, Shield, CreditCard, Key, Users, Globe,
  ChevronRight, Moon, Sun, Save
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { Switch } from '@/lib/ui/switch'
import { Separator } from '@/lib/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/lib/ui/tabs'
import { Badge } from '@/lib/ui/badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
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
                    <select className="h-9 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] px-3 focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
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
          </Tabs>
        </div>
      </div>
    </div>
  )
}
