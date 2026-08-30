import { useState } from 'react'
import { useApp } from '../../context'
import { Card, Button, TextField, PasswordField, Toggle, PageHeader, Divider } from '../../components/ui'
import { Avatar } from '../../components/ui'

export default function StudentProfile() {
  const { logout, navigate } = useApp()
  const [defaultAnon, setDefaultAnon] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [toast, setToast] = useState(false)

  const handleSave = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title="Profile & Settings" description="Manage your account preferences" />

      {/* Avatar */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-4">
          <Avatar name="Student User" size="xl" />
          <div>
            <h3 className="font-semibold font-heading text-fg text-lg">Student Name</h3>
            <p className="text-sm text-fg-muted">u2204061@student.cuet.ac.bd</p>
            <p className="text-xs text-fg-muted mt-1">Dept: CSE · Semester derived from student ID</p>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="p-6 mb-5">
        <h2 className="font-semibold font-heading text-fg mb-4">Personal Information</h2>
        <div className="space-y-4">
          <TextField label="Full name" placeholder="Your full name" defaultValue="Student Name" />
          <TextField label="University email" placeholder="u2204061@student.cuet.ac.bd" defaultValue="u2204061@student.cuet.ac.bd" disabled hint="Email cannot be changed" />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Department" defaultValue="CSE" disabled />
            <TextField label="Semester" defaultValue="Derived from ID" disabled />
          </div>
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
            hint="Receive emails when your review is approved/rejected or a question is answered."
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
