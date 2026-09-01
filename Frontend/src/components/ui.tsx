import { useState, type ReactNode, type InputHTMLAttributes } from 'react'

// ── Icons (inline SVG) ─────────────────────────────────────────────────────

export function IconStar({ filled, className = '' }: { filled?: boolean; className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

export function IconEye({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function IconEyeOff({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export function IconLock({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function IconBell({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function IconSearch({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function IconSun({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export function IconMoon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function IconX({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function IconCheck({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function IconChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function IconUser({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function IconThumbUp({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

export function IconFlag({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

export function IconEdit({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export function IconTrash({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export function IconPlus({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export function IconFilter({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

export function IconShield({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export function IconBarChart({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

export function IconMessage({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function IconUsers({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function IconBook({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

export function IconSettings({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function IconLogOut({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function IconTrendingUp({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

export function IconAlertTriangle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

// ── Theme Toggle ───────────────────────────────────────────────────────────

export function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  const dark = theme === 'dark'
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-brand-tint text-fg-muted hover:text-brand transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? <IconSun /> : <IconMoon />}
    </button>
  )
}

// ── Star Rating ────────────────────────────────────────────────────────────

export function StarRating({ value, max = 5, onRate, size = 16 }: {
  value: number
  max?: number
  onRate?: (v: number) => void
  size?: number
}) {
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? value
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(i => (
        <button
          key={i}
          onClick={() => onRate?.(i)}
          onMouseEnter={() => onRate && setHover(i)}
          onMouseLeave={() => onRate && setHover(null)}
          disabled={!onRate}
          style={{ width: size, height: size, cursor: onRate ? 'pointer' : 'default' }}
          className={`text-warning transition-colors ${i <= display ? 'opacity-100' : 'opacity-25'}`}
        >
          <IconStar filled={i <= display} className="w-full h-full" />
        </button>
      ))}
    </div>
  )
}

export function StarDisplay({ value, showText = true }: { value: number; showText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-warning">
        <IconStar filled className="inline w-3.5 h-3.5" />
      </span>
      <span className="text-sm font-semibold text-fg">{value.toFixed(1)}</span>
      {showText && <span className="text-xs text-fg-muted">/ 5</span>}
    </span>
  )
}

// ── Anonymous Badge ────────────────────────────────────────────────────────

export function AnonBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-anon-tint text-anon ${className}`}>
      <IconLock className="w-2.5 h-2.5" />
      Anonymous
    </span>
  )
}

// ── Status Chips ───────────────────────────────────────────────────────────

type StatusType = 'pending' | 'approved' | 'rejected' | 'answered' | 'unanswered' | 'active' | 'suspended'

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending:     { label: 'Pending',     className: 'bg-warning/15 text-warning' },
  approved:    { label: 'Approved',    className: 'bg-accent-tint text-accent' },
  rejected:    { label: 'Rejected',    className: 'bg-danger/15 text-danger' },
  answered:    { label: 'Answered',    className: 'bg-accent-tint text-accent' },
  unanswered:  { label: 'Unanswered', className: 'bg-line/80 text-fg-muted' },
  active:      { label: 'Active',      className: 'bg-accent-tint text-accent' },
  suspended:   { label: 'Suspended',  className: 'bg-danger/15 text-danger' },
}

export function StatusChip({ status }: { status: StatusType }) {
  const { label, className } = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

// ── Tag Pill ───────────────────────────────────────────────────────────────

export function TagPill({ label, onRemove, onClick, selected }: {
  label: string
  onRemove?: () => void
  onClick?: () => void
  selected?: boolean
}) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
        selected
          ? 'bg-brand text-white'
          : 'bg-brand-tint text-brand hover:bg-brand/20'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {label}
      {onRemove && (
        <button onClick={e => { e.stopPropagation(); onRemove() }} className="ml-0.5 hover:opacity-70">
          <IconX className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  )
}

// ── Avatar ─────────────────────────────────────────────────────────────────

export function Avatar({ name, src, size = 'md' }: { name: string; src?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-20 h-20 text-2xl' }
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover flex-shrink-0`} />
  return (
    <div className={`${sizes[size]} rounded-full bg-brand text-white font-semibold flex items-center justify-center flex-shrink-0 select-none`}>
      {initials}
    </div>
  )
}

// ── Password Field ─────────────────────────────────────────────────────────

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  showStrength?: boolean
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return { score, label: 'Weak', color: 'bg-danger' }
  if (score === 3) return { score, label: 'Fair', color: 'bg-warning' }
  if (score === 4) return { score, label: 'Good', color: 'bg-accent' }
  return { score, label: 'Strong', color: 'bg-brand' }
}

export function PasswordField({ label, error, showStrength, value = '', onChange, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const pw = String(value)
  const strength = passwordStrength(pw)
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-fg">{label}</label>}
      <div className="relative">
        <input
          {...props}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-surface text-fg pr-10 outline-none transition-shadow focus:ring-2 focus:ring-brand/30 focus:border-brand ${error ? 'border-danger' : 'border-line'}`}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
        >
          {visible ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
      {showStrength && pw.length > 0 && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-line'}`} />
            ))}
          </div>
          <p className={`text-xs ${strength.score <= 2 ? 'text-danger' : strength.score === 3 ? 'text-warning' : 'text-accent'}`}>
            {strength.label} password
          </p>
        </div>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

// ── Text Field ─────────────────────────────────────────────────────────────

export function TextField({ label, error, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-fg">{label}</label>}
      <input
        {...props}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-surface text-fg outline-none transition-shadow focus:ring-2 focus:ring-brand/30 focus:border-brand ${error ? 'border-danger' : 'border-line'} ${props.className ?? ''}`}
      />
      {hint && !error && <p className="text-xs text-fg-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

// ── Select Field ───────────────────────────────────────────────────────────

export function SelectField({ label, error, children, className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-fg">{label}</label>}
      <div className="relative">
        <select
          {...props}
          className={`w-full appearance-none rounded-lg border py-2.5 pl-3 pr-10 text-sm leading-5 bg-surface text-fg outline-none transition-shadow focus:ring-2 focus:ring-brand/30 focus:border-brand ${error ? 'border-danger' : 'border-line'} ${className}`}
        >
          {children}
        </select>
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted">
          <path d="m5.5 7.5 4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

// ── Button ─────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'

export function Button({
  variant = 'primary', size = 'md', loading, children, className = '', ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: 'sm' | 'md' | 'lg'; loading?: boolean }) {
  const variants: Record<ButtonVariant, string> = {
    primary:   'bg-brand text-white hover:bg-brand-hover shadow-sm',
    secondary: 'bg-brand-tint text-brand hover:bg-brand/20',
    ghost:     'text-fg-muted hover:bg-line/50 hover:text-fg',
    danger:    'bg-danger text-white hover:bg-danger/90',
    outline:   'border border-line text-fg hover:bg-line/30',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-xl border border-line shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md hover:border-brand/30 transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children, width = 'max-w-lg' }: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  width?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-surface rounded-2xl border border-line shadow-xl w-full ${width} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h3 className="font-semibold text-lg text-fg">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-line/50 text-fg-muted hover:text-fg"><IconX /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ── Toggle Switch ──────────────────────────────────────────────────────────

export function Toggle({ checked, onChange, label, hint }: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  hint?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors ${checked ? 'bg-brand' : 'bg-line'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      {(label || hint) && (
        <div>
          {label && <p className="text-sm font-medium text-fg leading-tight">{label}</p>}
          {hint && <p className="text-xs text-fg-muted mt-0.5">{hint}</p>}
        </div>
      )}
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
      {icon && <div className="w-16 h-16 rounded-2xl bg-brand-tint flex items-center justify-center text-brand">{icon}</div>}
      <div>
        <h3 className="font-semibold text-fg mb-1">{title}</h3>
        {description && <p className="text-sm text-fg-muted max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-line/60 ${className}`} />
}

export function SkeletonCard() {
  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </Card>
  )
}

// ── Toast ──────────────────────────────────────────────────────────────────

export function Toast({ message, type = 'success', onDismiss }: {
  message: string
  type?: 'success' | 'error' | 'info'
  onDismiss: () => void
}) {
  const styles = {
    success: 'bg-accent-tint border-accent text-accent',
    error:   'bg-danger/10 border-danger text-danger',
    info:    'bg-brand-tint border-brand text-brand',
  }
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${styles[type]}`}>
      {type === 'success' && <IconCheck />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onDismiss} className="ml-1 opacity-70 hover:opacity-100"><IconX className="w-3.5 h-3.5" /></button>
    </div>
  )
}

// ── Rating Bar Chart ───────────────────────────────────────────────────────

export function RatingBreakdown({ counts }: { counts: [number, number, number, number, number] }) {
  const total = counts.reduce((a, b) => a + b, 0)
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map(star => {
        const count = counts[star - 1]
        const pct = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={star} className="flex items-center gap-2">
            <span className="text-xs text-fg-muted w-4 text-right">{star}</span>
            <IconStar filled className="w-3 h-3 text-warning" />
            <div className="flex-1 h-2 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-warning rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-fg-muted w-5">{count}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── KPI Card ───────────────────────────────────────────────────────────────

export function KpiCard({ label, value, sub, icon, color = 'brand' }: {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  color?: 'brand' | 'accent' | 'warning' | 'danger' | 'anon'
}) {
  const colors: Record<string, string> = {
    brand:   'bg-brand-tint text-brand',
    accent:  'bg-accent-tint text-accent',
    warning: 'bg-warning/15 text-warning',
    danger:  'bg-danger/15 text-danger',
    anon:    'bg-anon-tint text-anon',
  }
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-fg-muted mb-1">{label}</p>
          <p className="text-2xl font-bold font-heading text-fg">{value}</p>
          {sub && <p className="text-xs text-fg-muted mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

// ── Page Shell ─────────────────────────────────────────────────────────────

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-fg">{title}</h1>
        {description && <p className="text-sm text-fg-muted mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-line mb-6">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${active === t ? 'text-brand border-brand' : 'text-fg-muted border-transparent hover:text-fg'}`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

export function SearchBar({ placeholder = 'Search…', value, onChange }: {
  placeholder?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-line bg-surface text-sm text-fg placeholder-fg-muted outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-shadow"
      />
    </div>
  )
}

// ── Textarea ───────────────────────────────────────────────────────────────

export function Textarea({ label, error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-fg">{label}</label>}
      <textarea
        {...props}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-surface text-fg resize-none outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-shadow ${error ? 'border-danger' : 'border-line'} ${props.className ?? ''}`}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

// ── Divider ────────────────────────────────────────────────────────────────

export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-line my-4" />
  return (
    <div className="flex items-center gap-3 my-4">
      <hr className="flex-1 border-line" />
      <span className="text-xs text-fg-muted">{label}</span>
      <hr className="flex-1 border-line" />
    </div>
  )
}
