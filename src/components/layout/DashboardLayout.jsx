import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg font-sora transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area — offset by sidebar width on desktop */}
      <div className="lg:ml-60 min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content with page enter animation */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-page-enter">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
