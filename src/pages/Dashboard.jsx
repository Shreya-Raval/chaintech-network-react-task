import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  UserCheck,
  ArrowRight,
  Package,
  UserCog,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getSessionTimeRemaining } from '../utils/localStorage'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const { cartItems, cartTotal, cartCount } = useCart()
  const [timeRemaining, setTimeRemaining] = useState(getSessionTimeRemaining())

  // Update session countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getSessionTimeRemaining())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (ms) => {
    if (ms <= 0) return '0:00'
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isLowTime = timeRemaining < 60 * 1000

  // Today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Profile completeness (simple check — name + email = 100%)
  const profileCompleteness = currentUser?.name && currentUser?.email ? 100 : 50

  // Stats cards data
  const stats = [
    {
      label: 'Total Products',
      value: '24',
      icon: ShoppingBag,
      gradient: 'from-primary-600 to-primary-900',
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary-300',
    },
    {
      label: 'Cart Items',
      value: cartCount.toString(),
      icon: ShoppingCart,
      gradient: 'from-accent-600 to-amber-900',
      iconBg: 'bg-accent/20',
      iconColor: 'text-accent-300',
    },
    {
      label: 'Cart Total',
      value: `$${cartTotal.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-emerald-600 to-emerald-900',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-300',
    },
    {
      label: 'Profile Complete',
      value: `${profileCompleteness}%`,
      icon: UserCheck,
      gradient: 'from-violet-600 to-violet-900',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-300',
    },
  ]

  // Quick actions
  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Explore our curated product collection',
      icon: Package,
      to: '/products',
      color: 'primary',
    },
    {
      title: 'View Cart',
      description: 'Review items and checkout',
      icon: ShoppingCart,
      to: '/cart',
      color: 'accent',
    },
    {
      title: 'Edit Profile',
      description: 'Update your account details',
      icon: UserCog,
      to: '/profile',
      color: 'violet',
    },
  ]

  const colorMap = {
    primary: {
      border: 'border-primary/20',
      hoverBorder: 'hover:border-primary/40',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary-400',
      arrow: 'text-primary-400',
    },
    accent: {
      border: 'border-accent/20',
      hoverBorder: 'hover:border-accent/40',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent-400',
      arrow: 'text-accent-400',
    },
    violet: {
      border: 'border-violet-500/20',
      hoverBorder: 'hover:border-violet-500/40',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
      arrow: 'text-violet-400',
    },
  }

  // Recently added to cart (last 3)
  const recentCartItems = cartItems.slice(-3).reverse()

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900/80 via-primary-800/60 to-dark-surface border border-primary/20 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {currentUser?.name || 'User'} 👋
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">{today}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.gradient} border border-white/5 p-5 group hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.iconColor} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added to Cart */}
        <div className="lg:col-span-2 bg-dark-surface border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recently Added to Cart</h2>
            {recentCartItems.length > 0 && (
              <Link
                to="/cart"
                className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {recentCartItems.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                <ShoppingCart size={28} className="text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">Your cart is empty</p>
              <p className="text-slate-500 text-sm mt-1">Browse products and add items to your cart</p>
              <Link
                to="/products"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary-400 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <Package size={16} />
                Browse Products
              </Link>
            </div>
          ) : (
            /* Cart items */
            <div className="space-y-3">
              {recentCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                    <Package size={20} className="text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-white shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-surface border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              const colors = colorMap[action.color]
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${colors.border} ${colors.hoverBorder} bg-slate-800/30 hover:bg-slate-800/60 transition-all duration-200 group`}
                >
                  <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={colors.iconColor} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200">{action.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                  </div>
                  <ArrowRight size={16} className={`${colors.arrow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Session Info Banner */}
      <div
        className={`rounded-xl border p-4 flex items-center gap-3 transition-colors ${
          isLowTime
            ? 'bg-red-500/5 border-red-500/20'
            : 'bg-slate-800/30 border-slate-700/30'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isLowTime ? 'bg-red-500/10' : 'bg-primary/10'
          }`}
        >
          <Clock
            size={18}
            className={`${isLowTime ? 'text-red-400 animate-pulse' : 'text-primary-400'}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-300">Session Active</p>
          <p className={`text-xs mt-0.5 ${isLowTime ? 'text-red-400' : 'text-slate-500'}`}>
            {isLowTime
              ? `Session expires in ${formatTime(timeRemaining)} — save your work!`
              : `Your session will expire in ${formatTime(timeRemaining)}`}
          </p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
            isLowTime
              ? 'bg-red-500/10 text-red-400'
              : 'bg-primary/10 text-primary-400'
          }`}
        >
          {formatTime(timeRemaining)}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
