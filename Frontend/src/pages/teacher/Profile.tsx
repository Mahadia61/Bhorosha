import { useState, useRef } from 'react'
import { useApp } from '../../context'
import { Card, Button, TextField, PasswordField, Toggle, PageHeader, Avatar } from '../../components/ui'

export default function TeacherProfile() {
  const { logout, user } = useApp()
  const [photo, setPhoto] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [toast, setToast] = useState('')

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => setPhoto(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const save = () => {
    setToast('Profile saved successfully')
    setTimeout(() => setToast(''), 2500)
  }

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields')
      return
    }
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordError('New password must be at least 8 characters and include upper, lower, number, and symbol')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match')
      return
    }
    setPasswordError('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setToast('Password updated successfully')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title="Teacher Profile" description="Manage your public profile and account settings" />

      {/* Photo Upload */}
      <Card className="p-6 mb-5">
        <h2 className="font-semibold font-heading text-fg mb-4">Profile Photo</h2>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {photo
              ? <img src={photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-brand" />
              : <Avatar name={user?.name ?? ''} size="xl" />
            }
          </div>
          <div className="flex-1">
            <div
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${drag ? 'border-brand bg-brand-tint' : 'border-line hover:border-brand/50 hover:bg-brand-tint/30'}`}
            >
              <div className="text-2xl mb-2">📷</div>
              <p className="text-sm font-medium text-fg mb-1">Drop a photo here or click to browse</p>
              <p className="text-xs text-fg-muted">PNG, JPG up to 5MB · Recommended: square, 400×400px</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            </div>
            {photo && (
              <button
                onClick={() => setPhoto(null)}
                className="mt-2 text-xs text-danger hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="p-6 mb-5">
        <h2 className="font-semibold font-heading text-fg mb-4">Personal Information</h2>
        <div className="space-y-4">
          <TextField label="Full name" value={user?.name ?? ''} disabled />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Title" />
            <TextField label="Department" value={user?.department ?? ''} disabled />
          </div>
          <TextField label="University email" value={user?.email ?? ''} disabled hint="Email cannot be changed" />
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={save}>Save profile</Button>
        </div>
        {toast && (
          <div className="mt-3 px-3 py-2 bg-accent-tint text-accent text-sm rounded-lg">✓ {toast}</div>
        )}
      </Card>

      {/* Public Profile Preview */}
      <Card className="p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold font-heading text-fg">Public Profile Preview</h2>
          <span className="text-xs text-fg-muted bg-line/50 px-2 py-1 rounded-lg">How students see you</span>
        </div>
        <div className="bg-bg rounded-xl border border-line p-4">
          <div className="flex items-center gap-4 mb-3">
            {photo
              ? <img src={photo} alt="" className="w-14 h-14 rounded-xl object-cover" />
              : <Avatar name="Teacher" size="lg" />
            }
            <div>
              <h3 className="font-semibold font-heading text-fg">Your public profile</h3>
            </div>
          </div>
          <p className="text-xs text-fg-muted">Your assigned courses and feedback summary will appear here.</p>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-6 mb-5">
        <h2 className="font-semibold font-heading text-fg mb-4">Change Password</h2>
        <div className="space-y-4">
          <PasswordField
            label="Current password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <PasswordField
            label="New password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            showStrength
          />
          <PasswordField
            label="Confirm new password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={passwordError}
          />
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={handleUpdatePassword}>Update password</Button>
        </div>
      </Card>

      {/* Logout */}
      <Card className="p-6">
        <h2 className="font-semibold font-heading text-fg mb-2">Session</h2>
        <p className="text-sm text-fg-muted mb-4">You are signed in as a teacher account.</p>
        <Button variant="outline" onClick={logout}>Log out</Button>
      </Card>
    </div>
  )
}
