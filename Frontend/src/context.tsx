import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Theme, Role, View, SignupRole } from './types'

interface AppContextValue {
  theme: Theme
  toggleTheme: () => void
  role: Role
  view: View
  navigate: (view: View) => void
  login: (role: Role) => void
  logout: () => void
  signupRole: SignupRole | null
  setSignupRole: (role: SignupRole) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [role, setRole] = useState<Role>('guest')
  const [view, setView] = useState<View>('landing')
  const [signupRole, setSignupRole] = useState<SignupRole | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const navigate = (v: View) => setView(v)

  const login = (r: Role) => {
    setRole(r)
    if (r === 'student') setView('student-dashboard')
    else if (r === 'teacher') setView('teacher-dashboard')
    else if (r === 'admin') setView('admin-dashboard')
  }

  const logout = () => {
    setRole('guest')
    setView('landing')
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, role, view, navigate, login, logout, signupRole, setSignupRole }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
