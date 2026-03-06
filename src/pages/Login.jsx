import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, ShoppingBag, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.email.trim() || !formData.password.trim()) {
      triggerError('Please fill in all fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      triggerError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    // Brief delay for UX feel
    await new Promise((r) => setTimeout(r, 400))

    const result = login(formData.email, formData.password)
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Welcome back!')
      navigate('/dashboard', { replace: true })
    } else {
      triggerError(result.message)
    }
  }

  const triggerError = (msg) => {
    setError(msg)
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-dark-bg">
      {/* ── Left: Brand Panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-dark-bg items-center justify-center animate-gradient">
        {/* Decorative floating shapes */}
        <div className="absolute top-16 left-16 w-32 h-32 rounded-full bg-primary/20 blur-xl animate-float" />
        <div className="absolute bottom-24 right-20 w-48 h-48 rounded-full bg-accent/10 blur-2xl animate-float-delay" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-2xl bg-primary-400/15 blur-lg animate-float-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full border border-primary-400/20 animate-float-delay" />

        <div className="relative z-10 text-center px-12 animate-fade-in-left">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary-400/30 mb-8">
            <ShoppingBag className="w-10 h-10 text-primary-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Shop<span className="text-accent">Vault</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-sm mx-auto leading-relaxed">
            Your premium shopping experience. Manage your store with elegance.
          </p>
          <div className="flex items-center justify-center gap-2 mt-8 text-primary-300/70">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Secure • Fast • Beautiful</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 border border-primary-400/30 mb-4">
              <ShoppingBag className="w-7 h-7 text-primary-300" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Shop<span className="text-accent">Vault</span>
            </h1>
          </div>

          {/* Form card */}
          <div className="bg-dark-surface/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl animate-pulse-glow">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-slate-400 mt-1.5 text-sm">
                Sign in to your dashboard
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div
                className={`mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 ${
                  shaking ? 'animate-shake' : ''
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-dark-bg/80 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-slate-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 bg-dark-bg/80 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-6 p-3.5 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent">Demo Account</span>
              </div>
              <p className="text-xs text-slate-400">
                Try: <span className="text-slate-300 font-medium">demo@shopvault.com</span>{' '}
                / <span className="text-slate-300 font-medium">demo1234</span>
              </p>
            </div>

            {/* Register link */}
            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
