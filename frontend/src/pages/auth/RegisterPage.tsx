import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Eye, EyeOff, Mail, User, ArrowRight, Sparkles, Shield, Zap as Lightning, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/lib/ui/toast'
import './LoginPage.css'
import './RegisterPage.css'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const { register, loginWithOAuth, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email || !password) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Please fill in all fields' })
      return
    }
    if (password !== confirmPassword) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Passwords do not match' })
      return
    }
    if (password.length < 6) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Password must be at least 6 characters' })
      return
    }
    setLoading(true)
    try {
      await register(email, password, name)
      addToast({ type: 'success', title: 'Account created', message: 'Welcome to AIForge!' })
      navigate('/')
    } catch (error: any) {
      addToast({ type: 'error', title: 'Registration failed', message: error.message || 'Could not create account' })
    } finally {
      setLoading(false)
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
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-subtitle">Start building with AI in minutes. Free forever.</p>
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
              <span className="auth-divider-text">or sign up with email</span>
              <div className="auth-divider-line" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Full name</label>
                <div className="auth-input-wrapper">
                  <User className="auth-input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

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
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                <div className="auth-password-strength">
                  <div className="auth-strength-bar">
                    <div className={`auth-strength-fill ${password.length >= 6 ? 'auth-strength-weak' : ''} ${password.length >= 10 ? 'auth-strength-medium' : ''} ${password.length >= 14 ? 'auth-strength-strong' : ''}`} />
                  </div>
                  <span className="auth-strength-text">
                    {password.length >= 14 ? 'Strong' : password.length >= 10 ? 'Medium' : password.length >= 6 ? 'Weak' : 'Too short'}
                  </span>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Confirm password</label>
                <div className="auth-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="auth-input auth-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-password-toggle"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span className="auth-field-error">Passwords do not match</span>
                )}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <div className="auth-loading">
                    <div className="auth-loading-spinner" />
                    Creating account...
                  </div>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">
                Sign in instead
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
              <span>Trusted by 10,000+ developers</span>
            </div>
            
            <h2 className="auth-visual-title">
              Join the next generation of
              <span className="auth-visual-highlight"> AI developers</span>
            </h2>
            
            <p className="auth-visual-desc">
              Start with our generous free tier. No credit card required. 
              Scale when you&apos;re ready.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-free">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="auth-feature-title">Free Forever</h4>
                  <p className="auth-feature-desc">Start building with zero upfront cost</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-secure">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="auth-feature-title">Enterprise Security</h4>
                  <p className="auth-feature-desc">SOC2 compliant with end-to-end encryption</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-fast">
                  <Lightning className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="auth-feature-title">Instant Setup</h4>
                  <p className="auth-feature-desc">Deploy your first AI agent in under 2 minutes</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-global">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="auth-feature-title">Global Edge Network</h4>
                  <p className="auth-feature-desc">Run inference on 50+ edge locations worldwide</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
