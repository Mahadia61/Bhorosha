import { useState } from 'react'
import { useApp } from '../../context'
import { Card, Button, TextField, PasswordField, Toggle, PageHeader, Divider } from '../../components/ui'
import { Avatar } from '../../components/ui'

export default function StudentProfile() {
  const { logout, navigate } = useApp()
  const [defaultAnon, setDefaultAnon] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [toast, setToast] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordToast, setPasswordToast] = useState(false)

  const handleSave = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

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
    setPasswordToast(true)
    setTimeout(() => setPasswordToast(false), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title="Profile & Settings" description="Manage your account preferences" />

      {/* Avatar */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-4">
          <Avatar name="Student" size="xl" />
          <div>
            <h3 className="font-semibold font-heading text-fg text-lg">Student account</h3>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="p-6 mb-5">
        <h2 className="font-semibold font-heading text-fg mb-4">Personal Information</h2>
        <div className="space-y-4">
          <TextField label="Full name" placeholder="Your full name" />
          <TextField label="University email" placeholder="Your university email" disabled hint="Email cannot be changed" />
          <TextField label="Department" disabled />
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={handleSave}>Save changes</Button>
        </div>
        {toast && (
          <div className="mt-3 px-3 py-2 bg-accent-tint text-accent text-sm rounded-lg">
            ✓ Profile saved successfully
          </div>
        )}
      </Card>

      {/* Anonymity */}
      <Card className="p-6 mb-5">
        <h2 className="font-semibold font-heading text-fg mb-4">Anonymity Preferences</h2>
        <div className="space-y-4">
          <Toggle
            checked={defaultAnon}
            onChange={setDefaultAnon}
            label="Default to anonymous"
            hint="When enabled, all new reviews and questions will default to anonymous. You can override this per submission."
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 mb-5">
        <h2 className="font-semibold font-heading text-fg mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <Toggle
            checked={emailNotifs}
            onChange={setEmailNotifs}
            label="Email notifications"
            hint="Receive emails when your review is published or a question is answered."
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
        {passwordToast && (
          <div className="mt-3 px-3 py-2 bg-accent-tint text-accent text-sm rounded-lg">
            ✓ Password updated successfully
          </div>
        )}
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-danger/30">
        <h2 className="font-semibold font-heading text-danger mb-2">Account Actions</h2>
        <p className="text-sm text-fg-muted mb-4">Log out from Bhorosha or manage your account.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={logout}>Log out</Button>
        </div>
      </Card>
    </div>
  )
}
