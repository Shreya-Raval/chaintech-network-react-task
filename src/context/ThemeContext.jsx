import { createContext, useState, useEffect, useContext } from 'react'

const THEME_KEY = 'shopvault_theme'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY)
    return stored ? stored === 'dark' : true // default to dark
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleTheme = () => setDarkMode((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
