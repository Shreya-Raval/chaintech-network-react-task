import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-bg dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
          <AlertTriangle size={36} className="text-accent" />
        </div>
        <h1 className="text-7xl font-bold text-white mb-2">404</h1>
        <p className="text-xl font-semibold text-slate-300 mb-2">Page Not Found</p>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
        >
          <Home size={18} />
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
