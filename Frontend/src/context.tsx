import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Theme, Role, View, SignupRole } from './types'

export interface NavParams {
  tab?: string
  courseId?: string
}

export interface CurrentUser { _id: string; name: string; email: string; role: Role; department?: string }

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
  token: string | null
  user: CurrentUser | null
  authenticate: (token: string, user: CurrentUser) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const VIEW_KEY = 'bhorosha_view'
const ROLE_KEY = 'bhorosha_role'
const SIGNUP_ROLE_KEY = 'bhorosha_signup_role'
const PARAMS_KEY = 'bhorosha_nav_params'
const TOKEN_KEY = 'bhorosha_token'
const USER_KEY = 'bhorosha_user'

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
    return stored && (typeof stored.tab === 'string' || typeof stored.courseId === 'string') ? { tab: stored.tab, courseId: stored.courseId } : undefined
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
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<CurrentUser | null>(() => {
  try {
    const stored = sessionStorage.getItem(USER_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed[0] ?? null : parsed
  } catch {
    return null
  }
})

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

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

  const login = (r: Role) => {
    setRole(r)
    setNavParams(undefined)
    setSignupRole(null)
    if (r === 'student') setView('student-dashboard')
    else if (r === 'teacher') setView('teacher-dashboard')
    else if (r === 'admin') setView('admin-dashboard')
    else setView('landing')
  }

  const authenticate = (nextToken: string, nextUser: CurrentUser) => {
    setToken(nextToken)
    setUser(nextUser)
    try { sessionStorage.setItem(TOKEN_KEY, nextToken); sessionStorage.setItem(USER_KEY, JSON.stringify([nextUser])) } catch { /* ignore */ }
    login(nextUser.role)
  }

  const logout = () => {
    setRole('guest')
    setView('landing')
    setNavParams(undefined)
    setSignupRole(null)
    setToken(null)
    setUser(null)
    try {
      sessionStorage.removeItem(VIEW_KEY)
      sessionStorage.removeItem(ROLE_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, role, view, navParams, navigate, login, logout, signupRole, setSignupRole, token, user, authenticate }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
