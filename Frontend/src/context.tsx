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

export interface StudentReview {
  id: number
  course: string
  anonymous: boolean
  text: string
  ratings: Record<string, number>
  tags: string[]
  createdAt: string
}

export interface StudentQuestion {
  id: number
  course: string
  anonymous: boolean
  text: string
  createdAt: string
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
  moderationReports: ModerationReport[]
  addModerationReport: (report: Omit<ModerationReport, 'id'>) => void
  removeModerationReport: (id: number) => void
  studentReviews: StudentReview[]
  addStudentReview: (review: Omit<StudentReview, 'id' | 'createdAt'>) => void
  studentQuestions: StudentQuestion[]
  addStudentQuestion: (question: Omit<StudentQuestion, 'id' | 'createdAt'>) => void
  token: string | null
  user: CurrentUser | null
  authenticate: (token: string, user: CurrentUser) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const VIEW_KEY = 'bhorosha_view'
const ROLE_KEY = 'bhorosha_role'
const SIGNUP_ROLE_KEY = 'bhorosha_signup_role'
const PARAMS_KEY = 'bhorosha_nav_params'
const STUDENT_REVIEWS_KEY = 'bhorosha_student_reviews'
const STUDENT_QUESTIONS_KEY = 'bhorosha_student_questions'
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

function readStudentActivity<T>(key: string): T[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [role, setRole] = useState<Role>(() => readStoredRole())
  const [view, setView] = useState<View>(() => readStoredView())
  const [navParams, setNavParams] = useState<NavParams | undefined>(readNavParams)
  const [signupRole, setSignupRole] = useState<SignupRole | null>(readSignupRole)
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>([])
  const [studentReviews, setStudentReviews] = useState<StudentReview[]>(() => readStudentActivity<StudentReview>(STUDENT_REVIEWS_KEY))
  const [studentQuestions, setStudentQuestions] = useState<StudentQuestion[]>(() => readStudentActivity<StudentQuestion>(STUDENT_QUESTIONS_KEY))
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<CurrentUser | null>(() => readStudentActivity<CurrentUser>(USER_KEY)[0] ?? null)

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

  useEffect(() => {
    try {
      sessionStorage.setItem(STUDENT_REVIEWS_KEY, JSON.stringify(studentReviews))
      sessionStorage.setItem(STUDENT_QUESTIONS_KEY, JSON.stringify(studentQuestions))
    } catch {
      // Activity remains available for the current session if storage is unavailable.
    }
  }, [studentReviews, studentQuestions])

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

  const addStudentReview = (review: Omit<StudentReview, 'id' | 'createdAt'>) => {
    setStudentReviews(current => [{ ...review, id: Date.now(), createdAt: new Date().toISOString() }, ...current])
  }

  const addStudentQuestion = (question: Omit<StudentQuestion, 'id' | 'createdAt'>) => {
    setStudentQuestions(current => [{ ...question, id: Date.now(), createdAt: new Date().toISOString() }, ...current])
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
    setStudentReviews([])
    setStudentQuestions([])
    setToken(null)
    setUser(null)
    try {
      sessionStorage.removeItem(VIEW_KEY)
      sessionStorage.removeItem(ROLE_KEY)
      sessionStorage.removeItem(STUDENT_REVIEWS_KEY)
      sessionStorage.removeItem(STUDENT_QUESTIONS_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, role, view, navParams, navigate, login, logout, signupRole, setSignupRole, moderationReports, addModerationReport, removeModerationReport, studentReviews, addStudentReview, studentQuestions, addStudentQuestion, token, user, authenticate }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
