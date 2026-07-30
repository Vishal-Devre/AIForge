import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/lib/ui/toast'
import { Shell } from '@/components/layout/Shell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { AdminRoute } from '@/components/layout/AdminRoute'
import { ChatBot } from '@/components/shared/ChatBot'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AgentFactoryPage } from '@/pages/AgentFactoryPage'
import { AgentsPage } from '@/pages/AgentsPage'
import { GPUPlatformPage } from '@/pages/GPUPlatformPage'
import { SandboxPage } from '@/pages/SandboxPage'
import { DeploymentEnginePage } from '@/pages/DeploymentEnginePage'
import { MonitoringPage } from '@/pages/MonitoringPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ProfilePage } from '@/pages/ProfilePage'

import { BillingPage } from '@/pages/BillingPage'
import { AgentTemplatesPage } from '@/pages/AgentTemplatesPage'
import { CreateAgentPage } from '@/pages/CreateAgentPage'
import { UserManagementPage } from '@/pages/UserManagementPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AccountSettingsPage } from '@/pages/AccountSettingsPage'

// Pages where chatbot icon should appear
const CHATBOT_PAGES = ['/', '/agents', '/gpu', '/sandbox', '/deployments', '/create-agent', '/templates']

function ChatBotWrapper() {
  const location = useLocation()
  const showChatbot = CHATBOT_PAGES.includes(location.pathname)
  return showChatbot ? <ChatBot /> : null
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Shell><DashboardPage /></Shell>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Admin pages */}
              <Route path="/gpu" element={<AdminRoute><Shell><GPUPlatformPage /></Shell></AdminRoute>} />
              <Route path="/sandbox" element={<ProtectedRoute><Shell><SandboxPage /></Shell></ProtectedRoute>} />
              <Route path="/agents" element={<ProtectedRoute><Shell><AgentsPage /></Shell></ProtectedRoute>} />
              <Route path="/deployments" element={<AdminRoute><Shell><DeploymentEnginePage /></Shell></AdminRoute>} />
              <Route path="/monitoring" element={<AdminRoute><Shell><MonitoringPage /></Shell></AdminRoute>} />
              <Route path="/settings" element={<AdminRoute><Shell><SettingsPage /></Shell></AdminRoute>} />

              {/* Admin-only pages */}
              <Route path="/users" element={<AdminRoute><Shell><UserManagementPage /></Shell></AdminRoute>} />
              <Route path="/analytics" element={<AdminRoute><Shell><AnalyticsPage /></Shell></AdminRoute>} />
              <Route path="/billing-management" element={<AdminRoute><Shell><BillingPage /></Shell></AdminRoute>} />

              {/* Customer specific pages (or shared ones) */}
              <Route path="/profile" element={<ProtectedRoute><Shell><ProfilePage /></Shell></ProtectedRoute>} />
              <Route path="/my-agents" element={<ProtectedRoute><Shell><AgentFactoryPage /></Shell></ProtectedRoute>} />
              <Route path="/create-agent" element={<ProtectedRoute><Shell><CreateAgentPage /></Shell></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><Shell><AgentTemplatesPage /></Shell></ProtectedRoute>} />
              <Route path="/my-deployments" element={<ProtectedRoute><Shell><DeploymentEnginePage /></Shell></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><Shell><BillingPage /></Shell></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><Shell><AccountSettingsPage /></Shell></ProtectedRoute>} />
            </Routes>
            <ChatBotWrapper />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
