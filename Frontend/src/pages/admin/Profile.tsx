import { useState } from 'react'
import { useApp } from '../../context'
import { Card, Button, TextField, PasswordField, Toggle, PageHeader, Avatar } from '../../components/ui'

export default function AdminProfile() {
  const { logout } = useApp()
  const [toast, setToast] = useState('')
  const [notifyReports, setNotifyReports] = useState(true)
  const [notifyDigest, setNotifyDigest] = useState(false)

  const save = () => {
    setToast('Profile saved successfully')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title="Profile & Settings" description="Manage your administrator account and notification preferences" />

      {/* Personal Info */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <Avatar name="Admin" size="xl" />
          <div>
            <p className="font-semibold font-heading text-fg">Admin</p>
            <p className="text-sm text-fg-muted">Platform administrator</p>
          </div>
        </div>
        <div className="space-y-4">
          <TextField label="Full name" placeholder="Your full name" defaultValue="Admin" />
          <TextField label="University email" defaultValue="admin@cuet.ac.bd" disabled hint="Email cannot be changed" />
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
          <PasswordField label="Current password" placeholder="Enter current password" />
          <PasswordField label="New password" placeholder="Min. 8 characters" showStrength />
          <PasswordField label="Confirm new password" placeholder="Re-enter new password" />
        </div>
        <div className="mt-5 flex justify-end">
          <Button>Update password</Button>
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
