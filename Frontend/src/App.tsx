import { AppProvider, useApp } from './context'
import Navbar from './components/Navbar'

import Landing from './pages/Landing'
import { RoleSelect, SignUp, OTPVerify, Login, ForgotPassword } from './pages/Auth'

import StudentDashboard from './pages/student/Dashboard'
import CourseDetail from './pages/student/CourseDetail'
import MyReviews from './pages/student/MyReviews'
import StudentProfile from './pages/student/Profile'

import TeacherDashboard from './pages/teacher/Dashboard'
import CourseFeedback from './pages/teacher/CourseFeedback'
import TeacherQA from './pages/teacher/QA'
import TeacherProfile from './pages/teacher/Profile'

import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminCourses from './pages/admin/Courses'
import AdminModeration from './pages/admin/Moderation'
import AdminAnalytics from './pages/admin/Analytics'
import AdminProfile from './pages/admin/Profile'

import { Terms, Privacy } from './pages/Legal'

const HIDE_NAVBAR: string[] = ['role-select', 'login', 'signup', 'otp', 'forgot-password']

function AppContent() {
  const { view } = useApp()

  const showNav = !HIDE_NAVBAR.includes(view)

  const renderView = () => {
    switch (view) {
      case 'landing':         return <Landing />
      case 'role-select':     return <RoleSelect />
      case 'signup':          return <SignUp />
      case 'otp':             return <OTPVerify />
      case 'login':           return <Login />
      case 'forgot-password': return <ForgotPassword />

      case 'student-dashboard':    return <StudentDashboard />
      case 'student-course-detail': return <CourseDetail />
      case 'student-my-reviews':   return <MyReviews />
      case 'student-profile':      return <StudentProfile />

      case 'teacher-dashboard':       return <TeacherDashboard />
      case 'teacher-course-feedback': return <CourseFeedback />
      case 'teacher-qa':             return <TeacherQA />
      case 'teacher-profile':        return <TeacherProfile />

      case 'admin-dashboard':  return <AdminDashboard />
      case 'admin-users':      return <AdminUsers />
      case 'admin-courses':    return <AdminCourses />
      case 'admin-moderation': return <AdminModeration />
      case 'admin-analytics':  return <AdminAnalytics />
      case 'admin-profile':    return <AdminProfile />

      case 'terms':   return <Terms />
      case 'privacy': return <Privacy />

      default: return <Landing />
    }
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      {showNav && <Navbar />}
      <main>{renderView()}</main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
