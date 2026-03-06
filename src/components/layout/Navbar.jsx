import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, Clock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getSessionTimeRemaining } from '../../utils/localStorage'

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/cart': 'Shopping Cart',
  '/profile': 'Profile',
}

const Navbar = ({ onToggleSidebar }) => {
  const { currentUser } = useAuth()
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(getSessionTimeRemaining())

  // Session countdown timer — update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getSessionTimeRemaining())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Toggle dark/light class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const pageTitle = routeTitles[location.pathname] || 'ShopVault'

  // Format time remaining as M:SS
  const formatTime = (ms) => {
    if (ms <= 0) return '0:00'
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isLowTime = timeRemaining < 60 * 1000 // Under 1 minute

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-800 border-b border-slate-700/50 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Session countdown */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isLowTime
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-slate-700/50 border border-slate-600/30 text-slate-400'
            }`}
          >
            <Clock size={13} className={isLowTime ? 'animate-pulse' : ''} />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          {/* Dark/Light toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white text-sm font-bold cursor-default" title={currentUser?.name || 'User'}>
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
