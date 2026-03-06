import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, ShoppingBag, Sparkles, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const Register = () => {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear field-specific error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    // Brief delay for UX feel
    await new Promise((r) => setTimeout(r, 400))

    const result = register(formData.name, formData.email, formData.password)
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } else {
      setErrors({ email: result.message })
    }
  }

  // Password strength indicators
  const passwordChecks = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(formData.password) },
    { label: 'Contains a letter', met: /[a-zA-Z]/.test(formData.password) },
  ]

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

      {/* ── Right: Register Form ───────────────────────── */}
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
              <h2 className="text-2xl font-bold text-white">Create account</h2>
              <p className="text-slate-400 mt-1.5 text-sm">
                Start your premium shopping journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                  className={`w-full px-4 py-3 bg-dark-bg/80 border rounded-xl text-slate-200 placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-slate-500 ${
                    errors.name ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

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
                  className={`w-full px-4 py-3 bg-dark-bg/80 border rounded-xl text-slate-200 placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-slate-500 ${
                    errors.email ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                )}
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
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 bg-dark-bg/80 border rounded-xl text-slate-200 placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-slate-500 ${
                      errors.password ? 'border-red-500/50' : 'border-slate-600/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                )}

                {/* Password strength hints */}
                {formData.password.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {passwordChecks.map((check) => (
                      <div key={check.label} className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                            check.met
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-700 text-slate-500'
                          }`}
                        >
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span
                          className={`text-xs transition-colors ${
                            check.met ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pr-12 bg-dark-bg/80 border rounded-xl text-slate-200 placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-slate-500 ${
                      errors.confirmPassword ? 'border-red-500/50' : 'border-slate-600/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>
                )}
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
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
