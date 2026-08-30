import { useState } from 'react'
import { Card, Button, StatusChip, Avatar, SearchBar, SelectField, Modal, EmptyState, PageHeader, IconUsers } from '../../components/ui'

type UserRole = 'student' | 'teacher'
type UserStatus = 'active' | 'suspended'

interface User {
  id: number
  name: string
  email: string
  role: UserRole
  dept: string
  status: UserStatus
  joined: string
}

const DEMO_USERS: User[] = [
  { id: 1, name: 'Student Name', email: 'u2204061@student.cuet.ac.bd', role: 'student', dept: 'CSE', status: 'active', joined: '2024-01-15' },
  { id: 2, name: 'Student Name', email: 'u2204062@student.cuet.ac.bd', role: 'student', dept: 'EEE', status: 'active', joined: '2024-01-16' },
  { id: 3, name: 'Professor Name', email: 'u1001@teacher.cuet.ac.bd', role: 'teacher', dept: 'CSE', status: 'active', joined: '2024-01-10' },
  { id: 4, name: 'Professor Name', email: 'u1002@teacher.cuet.ac.bd', role: 'teacher', dept: 'EEE', status: 'suspended', joined: '2024-01-12' },
]

function UserRow({ user, onAction }: { user: User; onAction: (u: User, action: string) => void }) {
  return (
    <tr className="hover:bg-brand-tint/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-fg">{user.name}</p>
            <p className="text-xs text-fg-muted">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${user.role === 'teacher' ? 'bg-anon-tint text-anon' : 'bg-brand-tint text-brand'}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-fg-muted">{user.dept}</td>
      <td className="px-4 py-3"><StatusChip status={user.status} /></td>
      <td className="px-4 py-3 text-xs text-fg-muted">{user.joined}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAction(user, 'view')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-brand bg-brand-tint hover:bg-brand/20 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onAction(user, user.status === 'active' ? 'suspend' : 'activate')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${user.status === 'active' ? 'text-warning bg-warning/15 hover:bg-warning/25' : 'text-accent bg-accent-tint hover:bg-accent/20'}`}
          >
            {user.status === 'active' ? 'Suspend' : 'Activate'}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(DEMO_USERS)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('All')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ user: User; action: string } | null>(null)

  const handleAction = (user: User, action: string) => {
    if (action === 'view') setSelectedUser(user)
    else setConfirmAction({ user, action })
  }

  const applyStatusChange = (userId: number, action: string) => {
    setUsers(us => us.map(u => u.id === userId
      ? { ...u, status: action === 'suspend' ? 'suspended' : 'active' }
      : u
    ))
  }

  const handleConfirm = () => {
    if (confirmAction) {
      applyStatusChange(confirmAction.user.id, confirmAction.action)
      setSelectedUser(null)
    }
    setConfirmAction(null)
  }

  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (statusFilter === 'all' || u.status === statusFilter) &&
    (deptFilter === 'All' || u.dept === deptFilter) &&
    (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.includes(query))
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* User detail modal */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-line">
              <Avatar name={selectedUser.name} size="lg" />
              <div>
                <h3 className="font-semibold font-heading text-fg">{selectedUser.name}</h3>
                <p className="text-sm text-fg-muted">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${selectedUser.role === 'teacher' ? 'bg-anon-tint text-anon' : 'bg-brand-tint text-brand'}`}>{selectedUser.role}</span>
                  <StatusChip status={selectedUser.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-fg-muted mb-0.5">Department</p><p className="font-medium text-fg">{selectedUser.dept}</p></div>
              <div><p className="text-xs text-fg-muted mb-0.5">Joined</p><p className="font-medium text-fg">{selectedUser.joined}</p></div>
              <div><p className="text-xs text-fg-muted mb-0.5">Reviews submitted</p><p className="font-medium text-fg">0</p></div>
              <div><p className="text-xs text-fg-muted mb-0.5">Questions asked</p><p className="font-medium text-fg">0</p></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="danger"
                onClick={() => setConfirmAction({ user: selectedUser, action: selectedUser.status === 'active' ? 'suspend' : 'activate' })}
                className="flex-1"
              >
                {selectedUser.status === 'active' ? 'Suspend account' : 'Reactivate account'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedUser(null)} className="flex-1">Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm action modal */}
      <Modal open={!!confirmAction} onClose={() => setConfirmAction(null)} title="Confirm Action">
        {confirmAction && (
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">
              Are you sure you want to <strong className="text-fg">{confirmAction.action}</strong> the account for{' '}
              <strong className="text-fg">{confirmAction.user.name}</strong>?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setConfirmAction(null)} className="flex-1">Cancel</Button>
              <Button
                variant={confirmAction.action === 'suspend' ? 'danger' : 'primary'}
                onClick={handleConfirm}
                className="flex-1 capitalize"
              >
                {confirmAction.action}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <PageHeader title="User Management" description="Manage students and teachers on the platform" />

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Users', value: users.length, color: 'text-brand' },
          { label: 'Students', value: users.filter(u => u.role === 'student').length, color: 'text-brand' },
          { label: 'Teachers', value: users.filter(u => u.role === 'teacher').length, color: 'text-anon' },
          { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length, color: 'text-danger' },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <p className={`text-xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-xs text-fg-muted">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-48">
          <SearchBar placeholder="Search by name or email…" value={query} onChange={setQuery} />
        </div>
        <SelectField value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
        </SelectField>
        <SelectField value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </SelectField>
        <SelectField value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="All">All depts</option>
          {['CSE', 'EEE', 'ME', 'Civil'].map(d => <option key={d}>{d}</option>)}
        </SelectField>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-bg">
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Role</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Dept</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Joined</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map(u => <UserRow key={u.id} user={u} onAction={handleAction} />)}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyState
            icon={<IconUsers className="w-7 h-7" />}
            title="No users found"
            description="Try adjusting your search or filter criteria."
          />
        )}
      </Card>
    </div>
  )
}
