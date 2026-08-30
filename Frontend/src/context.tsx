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
const SIGNUP_ROLE_KEY = 'bhorosha_signup_role'
const PARAMS_KEY = 'bhorosha_nav_params'

const VALID_VIEWS: View[] = [
  'landing', 'role-select', 'login', 'signup', 'otp', 'forgot-password',
  'student-dashboard', 'student-course-detail', 'student-my-reviews', 'student-profile',
  'teacher-dashboard', 'teacher-course-feedback', 'teacher-qa', 'teacher-profile',
  'admin-dashboard', 'admin-users', 'admin-courses', 'admin-moderation', 'admin-analytics', 'admin-profile',
  'terms', 'privacy',
]

function allowedView(view: View, role: Role): View {
  const scope = view.split('-')[0]
  return ['student', 'teacher', 'admin'].includes(scope) && scope !== role ? 'landing' : view
}

function readSignupRole(): SignupRole | null {
  try {
    const stored = sessionStorage.getItem(SIGNUP_ROLE_KEY)
    return stored === 'student' || stored === 'teacher' ? stored : null
  } catch { return null }
}

function readNavParams(): NavParams | undefined {
  try {
    const stored = JSON.parse(sessionStorage.getItem(PARAMS_KEY) ?? 'null')
    return stored && typeof stored.tab === 'string' ? { tab: stored.tab } : undefined
  } catch { return undefined }
}

function readStoredView(): View {
  try {
    const stored = sessionStorage.getItem(VIEW_KEY)
    if (!VALID_VIEWS.includes(stored as View)) return 'landing'
    if ((stored === 'signup' || stored === 'otp') && !readSignupRole()) return 'role-select'
    return allowedView(stored as View, readStoredRole())
  } catch {
    return 'landing'
  }
}

function readStoredRole(): Role {
  try {
    const stored = sessionStorage.getItem(ROLE_KEY)
    return stored === 'student' || stored === 'teacher' || stored === 'admin' ? stored : 'guest'
  } catch {
    return 'guest'
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [role, setRole] = useState<Role>(() => readStoredRole())
  const [view, setView] = useState<View>(() => readStoredView())
  const [navParams, setNavParams] = useState<NavParams | undefined>(readNavParams)
  const [signupRole, setSignupRole] = useState<SignupRole | null>(readSignupRole)
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Persist view/role so a refresh doesn't drop the user back to the landing page.
  useEffect(() => {
    try {
      sessionStorage.setItem(VIEW_KEY, view)
      sessionStorage.setItem(ROLE_KEY, role)
      sessionStorage.setItem(PARAMS_KEY, JSON.stringify(navParams ?? null))
      if (signupRole) sessionStorage.setItem(SIGNUP_ROLE_KEY, signupRole)
      else sessionStorage.removeItem(SIGNUP_ROLE_KEY)
    } catch {
      // sessionStorage may be unavailable (e.g. private browsing) — safe to ignore.
    }
  }, [view, role, navParams, signupRole])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const navigate = (v: View, params?: NavParams) => {
    setView(allowedView(v, role))
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
    setNavParams(undefined)
    setSignupRole(null)
    if (r === 'student') setView('student-dashboard')
    else if (r === 'teacher') setView('teacher-dashboard')
    else if (r === 'admin') setView('admin-dashboard')
    else setView('landing')
  }

  const logout = () => {
    setRole('guest')
    setView('landing')
    setNavParams(undefined)
    setSignupRole(null)
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
