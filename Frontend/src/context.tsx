import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Theme, Role, View, SignupRole } from './types'

export interface NavParams {
  tab?: string
}

export interface ModerationReport {
  id: number
  course: string
  anon: boolean
  preview: string
  reason: string
}

interface AppContextValue {
  theme: Theme
  toggleTheme: () => void
  role: Role
  view: View
  navParams: NavParams | undefined
  navigate: (view: View, params?: NavParams) => void
  login: (role: Role) => void
  logout: () => void
  signupRole: SignupRole | null
  setSignupRole: (role: SignupRole) => void
  moderationReports: ModerationReport[]
  addModerationReport: (report: Omit<ModerationReport, 'id'>) => void
  removeModerationReport: (id: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const VIEW_KEY = 'bhorosha_view'
const ROLE_KEY = 'bhorosha_role'

function readStoredView(): View {
  try {
    const stored = sessionStorage.getItem(VIEW_KEY)
    return (stored as View) || 'landing'
  } catch {
    return 'landing'
  }
}

function readStoredRole(): Role {
  try {
    const stored = sessionStorage.getItem(ROLE_KEY)
    return (stored as Role) || 'guest'
  } catch {
    return 'guest'
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [role, setRole] = useState<Role>(() => readStoredRole())
  const [view, setView] = useState<View>(() => readStoredView())
  const [navParams, setNavParams] = useState<NavParams | undefined>(undefined)
  const [signupRole, setSignupRole] = useState<SignupRole | null>(null)
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Persist view/role so a refresh doesn't drop the user back to the landing page.
  useEffect(() => {
    try {
      sessionStorage.setItem(VIEW_KEY, view)
      sessionStorage.setItem(ROLE_KEY, role)
    } catch {
      // sessionStorage may be unavailable (e.g. private browsing) — safe to ignore.
    }
  }, [view, role])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const navigate = (v: View, params?: NavParams) => {
    setView(v)
    setNavParams(params)
  }

  const addModerationReport = (report: Omit<ModerationReport, 'id'>) => {
    setModerationReports(current => [...current, { ...report, id: Date.now() }])
  }

  const removeModerationReport = (id: number) => {
    setModerationReports(current => current.filter(report => report.id !== id))
  }

  const login = (r: Role) => {
    setRole(r)
    if (r === 'student') setView('student-dashboard')
    else if (r === 'teacher') setView('teacher-dashboard')
    else if (r === 'admin') setView('admin-dashboard')
  }

  const logout = () => {
    setRole('guest')
    setView('landing')
    setNavParams(undefined)
    try {
      sessionStorage.removeItem(VIEW_KEY)
      sessionStorage.removeItem(ROLE_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, role, view, navParams, navigate, login, logout, signupRole, setSignupRole, moderationReports, addModerationReport, removeModerationReport }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
