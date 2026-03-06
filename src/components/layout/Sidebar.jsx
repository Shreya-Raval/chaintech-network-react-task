import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: ShoppingBag },
  { to: '/cart', label: 'Cart', icon: ShoppingCart, showBadge: true },
  { to: '/profile', label: 'Profile', icon: User },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, currentUser } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose()
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary-400/30 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-600 dark:text-primary-300" />
            </div>
            <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
              Shop<span className="text-accent">Vault</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navLinks.map(({ to, label, icon: Icon, showBadge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/10 dark:bg-primary/15 text-primary-600 dark:text-primary-300 shadow-sm shadow-primary/5'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`
              }
            >
              <Icon size={19} className="shrink-0" />
              <span>{label}</span>
              {showBadge && cartCount > 0 && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-dark-bg text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section + Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700/50">
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {currentUser?.email || ''}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
