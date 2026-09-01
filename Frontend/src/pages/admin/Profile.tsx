import { useState } from 'react'
import { useApp } from '../../context'
import { Card, Button, TextField, PasswordField, Toggle, PageHeader, Avatar } from '../../components/ui'

export default function AdminProfile() {
  const { logout, user } = useApp()
  const [toast, setToast] = useState('')
  const [notifyReports, setNotifyReports] = useState(true)
  const [notifyDigest, setNotifyDigest] = useState(false)

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
      <PageHeader title="Profile & Settings" description="Manage your administrator account and notification preferences" />

      {/* Personal Info */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <Avatar name={user?.name ?? ''} size="xl" />
          <div>
            <p className="font-semibold font-heading text-fg">{user?.name}</p>
            <p className="text-sm text-fg-muted">Platform administrator</p>
          </div>
        </div>
        <div className="space-y-4">
          <TextField label="Full name" placeholder="Your full name" value={user?.name ?? ''} disabled />
          <TextField label="University email" value={user?.email ?? ''} disabled hint="Email cannot be changed" />
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={save}>Save profile</Button>
        </div>
        {toast && (
          <div className="mt-3 px-3 py-2 bg-accent-tint text-accent text-sm rounded-lg">✓ {toast}</div>
        )}
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 mb-5">
        <h2 className="font-semibold font-heading text-fg mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <Toggle
            checked={notifyReports}
            onChange={setNotifyReports}
            label="New content reports"
            hint="Get notified when a review or question is flagged for moderation"
          />
          <Toggle
            checked={notifyDigest}
            onChange={setNotifyDigest}
            label="Weekly analytics digest"
            hint="Receive a weekly summary of platform activity by email"
          />
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
        <p className="text-sm text-fg-muted mb-4">You are signed in as an administrator account.</p>
        <Button variant="outline" onClick={logout}>Log out</Button>
      </Card>
    </div>
  )
}
