import { useState } from 'react'
import { useApp } from '../context'
import { Button, TextField, PasswordField, Card, Modal, IconCheck, IconShield } from '../components/ui'
import type { SignupRole } from '../types'
import { TERMS_SECTIONS, PRIVACY_SECTIONS, type LegalSection } from '../content/legal'

const LOGO = () => (
  <div className="flex items-center justify-center gap-2 mb-8 cursor-pointer select-none">
    <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
      <span className="text-white font-bold text-base font-heading">B</span>
    </div>
    <span className="font-bold text-xl font-heading text-fg tracking-tight">Bhorosha</span>
  </div>
)

const AuthCard = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-bg flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <LOGO />
      <Card className="p-8 shadow-lg">{children}</Card>
    </div>
  </div>
)

// ── Role Select ────────────────────────────────────────────────────────────

export function RoleSelect() {
  const { navigate, setSignupRole } = useApp()
  const [selected, setSelected] = useState<SignupRole | null>(null)

  const handleContinue = () => {
    if (!selected) return
    setSignupRole(selected)
    navigate('signup')
  }

  return (
    <AuthCard>
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold font-heading text-fg mb-1">Join Bhorosha</h2>
        <p className="text-sm text-fg-muted">I am a…</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {(['student', 'teacher'] as SignupRole[]).map(r => (
          <button
            key={r}
            onClick={() => setSelected(r)}
            className={`relative rounded-2xl border-2 p-6 text-center transition-all ${
              selected === r ? 'border-brand bg-brand-tint' : 'border-line hover:border-brand/40 bg-surface'
            }`}
          >
            {selected === r && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center">
                <IconCheck className="w-3 h-3" />
              </span>
            )}
            <div className="text-4xl mb-3">{r === 'student' ? '🎓' : '👨‍🏫'}</div>
            <p className="font-semibold font-heading text-fg capitalize">{r}</p>
            <p className="text-xs text-fg-muted mt-1">
              {r === 'student' ? 'Browse & review courses' : 'Manage feedback & Q&A'}
            </p>
          </button>
        ))}
      </div>
      <Button className="w-full" disabled={!selected} onClick={handleContinue} size="lg">
        Continue as {selected ? selected : '…'}
      </Button>
      <p className="text-center text-sm text-fg-muted mt-4">
        Already have an account?{' '}
        <button onClick={() => navigate('login')} className="text-brand font-medium hover:underline">Log in</button>
      </p>
    </AuthCard>
  )
}

// ── Sign Up ────────────────────────────────────────────────────────────────

function emailPattern(role: SignupRole) {
  return role === 'student'
    ? /^u\d+@student\.cuet\.ac\.bd$/
    : /^u\d+@teacher\.cuet\.ac\.bd$/
}

function emailExample(role: SignupRole) {
  return role === 'student'
    ? 'u2204061@student.cuet.ac.bd'
    : 'u1001@teacher.cuet.ac.bd'
}

function emailFormatHint(role: SignupRole) {
  return role === 'student'
    ? 'Format: u{student ID}@student.cuet.ac.bd'
    : 'Format: u{staff ID}@teacher.cuet.ac.bd'
}

