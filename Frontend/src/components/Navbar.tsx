import { useState } from 'react'
import { useApp } from '../context'
import {
  ThemeToggle, Avatar, IconBell, IconSearch, IconShield,
  IconUser, IconSettings, IconLogOut, IconBook, IconMessage,
  IconBarChart, IconUsers, IconChevronDown
} from './ui'
import type { View } from '../types'

const LOGO = () => (
  <div className="flex items-center gap-2 cursor-pointer select-none" >
    <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
      <span className="text-white font-bold text-sm font-heading">B</span>
    </div>
    <span className="font-bold text-lg font-heading text-fg tracking-tight">Bhorosha</span>
  </div>
)

function NavLink({ label, view, current, onClick }: { label: string; view: View; current: string; onClick: (v: View) => void }) {
  const active = current === view
  return (
    <button
      onClick={() => onClick(view)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-tint text-brand' : 'text-fg-muted hover:text-fg hover:bg-line/40'}`}
    >
      {label}
    </button>
  )
}

function ProfileDropdown({ name, onLogout, navigate }: { name: string; onLogout: () => void; navigate: (v: View) => void }) {
  const [open, setOpen] = useState(false)
  const { role } = useApp()

  const menuItems: { label: string; view?: View; action?: () => void; icon: React.ReactNode }[] = role === 'admin'
    ? [
        { label: 'Profile & Settings', view: 'admin-profile', icon: <IconSettings className="w-3.5 h-3.5" /> },
        { label: 'Logout', action: onLogout, icon: <IconLogOut className="w-3.5 h-3.5" /> },
      ]
    : role === 'teacher'
    ? [
        { label: 'Profile & Settings', view: 'teacher-profile', icon: <IconUser className="w-3.5 h-3.5" /> },
        { label: 'Logout', action: onLogout, icon: <IconLogOut className="w-3.5 h-3.5" /> },
      ]
    : [
        { label: 'Profile & Settings', view: 'student-profile', icon: <IconUser className="w-3.5 h-3.5" /> },
        { label: 'Logout', action: onLogout, icon: <IconLogOut className="w-3.5 h-3.5" /> },
      ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-line/40 transition-colors"
      >
        <Avatar name={name} size="sm" />
        <span className="text-sm font-medium text-fg hidden sm:block">{name.split(' ')[0]}</span>
        <IconChevronDown className={`text-fg-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface border border-line rounded-xl shadow-lg z-40 py-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-line mb-1">
              <p className="text-xs font-semibold text-fg">{name}</p>
              <p className="text-xs text-fg-muted capitalize">{role}</p>
            </div>
            {menuItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false)
                  if (item.action) item.action()
                  else if (item.view) navigate(item.view as View)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-fg hover:bg-line/40 transition-colors text-left"
              >
                <span className="text-fg-muted">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Navbar() {
  const { role, view, navigate, login, logout, theme, toggleTheme } = useApp()
  const [searchQ, setSearchQ] = useState('')

  const handleLogoClick = () => {
    if (role === 'guest') navigate('landing')
    else if (role === 'student') navigate('student-dashboard')
    else if (role === 'teacher') navigate('teacher-dashboard')
    else navigate('admin-dashboard')
  }

  if (role === 'guest') {
    return (
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div onClick={handleLogoClick}><LOGO /></div>
          <nav className="flex items-center gap-1">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button onClick={() => navigate('login')} className="px-3 py-1.5 text-sm font-medium text-fg-muted hover:text-fg transition-colors">Log in</button>
            <button
              onClick={() => navigate('role-select')}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors"
            >
              Sign up
            </button>
          </nav>
        </div>
      </header>
    )
  }

  if (role === 'admin') {
    const adminLinks: { label: string; icon: React.ReactNode; view: View }[] = [
      { label: 'Dashboard', icon: <IconBarChart className="w-4 h-4" />, view: 'admin-dashboard' },
      { label: 'Users', icon: <IconUsers className="w-4 h-4" />, view: 'admin-users' },
      { label: 'Courses', icon: <IconBook className="w-4 h-4" />, view: 'admin-courses' },
      { label: 'Moderation', icon: <IconShield className="w-4 h-4" />, view: 'admin-moderation' },
      { label: 'Analytics', icon: <IconBarChart className="w-4 h-4" />, view: 'admin-analytics' },
    ]
    return (
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <div onClick={handleLogoClick} className="cursor-pointer"><LOGO /></div>
          <span className="px-2 py-0.5 rounded-md bg-danger/15 text-danger text-xs font-semibold">ADMIN</span>
          <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-hide">
            {adminLinks.map(l => (
              <button
                key={l.view}
                onClick={() => navigate(l.view)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${view === l.view ? 'bg-brand-tint text-brand' : 'text-fg-muted hover:text-fg hover:bg-line/40'}`}
              >
                {l.icon}{l.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1 flex-shrink-0">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <ProfileDropdown name="Admin" onLogout={logout} navigate={navigate} />
          </div>
        </div>
      </header>
    )
  }

  if (role === 'teacher') {
    return (
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <div onClick={handleLogoClick} className="cursor-pointer"><LOGO /></div>
          <nav className="flex items-center gap-0.5 flex-1">
            <NavLink label="My Courses" view="teacher-dashboard" current={view} onClick={navigate} />
            <NavLink label="Feedback" view="teacher-course-feedback" current={view} onClick={navigate} />
            <NavLink label="Q&A" view="teacher-qa" current={view} onClick={navigate} />
          </nav>
          <div className="flex items-center gap-1">
            <button className="relative p-2 rounded-lg hover:bg-line/40 text-fg-muted hover:text-fg transition-colors">
              <IconBell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <ProfileDropdown name="Dr. Teacher" onLogout={logout} navigate={navigate} />
          </div>
        </div>
      </header>
    )
  }

  // Student
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <div onClick={handleLogoClick} className="cursor-pointer flex-shrink-0"><LOGO /></div>
        <div className="flex-1 max-w-sm hidden sm:block">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted w-4 h-4" />
            <input
              type="search"
              placeholder="Search courses, professors…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-line bg-bg text-sm text-fg placeholder-fg-muted outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-shadow"
            />
          </div>
        </div>
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          <NavLink label="Dashboard" view="student-dashboard" current={view} onClick={navigate} />
          <NavLink label="My Reviews" view="student-my-reviews" current={view} onClick={navigate} />
        </nav>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="relative p-2 rounded-lg hover:bg-line/40 text-fg-muted hover:text-fg transition-colors">
            <IconBell />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <ProfileDropdown name="Student" onLogout={logout} navigate={navigate} />
        </div>
      </div>
    </header>
  )
}
