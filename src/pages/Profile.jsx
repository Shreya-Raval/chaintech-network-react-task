import { useState } from 'react'
import {
  User,
  Mail,
  Calendar,
  ShoppingCart,
  DollarSign,
  Pencil,
  Eye,
  EyeOff,
  Save,
  X,
  Check,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getUserByEmail } from '../utils/localStorage'
import toast from 'react-hot-toast'

const Profile = () => {
  const { currentUser, updateProfile } = useAuth()
  const { cartCount, cartTotal } = useCart()
  const [activeTab, setActiveTab] = useState('profile')

  // Get full user data (including createdAt)
  const fullUser = getUserByEmail(currentUser?.email)
  const memberSince = fullUser?.createdAt
    ? new Date(fullUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently'

  // ── Edit Profile form state ─────────────────────────
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setErrors({})
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required to save changes'
    }
    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 400))

    const result = updateProfile(
      {
        name: formData.name,
        email: formData.email,
        newPassword: formData.newPassword || undefined,
      },
      formData.currentPassword
    )

    setIsSaving(false)

    if (result.success) {
      toast.success('Profile updated successfully!')
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } else {
      setErrors({ currentPassword: result.message })
    }
  }

  const tabs = [
    { id: 'profile', label: 'My Profile' },
    { id: 'edit', label: 'Edit Profile' },
  ]

  const stats = [
    {
      label: 'Cart Items',
      value: cartCount,
      icon: ShoppingCart,
      color: 'primary',
    },
    {
      label: 'Total Spent',
      value: `$${cartTotal.toFixed(2)}`,
      icon: DollarSign,
      color: 'emerald',
    },
  ]

  const colorMap = {
    primary: 'bg-primary/10 text-primary-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Tabs */}
      <div className="flex gap-1 bg-dark-surface border border-slate-700/50 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── My Profile Tab ─────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-dark-surface border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.3),transparent_70%)]" />
            </div>

            {/* Avatar + info */}
            <div className="px-6 pb-6 -mt-14 relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-primary-700 border-4 border-dark-surface flex items-center justify-center shadow-xl mb-4">
                <span className="text-4xl font-bold text-white">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white">
                {currentUser?.name || 'User'}
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail size={15} />
                  {currentUser?.email || 'user@example.com'}
                </div>
                <span className="hidden sm:block text-slate-700">•</span>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar size={15} />
                  Member since {memberSince}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-dark-surface border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Edit Profile Tab ───────────────────────────── */}
      {activeTab === 'edit' && (
        <div className="bg-dark-surface border border-slate-700/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Pencil size={18} className="text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
              <p className="text-xs text-slate-500">Update your account information</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-dark-bg/80 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all ${
                    errors.name ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-dark-bg/80 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all ${
                    errors.email ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div className="border-t border-slate-700/50 my-2" />
            <p className="text-xs text-slate-500">
              Enter your current password to verify your identity. New password fields are optional.
            </p>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Current Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`w-full px-4 py-2.5 pr-11 bg-dark-bg/80 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all ${
                    errors.currentPassword ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1.5 text-xs text-red-400">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                New Password <span className="text-slate-600">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className={`w-full px-4 py-2.5 pr-11 bg-dark-bg/80 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all ${
                    errors.newPassword ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1.5 text-xs text-red-400">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm New Password */}
            {formData.newPassword && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter new password"
                    className={`w-full px-4 py-2.5 pr-11 bg-dark-bg/80 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all ${
                      errors.confirmPassword ? 'border-red-500/50' : 'border-slate-600/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>
                )}
                {formData.newPassword &&
                  formData.confirmPassword &&
                  formData.newPassword === formData.confirmPassword && (
                    <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> Passwords match
                    </p>
                  )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 active:scale-[0.98] text-sm"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl transition-all text-sm font-medium"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Profile
