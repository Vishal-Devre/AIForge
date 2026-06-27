import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/lib/ui/toast'
import { Shell } from '@/components/layout/Shell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AgentFactoryPage } from '@/pages/AgentFactoryPage'
import { GPUPlatformPage } from '@/pages/GPUPlatformPage'
import { SandboxPage } from '@/pages/SandboxPage'
import { DeploymentEnginePage } from '@/pages/DeploymentEnginePage'
import { MonitoringPage } from '@/pages/MonitoringPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ProfilePage } from '@/pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Shell><DashboardPage /></Shell></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/agents" element={<ProtectedRoute><Shell><AgentFactoryPage /></Shell></ProtectedRoute>} />
              <Route path="/gpu" element={<ProtectedRoute><Shell><GPUPlatformPage /></Shell></ProtectedRoute>} />
              <Route path="/sandbox" element={<ProtectedRoute><Shell><SandboxPage /></Shell></ProtectedRoute>} />
              <Route path="/deployments" element={<ProtectedRoute><Shell><DeploymentEnginePage /></Shell></ProtectedRoute>} />
              <Route path="/monitoring" element={<ProtectedRoute><Shell><MonitoringPage /></Shell></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Shell><SettingsPage /></Shell></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Shell><ProfilePage /></Shell></ProtectedRoute>} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
