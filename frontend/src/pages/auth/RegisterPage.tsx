import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Eye, EyeOff, Mail, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/lib/ui/button'
import { Input } from '@/lib/ui/input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/lib/ui/toast'
import './RegisterPage.css'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Please fill in all fields' })
      return
    }
    if (password.length < 8) {
      addToast({ type: 'error', title: 'Weak Password', message: 'Password must be at least 8 characters' })
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      addToast({ type: 'success', title: 'Account created', message: 'Welcome to AIForge' })
      navigate('/')
    } catch (error: any) {
      addToast({ type: 'error', title: 'Registration failed', message: error.message || 'Please try again' })
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
      setOauthLoading(null)
    }
  }

  const passwordStrength = () => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-primary-500', 'bg-emerald-500']

  return (
    <div className="register-page-container grid-bg">
      <div className="register-page-gradient-bg" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="register-card-wrapper"
      >
        <div className="register-card-glow" />
        <div className="register-card">
          <div className="register-header">
            <div className="register-logo">
              <Zap className="register-logo-icon" />
            </div>
            <h1 className="register-title">Create account</h1>
            <p className="register-subtitle">Start building with AIForge</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="register-form">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="register-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon-left" />
                    <Input
                      type="text"
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-with-icon-left"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon-left" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-with-icon-left"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input-with-icon-right"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="input-icon-right"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="password-strength-container">
                      <div className="password-bars-row">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`password-bar ${i <= passwordStrength() ? strengthColors[passwordStrength()] : 'bg-surface-700'}`} />
                        ))}
                      </div>
                      <p className="password-strength-text">{passwordStrength() < 4 ? 'Add uppercase, numbers & symbols' : 'Strong password'}</p>
                    </div>
                  )}
                </div>

                <Button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (
                    <div className="loading-spinner-wrapper">
                      <div className="loading-spinner" />
                      Creating account...
                    </div>
                  ) : 'Create account'}
                </Button>
              </motion.div>
          </form>

          <div className="divider">
            <div className="divider-line-wrapper">
              <div className="divider-line" />
            </div>
            <div className="divider-text-wrapper">
              <span className="divider-text">or continue with</span>
            </div>
          </div>

          <div className="oauth-grid">
            <Button variant="outline" className="oauth-button" onClick={() => handleOAuth('github')} disabled={!!oauthLoading}>
              {oauthLoading === 'github' ? (
                <div className="oauth-spinner" />
              ) : (
                <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              )}
              GitHub
            </Button>
            <Button variant="outline" className="oauth-button" onClick={() => handleOAuth('google')} disabled={!!oauthLoading}>
              {oauthLoading === 'google' ? (
                <div className="oauth-spinner" />
              ) : (
                <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              )}
              Google
            </Button>
          </div>

          <p className="login-link-wrapper">
            Already have an account?{' '}
            <Link to="/login" className="login-link">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

