import { Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Layout
import ProtectedRoute from './components/layout/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg font-sora transition-colors duration-300">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — wrapped in DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Products />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Cart />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