function LegalPreview({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
      {sections.map(section => (
        <div key={section.heading}>
          <h4 className="font-semibold text-sm text-fg mb-1.5">{section.heading}</h4>
          <div className="space-y-1.5">
            {section.body.map((p, i) => (
              <p key={i} className="text-xs text-fg-muted leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SignUp() {
  const { navigate, signupRole } = useApp()
  const role = signupRole ?? 'student'

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!emailPattern(role).test(form.email)) {
      errs.email = `Email must match ${role === 'student' ? 'u{ID}@student.cuet.ac.bd' : 'u{ID}@teacher.cuet.ac.bd'}`
    }
    if (form.password.length < 8) errs.password = 'At least 8 characters required'
    if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password) || !/[^A-Za-z0-9]/.test(form.password)) {
      errs.password = 'Must include upper, lower, number, and symbol'
    }
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    if (!agreed) errs.agreed = 'You must agree to the Terms of Service and Privacy Policy to continue'
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('otp') }, 1000)
  }

  return (
    <AuthCard>
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-tint text-brand text-xs font-semibold mb-3 capitalize">
          {role === 'student' ? '🎓' : '👨‍🏫'} {role} account
        </div>
        <h2 className="text-2xl font-bold font-heading text-fg">Create your account</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Full name"
          placeholder="Your full name"
          value={form.name}
          onChange={set('name')}
          error={errors.name}
        />
        <TextField
          label="University email"
          placeholder={emailExample(role)}
          value={form.email}
          onChange={set('email')}
          error={errors.email}
          hint={emailFormatHint(role)}
          type="email"
        />
        <PasswordField
          label="Password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          showStrength
        />
        <PasswordField
          label="Confirm password"
          placeholder="Re-enter password"
          value={form.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
        />
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-line accent-brand flex-shrink-0"
            />
            <span className="text-xs text-fg-muted leading-relaxed">
              I agree to the{' '}
              <button type="button" onClick={() => setLegalModal('terms')} className="text-brand font-medium hover:underline">Terms of Service</button>
              {' '}and{' '}
              <button type="button" onClick={() => setLegalModal('privacy')} className="text-brand font-medium hover:underline">Privacy Policy</button>
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-danger mt-1.5">{errors.agreed}</p>}
        </div>
        <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
          Create account
        </Button>
      </form>
      <div className="mt-5 text-center">
        <p className="text-sm text-fg-muted">
          <button onClick={() => navigate('role-select')} className="text-brand font-medium hover:underline">← Change role</button>
          {' · '}
          <button onClick={() => navigate('login')} className="text-brand font-medium hover:underline">Already have account?</button>
        </p>
      </div>

      <Modal open={legalModal === 'terms'} onClose={() => setLegalModal(null)} title="Terms of Service" width="max-w-lg">
        <LegalPreview sections={TERMS_SECTIONS} />
      </Modal>
      <Modal open={legalModal === 'privacy'} onClose={() => setLegalModal(null)} title="Privacy Policy" width="max-w-lg">
        <LegalPreview sections={PRIVACY_SECTIONS} />
      </Modal>
    </AuthCard>
  )
}

// ── OTP ────────────────────────────────────────────────────────────────────

export function OTPVerify() {
  const { navigate, signupRole, login } = useApp()
  const role = signupRole ?? 'student'
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const next = [...otp]
    next[i] = v.slice(-1)
    setOtp(next)
    if (v && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus()
    }
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus()
    }
  }

  const handleVerify = () => {
    if (otp.join('').length < 6) { setError('Please enter the full 6-digit code'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); login(role) }, 1200)
  }

  return (
    <AuthCard>
      <div className="text-center mb-7">
        <div className="w-14 h-14 rounded-2xl bg-brand-tint flex items-center justify-center text-2xl mx-auto mb-4">📬</div>
        <h2 className="text-2xl font-bold font-heading text-fg mb-1">Check your email</h2>
        <p className="text-sm text-fg-muted">We sent a 6-digit code to your university email. Enter it below to verify your account.</p>
      </div>
      <div className="flex gap-2 justify-center mb-6">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-11 h-12 text-center text-lg font-bold rounded-xl border-2 bg-surface text-fg outline-none transition-shadow focus:ring-2 focus:ring-brand/30 focus:border-brand ${error ? 'border-danger' : 'border-line'}`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-danger text-center mb-4">{error}</p>}
      <Button className="w-full" size="lg" loading={loading} onClick={handleVerify}>
        Verify email
      </Button>
      <p className="text-center text-sm text-fg-muted mt-4">
        Didn't receive it?{' '}
        <button className="text-brand font-medium hover:underline">Resend code</button>
      </p>
    </AuthCard>
  )
}

// ── Login ──────────────────────────────────────────────────────────────────

export function Login() {
  const { navigate, login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (email.includes('@student')) login('student')
      else if (email.includes('@teacher')) login('teacher')
      else if (email.includes('admin')) login('admin')
      else setError('No account found with this email address')
    }, 1000)
  }

  return (
    <AuthCard>
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold font-heading text-fg mb-1">Welcome back</h2>
        <p className="text-sm text-fg-muted">Sign in to your Bhorosha account</p>
      </div>
      {/* Demo role shortcuts */}
      <div className="bg-brand-tint rounded-xl p-3 mb-5 text-xs text-brand space-y-1">
        <p className="font-semibold mb-2">Demo — click to auto-fill:</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setEmail('u2204061@student.cuet.ac.bd'); setPassword('Pass@1234') }} className="px-2.5 py-1 rounded-lg bg-brand text-white font-medium hover:bg-brand-hover transition-colors">🎓 Student</button>
          <button onClick={() => { setEmail('u1001@teacher.cuet.ac.bd'); setPassword('Pass@1234') }} className="px-2.5 py-1 rounded-lg bg-brand text-white font-medium hover:bg-brand-hover transition-colors">👨‍🏫 Teacher</button>
          <button onClick={() => { setEmail('admin@cuet.ac.bd'); setPassword('Admin@1234') }} className="px-2.5 py-1 rounded-lg bg-danger text-white font-medium hover:bg-danger/90 transition-colors">🛡️ Admin</button>
        </div>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <TextField
          label="Email address"
          type="email"
          placeholder="your@email.cuet.ac.bd"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <PasswordField
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="text-right">
            <button type="button" onClick={() => navigate('forgot-password')} className="text-xs text-brand font-medium hover:underline">
              Forgot password?
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-danger bg-danger/10 px-3 py-2 rounded-lg">{error}</p>}
        <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
          Sign in
        </Button>
      </form>
      <p className="text-center text-sm text-fg-muted mt-5">
        Don't have an account?{' '}
        <button onClick={() => navigate('role-select')} className="text-brand font-medium hover:underline">Sign up</button>
      </p>
      <div className="mt-4 p-3 bg-anon-tint rounded-xl flex items-start gap-2">
        <IconShield className="w-3.5 h-3.5 text-anon flex-shrink-0 mt-0.5" />
        <p className="text-xs text-anon">Admin accounts use pre-provisioned credentials and have no self-signup flow.</p>
      </div>
    </AuthCard>
  )
}

// ── Forgot Password ────────────────────────────────────────────────────────

function passwordErrors(password: string, confirm: string) {
  const errs: Record<string, string> = {}
  if (password.length < 8) errs.password = 'At least 8 characters required'
  else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    errs.password = 'Must include upper, lower, number, and symbol'
  }
  if (password !== confirm) errs.confirm = 'Passwords do not match'
  return errs
}

export function ForgotPassword() {
  const { navigate } = useApp()
  const [step, setStep] = useState<'request' | 'otp' | 'reset' | 'done'>('request')

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({})

  const [loading, setLoading] = useState(false)

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const next = [...otp]
    next[i] = v.slice(-1)
    setOtp(next)
    if (otpError) setOtpError('')
    if (v && i < 5) document.getElementById(`reset-otp-${i + 1}`)?.focus()
  }

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById(`reset-otp-${i - 1}`)?.focus()
    }
  }

  const sendCode = () => {
    if (!/^[\w.+-]+@(student|teacher)\.cuet\.ac\.bd$/.test(email)) {
      setEmailError('Enter a valid CUET university email address')
      return
    }
    setEmailError('')
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('otp') }, 1000)
  }

  const verifyCode = () => {
    if (otp.join('').length < 6) { setOtpError('Please enter the full 6-digit code'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('reset') }, 1000)
  }

  const submitNewPassword = () => {
    const errs = passwordErrors(newPassword, confirmPassword)
    setResetErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('done') }, 1000)
  }

  if (step === 'done') return (
    <AuthCard>
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-2xl bg-accent-tint flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
        <h2 className="text-xl font-bold font-heading text-fg mb-2">Password updated!</h2>
        <p className="text-sm text-fg-muted mb-6">You can now log in with your new password.</p>
        <Button className="w-full" onClick={() => navigate('login')} size="lg">Go to login</Button>
      </div>
    </AuthCard>
  )

  return (
    <AuthCard>
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold font-heading text-fg mb-1">Reset password</h2>
        <p className="text-sm text-fg-muted">
          {step === 'request' && 'Enter your university email to receive a reset code.'}
          {step === 'otp' && 'Enter the 6-digit code sent to your email.'}
          {step === 'reset' && 'Enter your new password.'}
        </p>
      </div>
      {step === 'request' && (
        <div className="space-y-4">
          <TextField
            label="University email"
            type="email"
            placeholder="u2204061@student.cuet.ac.bd"
            value={email}
            onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
            error={emailError}
          />
          <Button className="w-full" size="lg" loading={loading} onClick={sendCode}>
            Send reset code
          </Button>
        </div>
      )}
      {step === 'otp' && (
        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`reset-otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className={`w-11 h-12 text-center text-lg font-bold rounded-xl border-2 bg-surface text-fg outline-none transition-shadow focus:ring-2 focus:ring-brand/30 focus:border-brand ${otpError ? 'border-danger' : 'border-line'}`}
              />
            ))}
          </div>
          {otpError && <p className="text-xs text-danger text-center">{otpError}</p>}
          <Button className="w-full" size="lg" loading={loading} onClick={verifyCode}>Verify code</Button>
          <p className="text-center text-sm text-fg-muted">
            Didn't receive it?{' '}
            <button type="button" onClick={sendCode} className="text-brand font-medium hover:underline">Resend code</button>
          </p>
        </div>
      )}
      {step === 'reset' && (
        <div className="space-y-4">
          <PasswordField
            label="New password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            error={resetErrors.password}
            showStrength
          />
          <PasswordField
            label="Confirm new password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={resetErrors.confirm}
          />
          <Button className="w-full" size="lg" loading={loading} onClick={submitNewPassword}>Set new password</Button>
        </div>
      )}
      <p className="text-center text-sm text-fg-muted mt-4">
        <button onClick={() => navigate('login')} className="text-brand font-medium hover:underline">← Back to login</button>
      </p>
    </AuthCard>
  )
}
