import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Eye, EyeOff, Mail, ArrowRight, Sparkles, Bot, Cpu, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/lib/ui/toast'
import './LoginPage.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const { login, loginWithOAuth, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Please fill in all fields' })
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      addToast({ type: 'success', title: 'Welcome back', message: 'Successfully signed in' })
      navigate('/')
    } catch (error: any) {
      // Surface the actual reason (wrong password vs unconfirmed email vs network down)
      addToast({
        type: 'error',
        title: 'Sign in failed',
        message: error?.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      addToast({ type: 'error', title: 'Email required', message: 'Enter your email address above first, then click "Forgot password".' })
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/',
      })
      if (error) throw error
      setResetSent(true)
      addToast({ type: 'success', title: 'Reset link sent', message: `Check ${email} for instructions to reset your password.` })
    } catch (error: any) {
      addToast({ type: 'error', title: 'Could not send reset link', message: error?.message || 'Please try again later.' })
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOauthLoading(provider)
    try {
      await loginWithOAuth(provider)
    } catch (error: any) {
      addToast({ type: 'error', title: 'Authentication failed', message: error.message || 'Could not sign in with provider' })
    } finally {
      setOauthLoading(null)
    }
  }

  return (
    <div className="auth-page">
      {/* Left Panel - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="auth-logo-section"
          >
            <Link to="/" className="auth-logo-link">
              <div className="auth-logo">
                <Zap className="auth-logo-icon" />
              </div>
              <span className="auth-logo-text">AIForge</span>
            </Link>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="auth-form-card"
          >
            <div className="auth-form-header">
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">Sign in to continue building with AI</p>
            </div>

            {/* OAuth Buttons */}
            <div className="auth-oauth-section">
              <button
                className="auth-oauth-btn auth-oauth-github"
                onClick={() => handleOAuth('github')}
                disabled={!!oauthLoading}
              >
                {oauthLoading === 'github' ? (
                  <div className="auth-oauth-spinner" />
                ) : (
                  <svg className="auth-oauth-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                )}
                <span>Continue with GitHub</span>
              </button>
              <button
                className="auth-oauth-btn auth-oauth-google"
                onClick={() => handleOAuth('google')}
                disabled={!!oauthLoading}
              >
                {oauthLoading === 'google' ? (
                  <div className="auth-oauth-spinner" />
                ) : (
                  <svg className="auth-oauth-icon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or sign in with email</span>
              <div className="auth-divider-line" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <div className="auth-input-wrapper">
                  <Mail className="auth-input-icon" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field">
                <div className="auth-label-row">
                  <label className="auth-label">Password</label>
                  <button type="button" className="auth-forgot-link" onClick={handleForgotPassword}>
                    {resetSent ? 'Reset link sent ✓' : 'Forgot password?'}
                  </button>
                </div>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="auth-input auth-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-password-toggle"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <div className="auth-loading">
                    <div className="auth-loading-spinner" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="auth-switch-link">
                Create one free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="auth-visual-panel">
        <div className="auth-visual-bg">
          <div className="auth-gradient-orb auth-gradient-orb-1" />
          <div className="auth-gradient-orb auth-gradient-orb-2" />
          <div className="auth-gradient-orb auth-gradient-orb-3" />
          <div className="auth-grid-pattern" />
        </div>
        
        <div className="auth-visual-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="auth-visual-inner"
          >
            <div className="auth-visual-badge">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Infrastructure</span>
            </div>
            
            <h2 className="auth-visual-title">
              Build the future with
              <span className="auth-visual-highlight"> intelligent automation</span>
            </h2>
            
            <p className="auth-visual-desc">
              Deploy AI agents, manage GPU clusters, and scale your infrastructure 
              with the most advanced platform for AI development.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-bot">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="auth-feature-title">Agent Factory</h4>
                  <p className="auth-feature-desc">Deploy and manage AI agents at scale</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-gpu">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="auth-feature-title">GPU Platform</h4>
                  <p className="auth-feature-desc">Access powerful GPU clusters on demand</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-deploy">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="auth-feature-title">Instant Deploy</h4>
                  <p className="auth-feature-desc">Ship from code to production in seconds</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
